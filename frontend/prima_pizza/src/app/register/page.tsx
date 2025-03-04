"use client";

// Custom Imports

import globalStyles from "../globals.css";
import { styles } from "./styles";
import { useRouter } from "next/navigation";

const Register = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.push("/");
  };

  return (
    <div className={globalStyles.page}>
      <div style={styles.container}>
        <div style={styles.card}>
          <p>
            Registration not available for demo, please see documentation and search "Credentials for Demo"{" "}
            <a href="https://github.com/da-vazquez/prima_pizza/blob/main/frontend/prima_pizza/README.md" target="_blank" rel="noopener noreferrer">
              <strong style={{color: "limegreen"}}>here</strong>
            </a>
          </p>
          <button onClick={handleBackClick} style={styles.button}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
