import { loadAndRenderComments } from "./main.js";

const host = "https://wedev-api.sky.pro/api/user";

export const renderLogin = ({ container, onLoginSuccess }) => {
  console.log("Rendering login form");

  const loginFormHtml = `
    <h1>Вход</h1>
    <form class="login-form">
      <input type="text" class="login-form-login" placeholder="Логин" required autocomplete="username" />
      <input type="password" class="login-form-password" placeholder="Пароль" required autocomplete="new-password" />
      <button type="submit" class="login-form-button">Войти</button>
    </form>
    <div class="error-message" style="display: none; color: #ff3333; text-align: center; margin-top: 10px;"></div>
  `;

  container.innerHTML = loginFormHtml;

  const loginForm = container.querySelector(".login-form");
  const loginInput = container.querySelector(".login-form-login");
  const passwordInput = container.querySelector(".login-form-password");
  const errorMessage = container.querySelector(".error-message");

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const login = loginInput.value.trim();
    const password = passwordInput.value.trim();

    console.log("Sending login:", { login, password });

    if (!login || !password) {
      errorMessage.textContent = "Введите логин и пароль";
      errorMessage.style.display = "block";
      return;
    }

    const body = JSON.stringify({ login, password });

    console.log("Sending JSON body:", body);

    fetch(`${host}/login`, {
      method: "POST",
      body,
    })
      .then(async (res) => {
        console.log("Login response:", res.status, res.statusText);
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
            throw new Error(errorData.error || "Неверный логин или пароль");
          }
          throw new Error(`Ошибка сервера: ${res.status}`);
        }
        return JSON.parse(responseText);
      })
      .then((responseData) => {
        console.log("Login successful:", responseData);
        const { token, name } = responseData.user;
        localStorage.setItem("authToken", token);
        // Принудительно устанавливаем "Админ Глеб", если API возвращает "Админ"
        const userName = name === "Админ" ? "Админ Глеб" : name;
        localStorage.setItem("userName", userName);
        console.log("Saved userName:", userName);
        onLoginSuccess();
      })
      .catch((error) => {
        console.error("Ошибка авторизации:", error);
        errorMessage.textContent = error.message || "Не удалось авторизоваться";
        errorMessage.style.display = "block";
      });
  });
};