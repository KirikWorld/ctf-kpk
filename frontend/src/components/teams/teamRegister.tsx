import Dropdown from "./dropdown/dropdown";
import { useState, useRef, useContext } from "react";
import { CSSTransition } from "react-transition-group";
import { Context } from "../global/context";
import TeamReq from "./teamReq";

export default function TeamRegister(props: any) {
    const [members, setMembers] = useState(1);
    const [teamTitle, setTeamTitle] = useState("");
    const [institution, setInstitution] = useState("");

    const [showTeamReq, setshowTeamReq] = useState(false);
    const reqNode = useRef(null);
    const { storage, setNotif, setNotifText } = useContext(Context);

    async function createTeam() {
        const response = await fetch("/api/teams/", {
            method: "POST",
            headers: {
                Authorization: `Token ${storage.get("tracker")}`,
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                title: teamTitle,
                institution: institution,
                max_members: members,
            }),
        });
        let data = await response.json();
        if (data.error) {
            setNotif(true);
            setNotifText(data.error);
        }
        if (data.success) {
            props.setHasTeam(true);
            window.location.reload();
        }
    }

    return (
        <div className="team-form">
            <div className="login-form">
                <h3>Создание команды</h3>
                <div className="login">
                    <p>Название команды:</p>
                    <input
                        type="text"
                        onChange={(e) => setTeamTitle(e.target.value)}
                        value={teamTitle}
                    />
                </div>
                <div className="login">
                    <p>Учебное заведение:</p>
                    <input
                        type="text"
                        onChange={(e) => setInstitution(e.target.value)}
                        value={institution}
                    />
                </div>
                <div
                    className="pswd"
                    style={{
                        justifyContent: "space-between",
                        marginTop: "10px",
                    }}
                >
                    <button onClick={() => createTeam()}>Создать</button>
                    <Dropdown members={members} setMembers={setMembers} />
                </div>
                <CSSTransition
                    nodeRef={reqNode}
                    in={showTeamReq}
                    timeout={300}
                    classNames={"pswdReq"}
                    unmountOnExit
                >
                    <div className="pswdReqContainer" ref={reqNode}>
                        <TeamReq setshowTeamReq={setshowTeamReq} />
                    </div>
                </CSSTransition>
                <div
                    className="hint"
                    onClick={() => setshowTeamReq(!showTeamReq)}
                >
                    ?
                </div>
            </div>
        </div>
    );
}
