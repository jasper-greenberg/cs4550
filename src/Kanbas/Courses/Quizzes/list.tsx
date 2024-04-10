import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";

import Accordion from "react-bootstrap/Accordion";
import { RxRocket } from "react-icons/rx";
import { FcCancel } from "react-icons/fc";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { HiMiniEllipsisVertical } from "react-icons/hi2";

import "./list.css";

import { Quiz } from "./client";
import * as client from "./client";

export default function Quizzes() {
    const { courseId } = useParams();
    const location = useLocation();

    if (!courseId) {
        throw new Error("courseId is required");
    }

    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [groups, setGroups] = useState<string[]>([]);

    const translations = {
        Quizzes: "Quizzes",
        Assignments: "Assignment Quizzes",
        Exams: "Exam Quizzes",
        Projects: "Project Quizzes",
    };

    useEffect(() => {
        const fetchQuizzes = async () => {
            const quizzes = await client.findQuizzesByCourseId(courseId);
            setQuizzes(quizzes);

            const groupsSet = new Set(quizzes.map((quiz: Quiz) => quiz.group));
            setGroups(Array.from(groupsSet) as string[]);
        };

        fetchQuizzes();
    }, [courseId]);

    const cleanDate = (date: Date) => {
        return new Date(date).toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            timeZone: "America/New_York",
        });
    };

    const renderQuizStatus = (quiz: Quiz) => {
        const currentDate = new Date();
        const availableDate = new Date(quiz.available_date);
        const availableUntilDate = new Date(quiz.available_until_date);

        if (currentDate < availableDate) {
            return (
                <>
                    <span className="bolder">Not available until </span>
                    <span>{cleanDate(availableDate)}</span>
                </>
            );
        } else if (currentDate > availableUntilDate) {
            return <span className="bolder">Closed</span>;
        } else {
            return (
                <>
                    <span className="bolder">Available until </span>
                    <span>{cleanDate(availableDate)}</span>
                </>
            );
        }
    };

    const calculateTotalPoints = (quiz: Quiz) => {
        return quiz.questions.reduce((acc, question) => acc + question.points, 0);
    };

    return (
        <div>
            {[...groups].map((group, groupIndex) => (
                <Accordion
                    defaultActiveKey={quizzes.map((_, index) => index.toString())}
                    className="quiz-group"
                    alwaysOpen
                    key={groupIndex}
                >
                    <Accordion.Item eventKey={groupIndex.toString()} key={groupIndex}>
                        <Accordion.Header bsPrefix="custom-header accordion-header" key={groupIndex}>
                            {translations[group as keyof typeof translations]}
                        </Accordion.Header>
                        {quizzes
                            .filter((quiz) => quiz.group.toString() === group)
                            .map((quiz) => (
                                <Accordion.Body
                                    bsPrefix="custom-body accordion-body"
                                    className={`quiz-item ${quiz.published ? "published-item" : ""}`}
                                    key={quiz._id}
                                >
                                    <div className="quiz-info">
                                        <div className={`quiz-info ${quiz.published ? "published" : ""}`}></div>
                                        <RxRocket className={`rocket ${quiz.published ? "published" : ""}`} />
                                        <div>
                                            <Link to={`${location.pathname}/${quiz.title}`} className="quiz-title">
                                                {quiz.title}
                                            </Link>
                                            <div className="quiz-meta">
                                                <div>{renderQuizStatus(quiz)}</div>
                                                <span>
                                                    <span className="bolder">Due</span> {cleanDate(quiz.due_date)}
                                                </span>
                                                <span>{calculateTotalPoints(quiz)} pts</span>
                                                <span>{quiz.questions.length} Questions</span>
                                            </div>
                                        </div>
                                        <div className="icons">
                                            <div className="left-icons">
                                                {quiz.published ? (
                                                    <IoIosCheckmarkCircle className="checkmark" />
                                                ) : (
                                                    <FcCancel className="cancel" />
                                                )}
                                            </div>
                                            <HiMiniEllipsisVertical className="ellipsis" />
                                        </div>
                                    </div>
                                </Accordion.Body>
                            ))}
                    </Accordion.Item>
                </Accordion>
            ))}
        </div>
    );
}
