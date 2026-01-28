"use client";

import { useState } from "react";
import styles from "./HostelServices.module.scss";
import HostelAgreement from "./HostelAgreement";


type ServiceType =
  | ""
  | "allotment"
  | "agreement"
  | "hostelPayment"
  | "messPayment";

export default function HostelServicesPage() {
  const [service, setService] = useState<ServiceType>("");

  return (
    <section className={styles.hostelServices}>
      <h1>Hostel Services</h1>

      {/* Service Selection */}
      <div className={styles.serviceSelect}>
        <label>Select Service Type *</label>
        <select
          value={service}
          onChange={(e) => setService(e.target.value as ServiceType)}
          required
        >
          <option value="">-- Select Service --</option>
          <option value="allotment">Hostel Allotment Request</option>
          <option value="agreement">Hostel Agreement</option>
          {/* <option value="hostelPayment">Hostel Payment</option>
          <option value="messPayment">Mess Payment</option> */}
        </select>
      </div>

      {/* Allotment Form */}
      {service === "allotment" && (
        <form className={styles.form}>
          <h2>Hostel Allotment Application</h2>

          {/* Personal Details */}
          <fieldset>
            <legend>Personal Details</legend>

            <input required placeholder="Full Name" />
            <input required placeholder="Registration / Roll Number" />
            <input required placeholder="Application Number" />

            <select required>
              <option value="">Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <input type="date" required max={new Date().toISOString().split("T")[0]} />

            <select required>
              <option value="">Category</option>
              <option>General</option>
              <option>OBC</option>
              <option>SC</option>
              <option>ST</option>
              <option>EWS</option>
            </select>

            <input required placeholder="Nationality" />
            <input required placeholder="Blood Group" />
            <input
              required
              placeholder="Aadhaar Number"
              pattern="[0-9]{12}"
              title="Aadhaar must be 12 digits"
            />
          </fieldset>

          {/* Academic Details */}
          <fieldset>
            <legend>Academic Details</legend>

            <input required placeholder="College / University Name" />
            <input required placeholder="Course" />
            <input required placeholder="Branch / Specialization" />
            <input required placeholder="Year / Semester" />
            <input required placeholder="Academic Session (e.g., 2025–26)" />

            <select required>
              <option value="">Mode of Admission</option>
              <option>Entrance</option>
              <option>Direct</option>
              <option>Lateral</option>
            </select>
          </fieldset>

          {/* Address */}
          <fieldset>
            <legend>Residential Address</legend>

            <textarea required placeholder="Permanent Address" />
            <input required placeholder="Village / City" />
            <input required placeholder="District" />
            <input required placeholder="State" />
            <input
              required
              placeholder="PIN Code"
              pattern="[0-9]{6}"
              title="PIN must be 6 digits"
            />
          </fieldset>

          {/* Parent / Guardian */}
          <fieldset>
            <legend>Parent / Guardian Details</legend>

            <input required placeholder="Father’s Name" />
            <input required placeholder="Mother’s Name" />
            <input placeholder="Guardian’s Name (if any)" />
            <input required placeholder="Occupation" />

            <input
              required
              placeholder="Mobile Number"
              pattern="[0-9]{10}"
              title="Enter valid 10-digit number"
            />
            <input placeholder="Alternate Contact Number" />
            <input required type="email" placeholder="Email ID" />
          </fieldset>

          {/* Hostel Preference */}
          <fieldset>
            <legend>Hostel Preference</legend>

            <select required>
              <option value="">Hostel Type</option>
              <option>Boys</option>
              <option>Girls</option>
            </select>

            <select required>
              <option value="">Room Preference</option>
              <option>Single</option>
              <option>Double</option>
              <option>Triple</option>
            </select>

            <input placeholder="Floor Preference (optional)" />
          </fieldset>

          {/* Uploads */}
          <fieldset>
            <legend>Uploads</legend>

            <label>
              Passport Size Photograph *
              <input type="file" accept="image/*" required />
            </label>

            <label>
              Aadhaar Card (PDF/JPG) *
              <input type="file" accept=".pdf,image/*" required />
            </label>

            <label>
              College ID / Admission Letter *
              <input type="file" accept=".pdf,image/*" required />
            </label>
          </fieldset>

          {/* Declaration */}
          <div className={styles.declaration}>
            <label>
              <input type="checkbox" required /> I hereby declare that the
              information provided above is true and I agree to follow hostel
              rules.
            </label>
          </div>

          <button type="submit">Submit Application</button>
        </form>
      )}
      {service === "agreement" && <HostelAgreement />}

    </section>
  );
}
