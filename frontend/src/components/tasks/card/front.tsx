import styled from "styled-components";
import { CSSTransition } from "react-transition-group";
import { useRef } from "react";

const Card = styled.div`
    display: grid;
    grid-template-rows: 1fr 5fr 1fr;
    row-gap: 30px;

    max-width: 330px;
    width: 100%;
    height: 330px;

    padding: 20px;
    /* margin-bottom: 30px; */

    mix-blend-mode: normal;
    box-shadow: 0px 0px 18px 1px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(20px);
    border-radius: 20px;

    position: relative;
    background: #a659fd10;

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

export default function Front(props: any) {
    const cardNode = useRef(null);

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
                nodeRef={cardNode}
                unmountOnExit
            >
                <Card onClick={(e) => handleRotate(e)} ref={cardNode}>
                    <h2 style={{ width: "fit-content", "fontSize": "33px" }}>
                        {props.tasks.title}
                    </h2>
                    <div
                        className="empty"
                        style={{ width: "fit-content" }}
                    ></div>
                    <h2 style={{ width: "fit-content", justifySelf: "end", "fontSize": "33px" }}>
                        {props.tasks.costs}
                    </h2>
                </Card>
            </CSSTransition>
        </>
    );
}

export { Card };
