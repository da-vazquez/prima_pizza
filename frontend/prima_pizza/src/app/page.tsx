"use client";

// Default Imports
import Image from "next/image";
import Link from "next/link";

// Custom Imports
import styles from "./page.module.css";


export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.logoContainer}>
          <Image
            src="/images/new_logo.png"
            alt="Pizza Logo"
            width={200}
            height={200}
          />

          <h1>Welcome to Prima Pizza!</h1>
          <br/>
          <h3>Create an account for <strong style={{color: "limegreen", fontWeight: 800}}>free</strong></h3>
        </div>

        <div className={styles.buttonsContainer}>
          <Link href="/login">
            <button className={styles.loginButton}>Go to Login</button>
          </Link>
          
          <span style={{marginRight: "10px"}}>or</span>

          <Link href="/register">
            <button className={styles.registerButton}>Register</button>
          </Link>
        </div>
      </main>
    </div>
  );
}
