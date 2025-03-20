export function addEventListeners(comments, commentList, commentInput, nameInput, renderComments) {
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
  