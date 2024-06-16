import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BarChart({ labelData, valueData }) {
  console.log(valueData);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Persebaran Perkerasan Jalan",
      },
    },
  };

  const labels = labelData;

  const data = {
    labels,
    datasets: [
      {
        label: "Jumlah Jalan",
        data: valueData,
        backgroundColor: "rgba(255, 99, 132, 0.8)",
      },
    ],
  };
  return <Bar options={options} data={data} />;
}
