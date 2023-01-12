import "./pswdReq.css";

export default function PswdReq(props: any) {
    return (
        <ul className="pswdReq" onClick={() => props.setshowPswdReq(false)}>
            <li>
                Пароль не должен быть слишком похож на другую вашу личную
                информацию.
            </li>
            <li>
                Ваш пароль должен содержать как минимум 8 символов. Пароль не
                должен быть слишком простым и распространённым.
            </li>
            <li>Пароль не может состоять только из цифр.</li>
        </ul>
    );
}
