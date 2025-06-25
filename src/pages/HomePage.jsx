import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/axios'

const HomePage = () => {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    api.get('/boards').then(res => setBoards(res.data));
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>All Boards</h2>
      <ul>
        {boards.map(board => (
          <li key={board._id}>
            <Link to={`/board/${board._id}`}>{board.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;