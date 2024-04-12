import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

import NavBar from "./NavBar";
import CourseNavigation from "./Navigation";
import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import Quizzes from "./Quizzes/list";
import QuizDetails from "./Quizzes/details";
import QuizPreview from "./Quizzes/preview";
import QuizEdit from "./Quizzes/edit";

const API_BASE = process.env.REACT_APP_API_BASE;

function Courses() {
    const { courseId } = useParams();
    const COURSES_API = `${API_BASE}/api/courses`;
    const [course, setCourse] = useState<any>({ _id: "" });

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
    
        const findCourseById = async (courseId?: string) => {
            const response = await axios.get(`${COURSES_API}/${courseId}`);
            setCourse(response.data);
        };
    
        findCourseById(courseId);
    }, [COURSES_API, courseId]);

    return (
        <div>
            <NavBar course={course} />
            <CourseNavigation />
            <div>
                <div className="overflow-y-scroll position-fixed bottom-0 end-0" style={{ left: "280px", top: "70px" }}>
                    <Routes>
                        <Route path="/" element={<Navigate to="Home" />} />
                        <Route path="Home" element={<Home />} />
                        <Route path="Modules" element={<Modules />} />
                        <Route path="Piazza" element={<h1>Piazza</h1>} />
                        <Route path="Assignments" element={<Assignments />} />
                        <Route path="Assignments/:assignmentId" element={<h1>Assignment Editor</h1>} />
                        <Route path="Grades" element={<h1>Grades</h1>} />
                        <Route path="Quizzes" element={<Quizzes />} />
                        <Route path="Quizzes/:quizId" element={<QuizDetails />} />
                        <Route path="Quizzes/:quizId/Preview" element={<QuizPreview />} />
                        <Route path="Quizzes/Edit" element={<QuizEdit />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default Courses;
