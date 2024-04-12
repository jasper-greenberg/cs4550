import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

import * as client from "./client";
import { Quiz } from "./client";

export default function QuizEdit() {
    const location = useLocation();
    const state = location.state;

    const { quizId } = useParams();
    const [quiz, setQuiz] = useState<Quiz>(state?.quiz);

    // if quizId is not provided, create a new quiz
    if (!quizId) {
        setQuiz({
            _id: "",
            title: "",
            description: "",
            course_id: "",
            published: false,
            type: "Graded Quiz",
            group: "Quizzes",
            shuffle_answers: true,
            time_limit: 20,
            multiple_attempts: false,
            show_correct_answers: "After last attempt",
            access_code: "",
            one_question_at_a_time: true,
            webcam_required: false,
            lock_questions_after_answering: false,
            due_date: new Date(),
            available_date: new Date(),
            available_until_date: new Date(),
            questions: [],
        });
    }

    useEffect(() => {
        const fetchQuiz = async () => {
            if (quizId) {
                const quiz = await client.findQuizById(quizId);
                setQuiz(quiz);
            }
        };

        // if quiz is not stored in location state, get it from the server
        if (!quiz) {
            fetchQuiz();
        }
    }, [quiz, quizId]);

    return (
        <div>
            <h1>Edit</h1>
            <h2>{quiz?.title}</h2>
        </div>
    );
}
