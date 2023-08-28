import "./rankedUser.css";
import React, { useEffect } from "react";
import { useRef, useState } from "react";

export default function RankedUser(props: any) {
    const rankedContainer: any = useRef<any>(null);
    const [scrolled, setScrolled] = useState(true);
    const ranks = props.ranks;
    let style: any = {};
    if (props.index % 2 === 0) {
        style = {
            background: `${
                props.me === ranks.username ? "#F8F1FF" : "#6b52a08c"
            }`,
            opacity: `${props.me === ranks.username && 1}`,
            zIndex: `${props.me === ranks.username && 2}`,
            transform: `${props.me === ranks.username && "translateX(0)"}`,
        };
    }
    if (props.index % 2 !== 0) {
        style = {
            background: `${
                props.me === ranks.username ? "#F8F1FF" : "transparent"
            }`,
            opacity: `${props.me === ranks.username && 1}`,
            zIndex: `${props.me === ranks.username && 2}`,
            transform: `${props.me === ranks.username && "translateX(0)"}`,
            border: "4px solid #6b52a08c",
        };
    }

    if (props.me === ranks.username) {
        style["position"] = "sticky";
        style["bottom"] = "0";
        style["top"] = "0";
        style["color"] = "black";
        style["border"] = "none";
    }

    useEffect(() => {
        function handleScroll() {
            if (
                isElementInViewport(
                    rankedContainer.current,
                    rankedContainer.current.parentElement
                )
            ) {
                // Элемент находится в области видимости
                if (props.index === 0) {
                    if (props.setShowScrollToTop) {
                        props.setShowScrollToTop(false);
                    }
                }
                setScrolled(true);
            } else {
                // Элемент не находится в области видимости
                if (props.index === 0) {
                    if (props.setShowScrollToTop) {
                        props.setShowScrollToTop(true);
                    }
                }
                setScrolled(false);
            }
        }

        rankedContainer.current.parentElement.addEventListener(
            "scroll",
            handleScroll
        );
        return () => {
            if (rankedContainer.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                rankedContainer.current.parentElement.removeEventListener(
                    "scroll",
                    handleScroll
                );
            }
        };
    }, []);

    function isElementInViewport(el: any, outerEl: any) {
        const rect = el.getBoundingClientRect();
        const outerRect = outerEl.getBoundingClientRect();

        return (
            rect.top >= outerRect.top - 50 &&
            // rect.left >= outerRect.left &&
            rect.bottom <= outerRect.bottom + 50
            // rect.right <= outerRect.right
        );
    }

    return (
        <div
            className={
                // props.me === ranks.username ? "ranked-user iam" : "ranked-user"
                scrolled ? "ranked-user scrolled" : "ranked-user"
            }
            style={style}
            ref={rankedContainer}
        >
            <div className="ranked-left-part">
                <p>{props.index + 1}</p>
                <p>{ranks.username}</p>
            </div>
            <p id="points">{ranks.points}</p>
        </div>
    );
}
