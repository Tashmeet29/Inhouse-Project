// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Import the CSS file

const Sidebar = ({ currentPage, setPage }) => {
  const pages = [
    { id: 1, name: 'Dashboard' },
    { id: 2, name: 'Attendance' },
    { id: 3, name: 'Academics' },
    // Add more pages as needed
  ];

  return (
    <div className="sidebar">
      <ul>
        {pages.map((page) => (
          <li key={page.id} className={currentPage === page.id ? 'active' : ''}>
            <Link to={`/${page.name.toLowerCase()}`} onClick={() => setPage(page.id)}>
              {page.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
