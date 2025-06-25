import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/axios'
import TaskFormModal from '../components/TaskFormModel'

const BoardPage = () => {
  const { id: boardId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/boards/${boardId}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    if (boardId) fetchTasks();
  }, [boardId]);

  const openCreateModal = () => {
    setSelectedTask({}); // empty task
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setSelectedTask(task); // existing task
    setModalOpen(true);
  };

  const handleSubmitTask = async (formData) => {
    try {
      if (selectedTask && selectedTask._id) {
        await api.put(`/task/${selectedTask._id}`, formData);
      } else {
        await api.post(`/board/${boardId}/task`, { ...formData, board: boardId });
      }
      setModalOpen(false);
      setSelectedTask(null);
      fetchTasks();
    } catch (err) {
      console.error("Error saving task:", err);
      alert("Failed to save task.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const groupedTasks = {
    todo: [],
    'in-progress': [],
    done: []
  };

  tasks.forEach(task => {
    groupedTasks[task.status]?.push(task);
  });

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Board: {boardId}</h2>
      <button onClick={openCreateModal}>+ Create Task</button>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        {['todo', 'in-progress', 'done'].map(status => (
          <div key={status} style={{ flex: 1 }}>
            <h3>{status.toUpperCase()}</h3>
            {groupedTasks[status].map(task => (
              <div key={task._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '0.5rem' }}>
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                <span style={{
                  padding: '2px 6px',
                  backgroundColor:
                    task.priority === 'High' ? '#f44336' :
                    task.priority === 'Medium' ? '#ff9800' : '#4caf50',
                  color: '#fff', borderRadius: '4px', fontSize: '12px'
                }}>
                  {task.priority}
                </span>
                <div style={{ marginTop: '0.5rem' }}>
                  <button onClick={() => openEditModal(task)}>Edit</button>
                  <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <TaskFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleSubmitTask}
        initialData={selectedTask || {}}
      />
    </div>
  );
};

export default BoardPage;
