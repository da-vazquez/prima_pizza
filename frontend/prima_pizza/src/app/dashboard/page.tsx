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
import PizzaTable from "../../components/dashPizza";
import agent from "../../api/agent";


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
  const [refreshData, setRefreshData] = useState(false);

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
        console.log("Invalid token:", error);
        localStorage.removeItem("token");
        router.push("/login");
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pizzaToppingData = await agent.Requests.getDashboardStats();
        setPizzaToppingData(pizzaToppingData);
      } catch (error) {
        console.log("Error fetching data:", error);
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
        return (
          <PizzaTable />
        );
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
                  onClick={() => {
                    setCurrentView("modifyPizza");
                    setRefreshData(!refreshData);
                  }}
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
                <button
                  style={styles.navButtonLogout}
                  onClick={handleLogout}
                >
                  Logout
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
