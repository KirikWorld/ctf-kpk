import "./dropdown.css";

export default function Dropdown(props: any) {
    return (
        <>
            <div className="dropdown">
                <input type="checkbox" id="dropdown" />

                <label className="dropdown__face" htmlFor="dropdown">
                    <div className="dropdown__text" style={{ color: "black" }}>
                    Кол-во участников: {props.members}
                    </div>

                    <div className="dropdown__arrow"></div>
                </label>

                <ul className="dropdown__items">
                    <li onClick={()=>props.setMembers(1)}>1</li>
                    <li onClick={()=>props.setMembers(2)}>2</li>
                    <li onClick={()=>props.setMembers(3)}>3</li>
                    <li onClick={()=>props.setMembers(4)}>4</li>
                    <li onClick={()=>props.setMembers(5)}>5</li>
                </ul>
            </div>

            <svg id="dropdown__svg">
                <filter id="goo">
                    <feGaussianBlur
                        in="SourceGraphic"
                        stdDeviation="8"
                        result="blur"
                    />
                    <feColorMatrix
                        in="blur"
                        type="matrix"
                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                        result="goo"
                    />
                    <feBlend in="SourceGraphic" in2="goo" />
                </filter>
            </svg>
        </>
    );
}
