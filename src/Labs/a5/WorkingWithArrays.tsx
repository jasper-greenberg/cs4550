import { useState, useEffect } from "react";
import axios from "axios";

function WorkingWithArrays() {
    const API = "http://localhost:4000/a5/todos";
    const [todo, setTodo] = useState({
        id: 1,
        title: "NodeJS Assignment",
        description: "Create a NodeJS server with ExpressJS",
        due: "2021-09-09",
        completed: false,
    });

    const [todos, setTodos] = useState<any[]>([]);
    const fetchTodos = async () => {
        const response = await axios.get(API);
        setTodos(response.data);
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const removeTodo = async (todo: { id: any }) => {
        const response = await axios.get(`${API}/${todo.id}/delete`);
        setTodos(response.data);
    };

    const createTodo = async () => {
        const response = await axios.get(`${API}/create`);
        setTodos(response.data);
    };

    const fetchTodoById = async (id: any) => {
        const response = await axios.get(`${API}/${id}`);
        setTodo(response.data);
    };

    const updateTitle = async () => {
        const response = await axios.get(`${API}/${todo.id}/title/${todo.title}`);
        setTodos(response.data);
    };

    const postTodo = async () => {
        const response = await axios.post(API, todo);
        setTodos([...todos, response.data]);
    };

    const deleteTodo = async (todo: { id: any; title?: string; description?: string; due?: string; completed?: boolean }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const response = await axios.delete(`${API}/${todo.id}`);
        setTodos(todos.filter((t) => t.id !== todo.id));
    };

    const updateTodo = async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const response = await axios.put(`${API}/${todo.id}`, todo);
        setTodos(todos.map((t) => (t.id === todo.id ? todo : t)));
    };

    return (
        <div>
            <h3>Working with Arrays</h3>

            <h4>Retrieving Arrays</h4>
            <a className="btn btn-primary" href={API}>
                Get Todos
            </a>

            <h4>Retrieving an Item from an Array by ID</h4>
            <input value={todo.id} onChange={(e) => setTodo({ ...todo, id: parseInt(e.target.value) })} />
            <a className="btn btn-primary" href={`${API}/${todo.id}`}>
                Get Todo by ID
            </a>

            <h3>Filtering Array Items</h3>
            <a className="btn btn-primary" href={`${API}?completed=true`}>
                Get Completed Todos
            </a>

            <h4>Creating new Items in an Array</h4>
            <a className="btn btn-primary" href={`${API}/create`}>
                Create Todo
            </a>

            <h4>Deleting from an Array</h4>
            <a className="btn btn-primary" href={`${API}/${todo.id}/delete`}>
                Delete Todo with ID = {todo.id}
            </a>

            <h2>Working with Arrays Part 2</h2>
            <input
                type="number"
                value={todo.id}
                onChange={(e) =>
                    setTodo({
                        ...todo,
                        id: parseInt(e.target.value),
                    })
                }
            />
            <br />
            <input
                type="text"
                value={todo.title}
                onChange={(e) =>
                    setTodo({
                        ...todo,
                        title: e.target.value,
                    })
                }
            />
            <br />

            <textarea value={todo.description} onChange={(e) => setTodo({ ...todo, description: e.target.value })} />
            <br />
            <input
                value={todo.due}
                type="date"
                onChange={(e) =>
                    setTodo({
                        ...todo,
                        due: e.target.value,
                    })
                }
            />
            <br />
            <label>
                <input
                    value={todo.completed.toString()}
                    type="checkbox"
                    onChange={(e) =>
                        setTodo({
                            ...todo,
                            completed: e.target.checked,
                        })
                    }
                />
                Completed
            </label>
            <br />
            <button className="btn btn-success" onClick={postTodo}>
                {" "}
                Post Todo{" "}
            </button>
            <br />
            <button className="btn btn-primary" onClick={updateTodo}>
                Update Todo
            </button>
            <br />
            <button onClick={() => deleteTodo(todo)} className="btn btn-danger float-end ms-2">
                Delete
            </button>

            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        <input checked={todo.completed} type="checkbox" readOnly />
                        {todo.title}
                        <p>{todo.description}</p>
                        <p>{todo.due}</p>
                        <button className="btn btn-danger" onClick={() => removeTodo(todo)}>
                            Remove
                        </button>
                        <button className="btn btn-warning" onClick={() => fetchTodoById(todo.id)}>
                            Edit
                        </button>
                    </li>
                ))}
            </ul>

            <button className="btn btn-primary" onClick={createTodo}>
                Create Todo
            </button>
            <br />

            <button className="btn btn-success" onClick={updateTitle}>
                Update Title
            </button>

            <h4>Updating an Item in an Array</h4>
            <a className="btn btn-primary" href={`${API}/${todo.id}/title/${todo.title}`}>
                Update Title to {todo.title}
            </a>

            <h3>On Your Own</h3>
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={(e) =>
                    setTodo({
                        ...todo,
                        completed: e.target.checked,
                    })
                }
            />
            <a className="btn btn-primary" href={`${API}/${todo.id}/completed/${todo.completed}`}>
                Complete Todo ID = {todo.id}
            </a>
            <br />

            <input
                type="text"
                value={todo.description}
                onChange={(e) =>
                    setTodo({
                        ...todo,
                        description: e.target.value,
                    })
                }
            />
            <a className="btn btn-primary" href={`${API}/${todo.id}/description/${todo.description}`}>
                Describe Todo ID = {todo.id}
            </a>
        </div>
    );
}

export default WorkingWithArrays;
