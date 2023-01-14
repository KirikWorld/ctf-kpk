import React from "react";
import { Routes, Route } from "react-router-dom";
import Tasks from "./components/tasks/tasks";
import Signin from "./components/signin/signin";
import logo from "./img/logo.png";
import Me from "./components/me/me";
import { useNavigate } from "react-router-dom";
import Loading from "./components/global/loading";
import Notification from "./components/global/notification";
import { Context } from "./components/global/context";
import { useState } from "react";
import santa from "./img/santa.png";
import Signup from "./components/signup/signup";
import Basil from "./components/global/basil.min.js";

function App() {
    const navigator = useNavigate();
    const [notif, setNotif] = useState(false);
    const [notifText, setNotifText] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);

    document.title = "ctf-kpk"

    let options = {
        namespace: "storage",
        storages: ["local", "cookie", "memory", "session"],
        expireDays: "1",
        keyDelimiter: ".",
    };
    const storage = Basil(options);

    return (
        <Context.Provider value={{ setNotifText, setNotif, setLoading, storage }}>
            <>
                {notif && (
                    <Notification setNotif={setNotif}>{notifText}</Notification>
                )}
                <p className="version">V: 0.2.1b</p>
                {loading && <Loading />}
                <div className="App">
                    <div className="logo-wrapper">
                        <img
                            src={logo}
                            alt=""
                            className="logo"
                            onClick={() => navigator("/")}
                        />
                        <img
                            src={santa}
                            alt=""
                            className="santa"
                            onClick={() => navigator("/")}
                        />
                    </div>
                    <div className="container">
                        <Routes>
                            <Route path="/tasks/" element={<Tasks />} />
                            <Route path="/signin/" element={<Signin />} />
                            <Route path="/signup/" element={<Signup />} />
                            <Route path="/" element={<Me />} />
                            <Route path="test" element={<Loading />} />
                        </Routes>
                    </div>
                </div>
            </>
        </Context.Provider>
    );
}

export default App;
