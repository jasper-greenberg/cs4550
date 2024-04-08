import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, FloatingLabel } from "react-bootstrap";

import "./signin.css";

import { User } from "./client";
import * as client from "./client";

export default function SignIn() {
    const [credentials, setCredentials] = useState<User>({ _id: "", username: "", password: "", firstName: "", lastName: "", role: "USER" });
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const navigate = useNavigate();
    const signIn = async () => {
        await client.signin(credentials);
        navigate("/Kanbas/Account/Profile");
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await client.profile();
                if (user) {
                    navigate("/Kanbas/Account/Profile");
                }
            } catch (error) {
                console.error("Error checking authentication status:", error);
            } finally {
                setIsCheckingAuth(false);
            }
        };
        checkAuth();
    }, [navigate]);

    if (isCheckingAuth) {
        return null; // or a loading spinner
    }

    return (
        <div>
            <h1>Sign in</h1>
            <div className="signin">
                <FloatingLabel controlId="floatingInput" label="Username" className="mb-3">
                    <Form.Control type="username" placeholder="johndoe" value={credentials.username} onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} />
                </FloatingLabel>
                <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
                    <Form.Control type="password" placeholder="Password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} />
                </FloatingLabel>
            </div>
            <Button variant="primary" onClick={signIn}>
                Sign in
            </Button>
            <br />
            <br />
            <Link to="/Kanbas/Account/signup" className="btn btn-warning">Sign up</Link>
        </div>
    );
}
