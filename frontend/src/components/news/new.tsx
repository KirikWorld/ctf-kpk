import styled from "styled-components";
import { useState } from "react";

const New = styled.div`
    width: 100%;
    /* margin-left: 1%; */
    transition: all 0.3s ease-in-out;
    border-radius: 10px;
    padding: 30px 30px;
    cursor: pointer;

    &:hover {
        background: #77777772;
    }
`;

const NewText = styled.p<any>`
    margin-top: 20px;

    overflow-wrap: break-word;
    word-break: break-word;
    hyphens: manual;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 3.2em;
    line-height: 1.5em;
    transition: all 0.3s ease-in-out;
`;

export default function NewComponent(props: any) {
    const [expand, setExpand] = useState<boolean>(false);

    return (
        <New
            className="new"
            onClick={() => setExpand(!expand)}
        >
            <h4 style={{ fontSize: "14px" }}>{`${new Date(props.data.date)
                .toLocaleString()
                .slice(0, -3)}`}</h4>
            <h2 style={{ marginTop: "10px" }}>{props.data.title}</h2>
            <NewText
                style={expand ? { maxHeight: "100%" } : { maxHeight: "3.2em" }}
                dangerouslySetInnerHTML={{
                    __html: `${props.data.description}`,
                }}
            ></NewText>
        </New>
    );
}
