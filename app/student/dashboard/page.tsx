"use client";

import { useEffect, useState } from "react";
import styles from "./StudentDashboard.module.scss";
import { Bell, LogOut, X } from "lucide-react";
import Link from "next/link";

// -------- Types --------
interface Student {
  id: string;
  name: string;
  regNo: string;
  course: string;
  year: string;
  profileImage: string;
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
  const [student, setStudent] = useState<Student | null>(null);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);

  // 🔹 Modal State
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [purpose, setPurpose] = useState("");

  // 🔹 Simulating DB fetch
  useEffect(() => {
    setStudent({
      id: "STU101",
      name: "Sangam Kumar Mishra",
      regNo: "GECV2021CS045",
      course: "B.Tech Computer Science",
      year: "Final Year",
      profileImage: "/images/student.jpg",
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
  }, []);

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
          <button className={styles.logout}>
            <Link href="/login">
              <LogOut size={16} /> Logout
            </Link>
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
          </div>
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

      {/* ================= MODAL (Purpose Form) ================= */}
      
    </div>
  );
}
