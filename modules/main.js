console.log("main.js loaded successfully"); // Добавьте эту строку в начало

import { fetchComments, postComment } from "./api.js";
import { renderComments } from "./render.js";
import { comments, updateComments } from "./comments.js";
import { addEventListeners } from "./eventHandlers.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, starting app"); // Добавьте для отладки
  const nameInput = document.querySelector(".add-form-name");
  const commentInput = document.querySelector(".add-form-text");
  const addButton = document.querySelector(".add-form-button");
  const commentList = document.querySelector(".comments");

  fetchComments()
    .then((loadedComments) => {
      updateComments(loadedComments);
      renderComments(commentList, commentInput, nameInput);
      console.log("Event listeners added"); // Отладка
      addEventListeners(comments, commentList, commentInput, nameInput, renderComments);
    })
    .catch((error) => {
      console.error("Ошибка загрузки комментариев:", error);
      alert("Не удалось загрузить комментарии");
    });

  addButton.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const text = commentInput.value.trim();

    if (name.length < 3 || text.length < 3) {
      alert("Имя и текст должны содержать минимум 3 символа");
      return;
    }

    postComment(text, name)
      .then((loadedComments) => {
        updateComments(loadedComments);
        renderComments(commentList, commentInput, nameInput);
        addEventListeners(comments, commentList, commentInput, nameInput, renderComments);
        nameInput.value = "";
        commentInput.value = "";
      })
      .catch((error) => {
        console.error("Ошибка:", error);
        alert(error.message || "Не удалось отправить комментарий");
      });
  });
});