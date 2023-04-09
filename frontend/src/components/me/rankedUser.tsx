import "./rankedUser.css";
import React from "react";

export default function RankedUser(props: any) {
    const ranks = props.ranks;
    let style: any = {};
    if (props.index % 2 !== 0) {
        style = {
            background: `${
                props.me === ranks.username ? "#F8F1FF" : "transparent"
            }`,
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

    return (
        <div
            className={
                props.me === ranks.username ? "ranked-user iam" : "ranked-user"
            }
            style={style}
        >
            <div className="ranked-left-part">
                <p>{props.index + 1}</p>
                <p>{ranks.username}</p>
            </div>
            <p id="points">{ranks.points}</p>
        </div>
    );
}
