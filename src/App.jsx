import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage.jsx';
import BoardPage from './pages/BoardPage.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/board/:id" element={<BoardPage />} />
      <Route path="*" element={<h2>404 - Page Not Found</h2>} />
    </Routes>
  );
};

export default App;
