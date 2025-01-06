import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get('https://sabergestao1.onrender.com/api/students')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar alunos:', error);
      });
  }, []);

  return (
    <div>
      <h1>Lista de Alunos</h1>
      <ul>
        {students.map(student => (
          <li key={student._id}>{student.name} - {student.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

