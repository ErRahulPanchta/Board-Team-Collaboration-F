import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/axios'

const Sidebar = () => {
  const [boards, setBoards] = useState([]);
  const location = useLocation();

  useEffect(() => {
    api.get('/boards').then(res => setBoards(res.data));
  }, []);

  return (
    <div style={{ width: '200px', background: '#f4f4f4', padding: '1rem' }}>
      <h3>Boards</h3>
      {boards.map(board => (
        <Link key={board._id} to={`/board/${board._id}`} style={{ display: 'block', margin: '0.5rem 0' }}>
          {board.name}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;