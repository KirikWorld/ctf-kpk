// import styled from "styled-components";
import "./categories.css"

export default function Categories(props: any) {

    return (
        <div className="categories-container">
            <h1>Категории</h1>
            <div className="category">
                <div className="cat-input"><input type="checkbox" name="Выбрать" id="cat1" /><label htmlFor="cat1"></label></div><p>OSINT</p>
                <div className="cat-input"><input type="checkbox" name="Выбрать" id="cat2" /><label htmlFor="cat2"></label></div><p>STEGANO</p>
                <div className="cat-input"><input type="checkbox" name="Выбрать" id="cat3" /><label htmlFor="cat3"></label></div><p>WEB</p>
            </div>
        </div>
    );
}
