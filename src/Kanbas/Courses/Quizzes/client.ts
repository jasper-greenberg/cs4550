import axios from "axios";

// configure axios to send credential by default
axios.defaults.withCredentials = true;

export const BASE_API = process.env.REACT_APP_API_BASE;
export const QUIZZES_API = `${BASE_API}/api/quizzes`;

export interface Quiz {
    _id: string;
    id: number,
    title: string,
    description: string,
    course_id: string,
    published: {
        type: Boolean,
        default: false,
    },
    type: {
        type: string,
        enum: ["Graded Quiz", "Practice Quiz", "Graded Survey", "Ungraded Survey"],
        default: "Graded Quiz",
    },
    group: {
        type: string,
        enum: ["Quizzes", "Exams", "Assignments", "Project"],
        default: "Quizzes",
    },
    shuffle_answers: {
        type: Boolean,
        default: true,
    },
    time_limit: {
        type: number,
        default: 20,
    },
    multiple_attempts: {
        type: Boolean,
        default: false,
    },
    show_correct_answers: {
        type: string,
        enum: ["Never", "After last attempt", "After due date"],
        default: "After last attempt",
    },
    access_code: string,
    one_question_at_a_time: {
        type: Boolean,
        default: true,
    },
    webcam_required: {
        type: Boolean,
        default: false,
    },
    lock_questions_after_answering: {
        type: Boolean,
        default: false,
    },
    due_date: Date,
    available_date: Date,
    available_until_date: Date,
    questions: [
        {
            id: string,
            type: {
                type: string,
                enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "MULTIPLE_FILL_IN_THE_BLANK"],
            },
            title: string,
            points: number,
            answers: [
                {
                    text: string,
                    correct: Boolean,
                }
            ],
        },
    ]
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
}

export const findQuizzesByCourseId = async (courseId: string) => {
    const response = await axios.get(`${QUIZZES_API}/courses/${courseId}`);
    return response.data;
}
