import { useState } from "react";
import {
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  GraduationCap,
  IdCard,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  Sparkles,
  UserCog
} from "lucide-react";
import { updateMyProfile } from "../../api/authApi";
import { getErrorMessage } from "../../api/axios";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { getDepartmentName } from "../../utils/helpers";

const TeacherProfile = () => {
  const { user, updateAuthUser, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    qualification: user?.qualification || "",
    experience: user?.experience || "",
    designation: user?.designation || ""
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

    return initials || "TR";
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
        qualification: formData.qualification,
        experience: formData.experience,
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
    <div className="teacher-profile-page">
      

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <section className="teacher-profile-hero">
        <div className="teacher-profile-hero-content">
          <div className="teacher-profile-avatar">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user?.name || "Teacher"} />
            ) : (
              <span>{getInitials(user?.name || "Teacher")}</span>
            )}
          </div>

          <div>
            <p className="teacher-profile-kicker">
              <Sparkles size={15} />
              Faculty Workspace
            </p>

            <h1>{user?.name || "Teacher User"}</h1>

            <p className="teacher-profile-subtitle">
              {formData.designation || "Faculty Member"} in{" "}
              {getDepartmentName(user?.department)} department.
            </p>

            <div className="teacher-profile-tags">
              <span>
                <GraduationCap size={15} />
                {user?.role || "TEACHER"}
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

        <div className="teacher-profile-hero-card">
          <div className="teacher-profile-hero-icon">
            <ShieldCheck size={27} />
          </div>

          <h3>Faculty Access</h3>
          <p>
            You can create assignments, view submissions, check reports, and
            evaluate student work.
          </p>
        </div>
      </section>

      <div className="teacher-profile-main-grid">
        <aside className="teacher-profile-identity-card">
          <div className="teacher-identity-header">
            <div className="teacher-identity-icon">
              <IdCard size={22} />
            </div>

            <div>
              <p>Teacher Identity</p>
              <h3>Account Details</h3>
            </div>
          </div>

          <div className="teacher-identity-list">
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
                <p>Employee ID</p>
                <h4>{user?.employeeId || "N/A"}</h4>
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

        <section className="teacher-profile-edit-card">
          <div className="teacher-profile-section-title">
            <div>
              <p>Editable Details</p>
              <h3>Update Teacher Information</h3>
            </div>

            <div className="teacher-profile-section-icon">
              <UserCog size={24} />
            </div>
          </div>

          <form className="teacher-profile-form" onSubmit={handleSubmit}>
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

            <Input
              label="Qualification"
              name="qualification"
              placeholder="Example: M.Tech, Ph.D, MCA"
              value={formData.qualification}
              onChange={handleChange}
            />

            <Input
              label="Experience"
              name="experience"
              placeholder="Example: 5 years"
              value={formData.experience}
              onChange={handleChange}
            />

            <Input
              label="Designation"
              name="designation"
              placeholder="Example: Assistant Professor"
              value={formData.designation}
              onChange={handleChange}
            />

            <Input
              label="Email Address"
              name="email"
              value={user?.email || ""}
              disabled
            />

            <div className="teacher-profile-form-action">
              <Button type="submit" loading={saving}>
                <Save size={18} />
                Save Profile Changes
              </Button>
            </div>
          </form>
        </section>
      </div>

      <div className="teacher-capability-grid">
        <div className="teacher-capability-card">
          <div className="teacher-capability-icon">
            <BookOpen size={23} />
          </div>

          <h3>Assignment Management</h3>
          <p>
            Create, publish, close, and manage assignments for your assigned
            subjects.
          </p>
        </div>

        <div className="teacher-capability-card">
          <div className="teacher-capability-icon purple">
            <BriefcaseBusiness size={23} />
          </div>

          <h3>Submission Review</h3>
          <p>
            View student submissions, plagiarism scores, AI-content reports, and
            file details.
          </p>
        </div>

        <div className="teacher-capability-card">
          <div className="teacher-capability-icon pink">
            <GraduationCap size={23} />
          </div>

          <h3>Student Evaluation</h3>
          <p>
            Add marks, write feedback, and complete evaluation after report
            checking.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;