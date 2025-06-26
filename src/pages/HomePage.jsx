import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import TaskFormModal from '../components/TaskFormModal';
import api from '../services/axios';

const HomePage = () => {
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newBoardName, setNewBoardName] = useState('');
  const [user, setUser] = useState(null);

  
  const fetchUser = async () => {
    try {
      const res = await api.get('/user');
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  
  const fetchTasks = async (boardId) => {
    try {
      const res = await api.get(`/boards/${boardId}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  
  const handleBoardClick = (board) => {
    setSelectedBoard(board);
    localStorage.setItem('selectedBoardId', board._id);
    fetchTasks(board._id);
  };

  
  const handleBack = () => {
    setSelectedBoard(null);
    setTasks([]);
    localStorage.removeItem('selectedBoardId');
  };

  
  const handleCreateBoard = async (e) => {
    e.preventDefault();
    await api.post('/boards', { name: newBoardName });
    setNewBoardName('');
  };

  
  const handleSubmitTask = async (formData) => {
    try {
      if (selectedTask && selectedTask._id) {
        await api.put(`/task/${selectedTask._id}`, formData);
      } else {
        await api.post(`/board/${selectedBoard._id}/task`, {
          ...formData,
          board: selectedBoard._id
        });
      }
      setModalOpen(false);
      setSelectedTask(null);
      fetchTasks(selectedBoard._id);
    } catch (err) {
      console.error("Task save error:", err);
      alert("Failed to save task");
    }
  };

  
  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks(selectedBoard._id);
    } catch (err) {
      console.error("Delete task error:", err);
    }
  };

  
  useEffect(() => {
    fetchUser();

    const lastId = localStorage.getItem('selectedBoardId');
    if (lastId) {
      api.get('/boards').then((res) => {
        const board = res.data.find((b) => b._id === lastId);
        if (board) {
          setSelectedBoard(board);
          fetchTasks(board._id);
        }
      });
    }
  }, []);

  
  const groupedTasks = {
    todo: [],
    'in-progress': [],
    done: []
  };
  tasks.forEach((task) => groupedTasks[task.status]?.push(task));

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar onSelectBoard={handleBoardClick} selectedBoardId={selectedBoard?._id} />

      <div style={{ flex: 1, padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          {selectedBoard && <button onClick={handleBack}>⬅ Back</button>}
          <div>{user ? `👤 ${user.name}` : <button>Login / Register</button>}</div>
        </div>

        {selectedBoard ? (
          <>
            <h2>{selectedBoard.name}</h2>
            <button onClick={() => {
              setModalOpen(true);
              setSelectedTask(null);
            }}>+ Create Task</button>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              {['todo', 'in-progress', 'done'].map((status) => (
                <div key={status} style={{ flex: 1 }}>
                  <h3>{status.toUpperCase()}</h3>
                  {groupedTasks[status].map((task) => (
                    <div
                      key={task._id}
                      style={{
                        border: '1px solid #ccc',
                        padding: '1rem',
                        marginBottom: '0.5rem',
                        borderRadius: '5px'
                      }}
                    >
                      <h4>{task.title}</h4>
                      <p>{task.description}</p>
                      <span style={{
                        padding: '2px 6px',
                        backgroundColor:
                          task.priority === 'High' ? '#f44336' :
                            task.priority === 'Medium' ? '#ff9800' : '#4caf50',
                        color: '#fff',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        {task.priority}
                      </span>
                      <div style={{ marginTop: '0.5rem' }}>
                        <button onClick={() => {
                          setSelectedTask(task);
                          setModalOpen(true);
                        }}>Edit</button>
                        <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2>Create New Board</h2>
            <form onSubmit={handleCreateBoard}>
              <input
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="Board name"
                required
              />
              <button type="submit">Create</button>
            </form>
          </>
        )}

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
    </div>
  );
};

export default HomePage;
