// App.js
import React, { useState } from 'react';
import Navbar from './Component/Navbar';  // Import the Navbar component
import Dashboard from './Component/Dashboard';
import './App.css'; // Import the CSS file

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div>
      <header>
        <Navbar />  {/* Include the Navbar component */}
        <nav>
          <ul>
            <li 
              style={{
                marginRight: '20px',
                fontSize: currentPage === 'dashboard' ? '24px' : '16px', 
                fontWeight: 'bold', // Increase the size for the selected page
              }}
            onClick={() => setCurrentPage('dashboard')}>Dashboard</li>
            {/* Add more menu items for other pages if needed */}
          </ul>
        </nav>
      </header>
      
      <div className="content">
        {currentPage === 'dashboard' && <Dashboard/>}
        {/* Add conditions for other pages */}
        {/* {currentPage === 'page1' && <Page1 />} */}
        {/* {currentPage === 'page2' && <Page2 />} */}
        {/* ... */}
      </div>
    </div>
  );
};

export default App;
