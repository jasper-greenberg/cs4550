import { Routes, Route, Navigate } from "react-router-dom";

import SignIn from "../Users/signin";
import Profile from "../Users/profile";
import UserTable from "../Users/table";
import SignUp from "../Users/signup";

export default function Account() {
    return (
        <div className="container-fluid">
            <Routes>
                <Route path="/" element={<Navigate to="/Kanbas/Account/signin" />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/Admin/Users" element={<UserTable />} />
                <Route path="/signup" element={<SignUp />} />
            </Routes>
        </div>
    );
}
