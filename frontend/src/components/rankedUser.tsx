import "./rankedUser.css";
import React from "react";

export default function RankedUser(props: any) {
    const ranks = props.ranks;
    let style = {}
    if (props.index % 2 !== 0) {
        style = {
            background: "transparent",
            border: "4px solid rgba(31, 0, 53, 0.642)",
        };
    }

    return (
        <div className="ranked-user" style={style}>
            <div className="left-part">
                <p>{props.index + 1}</p>
                <p>{ranks.username}</p>
            </div>
            <p id="points">{ranks.points}</p>
        </div>
    );
}
