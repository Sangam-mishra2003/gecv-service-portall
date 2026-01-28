"use client";

import { useEffect, useState } from "react";
import styles from "./AcademicsDashboard.module.scss";
import { Bell, LogOut, X, Lock, Users, UserPlus, Trash2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserInfo {
  name: string;
  email: string;
  role: string;
  mobile?: string;
}

interface ManagedUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  regNo?: string;
  mobile?: string;
}

export default function AcademicsDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Create User Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<"student" | "faculty">("student");
  const [newUserRegNo, setNewUserRegNo] = useState("");
  const [newUserMobile, setNewUserMobile] = useState("");
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"profile" | "users">("profile");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [router]);

  // Fetch Users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Failed to fetch users");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  // Create User
  const handleCreateUser = async () => {
    setCreateError("");
    setCreateSuccess("");

    if (!newUserName || !newUserEmail || !newUserPassword) {
      setCreateError("Name, email, and password are required");
      return;
    }

    if (newUserRole === "student" && !newUserRegNo) {
      setCreateError("Registration number is required for students");
      return;
    }

    setCreateLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          role: newUserRole,
          regNo: newUserRegNo,
          mobile: newUserMobile,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setCreateSuccess(data.message);
      // Reset form
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserRegNo("");
      setNewUserMobile("");
      // Refresh list
      fetchUsers();
      setTimeout(() => setShowCreateModal(false), 1500);
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  // Delete User
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete "${userName}"?`)) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/users?id=${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error("Failed to delete user");
    }
  };

  // Change Password
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
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!user) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.dashboard}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <h2 className={styles.title}>Academics Dashboard</h2>
        <div className={styles.rightSection}>
          <div className={styles.notification}>
            <Bell size={22} />
            <span className={styles.dot} />
          </div>
          <div className={styles.profile}>
            <div className={styles.avatar}>{user.name.charAt(0).toUpperCase()}</div>
            <div>
              <p className={styles.name}>{user.name}</p>
              <button className={styles.logout} onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "profile" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={`${styles.tab} ${activeTab === "users" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <Users size={18} /> Manage Users
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <section className={styles.infoSection}>
          <h2>Profile Information</h2>
          <div className={styles.infoGrid}>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> Academics</p>
          </div>
          <button className={styles.changePasswordBtn} onClick={() => setShowPasswordModal(true)}>
            <Lock size={16} /> Change Password
          </button>
        </section>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <section className={styles.usersSection}>
          <div className={styles.usersHeader}>
            <h2>Manage Students & Faculty</h2>
            <button className={styles.addBtn} onClick={() => setShowCreateModal(true)}>
              <UserPlus size={18} /> Add User
            </button>
          </div>

          {loadingUsers ? (
            <p>Loading users...</p>
          ) : (
            <table className={styles.usersTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Reg No</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center" }}>No users found</td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td className={styles[u.role]}>{u.role}</td>
                      <td>{u.regNo || "-"}</td>
                      <td>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDeleteUser(u._id, u.name)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </section>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Create New User</h3>
              <button onClick={() => setShowCreateModal(false)}>
                <X />
              </button>
            </div>

            <label>Role *</label>
            <select
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value as "student" | "faculty")}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>

            <label>Name *</label>
            <input
              type="text"
              placeholder="Full name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
            />

            <label>Email *</label>
            <input
              type="email"
              placeholder="Email address"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
            />

            <label>Password *</label>
            <div className={styles.passwordInput}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {newUserRole === "student" && (
              <>
                <label>Registration Number *</label>
                <input
                  type="text"
                  placeholder="e.g., 21105152003"
                  value={newUserRegNo}
                  onChange={(e) => setNewUserRegNo(e.target.value)}
                />
              </>
            )}

            <label>Mobile (Optional)</label>
            <input
              type="text"
              placeholder="Mobile number"
              value={newUserMobile}
              onChange={(e) => setNewUserMobile(e.target.value)}
            />

            {createError && <p className={styles.errorMsg}>{createError}</p>}
            {createSuccess && <p className={styles.successMsg}>{createSuccess}</p>}

            <button
              className={styles.submitBtn}
              onClick={handleCreateUser}
              disabled={createLoading}
            >
              {createLoading ? "Creating..." : "Create User"}
            </button>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)}>
                <X />
              </button>
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
              className={styles.submitBtn}
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
