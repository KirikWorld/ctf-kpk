import { useEffect, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import "../me/me.css";
import RankedUser from "../me/rankedUser";
// import Loading from "../global/loading";
import { Context } from "../global/context";
import { useContext } from "react";
import copyIco from "../../img/copy.svg";

export default function TeamCabinet(props: any) {
    const [ranks, setRanks] = useState([]);
    const [members, setMembers] = useState([]);
    const [username, setUsername] = useState("");
    const [invintation, setInvintation] = useState("");

    const { storage, setNotif, setNotifText } = useContext(Context);
    const navigate = useNavigate();

    async function usersRanks() {
        let response: Response = await fetch("/api/teams/ranks", {
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

    async function getMe() {
        let response: Response = await fetch("/api/users/me", {
            headers: {
                Authorization: `Token ${storage.get("tracker")}`,
            },
        });
        if (response.status === 401) {
            navigate("/signin/");
            return;
        }
        let data = await response.json();
        setUsername(data.user);
        return data;
    }

    async function generateInvintation() {
        let response: Response = await fetch(`/api/teams/invite`, {
            method: "POST",
            headers: {
                Authorization: `Token ${storage.get("tracker")}`,
            },
        });
        let data = await response.json();
        if ((await response.status) === 401) {
            setNotif(true);
            setNotifText("Неавторизован");
            navigate("/signin/");
        }
        if (data.error) {
            setNotif(true);
            setNotifText(data.error);
        }
        if (data.invintation) {
            setNotif(true);
            setNotifText("Успешно");
            setInvintation(data.invintation);
        }
        return;
    }

    useEffect(() => {
        getMe();
        let sortedMembers: any = Object.values(props.team.members).sort(
            (a: any, b: any) => parseFloat(b.points) - parseFloat(a.points)
        );
        setMembers(sortedMembers);
        usersRanks().then((data) => setRanks(Object.values(data)));
        setInvintation(props.team.invintation);
    }, []);

    return (
        <>
            <div className="me-container">
                <div className="left-part" style={{ gap: "10px" }}>
                    <div className="me teams">
                        <h1>Команда: {props.team.team}</h1>
                        <p>
                            <a href={"/invintation/" + invintation}>
                                Приглашение
                            </a>
                            <img
                                src={copyIco}
                                alt="Копировать"
                                title="Копировать"
                                onClick={() => {
                                    navigator.clipboard
                                        .writeText(
                                            "https://ctf-kpk.ru/invintation/" +
                                                invintation
                                        )
                                        .then(() => {
                                            setNotif(true);
                                            setNotifText(
                                                "Приглашение скопировано"
                                            );
                                        })
                                        .catch((err) => {
                                            setNotif(true);
                                            setNotifText(
                                                `${err}`
                                            );
                                        });
                                }}
                                style={{
                                    width: "20px",
                                    marginLeft: "10px",
                                    filter: "invert(1)",
                                    cursor: "pointer",
                                    marginBottom: "-2px",
                                }}
                            />
                        </p>
                        <div className="me-btns">
                            <button
                                style={{ width: "max-content" }}
                                onClick={() => generateInvintation()}
                            >
                                Сгенерировать приглашение
                            </button>
                            <button style={{ color: "white" }} onClick={()=>navigate("tasks/")}>К таскам</button>
                        </div>
                    </div>
                    <div className="rating" style={{ height: "350px" }}>
                        <h1>Участники</h1>
                        <div
                            className="raiting-container"
                            style={{ overflowY: "scroll", height: "205px" }}
                        >
                            {members.map((data) => (
                                <RankedUser
                                    key={members.indexOf(data)}
                                    ranks={data}
                                    index={members.indexOf(data)}
                                    me={username}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="right-part">
                    <div className="rating">
                        <h1>Рейтинг команд</h1>
                        <div className="raiting-container">
                            {ranks.map((data) => (
                                <RankedUser
                                    key={ranks.indexOf(data)}
                                    ranks={data}
                                    index={ranks.indexOf(data)}
                                    me={props.team.team}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
