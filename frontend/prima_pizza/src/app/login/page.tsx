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

    try {
      const response = await agent.Requests.login({ username, password });
      console.log('Login response:', response); // Add this debug log
      
      if (!response.access_token) {
        throw new Error('No access token received');
      }
      
      localStorage.setItem("token", response.access_token);
      console.log('Stored token:', localStorage.getItem("token")); // Add this debug log
      
      setSuccess("Login successful!");
      setLoading(false);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error);
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
