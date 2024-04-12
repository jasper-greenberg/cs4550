import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";

import { Accordion } from "react-bootstrap";
import { RxRocket } from "react-icons/rx";
import { FcCancel } from "react-icons/fc";
import { IoIosCheckmarkCircle } from "react-icons/io";

import "./list.css";

import { Quiz } from "./client";
import * as client from "./client";

import ContextMenu from "./contextMenu";

export const cleanDate = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: "America/New_York",
    });
};

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
                    <span>{cleanDate(availableUntilDate)}</span>
                </>
            );
        }
    };

    const calculateTotalPoints = (quiz: Quiz) => {
        return quiz.questions.reduce((acc, question) => acc + question.points, 0);
    };

    /**
     * Toggles the published status of a quiz.
     *
     * @param {string} quizId - The ID of the quiz to toggle.
     */
    const togglePublished = async (quizId: string) => {
        // filter the quizzes state to find the quiz with the matching ID
        const quiz = quizzes.find((quiz) => quiz._id === quizId);

        if (!quiz) {
            throw new Error(`Quiz with ID ${quizId} not found`);
        }

        const updatedQuiz = { ...quiz, published: !quiz.published };

        setQuizzes(quizzes.map((q) => (q._id === quizId ? updatedQuiz : q)));
        await client.updateQuiz(updatedQuiz);
    };

    /**
     * Deletes a quiz.
     *
     * @param {Quiz} quiz - The ID of the quiz to delete.
     */
    const deleteQuiz = async (quiz: Quiz) => {
        // Call the deleteQuiz function from the client module.
        await client.deleteQuiz(quiz);

        // Update the quizzes state.
        // The function passed to setQuizzes receives the previous quizzes state and returns the new state.
        setQuizzes((prevQuizzes) =>
            // Filter the previous quizzes state to remove the quiz with the matching ID.
            prevQuizzes.filter((innerQuiz) => innerQuiz._id !== quiz._id)
        );
    };

    return (
        <div className="container custom-container">
            <div className="row mb-3">
                <div className="col-12 text-end">
                    <Link to={`${location.pathname}/New Quiz`} className="quiz-title">
                        <button className="btn btn-primary add-quiz-button">+ Quiz</button>
                    </Link>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    {[...groups].map((group, groupIndex) => (
                        <Accordion
                            defaultActiveKey={quizzes.map((_, index) => index.toString())}
                            className="quiz-group"
                            alwaysOpen
                            key={groupIndex}
                        >
                            <Accordion.Item
                                eventKey={groupIndex.toString()}
                                key={groupIndex}
                                bsPrefix="custom-item accordion-item"
                            >
                                <Accordion.Header bsPrefix="custom-header accordion-header" key={groupIndex}>
                                    {translations[group as keyof typeof translations]}
                                </Accordion.Header>
                                {quizzes
                                    .filter((quiz): boolean => quiz.group.toString() === group)
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
                                                    <Link
                                                        to={`${location.pathname}/${quiz._id}`}
                                                        className="quiz-title"
                                                    >
                                                        {quiz.title}
                                                    </Link>
                                                    <div className="quiz-meta">
                                                        <div>{renderQuizStatus(quiz)}</div>
                                                        <span>
                                                            <span className="bolder">Due</span>{" "}
                                                            {cleanDate(quiz.due_date)}
                                                        </span>
                                                        <span>{calculateTotalPoints(quiz)} pts</span>
                                                        <span>{quiz.questions.length} Questions</span>
                                                    </div>
                                                </div>
                                                <div className="icons">
                                                    <div className="left-icon">
                                                        {quiz.published ? (
                                                            <button onClick={() => togglePublished(quiz._id)}>
                                                                <IoIosCheckmarkCircle className="checkmark" />
                                                            </button>
                                                        ) : (
                                                            <button onClick={() => togglePublished(quiz._id)}>
                                                                <FcCancel className="cancel" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <ContextMenu
                                                        quiz={quiz}
                                                        togglePublished={togglePublished}
                                                        deleteQuiz={deleteQuiz}
                                                    />
                                                </div>
                                            </div>
                                        </Accordion.Body>
                                    ))}
                            </Accordion.Item>
                        </Accordion>
                    ))}
                </div>
            </div>
        </div>
    );
}
