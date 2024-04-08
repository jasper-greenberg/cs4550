import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import * as client from "./client";

export default function SignUp() {
    const [error, setError] = useState("");
    const [user, setUser] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const signUp = async () => {
        try {
            await client.signup(user);
            navigate("/Kanbas/Account/Profile");
        } catch (err: any) {
            setError(err.response.data.message);
        }
    };

    return (
        <div>
            <h1>Sign up</h1>
            {error && <div>{error}</div>}
            <div className="form-group">
                <input
                    className="form-control"
                    placeholder="Username"
                    value={user.username}
                    onChange={(e) =>
                        setUser({
                            ...user,
                            username: e.target.value,
                        })
                    }
                />
            </div>
            <div className="form-group">
                <input
                    className="form-control"
                    placeholder="Password"
                    type="password"
                    value={user.password}
                    onChange={(e) =>
                        setUser({
                            ...user,
                            password: e.target.value,
                        })
                    }
                />
            </div>
            <button className="btn btn-primary" onClick={signUp}>
                Sign up
            </button>
        </div>
    );
}
