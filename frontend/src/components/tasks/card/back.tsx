import { Card, CardBlur, Solved } from "./front";
import { CSSTransition } from "react-transition-group";
import { useRef, useState, useContext } from "react";
import { Context } from "../../global/context";
import styled from "styled-components";
import Description from "./description";

const CardBack = styled(Card)`
    position: relative;
    display: grid;
    grid-template-rows: 5fr 1fr;
    background: ${(props) =>
        props.solved === "None"
            ? "#a659fd10;"
            : "linear-gradient(295.61deg, rgba(160, 160, 160, 0.14) -0.03%, rgba(80, 80, 80, 0.6) 100%);"};А

    gap: 0px;

    transform: translate3d(0,0,0) translateZ(0) translate(0,0);
    backface-visibility: hidden;
    overflow: hidden;
    margin: 0;
    will-change: transform, opacity;
`;

const SolvedBack = styled(Solved)<any>`
    will-change: filter, opacity, transform;
    transition: filter 0.5s ease-in-out, transform 0.2s ease-in-out,
        opacity 0.5s ease-in-out;
    filter: ${(props) => (props.handleBlur ? "blur(10px);" : "blur(0px);")};
    transform: translate3d(0,0,0);
`;

const Button = styled.button<any>`
    will-change: filter, opacity, transform;

    width: 100px !important;
    height: 100px !important;
    transition: filter 0.5s ease-in-out, transform 0.2s ease-in-out,
        opacity 0.5s ease-in-out;
    filter: ${(props) => (props.handleBlur ? "blur(10px);" : "blur(0px);")};
    opacity: ${(props) => (props.handleBlur ? "0.2" : "1")};
    background: #d2d2d2;
    box-shadow: 0px 4px 4px rgba(255, 255, 255, 0.25);
    transform: translate3d(0,0,0);
`;

const buttonImage = {
    width: "84px",
    height: "84px",
};

export default function Back(props: any) {
    const { storage, setNotif, setNotifText, info, download } =
        useContext(Context);

    const cardNode = useRef(null);
    const blurNode = useRef(null);

    const [flag, setFlag] = useState("");

    const [showDesc, setShowDesc] = useState(false);
    const [handleBlur, setHandleBlur] = useState(false);

    function handleRotate(e: any) {
        e.target === cardNode.current && props.setBack(false);
    }

    async function handleFlag() {
        let response: Response = await fetch("/api/tasks/", {
            method: "POST",
            headers: {
                Authorization: `Token ${storage.get("tracker")}`,
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({ flag: flag, title: props.tasks.title }),
        });
        let data = await response.json();
        if (data !== "Something wents wrong") {
            setNotif(true);
            setNotifText("Успешно!");
            props
                .getTasks()
                .then((data: any) => {
                    props.setTasks(Object.values(data));
                })
                .then(() => props.setRerender(!props.rerender)); //получаю заново все таски с бэка, заново рендерю, чтобы отфильтровать таски если стоят фильтры
            props.setBack(false);
        } else {
            setNotif(true);
            setNotifText("Проверь правильность флага.");
        }
    }

    return (
        <>
            <CSSTransition
                in={props.back}
                classNames="rotate"
                timeout={300}
                onExited={() => props.setFront(true)}
                nodeRef={blurNode}
                unmountOnExit
            >
                <CardBlur ref={blurNode}>
                    <CardBack
                        onClick={(e: any) => handleRotate(e)}
                        ref={cardNode}
                        solved={props.tasks.solved}
                    >
                        {showDesc && (
                            <Description
                                desc={props.tasks.description}
                                setShowDesc={setShowDesc}
                                setHandleBlur={setHandleBlur}
                            />
                        )}
                        <div
                            className="buttons"
                            style={{
                                display: "flex",
                                justifyContent: "space-around",
                                height: "fit-content",
                                alignSelf: "center",
                            }}
                        >
                            <Button
                                handleBlur={handleBlur}
                                onClick={() => {
                                    setShowDesc(true);
                                    setHandleBlur(true);
                                }}
                                disabled={!props.tasks.description}
                                style={
                                    !props.tasks.description
                                        ? {
                                              background: "#8d8ba0",
                                          }
                                        : { color: "black" }
                                }
                            >
                                <img src={info} alt="" style={buttonImage} />
                            </Button>

                            <Button
                                handleBlur={handleBlur}
                                // onClick={() =>
                                //     (window.location.href = `/media/${props.tasks.file}`)
                                // }
                                disabled={!props.tasks.file}
                                style={
                                    !props.tasks.file
                                        ? {
                                              background: "#8d8ba0",
                                          }
                                        : { color: "black" }
                                }
                            >
                                <img
                                    src={download}
                                    alt=""
                                    style={buttonImage}
                                />
                                <a
                                    href={`/media/${props.tasks.file}`}
                                    download
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        position: "absolute",
                                    }}
                                >
                                    {" "}
                                </a>
                            </Button>
                        </div>
                        {props.tasks.solved === "None" ? (
                            <input
                                style={{
                                    transition: "all .5s ease-in-out",
                                    filter: `${
                                        handleBlur ? "blur(10px)" : "blur(0px)"
                                    }`,
                                    transform: "translate3d(0,0,0)",
                                    willChange: "filter, opacity, transform"
                                }}
                                type="text"
                                name=""
                                id=""
                                onChange={(e) => setFlag(e.target.value)}
                                onKeyUp={(e) => {
                                    e.key === "Enter" && handleFlag();
                                }}
                                placeholder="Сюда флаг"
                            />
                        ) : (
                            <SolvedBack handleBlur={handleBlur}>
                                Выполнено
                            </SolvedBack>
                        )}
                    </CardBack>
                </CardBlur>
            </CSSTransition>
        </>
    );
}
