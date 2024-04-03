import { useEffect } from "react";
import { useParams } from "react-router";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { Accordion, FloatingLabel, Form, Button } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

import { addModule, deleteModule, updateModule, setModule, setModules } from "./reducer";
import { KanbasState } from "../../store";
import * as client from "./client";

import "./index.css";

function ModuleList() {
    const location = useLocation();

    const { courseId } = useParams();

    useEffect(() => {
        client.findModulesForCourse(courseId).then((modules) => dispatch(setModules(modules)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseId]);

    const moduleList = useSelector((state: KanbasState) => state.modulesReducer.modules);
    const module = useSelector((state: KanbasState) => state.modulesReducer.module);
    const dispatch = useDispatch();

    const handleAddModule = () => {
        client.createModule(courseId, module).then((module) => {
            dispatch(addModule(module));
        });
    };

    const handleDeleteModule = (moduleId: string) => {
        client.deleteModule(moduleId).then((status) => {
            dispatch(deleteModule(moduleId));
        });
    };

    const handleUpdateModule = async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const status = await client.updateModule(module);
        dispatch(updateModule(module));
    };

    return (
        <>
            {location.pathname.toLowerCase().includes("modules") && (
                <div className="module-update-group">
                    <h4>Module Details</h4>
                    <Form.Group className="mb-3">
                        <Form.Label>Module Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter name" value={module.name} onChange={(e) => dispatch(setModule({ ...module, name: e.target.value }))} />
                    </Form.Group>
                    <FloatingLabel controlId="floatingTextarea2" label="Module Description">
                        <Form.Control as="textarea" style={{ height: "100px" }} value={module.description} onChange={(e) => dispatch(setModule({ ...module, description: e.target.value }))} />
                    </FloatingLabel>

                    <div className="course-buttons">
                        {/* <Button onClick={() => dispatch(addModule({ ...module, course: courseId }))}>Add</Button> */}
                        <Button onClick={handleAddModule}>Add</Button>
                        <Button onClick={handleUpdateModule}>Update</Button>
                    </div>

                    <hr className="horizontal-line" />
                </div>
            )}

            {/* Add some spacing when Module Details group isn't rendered */}
            {!location.pathname.toLowerCase().includes("modules") && (
                <div>
                    <br />
                    <br />
                </div>
            )}

            <div className="modules">
                {moduleList
                    .filter((module) => module.course === courseId)
                    .map((module, module_idx) => (
                        <Accordion defaultActiveKey="0" key={module_idx}>
                            <Accordion.Item eventKey={module_idx.toString()} key={module_idx}>
                                <Accordion.Header className="d-flex justify-content-between align-items-center">
                                    {module.name}
                                    {location.pathname.toLowerCase().includes("modules") && (
                                        <div className="module-buttons">
                                            <Button variant="primary" size="sm" onClick={() => dispatch(setModule(module))}>
                                                <MdEdit />
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDeleteModule(module._id)}>
                                                <MdDelete />
                                            </Button>
                                        </div>
                                    )}
                                </Accordion.Header>
                                {module.lessons?.map((lesson: any, lesson_idx: number) => (
                                    <Accordion.Body key={lesson_idx}>{lesson.name}</Accordion.Body>
                                ))}
                            </Accordion.Item>
                        </Accordion>
                    ))}
            </div>
        </>
    );
}

export default ModuleList;
