import { useRef, useState, useEffect } from "react";
import React from "react";
import "./task.css";
import { Context } from "../global/context";
import { useContext } from "react";

export function Task(props: any) {
    const [rotate, setRotate] = useState(false);
    const [cardClass, setCardClass] = useState("task-container");
    const taskContainer = useRef(null);
    const flagInput = useRef(null);
    const nodeDescription = useRef(null);
    const { setNotifText, setNotif, storage } = useContext(Context);
    const [timeoutID, setTimeoutID] = useState<any>();

    useEffect(() => {
        console.log(props.tasks.category);
        return () => clearTimeout(timeoutID);
    }, []);

    function handleRotate(e: any) {
        if (e.target === taskContainer.current) {
            setCardClass("task-container cardRotate-anim");
            setRotate(!rotate);
            const timeout = setTimeout(
                () => setCardClass("task-container"),
                800
            );
            setTimeoutID(timeout);
        }
    }

    async function handleFlag(e: any) {
        if (e.key === "Enter") {
            let response: Response = await fetch("/api/tasks/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                    Authorization: `Token ${storage.get("tracker")}`,
                },
                body: JSON.stringify({ flag: e.target.value }),
            });
            let data = await response.json();
            if (data === "Something wents wrong") {
                setNotifText("Проверь правильность введенного флага.");
                setNotif(true);
            } else {
                setNotifText("Успешно!");
                setNotif(true);
            }
            e.target.value = "";
            props
                .getTasks()
                .then((data: any) => props.setTasks(Object.values(data)));
            return data;
        }
    }

    return (
        <>
            {props.tasks.solved === "None" ? (
                <div
                    className={cardClass}
                    onClick={(e) => handleRotate(e)}
                    ref={taskContainer}
                    key={Math.random()}
                >
                    {rotate ? (
                        <>
                            <h1 className="title">{props.tasks.title}</h1>
                            <div className="description-container">
                                <p className="description">
                                    {props.tasks.description}
                                </p>
                            </div>
                            <p className="file">
                                Файл:
                                {props.tasks.file ? (
                                    <a
                                        href={`/media/${props.tasks.file}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        download={true}
                                    >
                                        файлик
                                    </a>
                                ) : (
                                    " Нету"
                                )}
                            </p>
                            <input
                                type="text"
                                placeholder="Сюда флаг"
                                ref={flagInput}
                                onKeyUp={(e) => handleFlag(e)}
                            />
                        </>
                    ) : (
                        <>
                            <h1 className="category">
                                {props.tasks.category.toUpperCase()}
                            </h1>
                            <p className="cost">{props.tasks.costs}</p>
                        </>
                    )}
                </div>
            ) : (
                <div className="task-container solved" key={Math.random()}>
                    <h1 className="title">{props.tasks.title}</h1>
                    <p className="description">{props.tasks.description}</p>
                    <p className="file">
                        Файл:{" "}
                        {props.tasks.file ? (
                            <a
                                href={`/media/${props.tasks.file}`}
                                target="_blank"
                                rel="noreferrer"
                                download={true}
                            >
                                файлик
                            </a>
                        ) : (
                            "Нету"
                        )}
                    </p>
                    <div className="bottom">
                        <p className="cost">Очки: {props.tasks.costs}</p>
                        <p className="success">выполнено</p>
                    </div>
                </div>
            )}
        </>
    );
}
