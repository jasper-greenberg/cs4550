import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Provider } from "react-redux";
import axios from "axios";

import KanbasNavigation from "./Navigation";
import store from "./store";
import Dashboard from "./Dashboard";
import Courses from "./Courses";

const API_BASE = process.env.REACT_APP_API_BASE_AFIVE;

function Kanbas() {
    const [courses, setCourses] = useState<any[]>([]);
    const [course, setCourse] = useState({
        _id: "0",
        name: "Course Name",
        number: "Course Number",
        startDate: "2024-01-08",
        endDate: "2024-04-23",
        image: "/images/react.png",
    });

    const COURSES_API = `${API_BASE}/api/courses`;

    const findAllCourses = async () => {
        const response = await axios.get(COURSES_API);
        setCourses(response.data);
    };

    useEffect(() => {
        findAllCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addNewCourse = async () => {
        const response = await axios.post(COURSES_API, course);
        setCourses([...courses, response.data]);
    };

    const deleteCourse = async (courseId: string) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const response = await axios.delete(`${COURSES_API}/${courseId}`);
        setCourses(courses.filter((c) => c._id !== courseId));
    };

    const updateCourse = async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const response = await axios.put(`${COURSES_API}/${course._id}`, course);
        setCourses(
            courses.map((c) => {
                if (c._id === course._id) {
                    return course;
                }
                return c;
            })
        );
    };

    return (
        <Provider store={store}>
            <div className="d-flex">
                <KanbasNavigation />
                <div style={{ flexGrow: 1 }}>
                    <Routes>
                        <Route path="/" element={<Navigate to="Dashboard" />} />
                        <Route path="Account" element={<h1>Account</h1>} />
                        <Route path="Dashboard" element={<Dashboard courses={courses} course={course} setCourse={setCourse} addNewCourse={addNewCourse} deleteCourse={deleteCourse} updateCourse={updateCourse} />} />
                        <Route path="Courses/:courseId/*" element={<Courses />} />
                    </Routes>
                </div>
            </div>
        </Provider>
    );
}

export default Kanbas;
