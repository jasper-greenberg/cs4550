import { useEffect, useState } from "react";
import axios from "axios";

import { API_BASE } from './Constants';

function WorkingWithObjects() {
    const [assignment, setAssignment] = useState({
        id: 1,
        title: "NodeJS Assignment",
        description: "Create a NodeJS server with ExpressJS",
        due: "2021-10-10",
        completed: false,
        score: 0,
    });
    const ASSIGNMENT_URL = `${API_BASE}/a5/assignment`;

    const [module, setModule] = useState({
        id: 1,
        name: "NodeJS",
        description: "NodeJS is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
        course: "CS4550",
    });
    const MODULE_URL = `${API_BASE}/a5/module`;

    const fetchAssignment = async () => {
        const response = await axios.get(`${ASSIGNMENT_URL}`);
        setAssignment(response.data);
    };
    const updateTitle = async () => {
        const response = await axios.get(`${ASSIGNMENT_URL}/title/${assignment.title}`);
        setAssignment(response.data);
    };
    useEffect(() => {
        fetchAssignment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <h3>Working With Objects</h3>
            <h4>Retrieving Objects</h4>
            <a className="btn btn-primary" href={`${API_BASE}/a5/assignment`}>
                Get Assignment
            </a>

            <h4>Retrieving Properties</h4>
            <a className="btn btn-primary" href={`${API_BASE}/a5/assignment/title`}>
                Get Title
            </a>

            <h4>Modifying Properties</h4>
            <input
                onChange={(e) =>
                    setAssignment({
                        ...assignment,
                        title: e.target.value,
                    })
                }
                value={assignment.title}
                type="text"
            />
            <button className="btn btn-primary" onClick={updateTitle}>Update Title to: {assignment.title}</button>
            <button className="btn btn-danger" onClick={fetchAssignment}>Fetch Assignment</button>
            <br />

            <input type="text" onChange={(e) => setAssignment({ ...assignment, title: e.target.value })} value={assignment.title} />
            <a className="btn btn-primary" href={`${ASSIGNMENT_URL}/title/${assignment.title}`}>
                Update Title
            </a>

            <h4>On Your Own</h4>
            <a className="btn btn-primary" href={`${API_BASE}/a5/module`}>
                Get Module
            </a>
            <br />

            <a className="btn btn-danger" href={`${API_BASE}/a5/module/name`}>
                Get Module Name
            </a>
            <br />

            <input type="text" onChange={(e) => setModule({ ...module, name: e.target.value })} value={module.name} />
            <a className="btn btn-warning" href={`${MODULE_URL}/name/${module.name}`}>
                Update Name
            </a>
            <br />

            <input type="number" onChange={(e) => setAssignment({ ...assignment, score: Number(e.target.value) })} value={assignment.score} />
            <a className="btn btn-info" href={`${ASSIGNMENT_URL}/score/${assignment.score}`}>
                Update Score
            </a>
            <br />

            <input type="checkbox" onChange={(e) => setAssignment({ ...assignment, completed: e.target.checked })} checked={assignment.completed} />
            <a className="btn btn-success" href={`${ASSIGNMENT_URL}/completed/${assignment.completed}`}>
                Update Completed
            </a>
        </div>
    );
}

export default WorkingWithObjects;
