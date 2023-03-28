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
import { useState, useEffect } from "react";
import Signup from "./components/signup/signup";
import Basil from "./components/global/basil.min.js";
import { useLocation } from "react-router-dom";

import info from "./img/info.png";
import download from "./img/download.png";
import Banner from "./components/global/banner";
import News from "./components/news/news";

function App() {
    const navigator = useNavigate();
    const [notif, setNotif] = useState(false);
    const [notifText, setNotifText] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);

    const location = useLocation();
    const [displayLocation, setDisplayLocation] = useState(location);
    const [transitionStage, setTransistionStage] = useState("fadeIn");

    const [showBanner, setShowBanner] = useState(false);
    const [neverBanner, setNeverBanner] = useState(false);

    useEffect(() => {
        if (neverBanner === true) {
            storage.set("showBanner", "false");
        }
        if (storage.get("showBanner") !== "false") {
            setShowBanner(true);
        }
    }, [neverBanner]);

    useEffect(() => {
        if (location !== displayLocation) setTransistionStage("fadeOut");
    }, [location, displayLocation]);

    const [screenWidth, setScreenWidth] = useState(
        document.documentElement.clientWidth
    );

    document.title = "ctf-kpk";

    let options = {
        namespace: "storage",
        storages: ["local", "cookie", "memory", "session"],
        expireDays: "1",
        keyDelimiter: ".",
    };
    const storage = Basil(options);

    useEffect(() => {
        const updateWindowWidth = () => {
            setScreenWidth(document.documentElement.clientWidth);
        };
        window.addEventListener("resize", updateWindowWidth);
        return () => window.removeEventListener("resize", updateWindowWidth);
    }, [screenWidth]);

    return (
        <Context.Provider
            value={{
                setNotifText,
                setNotif,
                setLoading,
                storage,
                info,
                download,
                setShowBanner,
            }}
        >
            <>
                {notif && (
                    <Notification setNotif={setNotif}>{notifText}</Notification>
                )}
                <p className="version">V: 0.3.2</p>
                {loading && <Loading />}
                {showBanner && (
                    <Banner
                        setShowBanner={setShowBanner}
                        setNeverBanner={setNeverBanner}
                    ></Banner>
                )}
                <div className="App">
                    <div
                        className={`container ${transitionStage}`}
                        onAnimationEnd={() => {
                            if (transitionStage === "fadeOut") {
                                setTransistionStage("fadeIn");
                                setDisplayLocation(location);
                            }
                        }}
                    >
                        <div className="logo-wrapper">
                            <img
                                src={logo}
                                alt=""
                                className="logo"
                                onClick={() => navigator("/me")}
                            />
                        </div>
                        <Routes location={displayLocation}>
                            <Route
                                path="/tasks/"
                                element={<Tasks screenWidth={screenWidth} />}
                            />
                            <Route path="/signin/" element={<Signin />} />
                            <Route path="/signup/" element={<Signup />} />
                            <Route path="/me/" element={<Me />} />
                            <Route path="/" element={<News />} />
                            <Route path="/test/" element={<Loading />} />
                        </Routes>
                    </div>
                </div>
            </>
        </Context.Provider>
    );
}

export default App;
