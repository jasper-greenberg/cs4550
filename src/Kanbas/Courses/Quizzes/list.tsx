import { useState, useEffect, useRef } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Accordion } from "react-bootstrap";
import { RxRocket } from "react-icons/rx";
import { FcCancel } from "react-icons/fc";
import { IoIosCheckmarkCircle } from "react-icons/io";

import "./list.css";

import { Quiz, Type, Group, ShowCorrectAnswers } from "./client";
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
    const navigate = useNavigate();
    const isFirstRender = useRef(true);

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
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

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

    const createQuizAndRedirect = async () => {
        const newQuiz = {
            _id: "",
            title: "Unnamed Quiz",
            description: "",
            course_id: courseId,
            published: false,
            type: "Graded Quiz" as Type,
            group: "Quizzes" as Group,
            shuffle_answers: true,
            time_limit: 20,
            multiple_attempts: false,
            show_correct_answers: "After last attempt" as ShowCorrectAnswers,
            access_code: "",
            one_question_at_a_time: true,
            webcam_required: false,
            lock_questions_after_answering: false,
            due_date: new Date(),
            available_date: new Date(),
            available_until_date: new Date(),
            questions: []
        };
        const createdQuiz = await client.createQuiz(newQuiz);
        navigate(`${location.pathname}/${createdQuiz._id}/Edit`);
    };

    const currentUserType = useSelector((state: any) => state.userReducer.currentUser.role);

    return (
        <div className="container custom-container">

            {currentUserType !== "STUDENT" &&
                <div className="row mb-3">
                    <div className="col-12 text-end">
                        <button className="btn btn-primary add-quiz-button" onClick={createQuizAndRedirect}>+ Quiz</button>
                    </div>
                </div>}
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
                                                    {quiz.published || currentUserType !== "STUDENT" ?
                                                        <Link
                                                            to={{ pathname: `${location.pathname}/${quiz._id}` }}
                                                            state={{ quiz: quiz }}
                                                            className="quiz-title"
                                                        >
                                                            {quiz.title}
                                                        </Link> : <div className="quiz-title unpublished">{quiz.title}</div>}
                                                    <div className="quiz-meta">
                                                        <div>{renderQuizStatus(quiz)}</div>
                                                        <span>
                                                            <span className="bolder">Due</span>{" "}
                                                            {cleanDate(quiz.due_date)}
                                                        </span>
                                                        {quiz.published && (
                                                            <>
                                                                <span>{calculateTotalPoints(quiz)} pts</span>
                                                                <span>{quiz.questions.length} Questions</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="icons">
                                                    <div className="left-icon">
                                                        {quiz.published ? (
                                                            <button onClick={() => togglePublished(quiz._id)} disabled={currentUserType === "STUDENT"}>
                                                                <IoIosCheckmarkCircle className="checkmark" />
                                                            </button>
                                                        ) : (
                                                            <button onClick={() => togglePublished(quiz._id)} disabled={currentUserType === "STUDENT"}>
                                                                <FcCancel className="cancel" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    {currentUserType !== "STUDENT" &&
                                                        <ContextMenu
                                                            quiz={quiz}
                                                            togglePublished={togglePublished}
                                                            deleteQuiz={deleteQuiz}
                                                        />}
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
