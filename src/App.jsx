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
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
        receiveWhatsApp: false,
        competencies: ''
    });
    const [message, setMessage] = useState(''); // Para exibir mensagens de erro ou sucesso
    const [chartData, setChartData] = useState(null); // Dados do Radar Chart

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = () => {
        axios.get('https://sabergestao1.onrender.com/api/students')
            .then(response => {
                setStudents(response.data);
                prepareChartData(response.data);
            })
            .catch(error => console.error('Erro ao buscar alunos:', error));
    };

    const prepareChartData = (students) => {
        if (students.length === 0) {
            setChartData(null);
            return;
        }

        // Apenas o primeiro aluno como exemplo
        const student = students[0];

        const data = {
            labels: Object.keys(student.progress || {}),
            datasets: [
                {
                    label: `Progresso de ${student.name}`,
                    data: Object.values(student.progress || {}),
                    backgroundColor: 'rgba(75,192,192,0.2)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 2
                }
            ]
        };

        setChartData(data);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const competenciesArray = formData.competencies.split(',').map(item => item.trim());
        axios.post('https://sabergestao1.onrender.com/api/students', {
            ...formData,
            competencies: competenciesArray
        })
            .then(() => {
                setMessage('Aluno cadastrado com sucesso!');
                setFormData({ name: '', email: '', whatsapp: '', receiveWhatsApp: false, competencies: '' });
                fetchStudents();
            })
            .catch(error => {
                if (error.response && error.response.status === 409) {
                    setMessage('Erro: Email ou WhatsApp já cadastrado!');
                } else {
                    setMessage('Erro ao cadastrar aluno.');
                }
                console.error('Erro ao cadastrar aluno:', error);
            });
    };

    const handleDelete = (id) => {
        axios.delete(`https://sabergestao1.onrender.com/api/students/${id}`)
            .then(() => {
                setMessage('Aluno excluído com sucesso!');
                fetchStudents();
            })
            .catch(error => {
                setMessage('Erro ao excluir aluno.');
                console.error('Erro ao excluir aluno:', error);
            });
    };

    const handleUpdateProgress = (id) => {
        const gestao = parseInt(prompt('Digite o progresso para Gestão (0-100):'), 10);
        const excelencia = parseInt(prompt('Digite o progresso para Excelência (0-100):'), 10);

        if (isNaN(gestao) || isNaN(excelencia)) {
            alert('Por favor, insira valores válidos!');
            return;
        }

        const progress = {
            Gestão: gestao,
            Excelência: excelencia
        };

        axios.patch(`https://sabergestao1.onrender.com/api/students/${id}/progress`, { progress })
            .then(() => {
                setMessage('Progresso atualizado com sucesso!');
                fetchStudents();
            })
            .catch(error => {
                setMessage('Erro ao atualizar progresso.');
                console.error('Erro ao atualizar progresso:', error);
            });
    };

    return (
        <div>
            <h1>Lista de Alunos</h1>
            {message && <p>{message}</p>} {/* Exibe mensagens de erro ou sucesso */}
            
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nome"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="E-mail"
                    required
                />
                <input
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="WhatsApp"
                />
                <label>
                    <input
                        type="checkbox"
                        name="receiveWhatsApp"
                        checked={formData.receiveWhatsApp}
                        onChange={handleChange}
                    />
                    Receber notificações pelo WhatsApp
                </label>
                <input
                    type="text"
                    name="competencies"
                    value={formData.competencies}
                    onChange={handleChange}
                    placeholder="Competências (separadas por vírgula)"
                />
                <button type="submit">Cadastrar Aluno</button>
            </form>

            <ul>
                {students.map(student => (
                    <li key={student._id}>
                        {student.name} - {student.email}
                        <button onClick={() => handleUpdateProgress(student._id)}>Atualizar Progresso</button>
                        <button onClick={() => handleDelete(student._id)}>Excluir</button>
                    </li>
                ))}
            </ul>

            {chartData ? (
                <div>
                    <h2>Radar Chart</h2>
                    <Radar data={chartData} />
                </div>
            ) : (
                <p>Sem dados para exibir no gráfico</p>
            )}
        </div>
    );
}

export default App;
