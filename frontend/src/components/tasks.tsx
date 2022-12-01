import { useEffect, useState } from "react";
import { Task } from "./task";
import React from "react"
import "./tasks.css";

export default function Tasks() {
    const [tasks, setTasks] = useState<Array<string>>([]);
    const [unauthorized, setUnauthorized] = useState(false);

    async function getTasks() {
        let response: Response = await fetch("http://127.0.0.1:8000/tasks/", {
            headers: {
                Authorization: `Token ${localStorage.getItem("auth_token")}`,
            },
        });
        if (response.status === 401) {
            setUnauthorized(true);
            return "";
        }
        let data = await response.json();
        setUnauthorized(false);
        return data;
    }

    useEffect(() => {
        return () => {
            getTasks().then((data) => {
                setTasks(Object.values(data));
            });
        };
    }, []);

    return (
        <div className="tasks-container">
            {tasks[0] ? (
                tasks.map((data) => (
                    <Task tasks={data} key={tasks.indexOf(data)} getTasks={getTasks} setTasks={setTasks} />
                ))
            ) : (
                <>
                    {unauthorized ? (
                        <h1>НЕАВТОРИЗОВАН</h1>
                    ) : (
                        <h1>LOADING...</h1>
                    )}
                </>
            )}
        </div>
    );
}
