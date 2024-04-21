import "./details.css";

interface ButtonBarProps {
    save: (published: boolean) => void;
    cancel: () => void;
    quiz: any;
}

export default function ButtonBar({ save, cancel, quiz }: ButtonBarProps) {
    return (
        <div>
            <hr />

            <div className="checkbox-button-group">
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="notifyUsers" />
                    <label className="form-check-label" htmlFor="notifyUsers">
                        Notify users this quiz has changed
                    </label>
                </div>

                <div className="quiz-button-group">
                    <button type="button" className="btn" onClick={cancel}>Cancel</button>
                    <button type="button" className="btn" onClick={() => save(true)}>Save & Publish</button>
                    <button type="button" className="btn save-button" onClick={() => save(quiz.published)}>Save</button>
                </div>
            </div>

            <hr />
        </div>
    );
}