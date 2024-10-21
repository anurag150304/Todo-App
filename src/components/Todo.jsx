import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Button from "@mui/material/Button";

export function Todo() {
    const [todo, setTodo] = useState([]);
    const [inputTask, setInputTask] = useState("");
    const [completed, setCompleted] = useState(false);

    // Load todos from local storage on component mount
    useEffect(() => {
        const storedTodos = localStorage.getItem("todos");
        if (storedTodos) {
            setTodo(JSON.parse(storedTodos));
        }
    }, []);

    // Save todos to local storage whenever the todo array changes
    const saveTodos = (todos) => {
        localStorage.setItem("todos", JSON.stringify(todos));
    };

    const addTodo = () => {
        const newTodo = [...todo, { id: uuidv4(), task: inputTask, isComplete: false }];
        setTodo(newTodo);
        saveTodos(newTodo); // Save the updated todo list to local storage
        setInputTask("");
    };

    const deleteAll = () => {
        setTodo([]); // Clear all todos
        saveTodos([]); // Clear local storage
    };

    const deleteTodo = (id) => {
        const updatedTodo = todo.filter((val) => val.id !== id);
        setTodo(updatedTodo);
        saveTodos(updatedTodo); // Save after deleting a todo
    };

    const taskCompletion = (id) => {
        const updatedTodo = todo.map((val) => val.id === id ? { ...val, isComplete: !val.isComplete } : val);
        setTodo(updatedTodo);
        saveTodos(updatedTodo); // Save after toggling task completion
    };

    const editTodo = (task, id) => {
        const updatedTodo = todo.filter((val) => val.id !== id);
        setTodo(updatedTodo);
        setInputTask(task); // Set task in input for editing
        saveTodos(updatedTodo); // Save after removing the task for editing
    };

    const showCompleted = () => {
        setCompleted(val => !val);
    };

    return (
        <div className="h-fit w-2/5 mx-auto mt-9 shadow-lg max-w-[410px] max-[431px]:w-4/5" style={{ borderRadius: "1em" }}>
            <div className="bg-purple-400 py-5 px-2 flex justify-center place-items-center gap-4"
                style={{ borderTopLeftRadius: "inherit", borderTopRightRadius: "inherit" }}>
                <input
                    type="text"
                    placeholder="Enter your task"
                    value={inputTask}
                    onChange={(e) => setInputTask(e.target.value)}
                    className="w-2/3 h-8 rounded-full pl-9"
                />
                <Button
                    variant="contained"
                    onClick={addTodo}
                    disabled={inputTask.length < 3}
                    className="text-sm"
                    style={{
                        borderRadius: "3em",
                        backgroundColor: "purple",
                        color: inputTask.length < 3 ? "#ffffffbb" : "white",
                        padding: "0.3em 0",
                        fontSize: "0.875rem",
                    }}>
                    Save
                </Button>
            </div>
            <div className="py-1 flex justify-around place-items-center">
                <span>
                    <input type="checkbox" id="completed" checked={completed} onChange={showCompleted} />
                    &nbsp;
                    <label htmlFor="completed" className="text-sm">Show completed</label>
                </span>
                <button className="py-1 px-2 bg-purple-600 rounded-full text-white text-sm font-semibold"
                    onClick={deleteAll}>Clear all</button>
            </div>
            <div className="shadow-xl bg-purple-200"
                style={{ borderBottomLeftRadius: "inherit", borderBottomRightRadius: "inherit" }}>
                <ul className="h-80 overflow-y-auto p-2 flex flex-col justify-start place-items-center gap-2 w-full rounded-2xl custom-scrollbar">
                    {todo.length <= 0 ? (
                        <li>No Todos</li>
                    ) : (
                        todo.map((el) => (
                            (completed || !el.isComplete) &&
                            <li
                                className="px-4 py-1.5 rounded-full w-full flex flex-row justify-between place-items-center
                                max-[769px]:py-1"
                                key={el.id}
                                style={{ backgroundColor: "ghostwhite" }}>
                                <input
                                    type="checkbox"
                                    checked={el.isComplete}
                                    onChange={() => taskCompletion(el.id)}
                                />
                                <p style={el.isComplete ? { textDecorationLine: "line-through" } : {}}>
                                    {el.task}
                                </p>
                                <div className="flex justify-center place-items-center gap-4">
                                    <i className="fa-regular fa-pen-to-square cursor-pointer" onClick={() => editTodo(el.task, el.id)} />
                                    <i className="fa-solid fa-trash cursor-pointer" onClick={() => deleteTodo(el.id)} />
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}