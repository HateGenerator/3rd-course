console.log("main.js loaded successfully");

import { fetchComments, postComment } from "./api.js";
import { renderComments } from "./render.js";
import { comments, updateComments } from "./comments.js";
import { addEventListeners } from "./eventHandlers.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, starting app");
  const nameInput = document.querySelector(".add-form-name");
  const commentInput = document.querySelector(".add-form-text");
  const addButton = document.querySelector(".add-form-button");
  const commentList = document.querySelector(".comments");
  const loadingIndicator = document.querySelector(".loading-indicator");
  const addForm = document.querySelector(".add-form");
  const addingIndicator = document.querySelector(".adding-indicator");

  // Функция для загрузки и рендеринга комментариев
  const loadAndRenderComments = () => {
    if (loadingIndicator) loadingIndicator.style.display = "block";
    return fetchComments()
      .then((loadedComments) => {
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

  // Загрузка комментариев при старте
  loadAndRenderComments();

  const handlePostClick = (attempts = 3) => {
    const name = nameInput.value.trim();
    const text = commentInput.value.trim();

    console.log("Sending comment:", { name, text, attempts });

    if (name.length < 3 || text.length < 3) {
      alert("Имя и комментарий должны быть не короче 3 символов");
      addForm.style.opacity = "1";
      if (addingIndicator) addingIndicator.style.display = "none";
      return;
    }

    addForm.style.opacity = "0";
    if (addingIndicator) addingIndicator.style.display = "block";

    postComment(text, name, true) 
      .then(() => {
        comments.push({
          id: Date.now(),
          name: name,
          date: new Date().toISOString(),
          text: text,
          likes: 0,
          isLiked: false,
          isLikeLoading: false,
        });
        renderComments(commentList, commentInput, nameInput);
        addEventListeners(comments, commentList, commentInput, nameInput, renderComments);
        nameInput.value = "";
        commentInput.value = "";
        addForm.style.opacity = "1";
        if (addingIndicator) addingIndicator.style.display = "none";
      })
      .catch((error) => {
        console.error("Ошибка:", error);
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

  addButton.addEventListener("click", () => handlePostClick());
});