import { useEffect, useState, useContext } from "react";
import { Task } from "./task";
import React from "react";
import "./tasks.css";
import Loading from "../global/loading";
import { Context } from "../global/context";
import Categories from "./categories";

export default function Tasks() {
    const [tasks, setTasks] = useState<Array<string>>([]);
    const [unauthorized, setUnauthorized] = useState(false);
    const [startTask, setStartTask] = useState(0);
    const [endTask, setEndTask] = useState(0);

    const [coordX, setCoordX] = useState<number>(0);
    const [draggingPos, setDraggingPos] = useState<number>(0);
    const [dragging, setDragging] = useState<boolean>(false);

    const { storage } = useContext(Context);

    async function getTasks() {
        let response: Response = await fetch("/api/tasks/", {
            headers: {
                Authorization: `Token ${storage.get("tracker")}`,
            },
        });
        if (response.status === 401) {
            setUnauthorized(true);
            return "";
        }
        let data = await response.json();
        setUnauthorized(false);
        let tasks = Object.values(data);
        tasks.length > 6 ? setEndTask(6) : setEndTask(tasks.length);
        return data;
    }

    useEffect(() => {
        getTasks().then((data) => {
            setTasks(Object.values(data));
        });
    }, []);

    function handleChangePage() {
        if (dragging) {
            console.log(draggingPos-coordX)
            if (draggingPos - coordX <= -300) {
                if (startTask > 5) {
                    setStartTask(startTask - 6);
                    setEndTask(endTask - 7);
                }
            } else if (draggingPos - coordX >= 300) {
                if (endTask < tasks.length) {
                    setStartTask(startTask + 6);
                    setEndTask(endTask + 7);
                }
            }
        }
    }

    return (
        <>
            <div className="tasks-wrapper">
                <Categories />
                <div
                    className="tasks-container"
                    onMouseDown={(e) => {
                        setDraggingPos(e.clientX);
                        setDragging(true);
                    }}
                    onMouseMoveCapture={(e) => {
                        setCoordX(e.clientX);
                        handleChangePage();
                    }}
                    onMouseUp={() => setDragging(false)}
                >
                    {tasks[0] ? (
                        tasks
                            .slice(startTask, endTask)
                            .map((data) => (
                                <Task
                                    tasks={data}
                                    key={tasks.indexOf(data)}
                                    getTasks={getTasks}
                                    setTasks={setTasks}
                                />
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
                <div className="empty"></div>
                <div className="nav">
                    <button
                        onClick={() => {
                            if (startTask > 5) {
                                setStartTask(startTask - 6);
                                setEndTask(endTask - 7);
                            }
                        }}
                    >
                        left
                    </button>
                    <button
                        onClick={() => {
                            if (endTask < tasks.length) {
                                setStartTask(startTask + 6);
                                setEndTask(endTask + 7);
                            }
                        }}
                    >
                        right
                    </button>
                </div>
            </div>
        </>
    );
}
