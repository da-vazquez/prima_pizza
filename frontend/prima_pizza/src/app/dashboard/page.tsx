"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

// Custom Imports
import globalStyles from "../globals.css";
import { styles } from "./styles";
import Home from "../../components/dashHome";
import ToppingsTable from "../../components/dashToppings";
import PizzaTable from "@/components/dashPizza";

/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>("home");
  const [pizzaToppingData, setPizzaToppingData] = useState<PizzaToppingData | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      setUser({
        username: session.user.name || "Unknown User",
        role: session.user.role || "Unknown Role",
      });
    }
  }, [session]);

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const renderContent = () => {
    switch (currentView) {
      case "home":
        return <Home user={user} pizzaToppingData={pizzaToppingData} />;
      case "modifyPizza":
        return <PizzaTable />;
      case "modifyTopping":
        return <ToppingsTable />;
      case "accountSettings":
        return <h2>Coming soon!</h2>;
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
