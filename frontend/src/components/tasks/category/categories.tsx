import { useEffect, useState } from "react";
import "./categories.css";

export default function Categories(props: any) {
    const [timeoutId, setTimeoutId] = useState<any>();
    const [hideAnim, setHideAnim] = useState(false);
    const [render, setRender] = useState(true);

    useEffect(() => {
        if (props.catAnim === false) {
            setHideAnim(true);
            const timeout = setTimeout(() => {
                props.setShowCat(false);
            }, 400);
            setTimeoutId(timeout);
        }
        return () => {
            clearTimeout(timeoutId);
        };
    }, [props.catAnim]);

    function handleCheck(e: any, data: any) {
        setRender(!render)
        props.setRerender(!props.rerender)
        data.checked==="false" ? data.checked = "true" : data.checked = "false" 
    }

    return (
        <div
            className={`categories-container ${hideAnim && "categories-hide"}`}
        >
            <h1>Категории</h1>
            {props.cats[0] ? (
                props.cats.map((data: any) => (
                    <div className="category" key={props.cats.indexOf(data)}>
                        <div className="cat-input">
                            <input
                                type="checkbox"
                                name="Выбрать"
                                id={props.cats.indexOf(data)}
                                checked={data.checked==="true"}
                                onChange={(e) => handleCheck(e, data)}
                            />
                            <label
                                htmlFor={props.cats.indexOf(data)}
                            ></label>
                        </div>
                        <p>{data.category.toLowerCase()}</p>
                    </div>
                ))
            ) : (
                <div className="empty" />
            )}
        </div>
    );
}
