import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { Dropdown } from "react-bootstrap";
import { HiMiniEllipsisVertical } from "react-icons/hi2";

import { Quiz } from "./client";

import "./list.css";
import "./contextMenu.css";

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = React.forwardRef<any, any>(({ children, onClick }, ref) => (
    <button ref={ref} onClick={onClick}>
        <HiMiniEllipsisVertical className="ellipsis" />
    </button>
));

const CustomMenu = React.forwardRef<any, any>(({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const [value] = useState("");

    return (
        <div ref={ref} style={style} className={className} aria-labelledby={labeledBy}>
            <ul className="custom-list list-unstyled">
                {React.Children.toArray(children).filter(
                    (child) =>
                        React.isValidElement(child) && (!value || child.props.children.toLowerCase().startsWith(value))
                )}
            </ul>
        </div>
    );
});

interface ContextMenuProps {
    quiz: Quiz;
    togglePublished: (quizId: string) => void;
    deleteQuiz: (quiz: Quiz) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ quiz, togglePublished, deleteQuiz }) => {
    const location = useLocation();

    return (
        <Dropdown>
            <Dropdown.Toggle as={CustomToggle} />

            <Dropdown.Menu as={CustomMenu} bsPrefix="custom-dropdown-menu dropdown-menu">
                <Dropdown.Item eventKey="1">
                    <Link to={`${location.pathname}/${quiz._id}/Edit`} state={{quiz: quiz}} className="unstyled-link">Edit</Link>
                </Dropdown.Item>
                <Dropdown.Item eventKey="2" onClick={() => deleteQuiz(quiz)}>
                    Delete
                </Dropdown.Item>
                <Dropdown.Item eventKey="3" onClick={() => togglePublished(quiz._id)}>
                    {quiz.published ? "Unpublish" : "Publish"}
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default ContextMenu;
