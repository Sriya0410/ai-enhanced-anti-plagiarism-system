import { useState } from "react";
import {
  BadgeCheck,
  Crown,
  LockKeyhole,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  Sparkles,
  UserCog,
  UsersRound,
  FileSearch,
  Settings
} from "lucide-react";
import { updateMyProfile } from "../../api/authApi";
import { getErrorMessage } from "../../api/axios";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../context/AuthContext";

const AdminProfile = () => {
  const { user, updateAuthUser, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    designation: user?.designation || "System Administrator"
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getInitials = (name = "") => {
    const initials = name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((item) => item[0]?.toUpperCase())
      .join("");

    return initials || "AD";
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await updateMyProfile({
        name: formData.name,
        phone: formData.phone,
        designation: formData.designation
      });

      const updatedUser = response?.data?.data?.user;

      updateAuthUser(updatedUser);
      await refreshUser();

      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-profile-premium-page">
      

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <section className="admin-profile-hero">
        <div className="admin-profile-hero-content">
          <div className="admin-profile-avatar-premium">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user?.name || "Admin"} />
            ) : (
              <span>{getInitials(user?.name || "Admin User")}</span>
            )}
          </div>

          <div>
            <p className="admin-profile-kicker">
              <Sparkles size={15} />
              Administrator Workspace
            </p>

            <h1>{user?.name || "Admin User"}</h1>

            <p className="admin-profile-subtitle">
              {formData.designation || "System Administrator"} with secure
              access to users, reports, departments, analytics, and system
              settings.
            </p>

            <div className="admin-profile-hero-tags">
              <span>
                <Crown size={15} />
                {user?.role || "ADMIN"}
              </span>

              <span>
                <BadgeCheck size={15} />
                {user?.isActive ? "Active Account" : "Inactive Account"}
              </span>

              <span>
                <LockKeyhole size={15} />
                Protected Access
              </span>
            </div>
          </div>
        </div>

        <div className="admin-profile-access-card">
          <div className="admin-profile-access-icon">
            <ShieldCheck size={27} />
          </div>

          <h3>Full System Access</h3>
          <p>
            You can control users, subjects, departments, submissions,
            plagiarism reports, AI reports, and platform settings.
          </p>
        </div>
      </section>

      <div className="admin-profile-main-grid">
        <aside className="admin-profile-identity-card">
          <div className="identity-card-header">
            <div className="identity-icon">
              <Crown size={22} />
            </div>

            <div>
              <p>Account Identity</p>
              <h3>Admin Access</h3>
            </div>
          </div>

          <div className="identity-detail-list">
            <div>
              <Mail size={18} />
              <div>
                <p>Email Address</p>
                <h4>{user?.email || "No email found"}</h4>
              </div>
            </div>

            <div>
              <Phone size={18} />
              <div>
                <p>Contact Number</p>
                <h4>{formData.phone || "Not added"}</h4>
              </div>
            </div>

            <div>
              <ShieldCheck size={18} />
              <div>
                <p>Access Status</p>
                <h4>{user?.isActive ? "Enabled" : "Disabled"}</h4>
              </div>
            </div>
          </div>
        </aside>

        <section className="admin-profile-edit-card">
          <div className="admin-profile-section-title">
            <div>
              <p>Editable Details</p>
              <h3>Update Administrator Information</h3>
            </div>

            <div className="admin-profile-section-icon">
              <UserCog size={24} />
            </div>
          </div>

          <form className="admin-profile-premium-form" onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
            />

            <Input
              label="Email Address"
              name="email"
              value={user?.email || ""}
              disabled
            />

            <Input
              label="Phone Number"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />

            <Input
              label="Designation"
              name="designation"
              placeholder="Example: System Administrator"
              value={formData.designation}
              onChange={handleChange}
            />

            <div className="admin-profile-form-action">
              <Button type="submit" loading={saving}>
                <Save size={18} />
                Save Profile Changes
              </Button>
            </div>
          </form>
        </section>
      </div>

      <div className="admin-capability-grid">
        <div className="admin-capability-card">
          <div className="admin-capability-icon">
            <UsersRound size={23} />
          </div>

          <h3>User Administration</h3>
          <p>
            Create, update, activate, deactivate, and manage students and
            teachers from one secure admin panel.
          </p>
        </div>

        <div className="admin-capability-card">
          <div className="admin-capability-icon purple">
            <FileSearch size={23} />
          </div>

          <h3>Report Supervision</h3>
          <p>
            Monitor plagiarism scores, AI content reports, submissions, and
            evaluation progress across departments.
          </p>
        </div>

        <div className="admin-capability-card">
          <div className="admin-capability-icon pink">
            <Settings size={23} />
          </div>

          <h3>Platform Control</h3>
          <p>
            Manage departments, subjects, assignments, dashboard analytics, and
            academic workflow settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;