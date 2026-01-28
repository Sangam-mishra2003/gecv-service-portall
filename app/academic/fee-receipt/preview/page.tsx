"use client";

import { useSearchParams } from "next/navigation";
import { generateFeeReceiptPDF } from "@/app/utils/generateFeeReceiptPDF";

export default function PreviewPage() {
  const params = useSearchParams();
  const data = Object.fromEntries(params.entries());

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Fee Receipt Preview</h2>

        <div style={styles.grid}>
          <div>
            <p><span style={styles.label}>Receipt No:</span> {data.receiptNo}</p>
            <p><span style={styles.label}>Student Name:</span> {data.studentName}</p>
            <p><span style={styles.label}>Father’s Name:</span> {data.fatherName}</p>
            <p><span style={styles.label}>Roll No:</span> {data.rollNo}</p>
          </div>

          <div>
            <p><span style={styles.label}>Course:</span> {data.course}</p>
            <p><span style={styles.label}>Session:</span> {data.session}</p>
            <p><span style={styles.label}>Payment Mode:</span> {data.paymentMode}</p>
            <p><span style={styles.label}>Transaction ID:</span> {data.transactionId}</p>
          </div>
        </div>

        <hr style={styles.divider} />

        <button
          onClick={() => generateFeeReceiptPDF(data)}
          style={styles.button}
        >
          Download / Print PDF
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f4f6f8",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "40px",
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: "750px",
    padding: "30px 40px",
    borderRadius: "8px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  heading: {
    textAlign: "center" as const,
    marginBottom: "30px",
    fontSize: "22px",
    letterSpacing: "0.5px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    fontSize: "15px",
    lineHeight: "1.8",
  },
  label: {
    fontWeight: 600,
  },
  divider: {
    margin: "30px 0",
    border: "none",
    borderTop: "1px solid #ddd",
  },
  button: {
    display: "block",
    margin: "0 auto",
    padding: "12px 28px",
    fontSize: "15px",
    fontWeight: 600,
    backgroundColor: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
