import { useEffect, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./me.css";
import RankedUser from "./rankedUser";
import Loading from "../global/loading";
import { Context } from "../global/context";
import { useContext } from "react";
import styled from "styled-components";

const Solved = styled.div`
    position: absolute;
    bottom: 20px;
    left: 20px;
    width: 135px;
    height: 31px;
    background: rgba(255, 255, 255, 0.16);
    color: #57ce63;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default function Me() {
    const [ranks, setRanks] = useState<Array<String>>([]);
    const [username, setUsername] = useState("");
    const [points, setPoints] = useState(0);
    const navigator = useNavigate();
    const [loading, setLoading] = useState(false);
    const [currentDate, setCurrentDate] = useState("Доброй ночи!");
    const [daily, setDaily] = useState<any>({});

    const [flag, setFlag] = useState("");

    const { storage, setNotif, setNotifText } = useContext(Context);

    async function getMe() {
        setLoading(true);
        let response: Response = await fetch("/api/users/me", {
            headers: {
                Authorization: `Token ${storage.get("tracker")}`,
            },
        });
        if (response.status === 401) {
            navigator("/signin/");
            return;
        }
        if (response.status === 200) {
            setLoading(false);
        }
        let data = await response.json();
        setUsername(data.user);
        setPoints(data.points);
        return data;
    }

    async function usersRanks() {
        let response: Response = await fetch("/api/users/ranks", {
            headers: {
                Authorization: `Token ${storage.get("tracker")}`,
            },
        });
        let data = await response.json();
        data = Object.values(data).sort(
            (a: any, b: any) => parseFloat(b.points) - parseFloat(a.points)
        );

        return data;
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

    async function getDaily() {
        setLoading(true);
        let response: Response = await fetch("/api/tasks/daily", {
            headers: {
                Authorization: `Token ${storage.get("tracker")}`,
            },
        });
        let data = await response.json();
        setLoading(false);
        return data;
    }

    async function handleFlag() {
        let response: Response = await fetch("/api/tasks/daily", {
            method: "POST",
            headers: {
                Authorization: `Token ${storage.get("tracker")}`,
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({ flag: flag }),
        });
        let data = await response.json();
        if (data !== "Something wents wrong") {
            setNotif(true);
            setNotifText("Успешно!");
            getDaily()
                .then((data: any) => setDaily(data))
                .catch((err) => console.log(err));
        } else {
            setNotif(true);
            setNotifText("Проверь правильность флага.");
        }
    }

    useEffect(() => {
        getMe().catch((err) => console.log(err));
        usersRanks().then((data) => setRanks(Object.values(data)));
        getDaily()
            .then((data: any) => setDaily(data))
            .catch((err) => console.log(err));
        let date = new Date();
        switch (true) {
            case Number(date.getHours()) >= 8 && Number(date.getHours()) < 12:
                setCurrentDate("Доброе утро!");
                break;
            case Number(date.getHours()) >= 12 && Number(date.getHours()) < 16:
                setCurrentDate("Удачного дня!");
                break;
            case Number(date.getHours()) >= 16 && Number(date.getHours()) < 20:
                setCurrentDate("Удачного вечера!");
                break;
            default:
                setCurrentDate("Доброй ночи!");
                break;
        }
    }, []);

    return (
        <div className="me-container">
            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className="left-part">
                        <div className="me">
                            <h1>Привет, {username}</h1>
                            <p>{currentDate}</p>
                            <p>
                                Присоединяйся{" "}
                                <a
                                    href="https://t.me/+HbYwxlMtOwk4NTJi"
                                    target="_blank"
                                    rel="noreferrer"
                                    title="Телеграм чат"
                                    style={{ color: "white", fontWeight: "bold" }}
                                >
                                    к нам
                                </a>
                            </p>
                        </div>

                        <div
                            className="daily"
                            style={
                                daily.solved !== "None"
                                    ? { gridTemplateRows: "25px 1fr 25px" }
                                    : { transform: "none" }
                            }
                        >
                            <h1>Еженедельный таск</h1>
                            <p>{daily.description}</p>
                            {daily.solved === "None" ? (
                                <input
                                    // style={{height: "80px"}}
                                    type="text"
                                    name=""
                                    id=""
                                    onChange={(e) => setFlag(e.target.value)}
                                    onKeyUp={(e) => {
                                        e.key === "Enter" && handleFlag();
                                    }}
                                    placeholder="Сюда флаг"
                                />
                            ) : (
                                <Solved>Выполнено</Solved>
                            )}
                        </div>
                    </div>
                    <div className="right-part">
                        <div className="rating">
                            <h1>Рейтинг игроков</h1>
                            <div className="raiting-container">
                                {ranks.map((data) => (
                                    <RankedUser
                                        key={ranks.indexOf(data)}
                                        ranks={data}
                                        index={ranks.indexOf(data)}
                                        me={username}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
