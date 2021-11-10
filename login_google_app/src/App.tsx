import React, { Fragment, useEffect, useState } from "react";
import GoogleLogin from "react-google-login";

type LoginDataType = {
    email: string;
    name: string;
};
function App() {
    const [error, setError] = useState<string>("");
    const [loginData, setLoginData] = useState<LoginDataType | null>(null);

    useEffect(() => {
        const localData = localStorage.getItem("loginData");
        if (localData) {
            setLoginData(JSON.parse(localData));
        } else {
            setLoginData(null);
        }
    }, []);

    const handleFailure = (result: any) => {
        alert("Login failed!");
    };

    const handleLogin = async (googleData: any) => {
        const res = await fetch("/api/google-login", {
            method: "POST",
            body: JSON.stringify({
                token: googleData.tokenId,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();
        setLoginData(data);
        localStorage.setItem("loginData", JSON.stringify(data));
    };

    const handleLogout = () => {
        localStorage.removeItem("loginData");
        setLoginData(null);
    };

    return (
        <div className="app">
            <h1 className="title">React google login</h1>
            <div className="group">
                {loginData ? (
                    <Fragment>
                        <h3>You logged in as {loginData.email}</h3>
                        <h4>Welcome {loginData.name}</h4>
                        <button
                            onClick={handleLogout}
                            type="button"
                            className="btn-login"
                        >
                            Logout
                        </button>
                    </Fragment>
                ) : (
                    <GoogleLogin
                        clientId={
                            process.env.CLIENT_ID ||
                            "900023505392-gh1qqmijck71c9nibceu60gckpomnaq8.apps.googleusercontent.com"
                        }
                        buttonText="Login with google"
                        onSuccess={handleLogin}
                        onFailure={handleFailure}
                        cookiePolicy="single_host_origin"
                    />
                )}
            </div>
        </div>
    );
}

export default App;
