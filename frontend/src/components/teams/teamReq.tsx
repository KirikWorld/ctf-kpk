import "../signup/pswdReq.css";

export default function TeamReq(props: any) {
    return (
        <>
            <ul className="pswdReq" onClick={() => props.setshowTeamReq(false)}>
                <li>
                    Все участники команды обязательно должны быть из одного учебного
                    заведения.
                </li>
                <br />
                <li>
                    После создания команды, форма отправится на проверку
                    администраторам. Пока будет происходить проверка, капитан
                    (создатель команды) может разослать остальным участникам команды
                    ссылку-приглашение.
                </li>
                <br />
                <li>
                    После проверки команды администраторами вы сможете приступить к
                    решению тасков и отправке флагов.
                </li>
                <br />
                <li>
                    Проверка начнется только после того, как все участники команды
                    вступят в нее.
                </li>
                <br />
                <li style={{ color: "red" }}>
                    Важно! Необходимо указывать настоящие фамилию и имя в аккаунте!
                </li>
                <br />
                <li>
                    По всем вопросам{" "}
                    <a href="https://t.me/kiriknm" target="_blank" rel="noreferrer" style={{color: "blue"}}>
                        @kiriknm
                    </a>{" "}
                    - telegram
                </li>
            </ul>
            <p style={{color: "#555555a4", width: "100%", textAlign: "center", marginTop: "10px"}}>Нажмите, чтобы закрыть</p>
        </>
    );
}
