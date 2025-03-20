const host = 'https://wedev-api.sky.pro/api/v1/sam-polyakov'; // Ваш personal-key

export const fetchComments = () => {
  return fetch(`${host}/comments`, {
    method: "GET",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Ошибка при загрузке комментариев");
      }
      return res.json();
    })
    .then((responseData) => {
      console.log("Comments from server:", responseData.comments); // Отладка
      return responseData.comments.map(comment => ({
        id: comment.id,
        name: comment.author.name,
        date: comment.date,
        text: comment.text,
        likes: comment.likes || 0,
        isLiked: comment.isLiked || false,
      }));
    })
    .catch((error) => {
      console.error("Ошибка загрузки:", error);
      throw error;
    });
};

export const postComment = (text, name) => {
  console.log("API sending:", { text, name });
  return fetch(`${host}/comments`, {
    method: "POST",
    body: JSON.stringify({
      text,
      name,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        if (res.status === 400) {
          return res.json().then((errorData) => {
            console.log("Server error response:", errorData); // Отладка
            throw new Error(errorData.error);
          });
        }
        throw new Error("Ошибка сервера при отправке комментария");
      }
      return res.json();
    })
    .then(() => {
      return fetchComments();
    })
    .catch((error) => {
      console.error("Ошибка отправки:", error);
      throw error;
    });
};