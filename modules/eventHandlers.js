import { delay } from "./utils.js";

export function addEventListeners(comments, commentList, commentInput, nameInput, renderComments) {
  
  commentList.removeEventListener("click", handleClick);
  commentList.addEventListener("click", handleClick);

  function handleClick(event) {
    // Обработка клика по .like-button
    const button = event.target.closest(".like-button");
    if (button) {
      event.stopPropagation();
      const index = parseInt(button.dataset.index, 10);
      console.log("Clicked like button, index:", index, "isLiked before:", comments[index].isLiked); // Отладка

      // Провеерка обработки лайка
      if (comments[index].isLikeLoading) {
        console.log("Like is already processing for index:", index);
        return;
      }

      
      comments[index].isLikeLoading = true;
      renderComments(commentList, commentInput, nameInput); 

      
      delay(2000).then(() => {
        comments[index].isLiked = !comments[index].isLiked;
        comments[index].likes += comments[index].isLiked ? 1 : -1;
        comments[index].isLikeLoading = false;

        console.log("isLiked after:", comments[index].isLiked, "likes:", comments[index].likes); // Отладка

        renderComments(commentList, commentInput, nameInput); 
      });

      return;
    }

    // Обработка клика по .comment
    const commentEl = event.target.closest(".comment");
    if (commentEl) {
      const index = parseInt(commentEl.dataset.index, 10);
      console.log("Clicked comment, index:", index); // Отладка
      const comment = comments[index];
      commentInput.value = `> ${comment.text}\n${commentInput.value}`;
      nameInput.focus();
    }
  }

  console.log("Event listeners added, comments count:", comments.length); // Отладка
}