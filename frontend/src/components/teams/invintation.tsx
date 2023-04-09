import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { Context } from "../global/context";

export default function Invintation() {
    const { token } = useParams();
    const { storage, setNotif, setNotifText, setLoading } = useContext(Context);
    const navigator = useNavigate();

    async function acceptInvintation() {
        setLoading(true);
        let response: Response = await fetch(`/api/teams/invite?inv=${token}`, {
            headers: {
                Authorization: `Token ${storage.get("tracker")}`,
            },
        });
        let data = await response.json();
        if ((await response.status) === 401) {
            setNotif(true);
            setNotifText("Неавторизован");
            navigator("/signin/");
        }
        if (data.error) {
            setNotif(true);
            if (data.error !== "У тебя есть команда") {
                setNotifText(data.error);
                navigator("/me/");
            }
        }
        if (data.error === "У тебя есть команда") {
            setNotifText(data.error);
            navigator("/teams/");
        }
        if (data.success) {
            setNotif(true);
            setNotifText(data.success);
            navigator("/teams/");
        }
        return setLoading(false);
    }

    useEffect(() => {
        acceptInvintation();
    }, []);

    return <></>;
}
