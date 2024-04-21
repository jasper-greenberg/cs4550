import React, { useState, useEffect } from "react";
import { BsTrash3Fill, BsPlusCircleFill } from "react-icons/bs";

import * as client from "./client";
import { User } from "./client";
import "./table.css";

export default function UserTable() {
    const [users, setUsers] = useState<User[]>([]);
    const fetchUsers = async () => {
        const users = await client.findAllUsers();
        setUsers(users);
    };
    useEffect(() => {
        fetchUsers();
    }, []);

    const [user, setUser] = useState<User>({
        _id: "",
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "USER",
        courses: [],
    });

    const createUser = async () => {
        try {
            const newUser = await client.createUser(user);
            setUsers([newUser, ...users]);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteUser = async (user: User) => {
        try {
            await client.deleteUser(user);
            setUsers(users.filter((u) => u._id !== user._id));
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <h1>User Table</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Role</th>
                    </tr>
                    <tr>
                        <td>
                            <div className="row">
                                <div className="col">
                                    <input className="form-control" placeholder="Username" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} />
                                </div>
                                <div className="col">
                                    <input className="form-control" placeholder="Password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
                                </div>
                            </div>
                        </td>
                        <td>
                            <input className="form-control" value={user.firstName} onChange={(e) => setUser({ ...user, firstName: e.target.value })} />
                        </td>
                        <td>
                            <input className="form-control" value={user.lastName} onChange={(e) => setUser({ ...user, lastName: e.target.value })} />
                        </td>
                        <td>
                            <select className="form-control" value={user.role} onChange={(e) => setUser({ ...user, role: e.target.value })}>
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                                <option value="FACULTY">Faculty</option>
                                <option value="STUDENT">Student</option>
                            </select>
                        </td>
                        <td>
                            <button onClick={createUser} className="add-button">
                                <BsPlusCircleFill size="2em" color="green" />
                            </button>
                        </td>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user: any) => (
                        <tr key={user._id}>
                            <td className="align-middle">{user.username}</td>
                            <td className="align-middle">{user.firstName}</td>
                            <td className="align-middle">{user.lastName}</td>
                            <td className="align-middle">{user.role}</td>
                            <td>
                                <button className="btn btn-danger" onClick={() => deleteUser(user)}>
                                    <BsTrash3Fill />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
