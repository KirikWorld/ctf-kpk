import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../global/context";

const NewsContainer = styled.div`
    max-width: 900px;
    width: 100%;
    max-height: 550px;
    height: 100%;
    background: #a659fd10;
    box-shadow: 0px 0px 18px 1px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    display: grid;
    grid-template-rows: 80px auto;
    grid-template-columns: 1fr;
    margin-bottom: 30px;
`;

const Title = styled.h1`
    position: relative;
    width: 100%;
    /* height: 100%; */
    text-align: center;
    &:after {
        position: absolute;
        width: 96%;
        height: 1px;
        background: white;
        content: "";
        margin: 0 auto;
        left: 0;
        right: 0;
        bottom: -20px;
    }
`;

const NewContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 1.5 %;
    overflow-y: scroll;
    scrollbar-width: thin;
`;

const New = styled.div`
    width: 100%;
    /* margin-left: 1%; */
    transition: all 0.3s ease-in-out;
    border-radius: 10px;
    padding: 30px 30px;

    &:hover {
        background: #77777772;
    }
`;

export default function News() {
    const { storage } = useContext(Context);
    const navigator = useNavigate();

    const [news, setNews] = useState<any>([]);

    async function getNews() {
        let response: Response = await fetch("/api/news/", {
            headers: {
                Authorization: `Token ${storage.get("tracker")}`,
            },
        });
        let data = await response.json();
        return data;
    }

    useEffect(() => {
        getNews().then((data: any) => {
            setNews(
                Object.values(data).sort(function (a: any, b: any) {
                    return b.date.localeCompare(a.date);
                })
            );
        });
    }, []);

    return (
        <>
            <NewsContainer>
                <Title style={{ alignSelf: "center", justifySelf: "center" }}>
                    Что нового?
                </Title>
                <NewContainer>
                    {news.map((data: any) => (
                        <New className="new" key={news.indexOf(data)}>
                            <h4 style={{ fontSize: "14px" }}>{`${new Date(
                                data.date
                            )
                                .toLocaleString()
                                .slice(0, -3)}`}</h4>
                            <h2 style={{ marginTop: "10px" }}>{data.title}</h2>
                            <p
                                style={{
                                    marginTop: "20px",
                                    overflowWrap: "break-word",
                                    wordBreak: "break-word",
                                    hyphens: "manual",
                                    display: "flex",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxHeight: "3.2em",
                                    lineHeight: "1.5em",
                                }}
                                dangerouslySetInnerHTML={{
                                    __html: `${data.description}`
                                }}
                            ></p>
                        </New>
                    ))}
                </NewContainer>
            </NewsContainer>
        </>
    );
}
