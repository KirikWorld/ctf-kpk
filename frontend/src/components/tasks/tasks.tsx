import { useEffect, useState, useContext, useRef } from "react";
import { Task } from "./task";
import React from "react";
import "./tasks.css";
import { Context } from "../global/context";
import Categories from "./category/categories";
import styled from "styled-components";
import { CSSTransition } from "react-transition-group";
import cogImg from "../../img/cogR.png";

const TaskContainer = styled.div<any>`
    width: 90%;
    height: 100%;

    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;

    justify-items: center;
    align-items: center;

    justify-self: center;
    align-self: center;

    position: relative;

    transform: translateZ(0);
    backface-visibility: hidden;
    overflow: hidden;
    margin: 0;
    /* will-change: transform; */

    @media (max-width: 1399px) {
        display: grid;
        margin: 0;
        grid-template-columns: 1fr 1fr;
        justify-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        gap: 20px;
        position: relative;
    }

    @media (max-width: 949px) {
        display: grid;
        margin: 0;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
        justify-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        gap: 20px;
        position: relative;
    }

    &.swipe-enter {
        transform: ${(props) =>
            props.rightSwipe ? "translateX(200vh);" : "translateX(-200vh);"};
    }

    &.swipe-enter-active {
        transform: translateX(0);
        transition: all 0.35s cubic-bezier(0.05, 0.64, 0.43, 0.99);
    }

    &.swipe-exit {
        transform: translateX(0);
    }

    &.swipe-exit-active {
        transform: ${(props) =>
            props.rightSwipe ? "translateX(-200vh);" : "translateX(200vh);"};
        transition: all 0.35s linear;
    }
`;

const Cog = styled.div<any>`
    width: 100%;
    height: 100%;
    background: url(${cogImg}) no-repeat;
    background-size: 30px auto;
    background-position: center;
    transition: transform 0.3s ease-in-out;
    transform: ${(props: any) =>
        props.go ? "rotate(180deg);" : "rotate(0deg);"};
`;

const Pages = styled.div`
    position: sticky;
    border-radius: 10px;
    max-width: 200px;
    width: auto;
    padding: 0 10px;
    box-sizing: border-box;
    height: 30px;
    background: #d2d2d214;
    backdrop-filter: blur(10px);
    bottom: 10px;
    justify-self: center;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    box-shadow: 1px 1px 10px 10px #00000011;
    overflow-x: scroll;
    scrollbar-width: none;

    transition: transform 0.3s ease-in-out;

    z-index: 999;

    &::-webkit-scrollbar {
        width: 0px;
        height: 0px;
    }

    &:hover {
        transform: scale(1.5);
    }
`;

const Page = styled.div<any>`
    border-radius: 50%;
    min-width: 10px;
    width: 10px;
    background: ${(props) => (props.here ? "white" : "#87878787")};
    color: black;
    height: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 3px;
    margin-right: 3px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
`;

export default function Tasks(props: any) {
    const [tasks, setTasks] = useState<any>([]);
    const [unauthorized, setUnauthorized] = useState(false);
    const [startTask, setStartTask] = useState(0);
    const [endTask, setEndTask] = useState(0);

    const [cats, setCats] = useState<any>([]);

    const [swipe, setSwipe] = useState(true);
    const [rightSwipe, setRightSwipe] = useState(false);
    const [tasksPerPage, setTasksPerPage] = useState<number>(0);
    const taskContainerNode = useRef(null);

    const [showCat, setShowCat] = useState(false);
    const [catAnim, setCatAnim] = useState(false);
    const [filteredTasks, setFilteredTasks] = useState<any>([]);

    const [startTouch, setStartTouch] = useState(0);
    const [endTouch, setEndTouch] = useState(0);
    const [dragging, setDraggin] = useState(false);

    const [pages, setPages] = useState<any>([]);

    const [renderPages, setRenderPages] = useState(false);

    const { storage, setLoading } = useContext(Context);

    async function getTasks() {
        setLoading(true);
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
        tasks.length > tasksPerPage ? getSize() : setEndTask(tasks.length);
        setLoading(false);
        setFilteredTasks(tasks);
        return data;
    }

    async function getCats() {
        setLoading(true);
        let response: Response = await fetch("/api/tasks/categories/", {
            headers: {
                Authorization: `Token ${storage.get("tracker")}`,
            },
        });
        let data = await response.json();
        setLoading(false);
        return data;
    }

    const getSize = () => {
        if (props.screenWidth >= 1398) {
            setEndTask(6);
        }
        if (props.screenWidth >= 950 && props.screenWidth < 1400) {
            setEndTask(4);
        }
        if (props.screenWidth >= 0 && props.screenWidth < 950) {
            setEndTask(2);
        }
    };

    useEffect(() => {
        if (props.screenWidth >= 1400) {
            setTasksPerPage(6);
            setStartTask(0);
            getSize();
        }
        if (props.screenWidth >= 950 && props.screenWidth < 1400) {
            setTasksPerPage(4);
            setStartTask(0);
            getSize();
        }
        if (props.screenWidth >= 0 && props.screenWidth < 950) {
            setTasksPerPage(2);
            setStartTask(0);
            getSize();
        }
        setRenderPages(!renderPages);
    }, [props]);

    function handleChangePage() {
        if (startTask >= tasksPerPage && !rightSwipe) {
            setStartTask(startTask - tasksPerPage);
            setEndTask(endTask - tasksPerPage);
        }
        if (endTask < filteredTasks.length && rightSwipe) {
            setStartTask(startTask + tasksPerPage);
            setEndTask(endTask + tasksPerPage);
        }
    }

    function categoryFilter() {
        let res: any = [];
        for (let cat of cats) {
            if (cat.checked === "true")
                res.push(
                    tasks.filter((data: any) => data.category === cat.category)
                );
        }
        if (!!res.length) {
            setStartTask(0);
            getSize();
            return res.reduce(function (arr: any, e: any) {
                return arr.concat(e);
            });
        }
        return tasks;
    }

    const [rerender, setRerender] = useState(false);

    useEffect(() => {
        setFilteredTasks(categoryFilter());
    }, [rerender]);

    useEffect(() => {
        if (filteredTasks) {
            const rows = [];
            for (
                let page = 1;
                page <= Math.ceil(filteredTasks.length / tasksPerPage);
                page++
            ) {
                rows.push(page);
            }
            setPages(rows);
        }
    }, [filteredTasks, props.screenWidth, renderPages]);

    useEffect(() => {
        getTasks().then((data) => {
            setTasks(Object.values(data));
        });
        getCats().then((data) => {
            setCats(Object.values(data));
        });
    }, []);

    return (
        <>
            <div className="tasks-wrapper">
                <CSSTransition
                    in={swipe}
                    timeout={350}
                    classNames={"swipe"}
                    onExited={() => {
                        setSwipe(true);
                        handleChangePage();
                    }}
                    nodeRef={taskContainerNode}
                    unmountOnExit
                >
                    <TaskContainer
                        onTouchStart={(e: any) => {
                            setStartTouch(e.touches[0].pageX);
                        }}
                        onTouchMoveCapture={(e: any) => {
                            setEndTouch(e.touches[0].pageX);
                            setDraggin(true);
                        }}
                        onTouchEnd={(e: any) => {
                            if (dragging) {
                                if (startTouch - endTouch >= 100) {
                                    if (endTask < filteredTasks.length) {
                                        setRightSwipe(true);
                                        setSwipe(false);
                                    }
                                } else if (startTouch - endTouch <= -100) {
                                    if (startTask >= tasksPerPage) {
                                        setRightSwipe(false);
                                        setSwipe(false);
                                    }
                                }
                                setDraggin(false);
                            }
                        }}
                        rightSwipe={rightSwipe}
                        ref={taskContainerNode}
                    >
                        {tasks[0] ? (
                            filteredTasks
                                .slice(startTask, endTask)
                                .map((data: any) => (
                                    <Task
                                        tasks={data}
                                        key={tasks.indexOf(data)}
                                        getTasks={getTasks}
                                        setTasks={setTasks}
                                        setRerender={setRerender}
                                        rerender={rerender}
                                    />
                                ))
                        ) : (
                            <>
                                {unauthorized ? (
                                    <h1>НЕАВТОРИЗОВАН</h1>
                                ) : (
                                    <div className="empty"></div>
                                )}
                            </>
                        )}
                    </TaskContainer>
                </CSSTransition>
                {props.screenWidth >= 420 && (
                    <div className="nav-btns">
                        {startTask !== 0 ? (
                            <button
                                onClick={() => {
                                    if (startTask >= tasksPerPage) {
                                        setRightSwipe(false);
                                        setSwipe(false);
                                    }
                                }}
                                style={{ fontSize: "30px" }}
                            >
                                &lt;
                            </button>
                        ) : (
                            <div className="empty"></div>
                        )}
                        {endTask < filteredTasks.length ? (
                            <button
                                onClick={() => {
                                    if (endTask < filteredTasks.length) {
                                        setRightSwipe(true);
                                        setSwipe(false);
                                    }
                                }}
                                style={{ fontSize: "30px" }}
                            >
                                &gt;
                            </button>
                        ) : (
                            <div className="empty"></div>
                        )}
                    </div>
                )}
                <Pages>
                    {pages.map((data: any) => (
                        <Page
                            key={data}
                            here={
                                tasksPerPage * data === endTask ? true : false
                            }
                            onClick={() => {
                                setEndTask(tasksPerPage * data);
                                setStartTask(
                                    tasksPerPage * data - tasksPerPage
                                );
                            }}
                        ></Page>
                    ))}
                </Pages>
                <div
                    className="cat-container"
                    style={{
                        position: "sticky",
                        bottom: "10px",
                        left: "10px",
                        zIndex: "3",
                        width: `${showCat ? "340px" : "50px"}`,
                        height: `${showCat ? "390px" : "50px"}`,
                        alignSelf: "end",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    {showCat && (
                        <Categories
                            setShowCat={setShowCat}
                            catAnim={catAnim}
                            setCatAnim={setCatAnim}
                            cats={cats}
                            setRerender={setRerender}
                            rerender={rerender}
                        />
                    )}
                    <button
                        onClick={() => {
                            setShowCat(true);
                            setCatAnim(!showCat);
                        }}
                        style={{
                            width: "50px",
                            height: "50px",
                            position: "absolute",
                            bottom: "0",
                            left: "0",
                        }}
                    >
                        <Cog go={catAnim} />
                    </button>
                </div>
            </div>
        </>
    );
}
