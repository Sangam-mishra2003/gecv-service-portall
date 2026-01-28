"use client";

import styles from "./HostelServices.module.scss";

export default function HostelAgreement() {
  return (
    <div className={styles.agreementSection}>
      <h2>Hostel Agreement</h2>

      <div className={styles.cards}>
        {/* Download Card */}
        <div className={`${styles.card} ${styles.download}`}>
          <h3>Download Agreement</h3>
          <p>
            Download the official hostel agreement, read it carefully, and sign
            it before submission.
          </p>

          <a
            href="/documents/hostel-agreement.pdf"
            download
            className={styles.btn}
          >
            Download Agreement
          </a>
        </div>

        {/* Submit Card */}
        <form className={`${styles.card} ${styles.submit}`}>
          <h3>Submit Signed Agreement</h3>
          <p>
            Upload the signed agreement document (PDF or Image).
          </p>

          <input type="file" accept=".pdf,image/*" required />

          <label className={styles.checkbox}>
            <input type="checkbox" required /> I confirm that I have read and
            signed the hostel agreement.
          </label>

          <button type="submit" className={styles.btn}>
            Submit Agreement
          </button>
        </form>
      </div>
    </div>
  );
}
