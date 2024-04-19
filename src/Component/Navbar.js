// Navbar.js
import React from 'react';
import PICTLogo from './logo.jpg';
import UserIcon from './user.jpeg';

const Navbar = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ccc'}}>
      {/* PICT Logo */}
      <div>
        <img src={PICTLogo} alt="PICT Logo" style={{ maxHeight: '100px', maxWidth: '150px', borderRadius: '75%' }} />
      </div>

      {/* User Icon */}
      <div>
        <img src={UserIcon} alt="User Icon" style={{ maxHeight: '100px', maxWidth: '150px', borderRadius: '75%' }} />
      </div>
    </div>
  );
};

export default Navbar;
