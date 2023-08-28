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

export default function Signup() {
    const [help, setHelp] = useState(false);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const signinContainer = useRef(null);
    const [unauthorized, setUnauthorized] = useState(false);
    const [error, setError] = useState<string>("");
    const [notif, setNotif] = useState<boolean>(false);

    const [pswdVisible, setPswdVisible] = useState(false);

    const { storage } = useContext(Context);

    async function handleSignin() {
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
        navigate("/me/");
    }

    function successLogin(e: any) {
        if (e.key === "Enter") {
            handleSignin();
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
                                type={pswdVisible ? "text" : "password"}
                                name=""
                                id="psw"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <ShowPswd
                                onClick={() => setPswdVisible(!pswdVisible)}
                            >
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
                            <button className="signin" onClick={() => handleSignin()}>
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
                        <div className="help-nav" style={{width: "100%", display: "flex", justifyContent: "space-around"}}>
                            <u
                                onMouseEnter={() => setHelp(true)}
                                onMouseLeave={() => setHelp(false)}
                                onClick={() => setHelp(!help)}
                            >
                                Нужна помощь?
                                {help && (
                                    <div className="need-help">
                                        Telegram: @kiriknm
                                    </div>
                                )}
                            </u>
                            <u style={{cursor: "pointer"}} onClick={()=>navigate('reset/')}>Забыли пароль?</u>
                        </div>
                    </div>
                
            </div>
        </>
    );
}
