import styled, { keyframes } from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "./context";
import { useContext, useState, useEffect } from "react";
import homeIco from "../../img/menu/home.svg";
import userIco from "../../img/menu/user.svg";
import tasksIco from "../../img/menu/tasks.svg";
import teamsIco from "../../img/menu/teams.svg";
import exitIco from "../../img/menu/exit.svg";

const FadeIn = keyframes`
    to {
        opacity: 1;
        transform: scale(1);
    }
`;

const FadeOut = keyframes`
    from {
        opacity: 1;
        transform: scale(1);
    }
    to {
        opacity: 0;
        transform: scale(0.8);
    }
`;

const MenuContainer = styled.div<any>`
    width: max-content;
    height: 60px;
    background: #1d1d27;
    padding: 20px;
    position: fixed;
    bottom: 10px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    justify-self: center;
    border-radius: 10px;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
    opacity: 0;
    transform: scale(0.8);
    z-index: 15;

    transition: opacity 0.3s, transform 0.3s;
    animation: ${(props) => (props.showMenu ? FadeIn : FadeOut)} 0.3s
        ease-in-out forwards normal;

    // exit from
    &.fade-exit {
        opacity: 1;
    }

    // exit to
    &.fade-exit-active {
        opacity: 0;
    }
`;

const Page = styled.div<any>`
    min-width: 30px;
    padding: 5px;
    width: auto;
    height: auto;
    /* background: red; */
    margin-left: 10px;
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    color: white;
    /* ${(props) => props.hover && "background: #bbbbbb25;"} */
    ${(props) => props.active && "transform: scale(1.2);"}

    &:hover {
        background: #bbbbbb25;
    }
`;

interface propsSchema {
    setShowMenu: any;
    showMenu: any;
}

export default function Menu(props: propsSchema) {
    const navigator = useNavigate();
    const route = useLocation();
    const routes = [
        { path: "home", ico: homeIco, color: "#4343f5", title: "Главная" },
        { path: "me", ico: userIco, color: "#4343f5", title: "Личный кабинет" },
        { path: "tasks", ico: tasksIco, color: "#4343f5", title: "Таски" },
        { path: "teams", ico: teamsIco, color: "#4343f5", title: "Команды" },
        { path: "exit", ico: exitIco, color: "red", title: "Выход" },
    ];
    const { storage } = useContext(Context);
    const [loggedIn, setLoggedIn] = useState<any>(true);
    // const [activate, setActivate] = useState(false);

    async function getMe() {
        let response: Response = await fetch("/api/users/me", {
            headers: {
                Authorization: `Token ${storage.get("tracker")}`,
            },
        });
        if (response.status === 401) {
            return setLoggedIn(false);
        }
        if (response.status === 200) {
            return setLoggedIn(true);
        }
        return;
    }

    async function quit() {
        await fetch("/api/auth/token/logout", {
            method: "POST",
            headers: {
                Authorization: `Token ${storage.get("tracker")}`,
                "Content-Type": "application/json",
            },
        }).catch((err) => err);
        storage.set("tracker", "");
        storage.remove("tracker");
        return navigator("/signin");
    }

    function currentPath(data: any) {
        if (data.path === route.pathname.replaceAll("/", "")) {
            return true;
        } else if (route.pathname === "/" && data.path === "home") {
            return true;
        } else {
            return false;
        }
    }

    useEffect(() => {
        getMe();
    }, [route]);

    return (
        <MenuContainer
            onMouseLeave={() => props.setShowMenu(false)}
            showMenu={props.showMenu}
        >
            {loggedIn ? (
                routes.map((data) => (
                    <Page
                        key={routes.indexOf(data)}
                        onClick={() => {
                            if (data.path !== "exit") {
                                if (data.path !== "home") {
                                    navigator(data.path);
                                }
                            }
                            if (data.path === "exit") {
                                quit();
                            }
                            if (data.path === "home") {
                                navigator("/");
                            }
                        }}
                        active={currentPath(data)}
                        style={{
                            background: currentPath(data) && "#4343f5",
                        }}
                        title={data.title}
                    >
                        <img
                            src={data.ico}
                            alt="menu-item"
                            style={{
                                width: "25px",
                                height: "auto",
                                filter: "invert(100%)",
                            }}
                        />
                    </Page>
                ))
            ) : (
                <>
                    <Page
                        onClick={() => {
                            navigator("");
                        }}
                        style={{
                            background: route.pathname === "/" && "#4343f5",
                        }}
                    >
                        Главная
                    </Page>
                    <Page
                        onClick={() => {
                            navigator("signin");
                        }}
                        style={{
                            background:
                                route.pathname.replaceAll("/", "") ===
                                    "signin" && "#4343f5",
                        }}
                    >
                        Вход
                    </Page>
                </>
            )}
        </MenuContainer>
    );
}
