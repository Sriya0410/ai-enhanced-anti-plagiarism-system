import { useEffect, useState } from "react";
import { getActiveDepartments } from "../../api/departmentApi";
import { getErrorMessage } from "../../api/axios";
import { SECTIONS, YEARS } from "../../utils/constants";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";

const RegisterForm = ({ onSubmit, loading = false }) => {
  const [departments, setDepartments] = useState([]);
  const [departmentError, setDepartmentError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    rollNumber: "",
    phone: "",
    year: "",
    section: ""
  });

  const [errors, setErrors] = useState({});

  const departmentOptions = departments.map((department) => ({
    label: `${department.name} (${department.code})`,
    value: department._id
  }));

  const fetchDepartments = async () => {
    try {
      const response = await getActiveDepartments();
      setDepartments(response?.data?.data?.departments || []);
    } catch (error) {
      setDepartmentError(getErrorMessage(error));
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!formData.department) newErrors.department = "Department is required.";
    if (!formData.rollNumber.trim()) newErrors.rollNumber = "Register number is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!formData.year) newErrors.year = "Year is required.";
    if (!formData.section) newErrors.section = "Section is required.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    onSubmit({
      ...formData,
      email: formData.email.trim().toLowerCase(),
      rollNumber: formData.rollNumber.trim().toUpperCase(),
      section: formData.section.trim().toUpperCase(),
      phone: formData.phone.trim()
    });
  };

  return (
    <form className="register-form-grid" onSubmit={handleSubmit}>
      {departmentError && (
        <div className="alert alert-error register-full-row">
          {departmentError}
        </div>
      )}

      <Input
        label="Full Name"
        type="text"
        name="name"
        placeholder="Enter full name"
        value={formData.name}
        error={errors.name}
        onChange={handleChange}
      />

      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="Enter email address"
        value={formData.email}
        error={errors.email}
        onChange={handleChange}
      />

      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="Create password"
        value={formData.password}
        error={errors.password}
        onChange={handleChange}
      />

      <Select
        label="Department"
        name="department"
        placeholder="Select department"
        options={departmentOptions}
        value={formData.department}
        error={errors.department}
        onChange={handleChange}
      />

      <Input
        label="Register Number"
        type="text"
        name="rollNumber"
        placeholder="Example: MCA101"
        value={formData.rollNumber}
        error={errors.rollNumber}
        onChange={handleChange}
      />

      <Input
        label="Phone Number"
        type="text"
        name="phone"
        placeholder="Enter phone number"
        value={formData.phone}
        error={errors.phone}
        onChange={handleChange}
      />

      <Select
        label="Year"
        name="year"
        placeholder="Select year"
        options={YEARS}
        value={formData.year}
        error={errors.year}
        onChange={handleChange}
      />

      <Select
        label="Section"
        name="section"
        placeholder="Select section"
        options={SECTIONS}
        value={formData.section}
        error={errors.section}
        onChange={handleChange}
      />

      <div className="register-full-row">
        <Button type="submit" loading={loading} className="full-width">
          Create Student Account
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;