import "./notification.css";
import { useState, useRef, useEffect } from "react";

export default function Notification(props: any) {
    const [coordX, setCoordX] = useState<number>(0);
    const [draggingPos, setDraggingPos] = useState<number>(0);
    const [dragging, setDragging] = useState<boolean>(false);
    const [startLeft, setStartLeft] = useState<number>(0);
    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
    const notifElem: any = useRef(null);

    useEffect(() => {
        window.addEventListener("resize", () => {
            setWindowWidth(window.innerWidth);
        });
        const hideNotif = setTimeout(() => {
            props.setNotif(false);
        }, 3000);
        return () => {
            window.removeEventListener("resize", () => {
                setWindowWidth(window.innerWidth);
            });
            clearTimeout(hideNotif);
        };
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setStartLeft(notifElem.current.offsetLeft);
        }, 500);
        return () => {
            clearTimeout(timeout);
        };
    }, [notifElem]);

    useEffect(() => {
        setCoordX((window.innerWidth - notifElem.current.offsetWidth) / 2);
        setStartLeft(notifElem.current.offsetLeft);
    }, [windowWidth]);

    function onMouseDown(e: any) {
        setStartLeft(notifElem.current.offsetLeft);
        setDraggingPos(e.pageX - startLeft);
        setDragging(true);
    }

    function onMouseMove(e: any) {
        if (!dragging) return;
        setCoordX(e.pageX - draggingPos);
        if (coordX) {
            if (coordX > windowWidth / 1.4 || coordX < -windowWidth / 3) {
                props.setNotif(false);
            }
        }
    }

    function onTouch(e: any) {
        setStartLeft(notifElem.current.offsetLeft);
        setDraggingPos(e.touches[0].pageX - startLeft);
        setDragging(true);
    }

    function onTouchMove(e: any) {
        if (!dragging) return;
        setCoordX(e.touches[0].pageX - draggingPos);
        if (coordX) {
            if (coordX > windowWidth / 1.4 || coordX < -windowWidth / 1.8) {
                props.setNotif(false);
            }
        }
    }

    return (
        <div
            className={
                dragging ? "notification" : "notification notification-back"
            }
            style={{ left: coordX }}
            ref={notifElem}
            onMouseDown={(e) => onMouseDown(e)}
            onMouseMoveCapture={(e) => onMouseMove(e)}
            onTouchStart={(e) => onTouch(e)}
            onTouchMoveCapture={(e) => onTouchMove(e)}
            onTouchEnd={() => {
                setDragging(false);
                setCoordX(
                    (window.innerWidth - notifElem.current.offsetWidth) / 2
                );
            }}
            onMouseUp={() => {
                setDragging(false);
                setCoordX(
                    (window.innerWidth - notifElem.current.offsetWidth) / 2
                );
            }}
            onMouseLeave={() => {
                setDragging(false);
                setCoordX(
                    (window.innerWidth - notifElem.current.offsetWidth) / 2
                );
            }}
        >
            <p className="notification-text">{props.children}</p>
        </div>
    );
}
