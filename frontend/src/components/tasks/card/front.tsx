import styled, {keyframes} from "styled-components";
import { CSSTransition } from "react-transition-group";
import { useRef } from "react";

const CardBlur = styled.div`
    position: relative;
    max-width: 330px;
    width: 100%;
    height: 330px;
    /* background: inherit; */

    backdrop-filter: blur(20px);
    /* opacity: 1; */

    overflow: visible;
    border-radius: 20px;
    box-shadow: 0px 0px 18px 1px rgba(0, 0, 0, 0.2);
    will-change: opacity, transform;

    // enter from
    &.rotate-enter {
        transform: rotateY(90deg);
    }

    // enter to
    &.rotate-enter-active {
        transform: rotateY(0deg);
        transition: transform 400ms cubic-bezier(0.44, 0.52, 0, 1.57);
    }

    // exit from
    &.rotate-exit {
        transform: rotateY(0deg);
    }

    // exit to
    &.rotate-exit-active {
        transform: rotateY(90deg);
        transition: transform 300ms ease-in;
    }
`;

const fadeIn = keyframes`
    from {
        opacity: 0.35;
    }
    to {
        opacity: 1;
    }
`

const Card = styled.div<any>`
    animation: ${fadeIn} .3s forwards ease-in-out;
    position: relative;
    display: grid;
    grid-template-rows: 1fr 5fr 1fr;
    row-gap: 30px;

    max-width: 330px;
    width: 100%;
    height: 330px;
    border-radius: 20px;

    padding: 20px;

    position: relative;
    background: ${(props) =>
        props.solved === "None"
            ? "#a659fd10;"
            : "linear-gradient(295.61deg, rgba(160, 160, 160, 0.14) -0.03%, rgba(80, 80, 80, 0.6) 100%);"};
`;

const Solved = styled.div`
    position: absolute;
    bottom: 20px;
    left: 20px;
    width: 135px;
    height: 31px;
    background: #5E9063;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default function Front(props: any) {
    const cardNode = useRef(null);
    const blurNode = useRef(null);

    function handleRotate(e: any) {
        e.target === cardNode.current && props.setFront(false);
    }

    return (
        <>
            <CSSTransition
                in={props.front}
                classNames="rotate"
                timeout={300}
                onExited={() => props.setBack(true)}
                nodeRef={blurNode}
                unmountOnExit
            >
                <CardBlur ref={blurNode}>
                    <Card
                        onClick={(e: any) => handleRotate(e)}
                        ref={cardNode}
                        solved={props.tasks.solved}
                    >
                        <h2 style={{ width: "fit-content", fontSize: "28px" }}>
                            {props.tasks.title}
                        </h2>
                        <div
                            className="empty"
                            style={{ width: "fit-content" }}
                        ></div>
                        {props.tasks.solved!=="None" && <Solved>Выполнено</Solved>}
                        <h2
                            style={{
                                width: "fit-content",
                                justifySelf: "end",
                                fontSize: "28px",
                            }}
                        >
                            {props.tasks.costs}
                        </h2>
                    </Card>
                </CardBlur>
            </CSSTransition>
        </>
    );
}

export { Card, CardBlur, Solved };
