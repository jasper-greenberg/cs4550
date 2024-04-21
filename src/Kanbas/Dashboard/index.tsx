import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";

import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

import "./index.css";

import { Course } from "../client";
import * as client from "../client";
import * as userClient from "../Users/client";
import { setUser } from "../Users/reducer";

function Dashboard({
    courses,
    course,
    setCourse,
    setCourses,
    updateCourse,
}: {
    courses: any[];
    course: any;
    setCourse: (course: any) => void;
    setCourses: (courses: Course[]) => void;
    updateCourse: () => void;
}) {
    const dispatch = useDispatch();

    let currentUser = useSelector((state: any) => state.userReducer.currentUser);

    if (currentUser != null) {
        courses = courses.filter((course) => currentUser.courses.includes(course._id));
    } else {
        courses = [];
    }

    const addNewCourse = async () => {
        const newCourse = await client.createCourse(course);
        currentUser = { ...currentUser, courses: [...currentUser.courses, newCourse._id] };
        dispatch(setUser(currentUser));
        setCourses([...courses, newCourse]);
        await userClient.updateUser(currentUser);
    };

    const deleteCourse = async (courseId: string) => {
        const updatedCourses = courses.filter((course) => course._id !== courseId);
        currentUser = { ...currentUser, courses: updatedCourses.map((course) => course._id) };
        dispatch(setUser(currentUser));
        setCourses(updatedCourses);
        await userClient.updateUser(currentUser);
        await client.deleteCourse(courseId);
    }

    return (
        <div className="p-4">
            <h1>Dashboard</h1>
            <hr />

            {courses && courses.length > 0 && (
                <div>
                    {(currentUser.role === "FACULTY" || currentUser.role === "ADMIN") && (
                        <>
                            <h2>Published Courses ({courses.length})</h2>

                            <h5>Course</h5>
                            <div className="add-course-form">
                                <input value={course.name} className="form-control" onChange={(e) => setCourse({ ...course, name: e.target.value })} />
                                <input value={course.number} className="form-control" onChange={(e) => setCourse({ ...course, number: e.target.value })} />
                                <input value={formatDate(course.startDate)} className="form-control" type="date" onChange={(e) => setCourse({ ...course, startDate: e.target.value })} />
                                <input value={formatDate(course.endDate)} className="form-control" type="date" onChange={(e) => setCourse({ ...course, endDate: e.target.value })} />
                            </div>
                            <div className="course-buttons">
                                <Button onClick={updateCourse}>Update</Button>
                                <Button onClick={addNewCourse}>Add</Button>
                            </div>
                            <hr />
                        </>
                    )}

                    <div className="row">
                        <div className="row row-cols-1 row-cols-md-5 g-4">
                            {courses.map((course) => (
                                <div key={course._id} className="col" style={{ width: 300 }}>
                                    <div className="custom-card card">
                                        <Link to={`/Kanbas/Courses/${course._id}/Home`}>
                                            <img className="card-img-top card-image" src={`/images/${course.image}`} alt="..." />
                                        </Link>
                                        <div className="card-body position-relative">
                                            <Link to={`/Kanbas/Courses/${course._id}/Home`} className="no-style-link">
                                                <h5 className="card-title">{course.name}</h5>
                                                <h6 className="card-subtitle mb-2 text-muted">{`${course.number} - ${dateToTerm(new Date(course.startDate))}`}</h6>
                                            </Link>
                                            {(currentUser.role === "FACULTY" || currentUser.role === "ADMIN") && (
                                                <div className="card-buttons">
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            setCourse(course);
                                                        }}
                                                    >
                                                        <MdEdit />
                                                    </Button>
                                                    <Button variant="danger" size="sm" onClick={() => deleteCourse(course._id)}>
                                                        <MdDelete />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {courses && courses.length === 0 && <h3>You're not enrolled in any courses!</h3>}
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

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed in JavaScript
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export default Dashboard;
