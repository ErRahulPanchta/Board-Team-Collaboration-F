import React, { useEffect, useState } from 'react';
import api from '../services/axios';
import Sidebar from '../components/Sidebar';

const HomePage = () => {
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newBoardName, setNewBoardName] = useState("");
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
    const res = await api.get(`/boards/${boardId}/tasks`);
    setTasks(res.data);
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

  useEffect(() => {
    fetchUser();

    const lastId = localStorage.getItem('selectedBoardId');
    if (lastId) {
      api.get('/boards').then((res) => {
        const board = res.data.find((b) => b._id === lastId);
        if (board) {
          setSelectedBoard(board);
          fetchTasks(lastId);
        }
      });
    }
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Sidebar onSelectBoard={handleBoardClick} selectedBoardId={selectedBoard?._id} />

      {/* Main */}
      <div style={{ flex: 1, padding: '1rem' }}>
        {/* Top Bar with user info and back */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          {selectedBoard && <button onClick={handleBack}>⬅ Back</button>}
          <div>
            {user ? `👋 Welcome, ${user.name}` : <button>Login / Register</button>}
          </div>
        </div>

        {!selectedBoard ? (
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
        ) : (
          <>
            <h2>{selectedBoard.name}</h2>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              {['todo', 'in-progress', 'done'].map(status => (
                <div key={status} style={{ flex: 1 }}>
                  <h3>{status.toUpperCase()}</h3>
                  {tasks
                    .filter(task => task.status === status)
                    .map(task => (
                      <div key={task._id} style={{ border: '1px solid #ccc', padding: '0.5rem', marginBottom: '0.5rem' }}>
                        <h4>{task.title}</h4>
                        <p>{task.description}</p>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
