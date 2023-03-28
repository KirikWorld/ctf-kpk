import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const fadeOut = keyframes`
    to {
        transform: scale(0);
        opacity: 0;
    }
`;

const BannerContainer = styled.div<any>`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 9999;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000000b9;
    backdrop-filter: blur(10px);
    padding: 20%;
    flex-direction: column;
    animation: ${(props) => !props.showBanner && fadeOut} 0.3s forwards
        ease-in-out;
    text-align: center;
`;

export default function Banner(props: any) {
    const [showBanner, setShowBanner] = useState(true);
    const [timeoutId, setTimeoutId] = useState<any>();

    useEffect(() => {
        if (showBanner === false) {
            const timeout = setTimeout(() => {
                props.setShowBanner(false);
            }, 300);
            setTimeoutId(timeout);
        }
        return () => {
            clearTimeout(timeoutId);
        };
    }, [showBanner]);

    function handleClose() {
        setShowBanner(false);
    }

    function handleNever() {
        setShowBanner(false);
        props.setNeverBanner(true);
    }

    return (
        <BannerContainer showBanner={showBanner}>
            Уважаемые пользователи, сообщаем вам, что наш сайт в данный момент
            частично совместим с устройствами iPhone. Мы приносим свои извинения за
            возможные неудобства и работаем над устранением этой проблемы.
            Возможны различные проблемы с отображением элементов на сайте.
            Спасибо за понимание.
            <div
                className="btns"
                style={{
                    width: "350px",
                    display: "flex",
                    height: "100px",
                    marginTop: "40px",
                    justifyContent: "space-between",
                }}
            >
                <button onClick={() => handleClose()}>Закрыть</button>
                <button onClick={() => handleNever()}>Больше не показывать</button>
            </div>
        </BannerContainer>
    );
}
