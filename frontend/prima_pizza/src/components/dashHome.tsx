// Default Imports
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

// Custom Imports
import { styles } from "./styles";
import Card from "./card";

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Home = ({ user }) => {
  const [pizzaToppingData, setPizzaToppingData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/v1/dashboard/pizza_topping_count`);
        if (!response.ok) {
          throw new Error("Error fetching pizza and topping data");
        }
        const data = await response.json();
        setPizzaToppingData(data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const chartData = pizzaToppingData
    ? {
        labels: ["Pizzas", "Toppings", "Meat", "Cheese", "Vegetables", "Sauces"],
        datasets: [
          {
            label: "Topping Counts",
            data: [
              pizzaToppingData.pizzas,
              pizzaToppingData.toppings,
              pizzaToppingData.meats || 0,
              pizzaToppingData.cheeses || 0,
              pizzaToppingData.vegetables || 0,
              pizzaToppingData.sauces || 0,
            ],
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 1,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div>
      <p style={styles.welcomeMessage}>Welcome {user?.username.toUpperCase()}!</p>
      <button disabled={true} 
        style={styles.roleBadge}
        >
          {user?.role}
        </button>

      <div style={styles.statsContainer}>
        <h3>Pizza & Topping Statistics</h3>
        {pizzaToppingData ? (
          <div>
            <div style={styles.cardContainer}>
              <Card pizzaToppingData={pizzaToppingData} typeData="pizzas" />
              <Card pizzaToppingData={pizzaToppingData} typeData="toppings" />
              <Card pizzaToppingData={pizzaToppingData} typeData="meats" />
              <Card pizzaToppingData={pizzaToppingData} typeData="vegetables" />
              <Card pizzaToppingData={pizzaToppingData} typeData="sauces" />
              <Card pizzaToppingData={pizzaToppingData} typeData="cheeses" />
              <Card pizzaToppingData={pizzaToppingData} typeData="crusts" />
            </div>

            {chartData && (
              <div style={styles.chartContainer}>
                <h4>Statistics Overview</h4>
                <Bar data={chartData} options={chartOptions} />
              </div>
            )}
          </div>
        ) : (
          <p>Loading pizza and topping data...</p>
        )}
      </div>
    </div>
  );
};


export default Home;
