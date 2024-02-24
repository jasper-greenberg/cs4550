import "./index.css"

import { Link } from "react-router-dom";
import { courses } from "../Database";

function Dashboard() {
    return (
        <div className="p-4">
            <h1>Dashboard</h1> <hr />
            <h2>Published Courses ({courses.length})</h2> <hr />
            <div className="row">
                <div className="row row-cols-1 row-cols-md-5 g-4">
                    {courses.map((course) => (
                        <div key={course._id} className="col" style={{ width: 300 }}>
                            <div className="custom-card card">
                                <Link to = {`/Kanbas/Courses/${course._id}/Home`}>
                                    <img className="card-img-top card-image" src={`/images/${course.image}`} alt="..." />
                                </Link>
                                <div className="card-body">
                                    <Link to={`/Kanbas/Courses/${course._id}/Home`} className="no-style-link">
                                        <h5 className="card-title">{course.name}</h5>
                                        <h6 className="card-subtitle mb-2 text-muted">{`${course.number} - ${dateToTerm(new Date(course.startDate))}`}</h6>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Convert a startDate to a school term
 * @param {Date} startDate the start date of the term
 * @returns {string} the term name and year
 */
function dateToTerm(startDate: Date): string {
    // Add 1 to the month because it is 0 indexed
    const startMonth = startDate.getMonth() + 1;
    const year = startDate.getFullYear();

    if (startMonth <= 5) return `Spring ${year}`;
    if (startMonth >= 5 && startMonth <= 6) return `Summer 1 ${year}`;
    if (startMonth >= 7 && startMonth <= 8) return `Summer 2 ${year}`;
    else return `Fall ${year}`;
}

export default Dashboard;
