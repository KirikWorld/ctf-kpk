import { useState, useRef } from "react";
import "./signup.css";
import { useNavigate } from "react-router-dom";
import { Context } from "../global/context";
import { useContext } from "react";
import PswdReq from "./pswdReq";
import { CSSTransition } from "react-transition-group";
import styled from "styled-components";
import showpswd from "../../img/showpswd.png";
import hidepswd from "../../img/hidepswd.png";

const ShowPswd = styled.div`
    position: absolute;
    width: 40px;
    height: 40px;
    right: 30px;

    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    @media (max-width: 650px) {
        right: 55px;
        width: 25px;
        height: 25px;
    }
`;

export default function Signup() {
    const navigate = useNavigate();
    const { setNotifText, setNotif, setLoading, storage } = useContext(Context);

    const [email, setEmail] = useState<string>("");
    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    // const [group, setGroup] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [showpswdReq, setshowPswdReq] = useState<boolean>(false);
    const [pswdVisible, setPswdVisible] = useState(false);

    const reqNode = useRef(null);

    async function registration() {
        storage.set("tracker", "");
        storage.remove("tracker");
        let response: Response = await fetch("/auth/users/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                group: `${new Date().getUTCDate().toString()}.${new Date()
                    .getUTCMonth()
                    .toString()}.${new Date().getUTCFullYear().toString()}`,
                first_name: name,
                last_name: surname,
                email: email,
                username: login,
                password: password,
            }),
        });
        let data = await response.json();
        if (response.status === 201) {
            setNotifText("Сообщение отправленно на почту.");
            setNotif(true);
            navigate("/signin/");
        } else {
            let hint;
            for (let key in data) hint = data[key];
            if (hint[0] === "Это поле не может быть пустым.")
                hint = "Заполните все поля.";
            if (hint[0] === "пользователь с таким Никнейм уже существует.")
                hint = "Пользователь с таким никнеймом существует.";
            if (hint[0].indexOf("Введённый пароль слишком короткий") === 0)
                hint = "Пароль не соответствует требованиям";
            setNotifText(`${hint}`);
            setNotif(true);
        }
        return setLoading(false);
    }

    return (
        <div className="signup-container">
            <h1 className="title">Регистрация</h1>
            <div className="info">
                <p>Почта:</p>
                <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
            </div>
            <div className="info">
                <p>Никнейм:</p>
                <input
                    type="text"
                    onChange={(e) => setLogin(e.target.value)}
                    value={login}
                />
            </div>
            <div className="info" id="password">
                <p>Пароль:</p>
                <input
                    type={pswdVisible ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    style={{ paddingRight: "62px" }}
                />
                <ShowPswd onClick={() => setPswdVisible(!pswdVisible)}>
                    <img
                        src={pswdVisible ? hidepswd : showpswd}
                        alt="Показать пароль"
                        style={{
                            width: "100%",
                            mixBlendMode: "multiply",
                        }}
                    />
                </ShowPswd>
                <CSSTransition
                    nodeRef={reqNode}
                    in={showpswdReq}
                    timeout={300}
                    classNames={"pswdReq"}
                    unmountOnExit
                >
                    <div className="pswdReqContainer" ref={reqNode}>
                        <PswdReq setshowPswdReq={setshowPswdReq}></PswdReq>
                    </div>
                </CSSTransition>
                <div
                    className="hint"
                    onClick={() => setshowPswdReq(!showpswdReq)}
                    onMouseEnter={() => setshowPswdReq(true)}
                    onMouseLeave={() => setshowPswdReq(false)}
                >
                    <p>?</p>
                </div>
            </div>
            <div className="info">
                <p>Имя:</p>
                <input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
            </div>
            <div className="info">
                <p>Фамилия:</p>
                <input
                    type="text"
                    onChange={(e) => setSurname(e.target.value)}
                    value={surname}
                />
            </div>
            <div className="btns">
                <button
                    onClick={() => {
                        registration();
                        setLoading(true);
                    }}
                >
                    Зарегистрироваться
                </button>
                <button
                    onClick={() => {
                        navigate("/signin/");
                    }}
                >
                    Или войти здесь
                </button>
            </div>
        </div>
    );
}
