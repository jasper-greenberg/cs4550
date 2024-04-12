import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

import * as client from "./client";
import { Quiz } from "./client";

export default function QuizPreview() {
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

    return (
        <div>
            <h1>Preview</h1>
            <h2>{quiz?.title}</h2>
        </div>
    );
}