import { useState } from "react";
import { useNavigate } from "react-router";
import { MdDelete } from "react-icons/md";

import "./details.css"
import "./questions.css"

import QuestionPreview from "../Preview/questionPreview";
import QuestionEdit from "./questionEdit";
import ButtonBar from "./buttonBar";
import { Quiz, Question } from "../client";
import * as client from "../client";

export default function EditQuestions({ quizArg }: { quizArg: Quiz }) {
    const [quiz, setQuiz] = useState<Quiz>(quizArg);
    const [editingQuestions, setEditingQuestions] = useState<boolean[]>(new Array(quizArg.questions.length).fill(false));

    const navigate = useNavigate();

    const cancel = async () => {
        navigate("../Quizzes");
    }

    const save = async (publish: boolean) => {
        const newQuiz = {
            ...quiz,
            published: publish
        };

        await client.updateQuiz(newQuiz);

        navigate("../Quizzes");
    }

    const addQuestion = async () => {
        // add the question to the quiz
        const updatedQuiz = {
            ...quiz,
            questions: [
                ...quiz.questions,
                {
                    id: `Q${quiz.questions.length + 1}`,
                    title: "New Question",
                    points: 0,
                    type: "MULTIPLE_CHOICE" as const,
                    answers: [{ text: "Answer 1", correct: true }]
                }
            ]
        };
        setQuiz(updatedQuiz);
        setEditingQuestions([...editingQuestions, false]);
    }

    const deleteQuestion = (index: number) => {
        if (quiz.questions.length === 1) {
            return;
        }

        const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
        const updatedQuiz = {
            ...quiz,
            questions: updatedQuestions
        };
        setQuiz(updatedQuiz);

        const updatedEditingQuestions = editingQuestions.filter((_, i) => i !== index);
        setEditingQuestions(updatedEditingQuestions);
    }

    const updateQuestion = (index: number, updatedQuestion: any) => {
        const updatedQuestions = quiz.questions.map((question, i) => i === index ? updatedQuestion : question);
        const updatedQuiz = {
            ...quiz,
            questions: updatedQuestions
        };
        setQuiz(updatedQuiz);

        const updatedEditingQuestions = editingQuestions.map((editing, i) => i === index ? !editing : editing);
        setEditingQuestions(updatedEditingQuestions);
    }

    const cancelQuestionEdit = (index: number) => {
        const updatedEditingQuestions = editingQuestions.map((editing, i) => i === index ? !editing : editing);
        setEditingQuestions(updatedEditingQuestions);
    }

    return (
        <div className="custom-container">
            <div className="quiz-button-group">
                <button type="button" className="btn" onClick={addQuestion}>+ New Question</button>
            </div>
            {quiz.questions.map((question, index) => (
                <div key={index}>
                    {editingQuestions[index] ? (
                        <QuestionEdit question={question} deleteQuestion={() => deleteQuestion(index)} updateQuestion={(updatedQuestion: Question) => updateQuestion(index, updatedQuestion)} cancel={() => cancelQuestionEdit(index)} />
                    ) : (
                        <>
                            <QuestionPreview question={question} answers={question.answers} />
                            <div className="quiz-button-group">
                                <button type="button" className="btn outer-delete-button" onClick={() => deleteQuestion(index)}><MdDelete /></button>
                                <button type="button" className="btn save-button" onClick={() => setEditingQuestions(editingQuestions.map((editing, i) => i === index ? !editing : editing))}>Edit</button>
                            </div>
                        </>
                    )}
                </div>
            ))}

            <div className="form-group">
                <ButtonBar save={save} cancel={cancel} quiz={quiz} />
            </div>
        </div>
    );
}