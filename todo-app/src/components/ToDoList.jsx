import React, { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import SortableTask from "./SortableTask";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";

function ToDoList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            const tasksCollection = collection(db, "tasks");
            const taskSnapshot = await getDocs(tasksCollection);
            const taskList = taskSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTasks(taskList);
        };

        fetchTasks();
    }, []);

    const addTask = async () => {
        if (newTask.trim() !== "") {
            const docRef = await addDoc(collection(db, "tasks"), {
                title: newTask,
                description: newDescription,
                completed: false,
                created: new Date(),
            });
            setTasks((prevTasks) => [...prevTasks, { id: docRef.id, title: newTask, description: newDescription, completed: false }]);
            setNewTask("");
            setNewDescription("");
        }
    };

    const deleteTask = async (taskId) => {
        await deleteDoc(doc(db, "tasks", taskId));
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    };

    const updateTask = async (taskId, newTitle, newDescription) => {
        await updateDoc(doc(db, "tasks", taskId), { title: newTitle, description: newDescription });
        setTasks((prevTasks) => prevTasks.map((task) => task.id === taskId ? { ...task, title: newTitle, description: newDescription } : task));
    };

    const toggleTaskCompletion = async (taskId) => {
        const task = tasks.find((task) => task.id === taskId);
        const updatedCompleted = !task.completed;
        await updateDoc(doc(db, "tasks", taskId), { completed: updatedCompleted });
        setTasks((prevTasks) => prevTasks.map((task) => task.id === taskId ? { ...task, completed: updatedCompleted } : task));
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = tasks.findIndex(task => task.id === active.id);
            const newIndex = tasks.findIndex(task => task.id === over.id);
            setTasks(arrayMove(tasks, oldIndex, newIndex));
        }
    };

    return (
        <div className="to-do-list">
            <button 
                className="logout-btn"
                onClick={() => navigate("/")}
            >
                Logout
            </button>
            <h1>What to do next?</h1>
            <div>
                <input
                    type="text"
                    placeholder="Enter a new task"
                    value={newTask}
                    onChange={(event) => setNewTask(event.target.value)}
                    maxLength={30}
                />
                <input
                    type="text"
                    placeholder="Enter description"
                    value={newDescription}
                    onChange={(event) => setNewDescription(event.target.value)}
                    maxLength={100}
                />
                <button className="add-button" onClick={addTask}>
                    Add
                </button>
            </div>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
                    <ol>
                        {tasks.map((task) => (
                            <SortableTask 
                                key={task.id} 
                                id={task.id} 
                                task={task.title} 
                                description={task.description}
                                completed={task.completed}
                                deleteTask={() => deleteTask(task.id)}
                                toggleCompletion={() => toggleTaskCompletion(task.id)}
                                updateTask={(newTitle, newDescription) => updateTask(task.id, newTitle, newDescription)}
                            />
                        ))}
                    </ol>
                </SortableContext>
            </DndContext>
        </div>
    );
}

export default ToDoList;
