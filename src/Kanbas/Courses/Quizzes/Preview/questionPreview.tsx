import { Question, Answer } from "../client";

export default function QuestionPreview({ question, answers}: { question: Question, answers: Answer[]}) {
    return (
        <div>
            
            <div className="question-head">
                <h4>{question.id}</h4>
                <div>
                    <h4>
                        {question.points}
                        {question.points > 1 ? <span>pts</span> : <span>pt</span>}
                    </h4>
                </div>
            </div>
            <div className="question-body">
                {question.title}
                {question.type !== "MULTIPLE_FILL_IN_THE_BLANK" ? <form className="answer-choices">
                    {answers.map((answer: any, index: number) => (
                        <div key={index}>
                            <hr className="q-separator" />
                            <input type="radio" id={`answer${index}`} name="answer" value={answer.text} />
                            <label htmlFor={`answer${index}`}>{answer.text}</label>
                        </div>
                    ))}
                </form> : <form className="answer-choices">
                    {answers.map((answer: any, index: number) => (
                        <div key={index}>
                            <hr className="q-separator" />
                            {index + 1}. <input type="text" id={`answer${index}`} name="answer" defaultValue="" />
                        </div>
                    ))}
                </form>}
            </div>
        </div>
    );
}