import { useState, useRef } from "react";
import { MdDelete } from "react-icons/md";

import "../Preview/preview.css"
import "./questions.css"

import { Question } from "../client";
import { Editor } from "@tinymce/tinymce-react";

export default function QuestionEdit({ question, deleteQuestion, updateQuestion, cancel }: { question: Question, deleteQuestion: () => void, updateQuestion: (question: Question) => void, cancel: () => void }) {
    const apiKey = process.env.REACT_APP_TINY_API_KEY;
    const editorRef = useRef<any>(null);

    const focusEditor = () => {
        if (editorRef.current) {
            editorRef.current.editor.focus();
        }
    };


    const [localQuestion, setLocalQuestion] = useState(question);

    function handleInputChange(event: any) {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        if (name === "correct") {
            setLocalQuestion({
                ...localQuestion,
                answers: localQuestion.answers.map((answer, index) => ({
                    ...answer,
                    correct: index.toString() === value
                }))
            });
        } else if (name.startsWith("answerText")) {
            const index = Number(name.split('answerText')[1]);
            setLocalQuestion({
                ...localQuestion,
                answers: localQuestion.answers.map((answer, i) => i === index ? { ...answer, text: value } : answer)
            });
        } else {
            setLocalQuestion({
                ...localQuestion,
                [name]: value
            });
        }
    }

    const saveQuestion = () => {
        // grab the content from the editor
        const content = sanitizeHTML(editorRef.current.editor.getContent());

        const updatedQuestion = {
            ...localQuestion,
            title: content
        };

        setLocalQuestion(updatedQuestion);
        updateQuestion(updatedQuestion);
    }

    const addAnswer = () => {
        setLocalQuestion({
            ...localQuestion,
            answers: [...localQuestion.answers, { text: "", correct: false }]
        });
    }

    const deleteAnswer = (index: number) => {
        if (localQuestion.answers.length === 1) {
            return;
        }

        const wasCorrect = localQuestion.answers[index].correct;

        setLocalQuestion({
            ...localQuestion,
            answers: localQuestion.answers.filter((_, i) => i !== index).map((answer, i) => wasCorrect && i === 0 ? { ...answer, correct: true } : answer)
        });
    }

    const sanitizeHTML = (html: string) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    }

    return (
        <div>
            <div className="question-head">
                <div className="question-header">
                    <div className="inline-elements">
                        <input className="form-control" type="text" name="title" defaultValue="Question Title" />
                        <select className="form-control" name="type" value={localQuestion.type} onChange={handleInputChange}>
                            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                            <option value="TRUE_FALSE">True/False</option>
                            <option value="MULTIPLE_FILL_IN_THE_BLANK">Multiple Fill in the Blank</option>
                        </select>
                    </div>
                </div>
                <div className="points-input-container">
                    <label htmlFor="points">pts: </label>
                    <input className="form-control" type="number" name="points" id="points" value={localQuestion.points} onChange={handleInputChange} />
                </div>
            </div>
            <div className="question-body">
                <p>Enter your question and multiple answers, then select the one correct answer.</p>

                <label className="bold-label" onClick={focusEditor}>Question:</label>
                <Editor
                    ref={editorRef}
                    apiKey={apiKey}
                    initialValue={localQuestion.title}
                    init={{
                        height: 200,
                    }}
                />
                <div className="answer-choices">
                    <label className="bold-label">Answers:</label>
                    {localQuestion.answers.map((answer, index) => (
                            <div key={index}>
                                <div className="answer-item">
                                    <input
                                        type="radio"
                                        id={`answer${index}`}
                                        name="correct"
                                        value={index}
                                        checked={answer.correct}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        className="form-control"
                                        type="text"
                                        id={`answerText${index}`}
                                        name={`answerText${index}`}
                                        value={answer.text}
                                        onChange={handleInputChange}
                                    />
                                    <button
                                        className="delete-button"
                                        onClick={() => deleteAnswer(index)}
                                        disabled={localQuestion.answers.length === 1}
                                    >
                                        <MdDelete />
                                    </button>
                                    {answer.correct && <span className="correct-tag">[CORRECT]</span>}
                                </div>
                            </div>
                        ))
                    }
                </div>

                <div className="add-answer-button-container question-list">
                    <button onClick={addAnswer}>+ Add Another Answer</button>
                </div>

                <div className="quiz-button-group editor">
                    <button type="button" className="btn save-button" onClick={saveQuestion}>Save</button>
                    <button type="button" className="btn" onClick={cancel}>Cancel</button>
                    <button type="button" className="btn outer-delete-button" onClick={deleteQuestion}><MdDelete /></button>
                </div>
            </div>
        </div>
    );
}