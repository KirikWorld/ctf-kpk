import { useRef, useState } from "react";
import React from "react"
import "./task.css";

export function Task(props: any) {
    const [rotate, setRotate] = useState(false);
    const [cardClass, setCardClass] = useState("task-container");
    const taskContainer = useRef(null);
    const flagInput = useRef(null);

    function handleRotate(e: any) {
        if (e.target === taskContainer.current) {
            setCardClass("task-container cardRotate-anim");
            setRotate(!rotate);
        }
    }

    async function handleFlag(e: any) {
        if (e.key === "Enter") {
            let response: Response = await fetch(
                "http://127.0.0.1:8000/tasks/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                        Authorization: `Token ${localStorage.getItem(
                            "auth_token"
                        )}`,
                    },
                    body: JSON.stringify({ flag: e.target.value }),
                }
            );
            let data = await response.json();
            console.log(data);
            e.target.value = "";
            props
                .getTasks()
                .then((data: any) => props.setTasks(Object.values(data)));
            return data;
        }
    }

    return (
        <div
            className={cardClass}
            onClick={(e) => handleRotate(e)}
            ref={taskContainer}
            key={Math.random()}
        >
            {rotate ? (
                <>
                    <h1 className="title">{props.tasks.title}</h1>
                    <p className="file">
                        Файл:{" "}
                        {props.tasks.file ? (
                            <a
                                href={`http://127.0.0.1:8000/media/${props.tasks.file}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                файлик
                            </a>
                        ) : (
                            "Нету"
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
                    <h1 className="title">{props.tasks.title}</h1>
                    <p className="description">{props.tasks.description}</p>
                    <p className="cost">Очки: {props.tasks.costs}</p>
                </>
            )}
        </div>
    );
}
