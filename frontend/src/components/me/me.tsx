import { useEffect, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./me.css";
import RankedUser from "./rankedUser";
import Loading from "../global/loading";
import { Context } from "../global/context";
import { useContext } from "react";

export default function Me() {
    const [ranks, setRanks] = useState<Array<String>>([]);
    const [username, setUsername] = useState("");
    const [points, setPoints] = useState(0);
    const navigator = useNavigate();
    const [loading, setLoading] = useState(false);
    const [currentDate, setCurrentDate] = useState("Доброй ночи!");

    const { storage } = useContext(Context);

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

    useEffect(() => {
        getMe().catch((err) => console.log(err));
        usersRanks().then((data) => setRanks(Object.values(data)));
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
                                        storage.set("tracker", "");
                                        storage.remove("tracker");
                                        navigator("/signin");
                                    }}
                                >
                                    Выйти
                                </button>
                            </div>
                        </div>
                        <div className="daily">
                            <h1>Таск недели (скоро)</h1>
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
