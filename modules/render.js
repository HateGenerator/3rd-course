import { comments } from "./comments.js";
import { sanitizeHTML } from "./sanitize.js";

export function renderComments(commentList, commentInput, nameInput) {
  commentList.innerHTML = comments
    .map(
      (comment, index) => `
      <li class="comment" data-index="${index}">
        <div class="comment-header">
          <div>${sanitizeHTML(comment.name)}</div>
          <div>${comment.date}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">${sanitizeHTML(comment.text)}</div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${comment.likes}</span>
            <button class="like-button ${
              comment.isLiked ? "-active-like" : ""
            }" data-index="${index}"></button>
          </div>
        </div>
      </li>
    `
    )
    .join("");

  document.querySelectorAll(".like-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const index = button.dataset.index;
      comments[index].isLiked = !comments[index].isLiked;
      comments[index].likes += comments[index].isLiked ? 1 : -1;
      renderComments(commentList, commentInput, nameInput);
    });
  });

  document.querySelectorAll(".comment").forEach((commentEl) => {
    commentEl.addEventListener("click", () => {
      const index = commentEl.dataset.index;
      const comment = comments[index];
      commentInput.value = `> ${comment.text}\n${commentInput.value}`;
      nameInput.focus();
    });
  });
}
