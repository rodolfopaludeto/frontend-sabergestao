import React from 'react';
import { Radar } from 'react-chartjs-2';

function RadarChart({ progress }) {
    // Dados do gráfico
    const data = {
        labels: Object.keys(progress),
        datasets: [
            {
                label: 'Progresso do Aluno (%)',
                data: Object.values(progress),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
            },
        ],
    };

    // Configurações do gráfico
    const options = {
        scale: {
            ticks: { beginAtZero: true, max: 100 },
        },
        responsive: true,
    };

    return (
        <div>
            <h3>Progresso do Aluno</h3>
            <Radar data={data} options={options} />
        </div>
    );
}

export default RadarChart;
