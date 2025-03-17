import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableTask({ id, task, description, completed, deleteTask, toggleCompletion, updateTask }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState(task);
    const [editedDescription, setEditedDescription] = useState(description);

    const style = {
        transform: CSS.Transform.toString(transform),
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: 'text-decoration 0.3s ease, opacity 0.3s ease',
        opacity: completed ? 0.5 : 1,
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        updateTask(editedTask, editedDescription);
        setIsEditing(false);
    };

    return (
        <li ref={setNodeRef} style={style} {...attributes}>
            <input
                type="checkbox"
                className="task-checkbox"
                checked={completed}
                onChange={toggleCompletion}
            />
            {isEditing ? (
                <div>
                    <input
                        type="text"
                        value={editedTask}
                        onChange={(e) => setEditedTask(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSave();
                        }}
                    />
                    <input
                        type="text"
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSave();
                        }}
                    />
                </div>
            ) : (
                <div>
                    <span className="text" style={{ textDecoration: completed ? "line-through" : "none" }}>
                        {task}
                    </span>
                    {description && (
                        <p style={{ fontSize: '0.9em', color: 'gray', margin: 0 }}>{description}</p>
                    )}
                </div>
            )}
            <div className="controls">
                <button className="edit-button" onClick={handleEdit} style={{ backgroundColor: 'blue', color: 'white' }}>
                    ✏️
                </button>
                <button className="delete-button" onClick={deleteTask}>
                    🗑️
                </button>
                <span className="drag-handle" {...listeners}>☰</span>
            </div>
        </li>
    );
}

export default SortableTask; 