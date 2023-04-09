import { useState } from "react";
import Front from "./card/front";
import Back from "./card/back";

export function Task(props: any) {
    const [front, setFront] = useState(true);
    const [back, setBack] = useState(false);

    return (
        <>
            <Front
                back={back}
                setBack={setBack}
                front={front}
                setFront={setFront}
                tasks={props.tasks}
                getTasks={props.getTasks}
                setTasks={props.setTasks}
            />
            <Back
                back={back}
                setBack={setBack}
                front={front}
                setFront={setFront}
                tasks={props.tasks}
                getTasks={props.getTasks}
                setTasks={props.setTasks}
                setRerender={props.setRerender}
                rerender={props.rerender}
                teams={props.teams}
            />
        </>
    );
}
