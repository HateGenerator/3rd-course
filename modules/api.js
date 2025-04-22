const host = "https://wedev-api.sky.pro/api/v2/sam-polyakov";

export const fetchComments = () => {
  console.log("Fetching comments from:", `${host}/comments`);
  return fetch(`${host}/comments`, {
    method: "GET",
  })
    .then((res) => {
      console.log("Fetch comments response:", res.status, res.statusText);
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
  console.log("Posting comment:", { text, name, forceError });
  const token = localStorage.getItem("authToken");
  if (!token) {
    console.error("No auth token found");
    throw new Error("Требуется авторизация");
  }
  console.log("Sending POST to:", `${host}/comments`, "with token:", token.substring(0, 10) + "...");

  const body = JSON.stringify({ text, name, forceError });

  console.log("Sending JSON body:", body);

  return fetch(`${host}/comments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body,
  })
    .then(async (res) => {
      console.log("Post comment response:", res.status, res.statusText);
      let responseText = "";
      try {
        responseText = await res.text();
        console.log("Raw response:", responseText);
      } catch (e) {
        console.error("Failed to read response text:", e);
      }
      if (!res.ok) {
        let errorData = {};
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          console.error("Failed to parse error response:", e);
        }
        if (res.status === 400) {
          console.log("Server error response:", errorData);
          throw new Error(errorData.error || "Неверные данные");
        }
        if (res.status === 401) {
          console.log("Unauthorized, clearing localStorage");
          localStorage.removeItem("authToken");
          localStorage.removeItem("userName");
          throw new Error("Требуется авторизация");
        }
        if (res.status >= 500 && res.status < 600) {
          throw new Error("Сервер сломался, попробуй позже");
        }
        throw new Error(`Ошибка сервера при отправке комментария: ${res.status}`);
      }
      return JSON.parse(responseText);
    })
    .then((responseData) => {
      console.log("Comment posted:", responseData);
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