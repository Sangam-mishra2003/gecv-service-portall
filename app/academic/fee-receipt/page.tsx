"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./FeeReceipt.module.scss";

export default function FeeReceiptFormPage() {
  const router = useRouter();

  const [data, setData] = useState({
    receiptNo: `GEC-${Date.now().toString().slice(-6)}`,
    institute: "GEC VAISHALI",

    studentName: "",
    fatherName: "",
    rollNo: "",
    regNo: "",
    course: "",
    session: "",

    paymentDate: "",
    paymentMode: "",
    transactionId: "",

    admissionFee: "",
    tuitionFee: "",
    registrationFee: "",
    examFee: "",
    developmentFee: "",
    otherFee: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ------------ CHANGE HANDLER ------------ */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Auto uppercase for specific fields
    const uppercaseFields = [
      "studentName",
      "fatherName",
      "rollNo",
      "transactionId",
    ];

    setData({
      ...data,
      [name]: uppercaseFields.includes(name)
        ? value.toUpperCase()
        : value,
    });
  };

  /* ------------ VALIDATION ------------ */
  const validateForm = () => {
    const err: Record<string, string> = {};

    if (!/^[A-Z\s]+$/.test(data.studentName))
      err.studentName = "Student name must contain letters only";

    if (!/^[A-Z\s]+$/.test(data.fatherName))
      err.fatherName = "Father name must contain letters only";

    if (!/^[A-Z0-9]+$/.test(data.rollNo))
      err.rollNo = "Roll No must be alphanumeric";

    if (!/^\d{11}$/.test(data.regNo))
      err.regNo = "Registration No must be exactly 11 digits";

    if (!["B.TECH", "M.TECH"].includes(data.course))
      err.course = "Select B.TECH or M.TECH";

    if (!/^\d{4}-\d{4}$/.test(data.session))
      err.session = "Session format must be YYYY-YYYY";

    if (!data.paymentMode)
      err.paymentMode = "Select payment mode";

    if (
      data.paymentMode === "ONLINE" &&
      !/^[A-Z0-9]+$/.test(data.transactionId)
    )
      err.transactionId = "Valid transaction ID required";

    if (!data.paymentDate)
      err.paymentDate = "Payment date required";
    else if (new Date(data.paymentDate) > new Date())
      err.paymentDate = "Payment date cannot be future";

    const feeFields = [
      "admissionFee",
      "tuitionFee",
      "registrationFee",
      "examFee",
      "developmentFee",
      "otherFee",
    ];

    feeFields.forEach((field) => {
      if (
        (data as any)[field] &&
        !/^\d+$/.test((data as any)[field])
      ) {
        err[field] = "Fee must be numeric";
      }
    });

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ------------ SUBMIT ------------ */
  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    router.push(
      `/academic/fee-receipt/preview?${new URLSearchParams(
        data as any
      ).toString()}`
    );
  };

  return (
    <div className={styles.container}>
      <h1>Fee Receipt Entry</h1>

      <form className={styles.form} onSubmit={handlePreview}>
        <input
          name="studentName"
          placeholder="Student Name"
          pattern="[A-Za-z\s]+"
          onChange={handleChange}
          required
        />
        {errors.studentName && <p className={styles.error}>{errors.studentName}</p>}

        <input
          name="fatherName"
          placeholder="Father Name"
          pattern="[A-Za-z\s]+"
          onChange={handleChange}
          required
        />
        {errors.fatherName && <p className={styles.error}>{errors.fatherName}</p>}

        <input
          name="rollNo"
          placeholder="Roll No"
          pattern="[A-Za-z0-9]+"
          onChange={handleChange}
          required
        />
        {errors.rollNo && <p className={styles.error}>{errors.rollNo}</p>}

        <input
          name="regNo"
          placeholder="Registration No (11 digits)"
          pattern="\d{11}"
          maxLength={11}
          onChange={handleChange}
          required
        />
        {errors.regNo && <p className={styles.error}>{errors.regNo}</p>}

        <select name="course" onChange={handleChange} required>
          <option value="">Select Course</option>
          <option value="B.TECH">B.TECH</option>
          <option value="M.TECH">M.TECH</option>
        </select>
        {errors.course && <p className={styles.error}>{errors.course}</p>}

        <input
          name="session"
          placeholder="Session (2025-2029)"
          pattern="\d{4}-\d{4}"
          onChange={handleChange}
          required
        />
        {errors.session && <p className={styles.error}>{errors.session}</p>}

        <select name="paymentMode" onChange={handleChange} required>
          <option value="">Payment Mode</option>
          <option value="CASH">CASH</option>
          <option value="ONLINE">ONLINE</option>
        </select>
        {errors.paymentMode && <p className={styles.error}>{errors.paymentMode}</p>}

        {data.paymentMode === "ONLINE" && (
          <input
            name="transactionId"
            placeholder="Transaction ID"
            pattern="[A-Za-z0-9]+"
            onChange={handleChange}
            required
          />
        )}
        {errors.transactionId && <p className={styles.error}>{errors.transactionId}</p>}

        <label>Payment Date</label>
        <input
          type="date"
          name="paymentDate"
          max={new Date().toISOString().split("T")[0]}
          onChange={handleChange}
          required
        />
        {errors.paymentDate && <p className={styles.error}>{errors.paymentDate}</p>}

        <input name="admissionFee" placeholder="Admission Fee" pattern="\d+" onChange={handleChange} />
        <input name="tuitionFee" placeholder="Tuition Fee" pattern="\d+" onChange={handleChange} />
        <input name="registrationFee" placeholder="Registration Fee" pattern="\d+" onChange={handleChange} />
        <input name="examFee" placeholder="Exam Fee" pattern="\d+" onChange={handleChange} />
        <input name="developmentFee" placeholder="Development Fee" pattern="\d+" onChange={handleChange} />
        <input name="otherFee" placeholder="Other Fee" pattern="\d+" onChange={handleChange} />

        <button type="submit">Preview & Generate PDF</button>
      </form>
    </div>
  );
}
