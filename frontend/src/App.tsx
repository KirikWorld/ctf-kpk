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
import flower from "./img/flower.png";
import download from "./img/download.png";
import Banner from "./components/global/banner";
import News from "./components/news/news";
import Menu from "./components/global/menu";
import { CSSTransition } from "react-transition-group";
import Teams from "./components/teams/teams";
import Invintation from "./components/teams/invintation";
import TeamTasks from "./components/teams/teamTasks";
import PasswordReset from "./components/signin/passwordReset";

function App() {
    const [notif, setNotif] = useState(false);
    const [notifText, setNotifText] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);

    const location = useLocation();
    const [displayLocation, setDisplayLocation] = useState(location);
    const [transitionStage, setTransistionStage] = useState("fadeIn");

    // const [showBanner, setShowBanner] = useState(false);
    // const [neverBanner, setNeverBanner] = useState(false);

    const [showMenu, setShowMenu] = useState(false);

    const [iphone, setIphone] = useState(false);

    useEffect(()=>{
        if (navigator.userAgent.indexOf("iPhone")!==-1) {
            setIphone(true)
        }
    },[])

    // useEffect(() => {
    //     if (neverBanner === true) {
    //         storage.set("showBanner", "false");
    //     }
    //     if (storage.get("showBanner") !== "false") {
    //         setShowBanner(true);
    //     }
    // }, [neverBanner]);

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
                // setShowBanner,
            }}
        >
            <>
                {notif && (
                    <Notification setNotif={setNotif}>{notifText}</Notification>
                )}
                <p className="version">V: 0.4.3</p>
                {loading && <Loading />}
                {/* {showBanner && (
                    <Banner
                        setShowBanner={setShowBanner}
                        setNeverBanner={setNeverBanner}
                    ></Banner>
                )} */}
                <div className="App">
                    <div
                        className={`container ${transitionStage}`}
                        onAnimationEnd={() => {
                            if (transitionStage === "fadeOut") {
                                setTransistionStage("fadeIn");
                                setDisplayLocation(location);
                            }
                        }}
                        style={iphone ? {background: "none"} : {}}
                    >
                        <div className="logo-wrapper">
                            <img
                                src={logo}
                                alt=""
                                className="logo"
                                onClick={() => setShowMenu(!showMenu)}
                                title="Меню"
                            />
                            <img src={flower} alt="flower" className="event" />
                        </div>
                        <Routes location={displayLocation}>
                            <Route
                                path="/tasks/"
                                element={<Tasks screenWidth={screenWidth} />}
                            />
                            <Route path="/signin/" element={<Signin />} />
                            <Route path="/signin/reset/" element={<PasswordReset />} />
                            <Route path="/signup/" element={<Signup />} />
                            <Route path="/me/" element={<Me />} />
                            <Route path="/" element={<News />} />
                            <Route path="/teams/" element={<Teams />} />
                            <Route
                                path="/teams/tasks/"
                                element={
                                    <TeamTasks screenWidth={screenWidth} />
                                }
                            />
                            <Route
                                path="/invintation/:token"
                                element={<Invintation />}
                            />
                            <Route path="/test/" element={<Loading />} />
                        </Routes>
                    </div>
                </div>
                <CSSTransition in={showMenu} timeout={300} unmountOnExit>
                    <Menu setShowMenu={setShowMenu} showMenu={showMenu}></Menu>
                </CSSTransition>
            </>
        </Context.Provider>
    );
}

export default App;
