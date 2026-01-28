
"use client";

import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import styles from "./LoginModal.module.scss";
import animationData from "../public/lottie/login.json";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginModal({
  role,
  onClose,
}: {
  role: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/student-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ regNo, password }),
    });

    if (!res.ok) {
      setError("Invalid Registration Number or Password");
      return;
    }

    const data = await res.json();

    // 🔐 Store session (basic demo)
    localStorage.setItem("student", JSON.stringify(data.student));

    onClose();
    router.push("/student/dashboard");
  };

  return (
    <AnimatePresence>
      <motion.div
        className={styles.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={styles.modal}
          initial={{ scale: 0.95, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 40 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className={styles.close} onClick={onClose}>✕</button>

          <div className={styles.modalGrid}>
            <div className={styles.lottieBox}>
              <Lottie animationData={animationData} loop />
            </div>

            <div className={styles.formBox}>
              <h2 className={styles.title}>{role} Login</h2>

              <form className={styles.form} onSubmit={handleLogin}>
                <input
                  placeholder="Registration Number"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {error && <p className={styles.error}>{error}</p>}

                <button type="submit">
                  <Link href="/student/dashboard">Sign In</Link>
                </button>

                 <Link href="/student/dashboard">Sign In</Link>
                 <Link href="/academic/bonafide">bonafide</Link>
                 <Link href="/academic/fee-receipt">feeStructure</Link>
              </form>

              <p className={styles.hint}>
                Default Password: <b>student@123</b>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

