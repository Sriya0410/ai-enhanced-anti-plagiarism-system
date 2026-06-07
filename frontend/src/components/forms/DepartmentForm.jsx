import { useEffect, useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";

const DepartmentForm = ({
  initialData = null,
  onSubmit,
  loading = false,
  submitText = "Save Department"
}) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    isActive: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        code: initialData.code || "",
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
      newErrors.name = "Department name is required.";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Department code is required.";
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
      code: formData.code.toUpperCase()
    });
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <Input
        label="Department Name"
        type="text"
        name="name"
        placeholder="Example: Computer Science and Engineering"
        value={formData.name}
        error={errors.name}
        onChange={handleChange}
      />

      <Input
        label="Department Code"
        type="text"
        name="code"
        placeholder="Example: CSE"
        value={formData.code}
        error={errors.code}
        onChange={handleChange}
      />

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-input form-textarea"
          name="description"
          placeholder="Enter department description"
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

export default DepartmentForm;