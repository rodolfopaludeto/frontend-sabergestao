import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css'; // Certifique-se de que o arquivo index.css está configurado

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

    useEffect(() => {
        fetchStudents();
    }, []);

    // Busca alunos do backend
    const fetchStudents = () => {
        axios.get('https://sabergestao1.onrender.com/api/students')
            .then(response => setStudents(response.data))
            .catch(error => console.error('Erro ao buscar alunos:', error));
    };

    // Atualiza os dados do formulário
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Envia formulário para criar aluno
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

    // Exclui aluno por ID
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

    // Atualiza o progresso de um aluno
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
            {message && <p className="message">{message}</p>} {/* Exibe mensagens de erro ou sucesso */}
            
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
        </div>
    );
}

export default App;
