import React, { useMemo, useState } from "react";
import "./auth.scss"; // если ты положишь стили в src/auth/auth.scss

type Tab = "login" | "register";

type LoginState = {
  email: string;
  password: string;
  remember: boolean;
};

type RegisterState = {
  name: string;
  email: string;
  password: string;
  password2: string;
  terms: boolean;
};

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>("login");

  const [login, setLogin] = useState<LoginState>({
    email: "",
    password: "",
    remember: true,
  });

  const [reg, setReg] = useState<RegisterState>({
    name: "",
    email: "",
    password: "",
    password2: "",
    terms: false,
  });

  const [message, setMessage] = useState<string>("");

  const canRegister = useMemo(() => {
    if (!reg.name.trim()) return false;
    if (!reg.email.trim()) return false;
    if (reg.password.length < 6) return false;
    if (reg.password !== reg.password2) return false;
    if (!reg.terms) return false;
    return true;
  }, [reg]);

  function onSubmitLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!login.email.trim() || !login.password.trim()) {
      setMessage("Заполните e-mail и пароль.");
      return;
    }

    // Пока мок: позже заменим на запрос к серверу
    setMessage(`✅ Вход выполнен (демо). Email: ${login.email}`);
  }

  function onSubmitRegister(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!canRegister) {
      if (reg.password !== reg.password2) {
        setMessage("Пароли не совпадают.");
        return;
      }
      setMessage("Проверьте поля регистрации (пароль минимум 6 символов).");
      return;
    }

    // Пока мок: позже заменим на запрос к серверу
    setMessage(`✅ Аккаунт создан (демо). Добро пожаловать, ${reg.name}!`);
  }

  return (
    <div className="auth-body">
      <div className="auth-layout">
        <main className="auth-card">
          {/* LEFT BRAND */}
          <div className="auth-brand">
            <div className="auth-logo">
              <div className="auth-logo-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#7C3AED" opacity="0.1" />
                  <path
                    d="M8 9l4 4 4-4"
                    stroke="#7C3AED"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="auth-logo-text">
                <div className="auth-logo-title">EventForms</div>
                <div className="auth-logo-subtitle">
                  Панель управления мероприятиями
                </div>
              </div>
            </div>

            <p className="auth-brand-text">
              Создавайте формы регистрации, собирайте ответы и смотрите
              аналитику по событиям в одном месте.
            </p>
          </div>

          {/* RIGHT PANEL */}
          <div className="auth-panel">
            {/* Tabs */}
            <div className="auth-tabs" role="tablist" aria-label="Auth tabs">
              <button
                type="button"
                className={
                  tab === "login"
                    ? "auth-tab-label auth-tab-label--active"
                    : "auth-tab-label"
                }
                onClick={() => {
                  setMessage("");
                  setTab("login");
                }}
                role="tab"
                aria-selected={tab === "login"}
              >
                Вход
              </button>

              <button
                type="button"
                className={
                  tab === "register"
                    ? "auth-tab-label auth-tab-label--active"
                    : "auth-tab-label"
                }
                onClick={() => {
                  setMessage("");
                  setTab("register");
                }}
                role="tab"
                aria-selected={tab === "register"}
              >
                Регистрация
              </button>
            </div>

            {/* Message */}
            {message && <div className="auth-message">{message}</div>}

            {/* LOGIN FORM */}
            {tab === "login" && (
              <form
                className="auth-form"
                autoComplete="on"
                onSubmit={onSubmitLogin}
              >
                <div className="auth-form-header">
                  <h1>Войти в аккаунт</h1>
                  <p>
                    Введите логин и пароль, чтобы открыть панель EventForms.
                  </p>
                </div>

                <div className="auth-field">
                  <label htmlFor="login-email">E-mail</label>
                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    value={login.email}
                    onChange={(e) =>
                      setLogin((s) => ({ ...s, email: e.target.value }))
                    }
                  />
                </div>

                <div className="auth-field">
                  <div className="auth-field-label-row">
                    <label htmlFor="login-password">Пароль</label>
                    <button
                      type="button"
                      className="auth-link-small"
                      onClick={() =>
                        alert("Позже сделаем восстановление пароля")
                      }
                    >
                      Забыли пароль?
                    </button>
                  </div>

                  <input
                    type="password"
                    id="login-password"
                    name="password"
                    placeholder="Введите пароль"
                    required
                    value={login.password}
                    onChange={(e) =>
                      setLogin((s) => ({ ...s, password: e.target.value }))
                    }
                  />
                </div>

                <div className="auth-field auth-field-inline">
                  <label className="auth-checkbox">
                    <input
                      type="checkbox"
                      name="remember"
                      checked={login.remember}
                      onChange={(e) =>
                        setLogin((s) => ({ ...s, remember: e.target.checked }))
                      }
                    />
                    <span>Запомнить меня</span>
                  </label>
                </div>

                <button type="submit" className="auth-btn auth-btn-primary">
                  Войти
                </button>

                <p className="auth-bottom-text">
                  Нет аккаунта?{" "}
                  <button
                    type="button"
                    className="auth-link-inline"
                    onClick={() => {
                      setMessage("");
                      setTab("register");
                    }}
                  >
                    Зарегистрироваться
                  </button>
                </p>
              </form>
            )}

            {/* REGISTER FORM */}
            {tab === "register" && (
              <form
                className="auth-form"
                autoComplete="on"
                onSubmit={onSubmitRegister}
              >
                <div className="auth-form-header">
                  <h1>Создать аккаунт</h1>
                  <p>
                    Зарегистрируйтесь, чтобы начать управлять мероприятиями.
                  </p>
                </div>

                <div className="auth-field">
                  <label htmlFor="reg-name">Имя</label>
                  <input
                    type="text"
                    id="reg-name"
                    name="name"
                    placeholder="Как к вам обращаться"
                    required
                    value={reg.name}
                    onChange={(e) =>
                      setReg((s) => ({ ...s, name: e.target.value }))
                    }
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="reg-email">E-mail</label>
                  <input
                    type="email"
                    id="reg-email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    value={reg.email}
                    onChange={(e) =>
                      setReg((s) => ({ ...s, email: e.target.value }))
                    }
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="reg-password">Пароль</label>
                  <input
                    type="password"
                    id="reg-password"
                    name="password"
                    placeholder="Придумайте пароль (мин. 6 символов)"
                    required
                    value={reg.password}
                    onChange={(e) =>
                      setReg((s) => ({ ...s, password: e.target.value }))
                    }
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="reg-password2">Повторите пароль</label>
                  <input
                    type="password"
                    id="reg-password2"
                    name="password2"
                    placeholder="Повторите пароль"
                    required
                    value={reg.password2}
                    onChange={(e) =>
                      setReg((s) => ({ ...s, password2: e.target.value }))
                    }
                  />
                </div>

                <div className="auth-field auth-field-inline">
                  <label className="auth-checkbox">
                    <input
                      type="checkbox"
                      name="terms"
                      required
                      checked={reg.terms}
                      onChange={(e) =>
                        setReg((s) => ({ ...s, terms: e.target.checked }))
                      }
                    />
                    <span>Я принимаю условия использования сервиса</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="auth-btn auth-btn-primary"
                  disabled={!canRegister}
                >
                  Зарегистрироваться
                </button>

                <p className="auth-bottom-text">
                  Уже есть аккаунт?{" "}
                  <button
                    type="button"
                    className="auth-link-inline"
                    onClick={() => {
                      setMessage("");
                      setTab("login");
                    }}
                  >
                    Войти
                  </button>
                </p>
              </form>
            )}

            <p className="auth-hint">
              Сейчас это демо (без сервера). Следующий шаг — подключим запросы к
              backend.
            </p>
          </div>
        </main>

        <footer className="auth-footer">
          © 2024 EventForms • Управление формами для мероприятий
        </footer>
      </div>
    </div>
  );
}
