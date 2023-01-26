import { Card } from "./front";
import { CSSTransition } from "react-transition-group";
import { useRef } from "react";

export default function Back(props: any) {
    const cardNode = useRef(null);

    function handleRotate(e: any) {
        e.target === cardNode.current && props.setBack(false);
    }

    return (
        <>
            <CSSTransition
                in={props.back}
                classNames="rotate"
                timeout={300}
                onExited={() => props.setFront(true)}
                nodeRef={cardNode}
                unmountOnExit
            >
                <Card onClick={(e) => handleRotate(e)} ref={cardNode}>
                    <h1>Back</h1>
                </Card>
            </CSSTransition>
        </>
    );
}
