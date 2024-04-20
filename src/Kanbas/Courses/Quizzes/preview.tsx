import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";

import { IoAlertCircleOutline } from "react-icons/io5";
import { GoTriangleRight, GoTriangleLeft } from "react-icons/go";

import * as client from "./client";
import { Quiz } from "./client";

import "./preview.css";

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
    const [startDate, setStartDate] = useState<Date>(state?.startDate);
    
    const currentTime = new Date();

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

    const shuffledAnswers = shuffleAnswers(quiz?.questions[currentQuestion].answers);

    return (
        <div className="container custom-container">
            <div className="quiz-button-group">
                <Link to={`${path}`.replace("/Preview", "")} state={{quiz: quiz}} className="btn">                                            
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
            <hr className="separator" />
            <div className="question">
                <div className="question-head">
                    <h4>{quiz?.questions[currentQuestion].id}</h4>
                    <div>
                        <h4>
                            {quiz?.questions[currentQuestion].points}
                            {quiz?.questions[currentQuestion].points > 1 ? <span>pts</span> : <span>pt</span>}
                        </h4>
                    </div>
                </div>
                <div className="question-body">
                    {quiz?.questions[currentQuestion].title}
                    {quiz?.questions[currentQuestion].type !== "MULTIPLE_FILL_IN_THE_BLANK" ? <form className="answer-choices">
                        {shuffledAnswers.map((answer: any, index: number) => (
                            <div>
                                <hr className="q-separator"/>
                                <input type="radio" id={`answer${index}`} name="answer" value={answer.text} checked={false} />
                                <label htmlFor={`answer${index}`}>{answer.text}</label>
                            </div>
                        ))}
                    </form> : <form className="answer-choices">
                        {shuffledAnswers.map((answer: any, index: number) => (
                            <div>
                                <hr className="q-separator"/>
                                <input type="text" id={`answer${index}`} name="answer" defaultValue="" />
                            </div>
                        ))}
                    </form>}
                    

                </div>
                
                <div className={`next-back quiz-button-group ${currentQuestion === 0 ? 'next' : ''} ${currentQuestion + 1 === quiz?.questions.length ? 'back' : ''}`}>
                    {currentQuestion !== 0 && <div className="back"><button className="btn icon-container" onClick={previousQuestion}><GoTriangleLeft className="small-icon" />Back</button></div>}
                    {currentQuestion + 1 !== quiz?.questions.length && <div className="next"><button className="btn icon-container" onClick={nextQuestion}>Next<GoTriangleRight className="small-icon" /></button></div>}
                </div>
            </div>
            <div className="quiz-button-group save-submit">
                Quiz saved at {cleanTime(currentTime)}
                <Link to={`${path}`.replace("/Preview", "")} state={{quiz: quiz}} className={`btn ${currentQuestion + 1 !== quiz?.questions.length ? '' : 'red'}`}>                                            
                    Submit Quiz
                </Link>
            </div>
            
        </div>
    );
}