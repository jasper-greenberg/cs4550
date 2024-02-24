import { FaCheckCircle, FaEllipsisV, FaPlusCircle } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { assignments } from "../../Database";

import "./index.css";

function Assignments() {
    const { courseId } = useParams();
    const assignmentList = assignments.filter((assignment) => assignment.course === courseId);

    return (
        <>
            <div className="d-flex align-items-center button-grp">
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
            
            <hr style={{ borderColor: "gray" }} />

            <ul className="list-group wd-assignments wd-modules">
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
                            <li className="list-group-item">
                                <FaEllipsisV className="me-2" />
                                <Link to={`/Kanbas/Courses/${courseId}/Assignments/${assignment._id}`}>{assignment.title}</Link>
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
