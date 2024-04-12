import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";

import { IoIosCheckmarkCircle } from "react-icons/io";
import { FcCancel } from "react-icons/fc";
import { GrEdit } from "react-icons/gr";

import { Quiz } from "./client";
import * as client from "./client";
import { cleanDate } from "./list";

import "./details.css";

export default function QuizDetails() {
    const location = useLocation();
    const path = location.pathname;
    const state = location.state;

    const { quizId } = useParams();
    const [quiz, setQuiz] = useState<Quiz>(state?.quiz);

    if (!quizId) {
        throw new Error("quizId is required");
    }

    useEffect(() => {
        const fetchQuiz = async () => {
            const quiz = await client.findQuizById(quizId);
            setQuiz(quiz);
        };

        // if quiz is not stored in location state, get it from the server
        if (!quiz) {
            fetchQuiz();
        }
    }, [quiz, quizId]);

    // /**
    //  * Toggles the published status of a quiz.
    //  */
    const togglePublished = async () => {
        if (quiz) {
            const updatedQuiz = {
                ...quiz,
                published: !quiz.published,
            };
            setQuiz(updatedQuiz);
            await client.updateQuiz(updatedQuiz);
        }
    };

    return (
        <div className="container custom-container">
            {quiz && (
                <div>
                    <div className="quiz-button-group">
                        {quiz.published ? (
                            <button className="btn published icon-container" onClick={togglePublished}>
                                <IoIosCheckmarkCircle className="small-icon" />
                                Published
                            </button>
                        ) : (
                            <button className="btn unpublished icon-container" onClick={togglePublished}>
                                <FcCancel className="small-icon" />
                                Publish
                            </button>
                        )}

                        <Link to={`${path}/Preview`} state={{quiz: quiz}} className="btn">                                            
                            Preview
                        </Link>
                        <Link to={`${path}/Edit`} state={{quiz: quiz}} className="btn">
                            <GrEdit className="small-icon edit" />
                            Edit
                        </Link>
                    </div>

                    <hr className="separator" />

                    <h3>{quiz.title}</h3>

                    <div className="details-container">
                        <li className="quiz-detail">
                            <div className="label-container">
                                <span className="quiz-detail-label">Quiz Type</span>
                                <span className="quiz-detail-label">Points</span>
                                <span className="quiz-detail-label">Assignment Group</span>
                                <span className="quiz-detail-label">Shuffle Answers</span>
                                <span className="quiz-detail-label">Time Limit</span>
                                <span className="quiz-detail-label">Multiple Attempts</span>
                                <span className="quiz-detail-label">Show Correct Answers</span>
                                <span className="quiz-detail-label">Access Code</span>
                                <span className="quiz-detail-label">One Question at a Time</span>
                                <span className="quiz-detail-label">Webcam Required</span>
                                <span className="quiz-detail-label">Lock Questions After Answering</span>
                            </div>
                            <div className="value-container">
                                <div className="value">{quiz.type}</div>
                                <div className="value">
                                    {quiz.questions.reduce(
                                        (acc: any, question: { points: any }) => acc + question.points,
                                        0
                                    )}
                                </div>
                                <div className="value">{quiz.group}</div>
                                <div className="value">{quiz.shuffle_answers ? "Yes" : "No"}</div>
                                <div className="value">{quiz.time_limit} minutes</div>
                                <div className="value">{quiz.multiple_attempts ? "Yes" : "No"}</div>
                                <div className="value">{quiz.show_correct_answers}</div>
                                <div className="value">{quiz.access_code || "\u00A0"}</div>
                                <div className="value">{quiz.one_question_at_a_time ? "Yes" : "No"}</div>
                                <div className="value">{quiz.webcam_required ? "Yes" : "No"}</div>
                                <div className="value">{quiz.lock_questions_after_answering ? "Yes" : "No"}</div>
                            </div>
                        </li>
                    </div>

                    <table className="table">
                        <thead className="details-table">
                            <tr>
                                <th>Due</th>
                                <th>For</th>
                                <th>Available from</th>
                                <th>Until</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{cleanDate(quiz.due_date)}</td>
                                <td>Everyone</td>
                                <td>{cleanDate(quiz.available_date)}</td>
                                <td>{cleanDate(quiz.available_until_date)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
