import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";


const TaskFormModal = ({ isOpen, onClose, onSubmit, initialData = {} }) => {
  const [form, setForm] = useState({
    title: '', description: '', assignedTo: '', priority: 'Low', dueDate: '', status: 'todo'
  });

  useEffect(() => {
    if (initialData && initialData._id) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        assignedTo: initialData.assignedTo || '',
        priority: initialData.priority || 'Low',
        dueDate: initialData.dueDate ? initialData.dueDate.slice(0, 10) : '',
        status: initialData.status || 'todo',
      });
    } else {
      setForm({
        title: '', description: '', assignedTo: '', priority: 'Low', dueDate: '', status: 'todo'
      });
    }
  }, [initialData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <Link to={'/'}>
        <IoMdArrowRoundBack />
        </Link>

       
        <h3>{initialData && initialData._id ? 'Edit Task' : 'Create Task'}</h3>
        <form onSubmit={handleSubmit}>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
          <input name="assignedTo" value={form.assignedTo} onChange={handleChange} placeholder="Assigned To" required />
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} required />
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
    justifyContent: 'center', alignItems: 'center'
  },
  modal: {
    backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', width: '400px'
  }
};

export default TaskFormModal;
