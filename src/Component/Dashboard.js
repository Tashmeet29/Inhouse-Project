import React, { useState, useRef, useEffect} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import { Button } from '@mui/material';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import './Dashboard.css'; // Import the CSS file

import axios from 'axios';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  tableContainer: {
    border: 1,
    borderColor: '#000',
    padding: 10,
  },
  table: {
    display: 'table',
    width: 'auto',
  },
  row: { 
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  cell: {
    fontSize: 10,
    padding: 8,
  },
  headerCell: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  headingText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },
});

const Dashboard = () => {
  const columns = [
    {width: 120 },
    { field: 'id', headerName: 'Sr. No', width: 120 },
    { field: 'firstname', headerName: 'First Name', width: 200 },
    { field: 'lastname', headerName: 'Last Name', width: 200 },
    { field: 'rollno', headerName: 'Roll No', width: 120 },
    { field: 'prn', headerName: 'PRN No', width: 120 },
    { field: 'score', headerName: 'Score', width: 120 },
    {
      field: 'photo',
      headerName: 'Photo',
      width: 120,
      renderCell: (params) => (
        <button className='view-btn' onClick={() => handleViewPhoto(params.row)}>View</button>
      ),
    },
  ];

  const dataGridRef = useRef(null);
  const componentPDF = useRef(null);
  const [selectedParameters, setSelectedParameters] = useState(new Set(['ALL'])); 
  const [selectedStudentData, setSelectedStudentData] = useState(null);
  const [page, setPage] = useState(1);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://script.google.com/macros/s/AKfycbyTp6QKApgniDdHfoJH3ZodUE0gKiWn4oJLvjluNhB8M8nmISjJgpozuWJUUxwbvGG8/exec');
        const studentsData = response.data.map((row, index) => ({
          id: index + 1,
          firstname: row['First Name'], // Replace 'First Name' with the actual column name in your Google Sheets for First Name
          lastname: row['Last Name'], // Replace 'Last Name' with the actual column name in your Google Sheets for Late Name 
          rollno: row['Roll No'], // Replace 'Roll No' with the actual column name in your Google Sheets for Roll No
          prn: row['prn no'], // Replace 'PRN' with the actual column name in your Google Sheets for PRN
          score: row['Overall Rating'], // Replace 'Score' with the actual column name in your Google Sheets for Score
        }));

        const reorderedStudentsData = studentsData.map(student => ({
          id: student.id,
          firstname: student.firstname,
          lastname: student.lastname,
          rollno: student.rollno,
          prn: student.prn,
          score: student.score,
        }));
        
        setStudents(reorderedStudentsData);
      } catch (error) {
        console.error("There was an error fetching the data:", error);
      }
    };
    fetchData();
  }, []);

  const generatePDF = async () => {
    if (selectedParameters.size === 0 || filterAndSortStudents().length === 0) {
      alert('Please select at least one parameter and ensure that rows are displayed.');
      return;
    }
  
    try {
      const filteredSortedStudents = filterAndSortStudents();
      const MyDocument = (
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.container}>
              <Text style={styles.headingText}>Student Data</Text>
              <View style={styles.table}>
                {/* Header Row */}
                <View style={[styles.row, styles.headerCell]}>
                  {columns
                    .filter((col) => selectedParameters.has('ALL') || selectedParameters.has(col.field))
                    .map((column) => (
                      <Text style={[styles.cell, styles.headerCell]} key={column.field}>
                        {column.headerName}
                      </Text>
                    ))}
                </View>
                {/* Data Rows */}
                {filteredSortedStudents.map((student, index) => (
                  <View style={styles.row} key={index}>
                    {columns
                      .filter((col) => selectedParameters.has('ALL') || selectedParameters.has(col.field))
                      .map((column) => (
                        <Text style={styles.cell} key={`${column.field}-${index}`}>
                          {student[column.field]}
                        </Text>
                      ))}
                  </View>
                ))}
              </View>
            </View>
          </Page>
        </Document>
      );
  
      const blob = await pdf(MyDocument).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'dashboard.pdf';
      link.click();
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert('Failed to generate PDF.');
    }
  };
  

  const handleParameterChange = (param) => {
    setSelectedParameters((prevSelected) => {
      const newSelected = new Set(prevSelected);
  
      if (param === 'ALL') {
        if (newSelected.has('ALL')) {
          newSelected.clear();
        } else {
          ['ALL', 'attendance', 'academics', 'higher studies', 'publication patent', 'hackathon', 'organization', 'arts circle sports', 'internship', 'certificate courses', 'amcat'].forEach((item) => newSelected.add(item));
        }
      } else {
        if (newSelected.has('ALL')) {
          newSelected.clear();
        }
        newSelected.has(param) ? newSelected.delete(param) : newSelected.add(param);
      }
  
      return newSelected;
    });
  };
  
  const handleViewPhoto = (student) => {
    setSelectedStudentData(student);
  };

  const clearSelectedStudentData = () => {
    setSelectedStudentData(null);
  };

  const filterAndSortStudents = () => {
    const filteredStudents = students.filter((student) => {
      if (selectedParameters.has('ALL')) {
        return true;
      }
      return (
        (selectedParameters.has('attendance') && student['attendance']) ||
        (selectedParameters.has('academics') && student.academics) ||
        (selectedParameters.has('higher studies') && student['higher studies']) ||
        (selectedParameters.has('publication patent') && student['publication patent']) ||
        (selectedParameters.has('hackathon') && student.hackathon) ||
        (selectedParameters.has('organization') && student.organization) ||
        (selectedParameters.has('arts circle sports') && student['arts circle sports']) ||
        (selectedParameters.has('internship') && student.internship) ||
        (selectedParameters.has('certificate courses') && student['certificate courses']) ||
        (selectedParameters.has('amcat') && student.amcat)
      );
    });
  
    const sortedStudents = [...filteredStudents].sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
  
    return sortedStudents;
  };
  


  const pageSize = 235;
  const totalStudents = filterAndSortStudents().length;
  const totalPages = Math.ceil(totalStudents / pageSize);

  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalStudents);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', border: '1px solid #ccc', borderRadius: '10px', margin: '10px', textAlign: 'center' }}>
      <div style={{ flex: 0.25 }}>
        <h2>Parameters</h2>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedParameters.has('ALL')}
                onChange={() => handleParameterChange('ALL')}
              />
            }
            label="ALL"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedParameters.has('attendance')}
                onChange={() => handleParameterChange('attendance')}
              />
            }
            label="Attendance"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedParameters.has('academics')}
                onChange={() => handleParameterChange('academics')}
              />
            }
            label="Academics"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedParameters.has('higher studies')}
                onChange={() => handleParameterChange('higher studies')}
              />
            }
            label="Higher studies"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedParameters.has('publication patent')}
                onChange={() => handleParameterChange('publication patent')}
              />
            }
            label="Publication/Patent"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedParameters.has('hackathon')}
                onChange={() => handleParameterChange('hackathon')}
              />
            }
            label="Hackathon"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedParameters.has('organization')}
                onChange={() => handleParameterChange('organization')}
              />
            }
            label="Organization"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedParameters.has('arts circle sports')}
                onChange={() => handleParameterChange('arts circle sports')}
              />
            }
            label="Arts Circle/Sports"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedParameters.has('internship')}
                onChange={() => handleParameterChange('internship')}
              />
            }
            label="Internship"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedParameters.has('certificate courses')}
                onChange={() => handleParameterChange('certificate courses')}
              />
            }
            label="Certificate Courses"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedParameters.has('amcat')}
                onChange={() => handleParameterChange('amcat')}
              />
            }
            label="AMCAT"
          />
        </FormGroup>
      </div>

      <div style={{ flex: 1, marginLeft: '10px', padding: '10px', border: '2px solid #3498db', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h2>Top Students</h2>
        <Button variant="contained" color="primary" onClick={generatePDF}>Download PDF</Button>
      </div>
        {selectedStudentData ? (
          <div>
            <h2>Selected Student Data</h2>
            <p>Roll No: {selectedStudentData.rollno}</p>
            <p>First Name: {selectedStudentData.firstname}</p>
            <p>Last Name: {selectedStudentData.lastname}</p>
            <p>Score: {selectedStudentData.score}</p>
            <p>PRN: {selectedStudentData.prn}</p>
            <button onClick={clearSelectedStudentData}>Close</button>
          </div>
        ) : (
          <div>
            <div ref={componentPDF} style={{ width: '100%' }}>
            <div style={{ height: '100%', width: '100%' }}>
              <DataGrid
                rows={filterAndSortStudents().slice(startIdx, endIdx)}
                columns={columns}
                pageSize={5}
                autoHeight
                disableSelectionOnClick
                pagination
                page={page}
                onPageChange={handlePageChange}
                paginationMode="server"
                rowCount={totalStudents}
                rowsPerPageOptions={[]}
                getRowId={(row) => row.id} // Provide a unique key for each row
              />
            </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// // Sample Data
// const getSampleData = () => {
//   const data = [];
//   const numberOfStudents = 100;

//   for (let i = 1; i <= numberOfStudents; i++) {
//     const rollNo = Math.floor(Math.random() * (33394 - 33101 + 1)) + 33101;

//     const prn = generatePRN();

//     const division = i % 3 === 0 ? '9' : i % 3 === 1 ? '10' : '11';

//     data.push({
//       id: i,
//       rollno: rollNo,
//       prn: prn,
//       name: `Student ${i}`,
//       score: Math.floor(Math.random() * 100),
//       division: division,
//       photo: 'View',
//       attendance: true, // All students have attendance data
//       academics: true,
//       'higher studies': true,
//       'publication patent': true,
//       hackathon: true,
//       organization: true,
//       'arts circle sports': true,
//       internship: true,
//       'certificate courses': true,
//       amcat: true,
//     });
//   }

//   return data;
// };


// const generatePRN = () => {
//   const prnPrefix = '7';
//   const prnSuffix = getRandomLetter();
//   const prnDigits = getRandomDigits(7); // Generate 7 random digits
//   return prnPrefix + prnDigits + prnSuffix;
// };

// const getRandomLetter = () => {
//   const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//   return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
// };

// const getRandomDigits = (length) => {
//   let result = '';
//   const characters = '0123456789';
//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * characters.length));
//   }
//   return result;
// };

export default Dashboard;
