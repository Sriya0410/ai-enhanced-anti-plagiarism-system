import { useEffect, useMemo, useState } from "react";
import { getDepartments } from "../../api/departmentApi";
import { getErrorMessage } from "../../api/axios";
import { ROLES, SECTIONS, YEARS } from "../../utils/constants";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";

const UserForm = ({
  initialData = null,
  defaultRole = ROLES.STUDENT,
  onSubmit,
  loading = false,
  submitText = "Save User"
}) => {
  const [departments, setDepartments] = useState([]);
  const [fetchError, setFetchError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: defaultRole,
    department: "",
    rollNumber: "",
    year: "",
    section: "",
    phone: "",
    employeeId: "",
    qualification: "",
    experience: "",
    designation: "",
    isActive: true
  });

  const [errors, setErrors] = useState({});

  const isEdit = Boolean(initialData?._id);

  const departmentOptions = departments.map((department) => ({
    label: `${department.name} (${department.code})`,
    value: department._id
  }));

  const roleOptions = [
    { label: "Admin", value: ROLES.ADMIN },
    { label: "Teacher", value: ROLES.TEACHER },
    { label: "Student", value: ROLES.STUDENT }
  ];

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      setDepartments(response?.data?.data?.departments || []);
    } catch (error) {
      setFetchError(getErrorMessage(error));
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        name: initialData.name || "",
        email: initialData.email || "",
        role: initialData.role || defaultRole,
        department: initialData.department?._id || initialData.department || "",
        rollNumber: initialData.rollNumber || "",
        year: initialData.year || "",
        section: initialData.section || "",
        phone: initialData.phone || "",
        employeeId: initialData.employeeId || "",
        qualification: initialData.qualification || "",
        experience: initialData.experience || "",
        designation: initialData.designation || "",
        isActive: initialData.isActive ?? true
      }));
    }
  }, [initialData, defaultRole]);

  const currentRole = useMemo(() => formData.role, [formData.role]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "isActive" ? value === "true" : value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    }

    if (!isEdit && !formData.password.trim()) {
      newErrors.password = "Password is required.";
    }

    if (!isEdit && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (currentRole === ROLES.STUDENT) {
      if (!formData.department) {
        newErrors.department = "Department is required.";
      }

      if (!formData.rollNumber.trim()) {
        newErrors.rollNumber = "Roll number is required.";
      }

      if (!formData.year) {
        newErrors.year = "Year is required.";
      }

      if (!formData.section) {
        newErrors.section = "Section is required.";
      }
    }

    if (currentRole === ROLES.TEACHER && !formData.department) {
      newErrors.department = "Department is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const cleanPayload = () => {
    const payload = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      phone: formData.phone,
      isActive: formData.isActive
    };

    if (!isEdit) {
      payload.password = formData.password;
    }

    if (currentRole === ROLES.STUDENT) {
      payload.department = formData.department;
      payload.rollNumber = formData.rollNumber;
      payload.year = formData.year;
      payload.section = formData.section;
    }

    if (currentRole === ROLES.TEACHER) {
      payload.department = formData.department;
      payload.employeeId = formData.employeeId || undefined;
      payload.qualification = formData.qualification;
      payload.experience = formData.experience;
      payload.designation = formData.designation;
    }

    if (currentRole === ROLES.ADMIN) {
      payload.designation = formData.designation || "System Administrator";
    }

    return payload;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit(cleanPayload());
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      {fetchError && <div className="alert alert-error">{fetchError}</div>}

      <div className="form-grid two">
        <Input
          label="Full Name"
          type="text"
          name="name"
          value={formData.name}
          error={errors.name}
          onChange={handleChange}
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          error={errors.email}
          onChange={handleChange}
        />
      </div>

      {!isEdit && (
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          error={errors.password}
          onChange={handleChange}
        />
      )}

      <div className="form-grid two">
        <Select
          label="Role"
          name="role"
          options={roleOptions}
          value={formData.role}
          disabled={isEdit}
          onChange={handleChange}
        />

        <Select
          label="Status"
          name="isActive"
          options={[
            { label: "Active", value: true },
            { label: "Inactive", value: false }
          ]}
          value={String(formData.isActive)}
          onChange={handleChange}
        />
      </div>

      {(currentRole === ROLES.STUDENT || currentRole === ROLES.TEACHER) && (
        <Select
          label="Department"
          name="department"
          placeholder="Select department"
          options={departmentOptions}
          value={formData.department}
          error={errors.department}
          onChange={handleChange}
        />
      )}

      {currentRole === ROLES.STUDENT && (
        <>
          <Input
            label="Roll Number"
            type="text"
            name="rollNumber"
            value={formData.rollNumber}
            error={errors.rollNumber}
            onChange={handleChange}
          />

          <div className="form-grid two">
            <Select
              label="Year"
              name="year"
              options={YEARS}
              value={formData.year}
              error={errors.year}
              onChange={handleChange}
            />

            <Select
              label="Section"
              name="section"
              options={SECTIONS}
              value={formData.section}
              error={errors.section}
              onChange={handleChange}
            />
          </div>
        </>
      )}

      {currentRole === ROLES.TEACHER && (
        <>
          <Input
            label="Employee ID"
            type="text"
            name="employeeId"
            placeholder="Optional - backend auto-generates if empty"
            value={formData.employeeId}
            onChange={handleChange}
          />

          <div className="form-grid two">
            <Input
              label="Qualification"
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
            />

            <Input
              label="Experience"
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
            />
          </div>

          <Input
            label="Designation"
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
          />
        </>
      )}

      {currentRole === ROLES.ADMIN && (
        <Input
          label="Designation"
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
        />
      )}

      <Input
        label="Phone"
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
      />

      <Button type="submit" loading={loading}>
        {submitText}
      </Button>
    </form>
  );
};

export default UserForm;