import React from "react";
import { Routes, Route } from "react-router-dom";
import Tasks from "./components/tasks";
import Signin from "./components/signin";
import logo from "./img/logo.png";
import Me from "./components/me";
import { useNavigate } from "react-router-dom";

function App() {
    const navigator = useNavigate();

    return (
        <div className="App">
            <img
                src={logo}
                alt=""
                className="logo"
                onClick={() => navigator("/")}
            />
            <Routes>
                <Route path="/tasks/" element={<Tasks />} />
                <Route path="/signin/" element={<Signin />} />
                <Route path="/" element={<Me />} />
            </Routes>
        </div>
    );
}

export default App;
