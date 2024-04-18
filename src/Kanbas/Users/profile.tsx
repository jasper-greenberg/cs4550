import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Alert } from "react-bootstrap";

import "./profile.css";

import * as client from "./client";
import * as courseClient from "../client";
import { setUser } from "./reducer";

export default function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    type ProfileState = {
        username: string;
        password: string;
        firstName: string;
        lastName: string;
        dob: string;
        email: string;
        role: string;
        courses: string[];
    };

    const [profile, setProfile] = useState<ProfileState>({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        dob: "",
        email: "",
        role: "USER",
        courses: [],
    });
    const [addAllCourses, setAddAllCourses] = useState(false);
    const [courses, setCourses] = useState<any[]>([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const account = await client.profile();
                setProfile(account);
            } catch (error: any) {
                // if the user is not authenticated, redirect to the signin page
                if (error.response && error.response.status === 401) {
                    // clear user state
                    dispatch(setUser(null));
                    navigate("/Kanbas/Account/signin");
                }
            }
        };

        const fetchCourses = async () => {
            const courses = await courseClient.findAllCourses();
            setCourses(courses);
        };

        fetchProfile();
        fetchCourses();
    }, [navigate, dispatch]);

    const save = async () => {
        let newProfile = { ...profile };
        if (addAllCourses) {
            newProfile = { ...newProfile, courses: courses.map((course) => course._id) };
        }

        await client.updateUser(newProfile);
        dispatch(setUser(newProfile));
        setProfile(newProfile);
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
        dispatch(setUser(null));
        navigate("/Kanbas/Account/Signin");
    };

    // Update the setProfile function to add all courses when the checkbox is checked
    const handleCheckboxChange = (e: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
        setAddAllCourses(e.target.checked);
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
                        <input className="form-control" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} placeholder="Username" />
                        <input className="form-control" value={profile.password} onChange={(e) => setProfile({ ...profile, password: e.target.value })} placeholder="Password" />
                        <input className="form-control" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} placeholder="First Name" />
                        <input className="form-control" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} placeholder="Last Name" />
                        <input className="form-control" value={profile.dob ? new Date(profile.dob).toISOString().split("T")[0] : ""} type="date" onChange={(e) => setProfile({ ...profile, dob: e.target.value })} placeholder="Date of Birth" />
                        <input className="form-control" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} placeholder="Email" />
                        <select className="form-control" value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })}>
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                            <option value="FACULTY">Faculty</option>
                            <option value="STUDENT">Student</option>
                        </select>
                        <div className="form-check">
                            <label className="form-check-label" htmlFor="addAllCourses">
                                <input id="addAllCourses" className="form-check-input" type="checkbox" checked={addAllCourses} onChange={handleCheckboxChange} />
                                Add all courses
                            </label>
                        </div>

                    </div>

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
            )}
        </div>
    );
}
