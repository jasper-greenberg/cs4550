import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";

import { IoAlertCircleOutline, } from "react-icons/io5";
import { GoTriangleRight, GoTriangleLeft, GoQuestion } from "react-icons/go";
import { GrEdit } from "react-icons/gr";

import * as client from "../client";
import { Quiz, Answer } from "../client";

import "./preview.css";
import QuestionPreview from "./questionPreview";

export const cleanDate = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: "America/New_York",
    });
};

export const cleanTime = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        timeZone: "America/New_York",
    });
};

function shuffleAnswers(ans: any) {
    for (let i = ans.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ans[i], ans[j]] = [ans[j], ans[i]];
    }
    return ans;
}

export default function QuizPreview() {
    const location = useLocation();
    const path = location.pathname;
    const state = location.state;

    const { quizId } = useParams();
    const [quiz, setQuiz] = useState<Quiz>(state?.quiz);
    const [startDate] = useState<Date>(state?.startDate);

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(timer);
    }, []);

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

    const [currentQuestion, setCurrentQuestion] = useState(0);

    const nextQuestion = () => {
        setCurrentQuestion((prevIndex) => (prevIndex + 1) % quiz?.questions.length);
    };

    const previousQuestion = () => {
        setCurrentQuestion((prevIndex) => (prevIndex - 1) % quiz?.questions.length);
    };

    let answers: Answer[] = [];

    if (quiz.questions.length > 0) {
        answers = quiz?.questions[currentQuestion].answers;

        if (quiz.shuffle_answers) {
            answers = shuffleAnswers(quiz?.questions[currentQuestion].answers);
        }
    }

    useEffect(() => {
        const radioButtons = document.querySelectorAll("input[type=radio]");
        radioButtons.forEach((radio) => {
            (radio as HTMLInputElement).checked = false;
        });
    }, [currentQuestion]);

    return (
        <div className="container custom-container">
            <div className="quiz-button-group">
                <Link to={`${path}`.replace("/Preview", "")} state={{ quiz: quiz }} className="btn">
                    Exit Preview
                </Link>
            </div>
            <hr className="separator" />
            <h3>{quiz?.title}</h3>
            <div className="icon-container preview-notif">
                <IoAlertCircleOutline className="small-icon" />
                This is a preview of the published version of the quiz
            </div>
            <div>
                Started: <span>{cleanDate(startDate)}</span>
            </div>
            <h3>Quiz Instructions</h3>
            <div dangerouslySetInnerHTML={{ __html: quiz?.description }} />
            <hr className="separator" />
            {quiz?.questions.length > 0 ?
                <div>
                    <div className="question">
                        {quiz?.one_question_at_a_time ? (
                            <>
                                <QuestionPreview question={quiz?.questions[currentQuestion]} answers={answers} />

                                <div className={`next-back quiz-button-group ${currentQuestion === 0 ? 'next' : ''} ${currentQuestion + 1 === quiz?.questions.length ? 'back' : ''}`}>
                                    {currentQuestion !== 0 && <div className="back"><button className="btn icon-container" onClick={previousQuestion}><GoTriangleLeft className="small-icon" />Back</button></div>}
                                    {currentQuestion + 1 !== quiz?.questions.length && <div className="next"><button className="btn icon-container" onClick={nextQuestion}>Next<GoTriangleRight className="small-icon" /></button></div>}
                                </div>
                            </>
                        ) : (
                            quiz?.questions.map((question, index) => (
                                <QuestionPreview key={index} question={question} answers={answers} />
                            ))
                        )}
                    </div>
                    <div className="quiz-button-group save-submit">
                        Quiz saved at {cleanTime(currentTime)}
                        <Link to={`${path}`.replace("/Preview", "")} state={{ quiz: quiz }} className={`btn ${currentQuestion + 1 !== quiz?.questions.length ? '' : 'red'}`}>
                            Submit Quiz
                        </Link>
                    </div>
                    <div className="quiz-button-group">
                        <Link to={`${path}/Edit`.replace("/Preview", "")} state={{ quiz: quiz }} className="btn icon-container wide">
                            <GrEdit className="small-icon edit" />
                            Keep Editing This Quiz
                        </Link>
                    </div>
                    <div className="question-list">
                        <h4>Questions</h4>
                        <ul>
                            {quiz?.questions.map((question, index) => (
                                <li key={index}>
                                    <button className={currentQuestion === index ? "bold" : ""} onClick={() => setCurrentQuestion(index)}>
                                        <GoQuestion className="small-icon grey" />
                                        Question {index + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div> : <h3>This quiz has no questions.</h3>}
        </div>
    );
}