import { useState } from "react";
import {
  BadgeCheck,
  BookOpen,
  GraduationCap,
  IdCard,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  Sparkles,
  UserCog,
  ClipboardList,
  FileCheck
} from "lucide-react";
import { updateMyProfile } from "../../api/authApi";
import { getErrorMessage } from "../../api/axios";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { SECTIONS, YEARS } from "../../utils/constants";
import { getDepartmentName } from "../../utils/helpers";

const StudentProfile = () => {
  const { user, updateAuthUser, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    year: user?.year || "",
    section: user?.section || ""
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

    return initials || "ST";
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
        year: formData.year,
        section: formData.section
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
    <div className="student-profile-page">
      
      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <section className="student-profile-hero">
        <div className="student-profile-hero-content">
          <div className="student-profile-avatar">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user?.name || "Student"} />
            ) : (
              <span>{getInitials(user?.name || "Student")}</span>
            )}
          </div>

          <div>
            <p className="student-profile-kicker">
              <Sparkles size={15} />
              Student Workspace
            </p>

            <h1>{user?.name || "Student User"}</h1>

            <p className="student-profile-subtitle">
              {getDepartmentName(user?.department)} student from Year{" "}
              {formData.year || "N/A"}, Section {formData.section || "N/A"}.
            </p>

            <div className="student-profile-tags">
              <span>
                <GraduationCap size={15} />
                {user?.role || "STUDENT"}
              </span>

              <span>
                <BadgeCheck size={15} />
                {user?.isActive ? "Active Account" : "Inactive Account"}
              </span>

              <span>
                <BookOpen size={15} />
                Assignment Access
              </span>
            </div>
          </div>
        </div>

        <div className="student-profile-hero-card">
          <div className="student-profile-hero-icon">
            <ShieldCheck size={27} />
          </div>

          <h3>Student Access</h3>
          <p>
            You can view assignments, submit files, check plagiarism reports,
            AI-content scores, marks, and feedback.
          </p>
        </div>
      </section>

      <div className="student-profile-main-grid">
        <aside className="student-profile-identity-card">
          <div className="student-identity-header">
            <div className="student-identity-icon">
              <IdCard size={22} />
            </div>

            <div>
              <p>Student Identity</p>
              <h3>Account Details</h3>
            </div>
          </div>

          <div className="student-identity-list">
            <div>
              <Mail size={18} />
              <div>
                <p>Email Address</p>
                <h4>{user?.email || "No email found"}</h4>
              </div>
            </div>

            <div>
              <BookOpen size={18} />
              <div>
                <p>Department</p>
                <h4>{getDepartmentName(user?.department)}</h4>
              </div>
            </div>

            <div>
              <IdCard size={18} />
              <div>
                <p>Roll Number</p>
                <h4>{user?.rollNumber || "N/A"}</h4>
              </div>
            </div>

            <div>
              <Phone size={18} />
              <div>
                <p>Contact Number</p>
                <h4>{formData.phone || "Not added"}</h4>
              </div>
            </div>
          </div>
        </aside>

        <section className="student-profile-edit-card">
          <div className="student-profile-section-title">
            <div>
              <p>Editable Details</p>
              <h3>Update Student Information</h3>
            </div>

            <div className="student-profile-section-icon">
              <UserCog size={24} />
            </div>
          </div>

          <form className="student-profile-form" onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
            />

            <Input
              label="Phone Number"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />

            <Select
              label="Year"
              name="year"
              placeholder="Select year"
              options={YEARS}
              value={formData.year}
              onChange={handleChange}
            />

            <Select
              label="Section"
              name="section"
              placeholder="Select section"
              options={SECTIONS}
              value={formData.section}
              onChange={handleChange}
            />

            <Input
              label="Email Address"
              name="email"
              value={user?.email || ""}
              disabled
            />

            <Input
              label="Roll Number"
              name="rollNumber"
              value={user?.rollNumber || "N/A"}
              disabled
            />

            <div className="student-profile-form-action">
              <Button type="submit" loading={saving}>
                <Save size={18} />
                Save Profile Changes
              </Button>
            </div>
          </form>
        </section>
      </div>

      <div className="student-capability-grid">
        <div className="student-capability-card">
          <div className="student-capability-icon">
            <ClipboardList size={23} />
          </div>

          <h3>Assignment Tracking</h3>
          <p>
            View published assignments from your department and track pending
            academic tasks.
          </p>
        </div>

        <div className="student-capability-card">
          <div className="student-capability-icon purple">
            <FileCheck size={23} />
          </div>

          <h3>Submission Reports</h3>
          <p>
            Upload assignment files and review plagiarism score, AI-content
            score, and report status.
          </p>
        </div>

        <div className="student-capability-card">
          <div className="student-capability-icon pink">
            <GraduationCap size={23} />
          </div>

          <h3>Feedback & Marks</h3>
          <p>
            Check teacher evaluation, marks, comments, and improvement feedback
            after submission review.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;