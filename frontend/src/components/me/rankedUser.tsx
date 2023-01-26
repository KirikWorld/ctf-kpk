import "./rankedUser.css";
import React from "react";

export default function RankedUser(props: any) {
    const ranks = props.ranks;
    let style = {}
    if (props.index % 2 !== 0) {
        style = {
            background: `${props.me===ranks.username ? "#ddd6e750" : "transparent"}`,
            border: "4px solid #6b52a08c",
        };
    }

    return (
        <div className={props.me===ranks.username ? "ranked-user iam": "ranked-user"} style={style} >
            <div className="left-part">
                <p>{props.index + 1}</p>
                <p>{ranks.username}</p>
            </div>
            <p id="points">{ranks.points}</p>
        </div>
    );
}
