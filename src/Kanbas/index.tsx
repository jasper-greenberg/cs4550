import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Provider } from "react-redux";

import KanbasNavigation from "./Navigation";
import store from "./store";
import Dashboard from "./Dashboard";
import Courses from "./Courses";
import Account from "./Account";

import { Course } from "./client";
import * as client from "./client";

function Kanbas() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [course, setCourse] = useState<Course>({
        _id: "",
        name: "Course Name",
        number: "Course Number",
        startDate: new Date("2024-01-08"),
        endDate: new Date("2024-04-23"),
        image: "/images/react.png",
    });

    const findAllCourses = async () => {
        const response = await client.findAllCourses();
        setCourses(response);
    };

    useEffect(() => {
        findAllCourses();
    }, []);

    const addNewCourse = async () => {
        const response = await client.createCourse(course);
        setCourses([...courses, response]);
    };

    const deleteCourse = async (courseId: string) => {
        await client.deleteCourse(courseId);
        setCourses(courses.filter((c) => c._id !== courseId));
    };

    const updateCourse = async () => {
        await client.updateCourse(course);
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
                        <Route path="/Account/*" element={<Account />} />
                        <Route
                            path="Dashboard"
                            element={
                                <Dashboard
                                    courses={courses}
                                    course={course}
                                    setCourse={setCourse}
                                    addNewCourse={addNewCourse}
                                    deleteCourse={deleteCourse}
                                    updateCourse={updateCourse}
                                />
                            }
                        />
                        <Route path="Courses/:courseId/*" element={<Courses />} />
                    </Routes>
                </div>
            </div>
        </Provider>
    );
}

export default Kanbas;
