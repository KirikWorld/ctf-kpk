import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { Context } from "../global/context";
import NewComponent from "./new";

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    background: inherit;

    @media (max-width: 1310px) {
    height: 1150px;
    /* flex-direction: column; */
  }
`;

const AboutUsContainer = styled.div`
    max-width: 400px;
    width: 100%;
    height: 550px;
    background: #a659fd10;
    box-shadow: 0px 0px 18px 1px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    display: grid;
    grid-template-rows: 80px auto;
    grid-template-columns: 1fr;
    margin-bottom: 30px;
`;

const NewsContainer = styled.div`
    max-width: 900px;
    width: 100%;
    height: 550px;
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
    align-self: center;
    justify-self: center;
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
    padding: 20px 1.5%;
    overflow-y: scroll;
    scrollbar-width: thin;
`;

export default function News() {
    const { storage, setLoading } = useContext(Context);

    const [news, setNews] = useState<any>([]);

    async function getNews() {
        setLoading(true);
        let response: Response = await fetch("/api/news/", {
            headers: {
                Authorization: `Token ${storage.get("tracker")}`,
            },
        });
        let data = await response.json();
        setLoading(false);
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
            <Container>
                <NewsContainer>
                    <Title>Что нового?</Title>
                    <NewContainer>
                        {news.map((data: any) => (
                            <NewComponent
                                data={data}
                                key={news.indexOf(data)}
                            ></NewComponent>
                        ))}
                    </NewContainer>
                </NewsContainer>
                <AboutUsContainer>
                    <Title>О нас</Title>
                    <NewContainer
                        style={{
                            padding: "20px",
                            lineHeight: "24px",
                            textIndent: "0px",
                        }}
                    >
                        <p>
                            Добро пожаловать на веб-сайт CTF KPK! Мы - группа
                            студентов, которые увлечены кибербезопасностью и
                            любят решать сложные задачи. Наш кружок сосредоточен
                            на организации мероприятий CTF и участии в них, и мы
                            рады привнести эту культуру в наш колледж.
                        </p>
                        <br />
                        <p>
                            Под руководством преподавателя Дмитренко Павла Сергеевича,
                            руководителя CTF KPK, мы постоянно учимся и
                            совершенствуем наши навыки в области
                            кибербезопасности. Павел Сергеевич, также, проводит
                            занятия по кибербезопасности для всех желающих
                            студентов нашего колледжа.
                        </p>
                        <br />
                        <p>
                            Мы создали этот веб-сайт для продвижения культуры
                            CTF в нашем колледже и за его пределами. Здесь вы
                            можете найти информацию о наших предстоящих
                            мероприятиях, а также решать таски и отслеживать
                            свои достижения.
                        </p>
                    </NewContainer>
                </AboutUsContainer>
            </Container>
        </>
    );
}
