import { useEffect, useState } from 'react';
import { FaCheckCircle, FaEllipsisV, FaPlusCircle } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { assignments } from "../../Database";

import * as client from "../../client";

import "./index.css";

function Assignments() {
    const { courseId } = useParams();

    const [assignmentList, setAssignmentList] = useState<{ id: string; title: string; course: string; }[]>([]);

    useEffect(() => {
        const fetchAssignments = async () => {
            if (!courseId) {
                return;
            }
            const course = await client.findCourseById(courseId);

            const assignmentList = assignments.filter((assignment) => assignment.course === course.id);
            setAssignmentList(assignmentList);
        };

        fetchAssignments();
    }, [courseId]);

    return (
        <>
            <div className="d-flex align-items-center button-grp d-none d-sm-flex">
                <input className="form-control w-25" placeholder="Search for Assignment" />
                <button type="button" className="wd-assignments-button">
                    + Group
                </button>
                <button type="button" className="wd-assignments-button">
                    + Assignment
                </button>
                <select className="form-control w-25">
                    <option>Edit Assignment Dates</option>
                </select>
            </div>
            
            <hr className="d-none d-sm-flex" style={{ borderColor: "gray" }} />

            <ul className="list-group wd-assignments wd-modules col-12 col-sm-auto">
                <li className="list-group-item">
                    <div>
                        <FaEllipsisV className="me-2" /> ASSIGNMENTS
                        <span className="float-end">
                            <FaCheckCircle className="text-success" />
                            <FaPlusCircle className="ms-2" />
                            <FaEllipsisV className="ms-2" />
                        </span>
                    </div>
                    <ul className="list-group">
                        {assignmentList.map((assignment) => (
                            <li className="list-group-item" key={assignment.id}>
                                <FaEllipsisV className="me-2" />
                                <Link to={`/Kanbas/Courses/${courseId}/Assignments/${assignment.id}`}>{assignment.title}</Link>
                                <span className="float-end">
                                    <FaCheckCircle className="text-success" />
                                    <FaEllipsisV className="ms-2" />
                                </span>
                            </li>
                        ))}
                    </ul>
                </li>
            </ul>
        </>
    );
}

export default Assignments;
