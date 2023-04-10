import { useState, useEffect, useContext } from "react";
import { Context } from "../global/context";
import TeamRegister from "./teamRegister";
import TeamCabinet from "./teamCabinet";
import { useNavigate } from "react-router-dom";

export default function Teams() {
    const { storage, setLoading } = useContext(Context);
    const [hasTeam, setHasTeam] = useState(false);
    const [team, setTeam] = useState();

    const navigator = useNavigate();

    async function getTeam() {
        let response = await fetch("/api/teams/", {
            headers: {
                Authorization: `Token ${storage.get("tracker")}`,
            },
        });
        const data = await response.json();
        if (await response.status===401) {
            navigator("/");
            setLoading(false);
        }
        if (data.error === "У тебя нет команды") {
            setLoading(false);
            return setHasTeam(false);
        }
        if ((await response.status) === 200) {
            setLoading(false);
            setTeam(data);
            return setHasTeam(true);
        }
    }

    useEffect(() => {
        setLoading(true);
        getTeam();
    }, []);

    return (
        <>
            {hasTeam ? (
                <TeamCabinet team={team} />
            ) : (
                <TeamRegister setHasTeam={setHasTeam} />
            )}
        </>
    );
}
