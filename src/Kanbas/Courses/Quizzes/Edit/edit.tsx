import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

import * as client from "../client";
import { Quiz } from "../client";

import "../details.css";

import EditDetails from "./details";
import EditQuestions from "./questions";

export default function QuizEdit() {
    const location = useLocation();
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

    const [selectedTab, setSelectedTab] = useState('Details');

    return (
        <div>
            <div className="container custom-container">
                <nav className="nav nav-tabs mt-2">
                    <button
                        onClick={() => setSelectedTab('Details')}
                        className={`nav-link ${selectedTab === 'Details' ? 'active' : ''}`}
                    >
                        Details
                    </button>
                    <button
                        onClick={() => setSelectedTab('Questions')}
                        className={`nav-link ${selectedTab === 'Questions' ? 'active' : ''}`}
                    >
                        Questions
                    </button>
                </nav>
                {selectedTab === 'Details' ? <EditDetails /> : <EditQuestions />}
            </div>
        </div>
    );
}
