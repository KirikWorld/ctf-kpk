import "./signin.css";
import { useRef, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../global/loading";
import Notification from "../global/notification";
import { Context } from "../global/context";
import { useContext } from "react";
import styled from "styled-components";
import showpswd from "../../img/showpswd.png";
import hidepswd from "../../img/hidepswd.png";

const ShowPswd = styled.div`
    position: absolute;
    width: 40px;
    height: 40px;
    right: 40px;

    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    @media (max-width: 440px) {
        right: 20px;
    }
`;

export default function PasswordReset() {
    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const signinContainer = useRef(null);

    const [pswdVisible, setPswdVisible] = useState(false);

    const { storage, setLoading, setNotif, setNotifText } = useContext(Context);

    async function handleReset() {
        setLoading(true);
        if (!email || !password || !login) {
            setLoading(false);
            setNotif(true);
            return setNotifText("Поля должны быть заполненными.");
        }
        let response: Response = await fetch("/api/users/password_reset/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                username: login,
                email: email,
                password: password,
            }),
        });
        let data = await response.json();
        if (response.status !== 200) {
            storage.set("tracker", "");
            storage.remove("tracker");
            setLoading(false);
            setNotif(true);
            if (data.username || data.password)
                return setNotifText("Поля должны быть заполненными.");
            let hint;
            for (let key in data) {
                hint = data[key];
            }
            if (hint === "Это поле не может быть пустым.") {
                hint = "Заполните все поля.";
            }
            if (hint === "пользователь с таким Никнейм уже существует.") {
                hint = "Пользователь с таким никнеймом существует.";
            }
            if (hint.indexOf("Введённый пароль") === 0) {
                hint = "Пароль не соответствует требованиям";
            }
            setNotifText(`${hint}`);
            setNotif(true);
            return;
        }
        // localStorage.setItem("auth_token", data.auth_token);
        setLoading(false);
        setNotifText("Проверьте почту")
        setNotif(true)
        storage.set("tracker", data.auth_token);
        navigate("/signin/");
    }

    function successLogin(e: any) {
        if (e.key === "Enter") {
            handleReset();
        }
    }

    return (
        <div
            className="signin-container"
            ref={signinContainer}
            onKeyUp={(e) => successLogin(e)}
        >
            <div className="login-form" style={{ height: "430px" }}>
                <h1>Восстановление пароля</h1>
                <div className="login">
                    <p>Почта:</p>
                    <input
                        type="text"
                        name=""
                        id="lgn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="login">
                    <p>Никнейм:</p>
                    <input
                        type="text"
                        name=""
                        id=""
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                </div>
                <div className="pswd">
                    <p>Пароль:</p>
                    <input
                        type={pswdVisible ? "text" : "password"}
                        name=""
                        id="psw"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <ShowPswd onClick={() => setPswdVisible(!pswdVisible)}>
                        <img
                            src={pswdVisible ? hidepswd : showpswd}
                            alt="Показать пароль"
                            style={{
                                mixBlendMode: "multiply",
                            }}
                        />
                    </ShowPswd>
                </div>
                <div className="btns">
                    <button className="signin" onClick={() => handleReset()}>
                        Восстановить
                    </button>
                </div>
            </div>
        </div>
    );
}
