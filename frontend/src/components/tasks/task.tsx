import { useRef, useState, useEffect } from "react";
// import "./task.css";
import { Context } from "../global/context";
import { useContext } from "react";
import styled, { css, keyframes } from "styled-components";
import Front from "./card/front";
import Back from "./card/back";

const rotate = keyframes`
    to {
        transform: rotate(45deg);
    }
`;

const TaskContainer = styled.div<any>`
    display: grid;
    grid-template-rows: 1fr 5fr 1fr;
    row-gap: 30px;

    max-width: 350px;
    width: 100%;
    height: 350px;

    padding: 20px;
    /* margin-bottom: 30px; */

    mix-blend-mode: normal;
    box-shadow: 0px 0px 18px 1px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(50px);
    border-radius: 20px;

    position: relative;
    /* background: ${(props) => (props.rotate ? props.rotate : "#a659fd10")}; */
    background: #a659fd10;

    ${(props) =>
        props.rotate
            ? css`
                  animation: ${rotate} 0.5s forwards normal ease-in-out;
              `
            : css`
                  animation: ${rotate} 0.5s reverse forwards ease-in-out;
              `};
`;

export function Task(props: any) {
    const [front, setFront] = useState(true);
    const [back, setBack] = useState(false);

    return (
        <>
            <Front back={back} setBack={setBack} front={front} setFront={setFront} tasks={props.tasks} />
            <Back back={back} setBack={setBack} front={front} setFront={setFront} tasks={props.tasks} />
        </>
    );
    // const [rotate, setRotate] = useState(false);
    // const [cardClass, setCardClass] = useState("task-container");
    // const taskContainer = useRef(null);
    // const flagInput = useRef(null);
    // // const nodeDescription = useRef(null);
    // const { setNotifText, setNotif, storage } = useContext(Context);
    // const [timeoutID, setTimeoutID] = useState<any>();

    // useEffect(() => {
    //     console.log(props.tasks.category);
    //     return () => clearTimeout(timeoutID);
    // }, []);

    // function handleRotate(e: any) {
    //     if (e.target === taskContainer.current) {
    //         setCardClass("task-container cardRotate-anim");
    //         setRotate(!rotate);
    //         const timeout = setTimeout(
    //             () => setCardClass("task-container"),
    //             800
    //         );
    //         setTimeoutID(timeout);
    //     }
    // }

    // async function handleFlag(e: any) {
    //     if (e.key === "Enter") {
    //         let response: Response = await fetch("/api/tasks/", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json;charset=utf-8",
    //                 Authorization: `Token ${storage.get("tracker")}`,
    //             },
    //             body: JSON.stringify({ flag: e.target.value }),
    //         });
    //         let data = await response.json();
    //         if (data === "Something wents wrong") {
    //             setNotifText("Проверь правильность введенного флага.");
    //             setNotif(true);
    //         } else {
    //             setNotifText("Успешно!");
    //             setNotif(true);
    //         }
    //         e.target.value = "";
    //         props
    //             .getTasks()
    //             .then((data: any) => props.setTasks(Object.values(data)));
    //         return data;
    //     }
    // }

    // return (
    //     <>
    //         {props.tasks.solved === "None" ? (
    //             <div
    //                 className={cardClass}
    //                 onClick={(e) => handleRotate(e)}
    //                 ref={taskContainer}
    //                 key={Math.random()}
    //             >
    //                 {rotate ? (
    //                     <>
    //                         <h1 className="title">{props.tasks.title}</h1>
    //                         <div className="description-container">
    //                             <p className="description">
    //                                 {props.tasks.description}
    //                             </p>
    //                         </div>
    //                         <p className="file">
    //                             Файл:
    //                             {props.tasks.file ? (
    //                                 <a
    //                                     href={`/media/${props.tasks.file}`}
    //                                     target="_blank"
    //                                     rel="noreferrer"
    //                                     download={true}
    //                                 >
    //                                     файлик
    //                                 </a>
    //                             ) : (
    //                                 " Нету"
    //                             )}
    //                         </p>
    //                         <input
    //                             type="text"
    //                             placeholder="Сюда флаг"
    //                             ref={flagInput}
    //                             onKeyUp={(e) => handleFlag(e)}
    //                         />
    //                     </>
    //                 ) : (
    //                     <>
    //                         <h1 className="title" style={{"justifySelf": "flex-start", "textAlign": "left"}} >{props.tasks.title}</h1>
    //                         <div></div>
    //                         <p className="cost">{props.tasks.costs}</p>
    //                     </>
    //                 )}
    //             </div>
    //         ) : (
    //             <div className="task-container solved" key={Math.random()}>
    //                 <h1 className="title">{props.tasks.title}</h1>
    //                 <p className="description">{props.tasks.description}</p>
    //                 <p className="file">
    //                     Файл:{" "}
    //                     {props.tasks.file ? (
    //                         <a
    //                             href={`/media/${props.tasks.file}`}
    //                             target="_blank"
    //                             rel="noreferrer"
    //                             download={true}
    //                         >
    //                             файлик
    //                         </a>
    //                     ) : (
    //                         "Нету"
    //                     )}
    //                 </p>
    //                 <div className="bottom">
    //                     <p className="cost">{props.tasks.costs}</p>
    //                     <p className="success">выполнено</p>
    //                 </div>
    //             </div>
    //         )}
    //     </>
    // );
}
