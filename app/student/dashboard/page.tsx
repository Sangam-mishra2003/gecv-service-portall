"use client";

import { useEffect, useState } from "react";
import styles from "./StudentDashboard.module.scss";
import { Bell, LogOut, X, User, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// -------- Types --------
interface Student {
  id: string;
  name: string;
  regNo: string;
  course: string;
  year: string;
  profileImage: string;
  email?: string;
  mobile?: string;
}

interface ServiceRequest {
  id: string;
  serviceType:
    | "Bonafide"
    | "Fee Structure"
    | "NOC"
    | "TC"
    | "No Dues";
  status: "Pending" | "Approved" | "Rejected";
  appliedOn: string;
}

export default function StudentDashboard() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);

  // 🔹 Modal State
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [purpose, setPurpose] = useState("");

  // 🔹 Profile/Password State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // 🔹 Fetch user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    
    const userData = JSON.parse(storedUser);
    setStudent({
      id: "STU101",
      name: userData.name || "Student User",
      regNo: userData.regNo || "N/A",
      course: "B.Tech Computer Science",
      year: "Final Year",
      profileImage: "/images/student.jpg",
      email: userData.email,
      mobile: userData.mobile,
    });

    setRequests([
      {
        id: "REQ1",
        serviceType: "Bonafide",
        status: "Pending",
        appliedOn: "20 Jan 2026",
      },
      {
        id: "REQ2",
        serviceType: "NOC",
        status: "Approved",
        appliedOn: "15 Jan 2026",
      },
    ]);
  }, [router]);

  // 🔹 Send Request Handler
  const handleSendRequest = () => {
    if (!selectedService || !purpose.trim()) return;

    const newRequest: ServiceRequest = {
      id: `REQ${Date.now()}`,
      serviceType: selectedService as any,
      status: "Pending",
      appliedOn: new Date().toLocaleDateString(),
    };

    setRequests((prev) => [newRequest, ...prev]);

    // Reset
    setSelectedService(null);
    setPurpose("");
  };

  // 🔹 Change Password Handler
  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      setPasswordSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setShowPasswordModal(false), 1500);
    } catch (err: any) {
      setPasswordError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  // 🔹 Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className={styles.dashboard}>
      {/* ================= TOP BAR (No Global Header) ================= */}
      <div className={styles.topBar}>
  <h2 className={styles.title}>Student Dashboard</h2>

  <div className={styles.rightSection}>
    <div className={styles.notification}>
      <Bell size={22} />
      <span className={styles.dot} />
    </div>

    {student && (
      <div className={styles.profile}>
        <img src={student.profileImage} alt="Profile" />
        <div>
          <p className={styles.name}>{student.name}</p>
          <button className={styles.logout} onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    )}
  </div>
</div>


      {/* ================= Student Info ================= */}
      {student && (
        <section className={styles.studentInfo}>
          <h2>Basic Information</h2>
          <div className={styles.infoGrid}>
            <p><strong>Registration No:</strong> {student.regNo}</p>
            <p><strong>Course:</strong> {student.course}</p>
            <p><strong>Year:</strong> {student.year}</p>
            {student.email && <p><strong>Email:</strong> {student.email}</p>}
            {student.mobile && <p><strong>Mobile:</strong> {student.mobile}</p>}
          </div>
          <button 
            className={styles.changePasswordBtn}
            onClick={() => setShowPasswordModal(true)}
          >
            <Lock size={16} /> Change Password
          </button>
        </section>
      )}

      {/* ================= Services ================= */}
      <section className={styles.services}>
        <h2>Apply for Services</h2>
        <div className={styles.serviceGrid}>
          {["Bonafide", "Fee Structure", "NOC", "TC", "No Dues"].map((service) => (
            <button
              key={service}
              className={styles.serviceCard}
              onClick={() => setSelectedService(service)}
            >
              {service}
            </button>
          ))}
        </div>
      </section>
      {selectedService && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <button  onClick={() => setSelectedService(null)}>
                <X />
              </button>
              <h3>Apply for {selectedService}</h3>
              
            </div>

            <label>Purpose *</label>
            <textarea
              placeholder="Enter purpose of request..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />

            <button
              className={styles.sendBtn}
              onClick={handleSendRequest}
            >
              Send Request
            </button>
          </div>
        </div>
      )}

      {/* ================= Status ================= */}
      <section className={styles.status}>
        <h2>Request Status</h2>
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Applied On</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.serviceType}</td>
                <td>{req.appliedOn}</td>
                <td className={styles[req.status.toLowerCase()]}>
                  {req.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ================= PASSWORD CHANGE MODAL ================= */}
      {showPasswordModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <button onClick={() => setShowPasswordModal(false)}>
                <X />
              </button>
              <h3>Change Password</h3>
            </div>

            <label>Current Password *</label>
            <input
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <label>New Password *</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <label>Confirm New Password *</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {passwordError && <p className={styles.errorMsg}>{passwordError}</p>}
            {passwordSuccess && <p className={styles.successMsg}>{passwordSuccess}</p>}

            <button
              className={styles.sendBtn}
              onClick={handleChangePassword}
              disabled={passwordLoading}
            >
              {passwordLoading ? "Changing..." : "Change Password"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

