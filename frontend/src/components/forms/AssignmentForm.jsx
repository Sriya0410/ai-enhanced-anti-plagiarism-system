import { useEffect, useMemo, useState } from "react";
import { getMyTeacherSubjects } from "../../api/subjectApi";
import { getErrorMessage } from "../../api/axios";
import { STATUS_OPTIONS, YEARS } from "../../utils/constants";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";

const AssignmentForm = ({
  initialData = null,
  onSubmit,
  loading = false,
  submitText = "Save Assignment"
}) => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    department: "",
    year: "",
    dueDate: "",
    maxMarks: "100",
    status: "DRAFT"
  });

  const [errors, setErrors] = useState({});

  const subjectOptions = useMemo(() => {
    return subjects.map((subject) => ({
      label: `${subject.name} (${subject.code}) - ${
        subject.department?.name || "No Department"
      }`,
      value: subject._id
    }));
  }, [subjects]);

  const fetchSubjects = async () => {
    try {
      const response = await getMyTeacherSubjects();
      const fetchedSubjects = response?.data?.data?.subjects || [];

      setSubjects(fetchedSubjects);

      if (initialData) {
        const initialSubjectId =
          initialData.subject?._id || initialData.subject || "";

        const matchedSubject = fetchedSubjects.find(
          (subject) => subject._id === initialSubjectId
        );

        setSelectedSubject(matchedSubject || initialData.subject || null);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (initialData) {
      const initialSubjectId =
        initialData.subject?._id || initialData.subject || "";

      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        subject: initialSubjectId,
        department:
          initialData.department?._id ||
          initialData.department ||
          initialData.subject?.department?._id ||
          initialData.subject?.department ||
          "",
        year: initialData.year || "",
        dueDate: initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().slice(0, 10)
          : "",
        maxMarks: initialData.maxMarks || "100",
        status: initialData.status || "DRAFT"
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (!formData.subject || !subjects.length) {
      return;
    }

    const subject = subjects.find((item) => item._id === formData.subject);

    if (subject) {
      setSelectedSubject(subject);

      setFormData((prev) => ({
        ...prev,
        department: subject.department?._id || ""
      }));
    }
  }, [formData.subject, subjects]);

  const handleSubjectChange = (event) => {
    const subjectId = event.target.value;
    const subject = subjects.find((item) => item._id === subjectId);

    setSelectedSubject(subject || null);

    setFormData((prev) => ({
      ...prev,
      subject: subjectId,
      department: subject?.department?._id || ""
    }));

    setErrors((prev) => ({
      ...prev,
      subject: "",
      department: ""
    }));
  };

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

    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    }

    if (!formData.subject) {
      newErrors.subject = "Subject is required.";
    }

    if (!formData.year) {
      newErrors.year = "Year is required.";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required.";
    }

    if (!formData.maxMarks || Number(formData.maxMarks) <= 0) {
      newErrors.maxMarks = "Max marks must be greater than 0.";
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
      title: formData.title.trim(),
      description: formData.description.trim(),
      subject: formData.subject,
      department: formData.department,
      year: formData.year,
      dueDate: formData.dueDate,
      maxMarks: Number(formData.maxMarks),
      status: formData.status
    });
  };

  return (
    <form className="form-card assignment-form" onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}

      {!error && !subjects.length && (
        <div className="alert alert-warning">
          No subjects are assigned to you. Please contact admin to assign a
          subject before creating assignments.
        </div>
      )}

      <Input
        label="Assignment Title"
        type="text"
        name="title"
        placeholder="Enter assignment title"
        value={formData.title}
        error={errors.title}
        onChange={handleChange}
      />

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-input form-textarea"
          name="description"
          placeholder="Enter assignment description"
          value={formData.description}
          onChange={handleChange}
        />
        {errors.description && <p className="form-error">{errors.description}</p>}
      </div>

      <div className="form-grid two">
        <Select
          label="Assigned Subject"
          name="subject"
          placeholder="Select your assigned subject"
          options={subjectOptions}
          value={formData.subject}
          error={errors.subject}
          onChange={handleSubjectChange}
        />

        <Input
          label="Department"
          type="text"
          name="departmentName"
          value={
            selectedSubject?.department
              ? `${selectedSubject.department.name} (${selectedSubject.department.code})`
              : "Select subject first"
          }
          disabled
        />
      </div>

      <div className="form-grid two">
        <Select
          label="Target Year"
          name="year"
          placeholder="Select student year"
          options={YEARS}
          value={formData.year}
          error={errors.year}
          onChange={handleChange}
        />

        <Input
          label="Due Date"
          type="date"
          name="dueDate"
          value={formData.dueDate}
          error={errors.dueDate}
          onChange={handleChange}
        />
      </div>

      <div className="form-grid two">
        <Input
          label="Max Marks"
          type="number"
          name="maxMarks"
          min="1"
          value={formData.maxMarks}
          error={errors.maxMarks}
          onChange={handleChange}
        />

        <Select
          label="Status"
          name="status"
          options={STATUS_OPTIONS}
          value={formData.status}
          onChange={handleChange}
        />
      </div>

      <Button type="submit" loading={loading} disabled={!subjects.length}>
        {submitText}
      </Button>
    </form>
  );
};

export default AssignmentForm;