"use client";

// Default Imports
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// Custom Imports
import globalStyles from "../globals.css";
import { styles } from "./styles";
import Home from "../../components/dashHome";
import ToppingsTable from "../../components/dashToppings";

interface User {
  username: string;
  role: string;
}

interface PizzaToppingData {
  pizzaCount: number;
  toppingCount: number;
}

const DashboardPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>("home");
  const [pizzaToppingData, setPizzaToppingData] = useState<PizzaToppingData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      try {
        const decoded: any = jwtDecode(token);
        const userData = JSON.parse(decoded.sub);

        setUser({
          username: userData.username || "Unknown User",
          role: userData.role || "Unknown Role",
        });
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        router.push("/login");
      }
    }
  }, [router]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const pizzaToppingResponse = await fetch("/api/pizza_topping_count");
        console.log("pizza topping count: ", pizzaToppingResponse)
        
        if (!pizzaToppingResponse.ok) {
          throw new Error(`Error fetching pizza/topping data: ${pizzaToppingResponse.statusText}`);
        }

        const pizzaToppingData = await pizzaToppingResponse.json();
        setPizzaToppingData(pizzaToppingData);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case "home":
        return (
          <Home user={user} pizzaToppingData={pizzaToppingData}/>
        );
      case "modifyPizza":
        // TODO: Create Component
        return <h2>View/Modify Pizza</h2>;
      case "modifyTopping":
        return (
          <ToppingsTable />
        );
      case "accountSettings":
        // TODO: Create Component
        return <h2>Account Settings</h2>;
      default:
        return <h2>Dashboard</h2>;
    }
  };

  return (
    <div className={globalStyles.page}>
      <div style={styles.container}>
        <div style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>Prima Pizza Dashboard</h2>
          {user && (
            <>
              <nav style={styles.nav}>
                <button
                  style={styles.navButton}
                  onClick={() => setCurrentView("home")}
                >
                  Home
                </button>
                <button
                  style={user.role !== "chef" ? styles.navButtonDisabled : styles.navButton}
                  onClick={() => setCurrentView("modifyPizza")}
                  disabled={user.role !== "chef"}
                >
                  View/Modify Pizzas
                </button>
                <button
                  style={user.role !== "owner" ? styles.navButtonDisabled : styles.navButton}
                  onClick={() => setCurrentView("modifyTopping")}
                  disabled={user.role !== "owner"}
                >
                  View/Modify Toppings
                </button>
                <button
                  style={styles.navButton}
                  onClick={() => setCurrentView("accountSettings")}
                >
                  Account Settings
                </button>
              </nav>
            </>
          )}
        </div>

        <div style={styles.mainContent}>
          <div style={styles.card}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};


export default DashboardPage;
