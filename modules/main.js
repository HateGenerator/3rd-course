import { renderComments } from "./render.js";
import { addComment } from "./addComment.js";
import { addEventListeners } from "./eventHandlers.js";

addEventListeners(comments, commentList, commentInput, nameInput, renderComments);

const nameInput = document.querySelector(".add-form-name");
const commentInput = document.querySelector(".add-form-text");
const addButton = document.querySelector(".add-form-button");
const commentList = document.querySelector(".comments");

addButton.addEventListener("click", () => addComment(nameInput, commentInput, commentList));

renderComments(commentList, commentInput, nameInput);