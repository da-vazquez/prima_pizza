"use client";

// Default Imports
import { useState } from "react";
import { useRouter } from "next/navigation";

// Custom Imports
import agent from "../../api/agent";
import globalStyles from "../globals.css";
import { styles } from "./styles";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await agent.Requests.login({ username, password });
      const { access_token } = response.data;

      if (access_token) {
        localStorage.setItem("jwt_token", access_token);
        setSuccess(true);
        setLoading(false);
        router.push("/dashboard");
      }
    } catch {
      setLoading(false);
      setError("Invalid credentials or account does not exist");
    }
  };

  return (
    <div className={globalStyles.page}>
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>Login</h2>
          <form onSubmit={handleLogin} style={{ width: "100%" }}>
            <div style={styles.inputContainer}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputContainer}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Logging In..." : "Login"}
            </button>
          </form>

          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>Login successful!</p>}
        </div>
      </div>
    </div>
  );
};


export default Login;
