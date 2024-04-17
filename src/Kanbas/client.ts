import axios from "axios";

// configure axios to send credential by default
axios.defaults.withCredentials = true;

export const BASE_API = process.env.REACT_APP_API_BASE;
export const COURSES_API = `${BASE_API}/api/courses`;

export interface Course {
    _id: string;
    name: string;
    number: string;
    startDate: Date;
    endDate: Date;
    image: string;
}

export const findCourseById = async (courseId: string) => {
    const response = await axios.get(`${COURSES_API}/${courseId}`);
    return response.data;
}

export const updateCourse = async (course: any) => {
    const response = await axios.put(`${COURSES_API}/${course._id}`, course);
    return response.data;
};

export const findAllCourses = async () => {
    const response = await axios.get(`${COURSES_API}`);
    return response.data;
};

export const createCourse = async (course: any) => {
    const response = await axios.post(`${COURSES_API}`, course);
    return response.data;
};

export const deleteCourse = async (courseId: string) => {
    const response = await axios.delete(`${COURSES_API}/${courseId}`);
    return response.data;
};