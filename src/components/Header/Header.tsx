import React from 'react';
import './Header.css';

export const Header: React.FC = () => {
  return (
    <header className="site-header">
      <div className="header-container">
        <h1 className="header-title">Tesla Energy Site Planner</h1>
        <p className="header-subtitle">Industrial Battery Layout & Grid Orchestrator</p>
      </div>
    </header>
  );
};