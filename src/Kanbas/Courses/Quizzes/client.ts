import axios from "axios";

// configure axios to send credential by default
axios.defaults.withCredentials = true;

export const BASE_API = process.env.REACT_APP_API_BASE;
export const QUIZZES_API = `${BASE_API}/api/quizzes`;

export interface Quiz {
    _id: string;
    id: number;
    title: string;
    description: string;
    course_id: string;
    published: boolean;
    type: "Graded Quiz" | "Practice Quiz" | "Graded Survey" | "Ungraded Survey";
    group: "Quizzes" | "Exams" | "Assignments" | "Project";
    shuffle_answers: boolean;
    time_limit: number;
    multiple_attempts: boolean;
    show_correct_answers: "Never" | "After last attempt" | "After due date";
    access_code: string;
    one_question_at_a_time: boolean;
    webcam_required: boolean;
    lock_questions_after_answering: boolean;
    due_date: Date;
    available_date: Date;
    available_until_date: Date;
    questions: Question[];
}

interface Question {
    id: string;
    type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "MULTIPLE_FILL_IN_THE_BLANK";
    title: string;
    points: number;
    answers: Answer[];
}

interface Answer {
    text: string;
    correct: boolean;
}

export const updateQuiz = async (quiz: Quiz) => {
    const response = await axios.put(`${QUIZZES_API}/${quiz._id}`, quiz);
    return response.data;
};

export const createQuiz = async (quiz: Quiz) => {
    const response = await axios.post(`${QUIZZES_API}`, quiz);
    return response.data;
};

export const deleteQuiz = async (quiz: Quiz) => {
    const response = await axios.delete(`${QUIZZES_API}/${quiz._id}`);
    return response.data;
};

export const findAllQuizzes = async () => {
    const response = await axios.get(`${QUIZZES_API}`);
    return response.data;
};

export const findQuizzesByCourseId = async (courseId: string) => {
    const response = await axios.get(`${QUIZZES_API}/courses/${courseId}`);
    return response.data;
};
