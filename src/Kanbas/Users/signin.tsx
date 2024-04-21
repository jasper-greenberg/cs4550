import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, FloatingLabel } from "react-bootstrap";

import "./signin.css";

import { User } from "./client";
import * as client from "./client";
import { setUser } from './reducer';

export default function SignIn() {
    const dispatch = useDispatch();
    const currentUser = useSelector((state: any) => state.userReducer.currentUser);

    const [credentials, setCredentials] = useState<User>({ _id: "", username: "", password: "", firstName: "", lastName: "", role: "USER", courses: []});
    const navigate = useNavigate();

    const signIn = async () => {
        const user = await client.signin(credentials);
        dispatch(setUser(user));
        navigate("/Kanbas/Account/Profile");
    };

    useEffect(() => {
        if (currentUser) {
            navigate("/Kanbas/Account/Profile");
        }

    }, [currentUser, navigate]);

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
