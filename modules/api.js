const host = 'https://wedev-api.sky.pro/api/v1/sam-polyakov'; // personal-key

export const fetchComments = () => {
  return fetch(`${host}/comments`, {
    method: "GET",
  })
    .then((res) => {
      if (!res.ok) {
        if (res.status >= 500 && res.status < 600) {
          throw new Error("Сервер сломался, попробуй позже");
        }
        throw new Error(`Ошибка при загрузке комментариев: ${res.status}`);
      }
      return res.json();
    })
    .then((responseData) => {
      console.log("Comments from server:", responseData.comments); 
      return responseData.comments.map(comment => ({
        id: comment.id,
        name: comment.author.name,
        date: comment.date,
        text: comment.text,
        likes: comment.likes || 0,
        isLiked: comment.isLiked || false,
        isLikeLoading: false,
      }));
    })
    .catch((error) => {
      console.error("Ошибка загрузки:", error);
      if (!navigator.onLine) {
        throw new Error("Кажется, у вас сломался интернет, попробуйте позже");
      }
      throw error;
    });
};

export const postComment = (text, name, forceError = false) => {
  console.log("API sending:", { text, name, forceError }); 
  return fetch(`${host}/comments`, {
    method: "POST",
    body: JSON.stringify({
      text,
      name,
      forceError, 
    }),
  })
    .then(async (res) => {
      if (!res.ok) {
        if (res.status === 400) {
          const errorData = await res.json();
          console.log("Server error response:", errorData); 
          throw new Error(errorData.error);
        }
        if (res.status >= 500 && res.status < 600) {
          throw new Error("Сервер сломался, попробуй позже");
        }
        throw new Error(`Ошибка сервера при отправке комментария: ${res.status}`);
      }
      return res.json();
    })
    .then(() => {
      return fetchComments();
    })
    .catch((error) => {
      console.error("Ошибка отправки:", error);
      if (!navigator.onLine) {
        throw new Error("Кажется, у вас сломался интернет, попробуйте позже");
      }
      throw error;
    });
};