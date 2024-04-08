import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Alert } from "react-bootstrap";

import * as client from "./client";

export default function Profile() {
    const [profile, setProfile] = useState({ username: "", password: "", firstName: "", lastName: "", dob: "", email: "", role: "USER" });
    const navigate = useNavigate();

    const fetchProfile = async () => {
        const account = await client.profile();
        setProfile(account);
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const save = async () => {
        await client.updateUser(profile);
        setShow(true);
    };

    const [show, setShow] = useState(false);

    // automatically hide the alert after 5 seconds
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => setShow(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [show]);

    const signout = async () => {
        await client.signout();
        navigate("/Kanbas/Account/Signin");
      };

    return (
        <div>
            {show && (
                <Alert variant="success" onClose={() => setShow(false)} dismissible className="alert">
                    Profile Saved!
                </Alert>
            )}

            <h1>Profile</h1>
            {profile && (
                <div>
                    <div className="form-group">
                        <input className="form-control" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} />
                        <input className="form-control" value={profile.password} onChange={(e) => setProfile({ ...profile, password: e.target.value })} />
                        <input className="form-control" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
                        <input className="form-control" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
                        <input className="form-control" value={profile.dob ? new Date(profile.dob).toISOString().split("T")[0] : ""} type="date" onChange={(e) => setProfile({ ...profile, dob: e.target.value })} />
                        <input className="form-control" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                        <select className="form-control" value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })}>
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                            <option value="FACULTY">Faculty</option>
                            <option value="STUDENT">Student</option>
                        </select>
                        <button className="form-control btn btn-primary" onClick={save}>
                            Save
                        </button>
                        <br />
                        <button className="form-control btn btn-danger" onClick={signout}>
                            Sign out
                        </button>
                        <br />
                        <br />
                        <Link to="/Kanbas/Account/Admin/Users" className="form-control btn btn-warning">
                            Users
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
