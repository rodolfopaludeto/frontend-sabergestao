import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Radar } from 'react-chartjs-2';
import './index.css'; // Certifique-se de que o arquivo index.css está configurado
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from 'chart.js';

// Registrar componentes do Chart.js
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function App() {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [message, setMessage] = useState('');
    const [newAnalysis, setNewAnalysis] = useState({}); // Para registrar análises

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = () => {
        axios.get('https://sabergestao1.onrender.com/api/students')
            .then(response => setStudents(response.data))
            .catch(error => console.error('Erro ao buscar alunos:', error));
    };

    const handleSelectStudent = (student) => {
        setSelectedStudent(student);
    };

    const handleRegisterAnalysis = () => {
        if (!selectedStudent || Object.keys(newAnalysis).length === 0) {
            setMessage('Selecione um aluno e insira os dados de análise.');
            return;
        }

        axios.post(`https://sabergestao1.onrender.com/api/students/${selectedStudent._id}/analyses`, {
            competencies: newAnalysis
        })
            .then(response => {
                setMessage('Análise registrada com sucesso!');
                fetchStudents(); // Atualiza os dados do aluno
                setNewAnalysis({});
            })
            .catch(error => {
                setMessage('Erro ao registrar análise.');
                console.error('Erro ao registrar análise:', error);
            });
    };

    const getRadarData = () => {
        if (!selectedStudent || !selectedStudent.analyses || selectedStudent.analyses.length === 0) {
            return null;
        }

        const labels = Object.keys(selectedStudent.analyses[0].competencies);
        const datasets = selectedStudent.analyses.map((analysis, index) => ({
            label: `Análise ${index + 1}`,
            data: Object.values(analysis.competencies),
            fill: true,
            backgroundColor: `rgba(${100 + index * 50}, 99, 132, 0.2)`,
            borderColor: `rgba(${100 + index * 50}, 99, 132, 1)`,
            borderWidth: 1,
        }));

        return {
            labels,
            datasets,
        };
    };

    const radarData = getRadarData();

    return (
        <div>
            <h1>Lista de Alunos</h1>
            {message && <p>{message}</p>}

            <ul>
                {students.map(student => (
                    <li key={student._id}>
                        {student.name} - {student.email}
                        <button onClick={() => handleSelectStudent(student)}>Selecionar</button>
                    </li>
                ))}
            </ul>

            {selectedStudent && (
                <div>
                    <h2>Aluno Selecionado: {selectedStudent.name}</h2>

                    <div>
                        <h3>Registrar Nova Análise</h3>
                        <input
                            type="number"
                            placeholder="Gestão"
                            onChange={(e) => setNewAnalysis({ ...newAnalysis, Gestão: parseInt(e.target.value, 10) })}
                        />
                        <input
                            type="number"
                            placeholder="Excelência"
                            onChange={(e) => setNewAnalysis({ ...newAnalysis, Excelência: parseInt(e.target.value, 10) })}
                        />
                        <input
                            type="number"
                            placeholder="Liderança"
                            onChange={(e) => setNewAnalysis({ ...newAnalysis, Liderança: parseInt(e.target.value, 10) })}
                        />
                        <button onClick={handleRegisterAnalysis}>Registrar</button>
                    </div>

                    {radarData ? (
                        <div>
                            <h3>Evolução das Competências</h3>
                            <Radar data={radarData} />
                        </div>
                    ) : (
                        <p>Sem dados de análise para exibir no gráfico</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
