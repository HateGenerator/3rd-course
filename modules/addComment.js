// import { comments } from "./comments.js";
// import { getCurrentDateTime } from "./utils.js";
// import { sanitizeHTML } from "./sanitize.js";
// import { renderComments } from "./render.js";

// export function addComment(nameInput, commentInput, commentList) {
//   const name = sanitizeHTML(nameInput.value.trim());
//   const text = sanitizeHTML(commentInput.value.trim());

//   if (!name || !text) {
//     alert("Пожалуйста, заполните оба поля!");
//     return;
//   }

//   comments.push({
//     name,
//     date: getCurrentDateTime(),
//     text,
//     likes: 0,
//     isLiked: false,
//   });

//   nameInput.value = "";
//   commentInput.value = "";

//   renderComments(commentList, commentInput, nameInput);
// }