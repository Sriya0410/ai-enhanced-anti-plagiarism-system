import { useEffect, useState } from "react";
import { getDepartments } from "../../api/departmentApi";
import { getAllTeachers } from "../../api/adminApi";
import { getErrorMessage } from "../../api/axios";
import { SEMESTERS } from "../../utils/constants";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";

const SubjectForm = ({
  initialData = null,
  onSubmit,
  loading = false,
  submitText = "Save Subject"
}) => {
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [fetchError, setFetchError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    department: "",
    teacher: "",
    semester: "",
    description: "",
    isActive: true
  });

  const [errors, setErrors] = useState({});

  const departmentOptions = departments.map((department) => ({
    label: `${department.name} (${department.code})`,
    value: department._id
  }));

  const teacherOptions = teachers.map((teacher) => ({
    label: `${teacher.name} (${teacher.email})`,
    value: teacher._id
  }));

  const fetchDropdownData = async () => {
    try {
      const [departmentRes, teacherRes] = await Promise.all([
        getDepartments(),
        getAllTeachers()
      ]);

      setDepartments(departmentRes?.data?.data?.departments || []);
      setTeachers(teacherRes?.data?.data?.teachers || []);
    } catch (error) {
      setFetchError(getErrorMessage(error));
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        code: initialData.code || "",
        department: initialData.department?._id || initialData.department || "",
        teacher: initialData.teacher?._id || initialData.teacher || "",
        semester: initialData.semester || "",
        description: initialData.description || "",
        isActive: initialData.isActive ?? true
      });
    }
  }, [initialData]);

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
      newErrors.name = "Subject name is required.";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Subject code is required.";
    }

    if (!formData.department) {
      newErrors.department = "Department is required.";
    }

    if (!formData.semester) {
      newErrors.semester = "Semester is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      ...formData,
      code: formData.code.toUpperCase(),
      teacher: formData.teacher || null
    });
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      {fetchError && <div className="alert alert-error">{fetchError}</div>}

      <Input
        label="Subject Name"
        type="text"
        name="name"
        placeholder="Example: Data Structures"
        value={formData.name}
        error={errors.name}
        onChange={handleChange}
      />

      <Input
        label="Subject Code"
        type="text"
        name="code"
        placeholder="Example: CSE201"
        value={formData.code}
        error={errors.code}
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

      <Select
        label="Teacher"
        name="teacher"
        placeholder="Optional - assign teacher"
        options={teacherOptions}
        value={formData.teacher}
        onChange={handleChange}
      />

      <Select
        label="Semester"
        name="semester"
        placeholder="Select semester"
        options={SEMESTERS}
        value={formData.semester}
        error={errors.semester}
        onChange={handleChange}
      />

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-input form-textarea"
          name="description"
          placeholder="Enter subject description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

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

      <Button type="submit" loading={loading}>
        {submitText}
      </Button>
    </form>
  );
};

export default SubjectForm;