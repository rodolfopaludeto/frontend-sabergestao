import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
        receiveWhatsApp: false,
        competencies: ''
    });

    useEffect(() => {
        axios.get('https://sabergestao1.onrender.com/api/students')
            .then(response => setStudents(response.data))
            .catch(error => console.error('Erro ao buscar alunos:', error));
    }, []);

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
                setFormData({ name: '', email: '', whatsapp: '', receiveWhatsApp: false, competencies: '' });
                axios.get('https://sabergestao1.onrender.com/api/students')
                    .then(response => setStudents(response.data));
            })
            .catch(error => console.error('Erro ao cadastrar aluno:', error));
    };

    return (
        <div>
            <h1>Lista de Alunos</h1>
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
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
