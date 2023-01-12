import "./signin.css";
import { useRef, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../global/loading";
import Notification from "../global/notification";
import { Context } from "../global/context";
import { useContext } from "react";

export default function Signup() {
    const [help, setHelp] = useState(false);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const signinContainer = useRef(null);
    const [unauthorized, setUnauthorized] = useState(false);
    const [error, setError] = useState<string>("");
    const [notif, setNotif] = useState<boolean>(false);

    const { storage } = useContext(Context);

    async function signin() {
        setUnauthorized(true);
        let response: Response = await fetch("/api/auth/token/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({ password: password, username: login }),
        });
        let data = await response.json();
        if (response.status !== 200) {
            storage.set("tracker", "");
            storage.remove("tracker");
            setUnauthorized(false);
            setNotif(true);
            if (data.non_field_errors) return setError(data.non_field_errors);
            if (data.username || data.password)
                return setError("Поля должны быть заполненными.");
            return setError("Произошла ошибка");
        }
        // localStorage.setItem("auth_token", data.auth_token);
        storage.set("tracker", data.auth_token);
        navigate("/");
    }

    function successLogin(e: any) {
        if (e.key === "Enter") {
            signin();
        }
    }

    return (
        <>
            {unauthorized ? <Loading /> : null}
            {notif && <Notification setNotif={setNotif}>{error}</Notification>}
            <div
                className="signin-container"
                ref={signinContainer}
                onKeyUp={(e) => successLogin(e)}
            >
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
                        <button
                            className="signup"
                            onClick={() => {
                                storage.set("tracker", "");
                                storage.remove("tracker");
                                navigate("/signup/");
                            }}
                        >
                            Регистрация
                        </button>
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
