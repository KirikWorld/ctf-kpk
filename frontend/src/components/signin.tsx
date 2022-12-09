import "./signin.css";
import { useRef, useState } from "react";
import React from "react"
import { useNavigate } from "react-router-dom";
import Loading from "./loading";

export default function Signup() {
    const [help, setHelp] = useState(false);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const signinContainer = useRef(null);
    const [unauthorized, setUnauthorized] = useState(false);

    async function signin() {
        setUnauthorized(true);
        let response: Response = await fetch(
            "https://ctf-room.onrender.com/auth/token/login/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({ password: password, username: login }),
            }
        );
        let data = await response.json();
        if (response.status !== 200) {
            localStorage.setItem("auth_token", "");
            setUnauthorized(false);
            return;
        }
        localStorage.setItem("auth_token", data.auth_token);
        navigate("/");
    }

    return (
        <>
        {unauthorized ? <Loading /> : null}
        <div className="signin-container" ref={signinContainer}>
            <div className="login-form">
                <h3>Вход</h3>
                <div className="login">
                    <p>Никнейм:</p>
                    <input
                        type="text"
                        name=""
                        id="lgn"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                </div>
                <div className="pswd">
                    <p>Пароль:</p>
                    <input
                        type="password"
                        name=""
                        id="psw"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="btns">
                    <button className="signin" onClick={() => signin()}>
                        Войти
                    </button>
                    <button className="signup">Регистрация</button>
                </div>
                <u
                    onMouseEnter={() => setHelp(true)}
                    onMouseLeave={() => setHelp(false)}
                    onClick={() => setHelp(!help)}
                >
                    Нужна помощь?
                    {help && (
                        <div className="need-help">Telegram: @kiriknm</div>
                    )}
                </u>
            </div>
        </div>
        </>
    );
}
