// StudentDetails.js
import React from 'react';

const StudentDetails = ({ student }) => {
  return (
    <div>
      <h2>Student Details</h2>
      <p>Name: {student.name}</p>
      <p>Roll No: {student.rollno}</p>
      <p>Score: {student.score}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default StudentDetails;
