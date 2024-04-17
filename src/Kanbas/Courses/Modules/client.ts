import axios from "axios";

import * as client from "../../client";

const API_BASE = process.env.REACT_APP_API_BASE;
const MODULES_API = `${API_BASE}/api/modules`;

export const findModulesForCourse = async (courseId: string) => {
    // get the course information
    const course = await client.findCourseById(courseId);

    const response = await axios.get(`${MODULES_API}/courses/${course.id}`);
    return response.data;
};

export const createModule = async (courseId: string, module: any) => {
    const response = await axios.post(`${MODULES_API}/courses/${courseId}`, module);
    return response.data;
};

export const deleteModule = async (moduleId: string) => {
    console.log(moduleId)
    const response = await axios.delete(`${MODULES_API}/${moduleId}`);
    return response.data;
};

export const updateModule = async (module: { _id: string; }) => {
    const response = await axios.put(`${MODULES_API}/${module._id}`, module);
    return response.data;
};
