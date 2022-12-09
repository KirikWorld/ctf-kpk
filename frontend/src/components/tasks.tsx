import { useEffect, useState } from "react";
import { Task } from "./task";
import React from "react"
import "./tasks.css";
import Loading from "./loading";

export default function Tasks() {
    const [tasks, setTasks] = useState<Array<string>>([]);
    const [unauthorized, setUnauthorized] = useState(false);

    async function getTasks() {
        let response: Response = await fetch("https://ctf-room.onrender.com/tasks/", {
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
            getTasks().then((data) => {
                setTasks(Object.values(data));
            });
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
                        <Loading />
                    )}
                </>
            )}
        </div>
    );
}
