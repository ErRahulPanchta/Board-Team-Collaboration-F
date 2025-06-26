// components/Sidebar.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/axios';

const Sidebar = ({ onSelectBoard, selectedBoardId }) => {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    api.get('/boards').then(res => setBoards(res.data));
  }, []);

  return (
    <div style={{ width: '200px', background: '#f4f4f4', padding: '1rem' }}>
      <h3>Boards</h3>
      {boards.map(board => (
        <div
          key={board._id}
          onClick={() => onSelectBoard(board)}
          style={{
            margin: '0.5rem 0',
            cursor: 'pointer',
            fontWeight: selectedBoardId === board._id ? 'bold' : 'normal',
            color: selectedBoardId === board._id ? '#007bff' : '#333'
          }}
        >
          {board.name}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
