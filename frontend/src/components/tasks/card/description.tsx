import styled, { keyframes, css } from "styled-components";
import { useEffect, useState } from "react";

const DescIn = keyframes`
    from {
        opacity: 0;
        transform: scale(0);
        color: transparent;
    }
    to {
        color: white;
        transform: scale(1);
        opacity: 1;
    }
`;

const DescOut = keyframes`
    from {
        transform: scale(1);
    }
    to {
        transform: scale(0);
        color: transparent;
        opacity: 0;
    }
`;

const Descriptionc = styled.div<any>`
    font-size: 16px;
    scrollbar-width: hidden;
    position: fixed;
    margin: 0 auto;
    z-index: 999;
    top: 10px;
    left: 7.5px;
    overflow-x: hidden;
    overflow-y: scroll;
    overflow-wrap: break-word;
    word-break: break-word;
    hyphens: manual;
    width: 95%;
    height: 95%;
    min-height: 50px;
    background: #0000005c;
    /* backdrop-filter: blur(20px); */
    /* filter: blur(5px); */
    color: white;
    border-radius: 10px;
    padding: 10px;
    ${(props) =>
        props.handleHide
            ? css`
                  animation: ${DescIn} 0.5s forwards ease-in-out;
              `
            : css`
                  animation: ${DescOut} 0.5s forwards ease-in-out;
              `}

    display: grid;
    grid-template-rows: 1fr, 50px;
    gap: 20px;
`;

export default function Description(props: any) {
    const [hideId, setHideId] = useState<any>();
    const [handleHide, setHandleHide] = useState(true);

    useEffect(() => {
        if (!handleHide) {
            props.setHandleBlur(false)
            const timeout = setTimeout(() => {
                props.setHandleBlur(false)
                props.setShowDesc(false);
            }, 500);
            setHideId(timeout);
        }
        return () => {
            clearTimeout(hideId);
        };
    }, [handleHide]);

    return (
        <Descriptionc handleHide={handleHide}>
            {props.desc ? props.desc : "Автор поленился оставить описание"}
            <button
                style={{
                    width: "auto",
                    position: "sticky",
                    bottom: "0px",
                    background: "#4343f5",
                    color: "white",
                    height: "30px",
                    fontSize: "14px",
                    borderRadius: "10px"
                }}
                onClick={() => setHandleHide(false)}
            >
                закрыть
            </button>
        </Descriptionc>
    );
}
