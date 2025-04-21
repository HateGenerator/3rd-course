const host = "https://wedev-api.sky.pro/api/user";

export const renderRegister = ({ container, onRegisterSuccess }) => {
  console.log("Rendering register form");

  const registerFormHtml = `
    <h1>Регистрация</h1>
    <form class="register-form">
      <input type="text" class="register-form-login" placeholder="Логин" required autocomplete="username" />
      <input type="text" class="register-form-name" placeholder="Имя" required autocomplete="name" />
      <input type="password" class="register-form-password" placeholder="Пароль" required autocomplete="new-password" />
      <button type="submit" class="register-form-button">Зарегистрироваться</button>
    </form>
    <div class="error-message" style="display: none; color: #ff3333; text-align: center; margin-top: 10px;"></div>
  `;

  container.innerHTML = registerFormHtml;

  const registerForm = container.querySelector(".register-form");
  const loginInput = container.querySelector(".register-form-login");
  const nameInput = container.querySelector(".register-form-name");
  const passwordInput = container.querySelector(".register-form-password");
  const errorMessage = container.querySelector(".error-message");

  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const login = loginInput.value.trim();
    const name = nameInput.value.trim();
    const password = passwordInput.value.trim();

    console.log("Sending registration:", { login, name, password });

    if (!login || !name || !password) {
      errorMessage.textContent = "Заполните все поля";
      errorMessage.style.display = "block";
      return;
    }

    const body = JSON.stringify({ login, name, password });

    console.log("Sending JSON body:", body);

    fetch(host, {
      method: "POST",
      body,
    })
      .then(async (res) => {
        console.log("Register response:", res.status, res.statusText);
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
            throw new Error(errorData.error || "Ошибка регистрации: неверные данные");
          }
          throw new Error(`Ошибка сервера: ${res.status}`);
        }
        return JSON.parse(responseText);
      })
      .then((responseData) => {
        console.log("Registration successful:", responseData);
        const { token, name } = responseData.user;
        localStorage.setItem("authToken", token);
        localStorage.setItem("userName", name);
        console.log("Saved userName:", name);
        onRegisterSuccess();
      })
      .catch((error) => {
        console.error("Ошибка регистрации:", error);
        errorMessage.textContent = error.message || "Не удалось зарегистрироваться";
        errorMessage.style.display = "block";
      });
  });
};