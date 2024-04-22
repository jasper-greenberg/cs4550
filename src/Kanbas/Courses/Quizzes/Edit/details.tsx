import { useRef, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";

import "./details.css";

import ButtonBar from "./buttonBar";

import * as client from "../client";

export default function EditDetails({ quizArg }: { quizArg: any }) {
    const apiKey = process.env.REACT_APP_TINY_API_KEY;
    const editorRef = useRef<any>(null);

    const focusEditor = () => {
        if (editorRef.current) {
            editorRef.current.editor.focus();
        }
    };

    function formatDate(date: Date | string) {
        if (date instanceof Date) {
            return date.toISOString().slice(0, 16);
        } else if (typeof date === "string") {
            return date.slice(0, 16);
        } else {
            console.error(`Expected a Date object or a string but received ${typeof date}`);
            return "";
        }
    }

    const today = useMemo(() => new Date(), []);
    const todayString = today.toISOString().slice(0, 16);

    function areDatesEqual(date1: Date, date2: Date) {
        // compares dates without seconds
        return new Date(date1.getFullYear(), date1.getMonth(), date1.getDate(), date1.getHours(), date1.getMinutes()).getTime() === new Date(date2.getFullYear(), date2.getMonth(), date2.getDate(), date2.getHours(), date2.getMinutes()).getTime();
    }

    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(() => {
        const initialQuiz = quizArg || {
            title: "",
            description: "",
            quizType: "Graded Quiz",
            group: "Quizzes",
            shuffle_answers: false,
            time_limit: 0,
            multiple_attempts: false,
            show_correct_answers: "Never",
            access_code: "",
            one_question_at_a_time: false,
            webcam_required: false,
            lock_questions_after_answering: false,
            due_date: today,
            available_date: today,
            available_until_date: today
        };

        return {
            ...initialQuiz,
            due_date: formatDate(initialQuiz.due_date),
            available_date: formatDate(initialQuiz.available_date),
            available_until_date: formatDate(initialQuiz.available_until_date),
        };
    });

    const [isLoaded, setIsLoaded] = useState(false);
    const [isNew, setIsNew] = useState(false);

    useEffect(() => {
        if (quizArg) {
            const fixedQuizArg = {
                ...quizArg,
                due_date: formatDate(quizArg.due_date),
                available_date: formatDate(quizArg.available_date),
                available_until_date: formatDate(quizArg.available_until_date),
            };
            setQuiz(fixedQuizArg);
            setIsLoaded(true);

            // if all dates are the current, same date, then it's a new quiz
            const dueDate = new Date(quizArg.due_date);
            const availableDate = new Date(quizArg.available_date);
            const availableUntilDate = new Date(quizArg.available_until_date);

            if (areDatesEqual(dueDate, today) && areDatesEqual(availableDate, today) && areDatesEqual(availableUntilDate, today)) {
                setIsNew(true);
            }
        }
    }, [quizArg, today]);

    function handleInputChange(event: any) {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        setQuiz((prevQuiz: any) => ({
            ...prevQuiz,
            [name]: value
        }));
    }

    const cancel = async () => {
        if (isNew) {
            await client.deleteQuiz(quiz);
        }

        navigate("../Quizzes");
    }

    const save = async (publish: boolean) => {
        const newQuiz = {
            ...quiz,
            published: publish,
            description: editorRef.current.editor.getContent()
        };

        await client.updateQuiz(newQuiz);

        navigate("../Quizzes");
    }

    if (!isLoaded) {
        return null;
    }

    return (
        <div className="custom-container">
            <div className="form-group">
                <input type="text" className="form-control custom-form" placeholder="Quiz Title" name="title" value={quiz.title} onChange={handleInputChange} />

                <label onClick={focusEditor} className="custom-label" >Quiz Instructions:</label>

                <div className="editor-container">
                    <Editor
                        ref={editorRef}
                        apiKey={apiKey}
                        initialValue={quiz.description}
                    />
                </div>

                <label htmlFor="quizType" className="custom-label" >Quiz Type</label>
                <select className="form-control" id="quizType" name="quizType" value={quiz.quizType} onChange={handleInputChange} >
                    <option value="Graded Quiz">Graded Quiz</option>
                    <option value="Practice Quiz">Practice Quiz</option>
                    <option value="Graded Survey">Graded Survey</option>
                    <option value="Ungraded Survey">Ungraded Survey</option>
                </select>

                <label htmlFor="assignmentGroup" className="custom-label" >Assignment Group</label>
                <select className="form-control" id="assignmentGroup" name="group" value={quiz.group} onChange={handleInputChange} >
                    <option value="Quizzes">Quizzes</option>
                    <option value="Exams">Exams</option>
                    <option value="Assignments">Assignments</option>
                    <option value="Projects">Projects</option>
                </select>

                <div className="form-group">
                    <label className="options-label">Options</label>

                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="shuffleAnswers" name="shuffle_answers" checked={quiz.shuffle_answers} onChange={handleInputChange} />
                        <label className="form-check-label" htmlFor="shuffleAnswers">
                            Shuffle Answers
                        </label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="timeLimit">Time Limit (minutes)</label>
                        <input type="number" className="form-control" id="timeLimit" name="time_limit" value={quiz.time_limit} onChange={handleInputChange} />
                    </div>

                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="multipleAttempts" name="multiple_attempts" checked={quiz.multiple_attempts} onChange={handleInputChange} />
                        <label className="form-check-label" htmlFor="multipleAttempts">
                            Allow Multiple Attempts
                        </label>
                    </div>

                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="showCorrectAnswers" name="show_correct_answers" checked={quiz.show_correct_answers} onChange={handleInputChange} />
                        <label className="form-check-label" htmlFor="showCorrectAnswers">
                            Show Correct Answers
                        </label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="accessCode">Access Code</label>
                        <input type="text" className="form-control" id="accessCode" name="access_code" value={quiz.access_code} onChange={handleInputChange} />
                    </div>

                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="oneQuestionAtATime" name="one_question_at_a_time" checked={quiz.one_question_at_a_time} onChange={handleInputChange} />
                        <label className="form-check-label" htmlFor="oneQuestionAtATime">
                            One Question at a Time
                        </label>
                    </div>

                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="webcamRequired" name="webcam_required" checked={quiz.webcam_required} onChange={handleInputChange} />
                        <label className="form-check-label" htmlFor="webcamRequired">
                            Webcam Required
                        </label>
                    </div>

                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="lockQuestionsAfterAnswering" name="lock_questions_after_answering" checked={quiz.lock_questions_after_answering} onChange={handleInputChange} />
                        <label className="form-check-label" htmlFor="lockQuestionsAfterAnswering">
                            Lock Questions After Answering
                        </label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="dueDate">Due Date</label>
                        <input type="datetime-local" className="form-control" id="dueDate" name="due_date" value={quiz.due_date} min={todayString} onChange={handleInputChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="availableDate">Available Date</label>
                        <input type="datetime-local" className="form-control" id="availableDate" name="available_date" value={quiz.available_date} min={todayString} onChange={handleInputChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="availableUntilDate">Until Date</label>
                        <input type="datetime-local" className="form-control" id="availableUntilDate" name="available_until_date" value={quiz.available_until_date} min={todayString} onChange={handleInputChange} />
                    </div>
                </div>

                <ButtonBar save={save} cancel={cancel} quiz={quiz} />
            </div>
        </div>
    );
}