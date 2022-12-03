import { useEffect, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./me.css";
import RankedUser from "./rankedUser";

export default function Me() {
    const [ranks, setRanks] = useState<Array<String>>([]);
    const [username, setUsername] = useState("");
    const [points, setPoints] = useState(0);
    const navigator = useNavigate();

    async function getMe() {
        let response: Response = await fetch(
            "https://ctf-room.onrender.com/users/me",
            {
                headers: {
                    Authorization: `Token ${localStorage.getItem(
                        "auth_token"
                    )}`,
                },
            }
        );
        if (response.status === 401) {
            window.location.replace("/signin/");
            return;
        }
        let data = await response.json();
        setUsername(data.user);
        setPoints(data.points);
        return data;
    }

    async function usersRanks() {
        let response: Response = await fetch(
            "https://ctf-room.onrender.com/users/ranks",
            {
                headers: {
                    Authorization: `Token ${localStorage.getItem(
                        "auth_token"
                    )}`,
                },
            }
        );
        let data = await response.json();
        data = Object.values(data).sort(
            (a: any, b: any) => parseFloat(b.points) - parseFloat(a.points)
        );

        return data;
    }

    useEffect(() => {
        getMe();
        usersRanks().then((data) => setRanks(Object.values(data)));
    }, []);

    return (
        <div className="me-container">
            <div className="left-part">
                <div className="me">
                    <h1>Привет, {username}</h1>
                    <p>Удачного дня!</p>
                    <p>Твои очки: {points}</p>
                    <div className="me-btns">
                        <button
                            title="К таскам"
                            onClick={() => {
                                navigator("/tasks/");
                            }}
                        >
                            К таскам
                        </button>
                        <button title="Команды">Команды (скоро)</button>
                        <button
                            title="Выйти"
                            onClick={() => {
                                localStorage.setItem("auth_key", "");
                                navigator("/signin");
                            }}
                        >
                            Выйти
                        </button>
                    </div>
                </div>
                <div className="daily">
                    <h1>Ежедневный таск (скоро)</h1>
                </div>
            </div>
            <div className="right-part">
                <div className="rating">
                    <h1>Рейтинг игроков</h1>
                    {ranks.map((data) => (
                        <RankedUser
                            key={ranks.indexOf(data)}
                            ranks={data}
                            index={ranks.indexOf(data)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
