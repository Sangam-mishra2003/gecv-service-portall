"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import animationData from "@/public/lottie/login.json";
import styles from "../signup/Signup.module.scss";

type Role = "student" | "faculty" | "academics";

export default function SignupPage() {
  const [role, setRole] = useState<Role>("student");

  return (
    <section className={styles.sinup}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.container}
      >
        {/* LEFT – LOTTIE */}
        <div className={styles.left} >
          <Lottie animationData={animationData} loop />
        </div>

        {/* RIGHT – FORM */}
        <div className={styles.right}>
          <div className={styles.container}>
            {/* HEADER */}
            <div className={styles.header}>
              <h1>Create Account</h1>
              <p>Register as Student, Faculty, or Academics</p>
            </div>

            {/* ROLE SELECT */}
            <div className={styles.roleSelect}>
              {(["student", "faculty", "academics"] as Role[]).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={`${styles.roleBtn} ${
                    role === r ? styles.active : ""
                  }`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>

            {/* FORM */}
            <form className={styles.form}>
              <Field label="Full Name" />
              <Field label="Email Address" type="email" />
              <Field label="Mobile Number" type="tel" pattern="[0-9]{10}" />
              <Field label="Date of Birth" type="date" hasValue />
              <Field label="Father’s Name" />

              <AnimatePresence>
                {role !== "faculty" && role !== "academics" && (
                  <motion.div
                    className={styles.group}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Field label="Registration Number" />
                    <Field label="Roll Number" />
                  </motion.div>
                )}
              </AnimatePresence>

              <Field label="Password" type="password" minLength={8} />

              <div className={styles.submitWrap}>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={styles.submit}
                  type="submit"
                >
                  Create Account
                </motion.button>
              </div>

              <p className={styles.note}>
                By registering, you agree to institutional policies.
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ---------------- COMPONENT ---------------- */

function Field({
  label,
  type = "text",
  hasValue = false,
  ...props
}: {
  label: string;
  type?: string;
  hasValue?: boolean;
  [key: string]: any;
}) {
  return (
    <div className={styles.field}>
      <input type={type} required placeholder=" " {...props} />
      <label className={hasValue ? styles.fixedLabel : ""}>{label}</label>
    </div>
  );
}
