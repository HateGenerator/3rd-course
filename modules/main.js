console.log("main.js loaded successfully");

import { fetchComments, postComment } from "./api.js";
import { renderComments } from "./render.js";
import { comments, updateComments } from "./comments.js";
import { addEventListeners } from "./eventHandlers.js";
import { renderLogin } from "./renderLogin.js";
import { renderRegister } from "./renderRegister.js"; // Новый файл для регистрации

export const loadAndRenderComments = () => {
  const commentList = document.querySelector(".comments");
  const nameInput = document.querySelector(".add-form-name");
  const commentInput = document.querySelector(".add-form-text");
  const loadingIndicator = document.querySelector(".loading-indicator");

  if (!commentList) {
    console.warn("Comment list not found");
    return;
  }

  if (loadingIndicator) loadingIndicator.style.display = "block";
  return fetchComments()
    .then((loadedComments) => {
      console.log("Loaded comments:", loadedComments);
      updateComments(loadedComments);
      renderComments(commentList, commentInput, nameInput);
      addEventListeners(comments, commentList, commentInput, nameInput, renderComments);
    })
    .catch((error) => {
      console.error("Ошибка загрузки комментариев:", error);
      alert(error.message || "Не удалось загрузить комментарии");
    })
    .finally(() => {
      if (loadingIndicator) loadingIndicator.style.display = "none";
    });
};

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, starting app");
  const container = document.querySelector(".container");

  const renderCommentsPage = () => {
    const token = localStorage.getItem("authToken");
    const userName = localStorage.getItem("userName");

    console.log("Rendering comments page, token:", !!token, "userName:", userName);

    container.innerHTML = `
      <ul class="comments"></ul>
      <div class="loading-indicator">Загрузка комментариев...</div>
      <div class="auth-message" style="display: ${token ? "none" : "block"}; text-align: center; margin-top: 20px;">
        Чтобы добавить комментарий, 
        <a href="#" class="login-link">авторизуйтесь</a> или 
        <a href="#" class="register-link">зарегистрируйтесь</a>.
      </div>
      <form class="add-form" style="display: ${token ? "block" : "none"};">
        <input type="text" class="add-form-name" readonly value="${userName || ""}" />
        <textarea class="add-form-text" placeholder="Введите ваш комментарий" rows="4"></textarea>
        <div class="add-form-row">
          <button class="add-form-button">Написать</button>
        </div>
      </form>
      <div class="adding-indicator" style="display: none;">Комментарий добавляется...</div>
    `;

    const commentList = document.querySelector(".comments");
    const nameInput = document.querySelector(".add-form-name");
    const commentInput = document.querySelector(".add-form-text");
    const addButton = document.querySelector(".add-form-button");
    const loadingIndicator = document.querySelector(".loading-indicator");
    const addingIndicator = document.querySelector(".adding-indicator");
    const loginLink = document.querySelector(".login-link");
    const registerLink = document.querySelector(".register-link");

    loadAndRenderComments();

    if (loginLink) {
      loginLink.addEventListener("click", (event) => {
        event.preventDefault();
        container.innerHTML = "";
        renderLogin({ container, onLoginSuccess: renderCommentsPage });
      });
    }

    if (registerLink) {
      registerLink.addEventListener("click", (event) => {
        event.preventDefault();
        container.innerHTML = "";
        renderRegister({ container, onRegisterSuccess: renderCommentsPage });
      });
    }

    const handlePostClick = (attempts = 3) => {
      console.log("Add button clicked, sending comment");
      if (!token) {
        alert("Требуется авторизация");
        container.innerHTML = "";
        renderLogin({ container, onLoginSuccess: renderCommentsPage });
        return;
      }

      const name = nameInput.value.trim();
      const text = commentInput.value.trim();

      console.log("Sending comment:", { name, text, attempts });

      if (text.length < 3) {
        alert("Комментарий должен быть не короче 3 символов");
        addForm.style.opacity = "1";
        if (addingIndicator) addingIndicator.style.display = "none";
        return;
      }

      const addForm = document.querySelector(".add-form");
      addForm.style.opacity = "0";
      if (addingIndicator) addingIndicator.style.display = "block";

      postComment(text, name, false)
        .then(() => {
          console.log("Comment posted successfully");
          return fetchComments();
        })
        .then((loadedComments) => {
          updateComments(loadedComments);
          renderComments(commentList, commentInput, nameInput);
          addEventListeners(comments, commentList, commentInput, nameInput, renderComments);
          commentInput.value = "";
          addForm.style.opacity = "1";
          if (addingIndicator) addingIndicator.style.display = "none";
        })
        .catch((error) => {
          console.error("Ошибка отправки комментария:", error);
          if (error.message === "Сервер сломался, попробуй позже" && attempts > 1) {
            console.log(`Retrying... Attempts left: ${attempts - 1}`);
            setTimeout(() => handlePostClick(attempts - 1), 1000);
          } else {
            alert(error.message || "Не удалось отправить комментарий");
            addForm.style.opacity = "1";
            if (addingIndicator) addingIndicator.style.display = "none";
          }
        });
    };

    if (token && addButton) {
      addButton.addEventListener("click", () => {
        console.log("Binding click event to add button");
        handlePostClick();
      });
    }
  };

  const token = localStorage.getItem("authToken");
  if (token) {
    console.log("User is already authorized, rendering comments page");
    renderCommentsPage();
  } else {
    console.log("No token found, rendering comments page with auth prompt");
    renderCommentsPage();
  }
});