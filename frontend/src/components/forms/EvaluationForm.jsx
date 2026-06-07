import { useEffect, useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";

const EvaluationForm = ({
  submission,
  existingEvaluation = null,
  onSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    marks: "",
    feedback: ""
  });

  const [errors, setErrors] = useState({});

  const maxMarks = Number(submission?.assignment?.maxMarks || 100);

  useEffect(() => {
    if (existingEvaluation) {
      setFormData({
        marks: existingEvaluation.marks || "",
        feedback: existingEvaluation.feedback || ""
      });
    }
  }, [existingEvaluation]);

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

    if (formData.marks === "") {
      newErrors.marks = "Marks are required.";
    } else if (Number(formData.marks) < 0 || Number(formData.marks) > maxMarks) {
      newErrors.marks = `Marks must be between 0 and ${maxMarks}.`;
    }

    if (!formData.feedback.trim()) {
      newErrors.feedback = "Feedback is required.";
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
      submissionId: submission._id,
      marks: Number(formData.marks),
      feedback: formData.feedback
    });
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <Input
        label={`Marks out of ${maxMarks}`}
        type="number"
        name="marks"
        min="0"
        max={maxMarks}
        value={formData.marks}
        error={errors.marks}
        onChange={handleChange}
      />

      <div className="form-group">
        <label className="form-label">Feedback</label>
        <textarea
          className="form-input form-textarea"
          name="feedback"
          placeholder="Enter feedback for student"
          value={formData.feedback}
          onChange={handleChange}
        />
        {errors.feedback && <p className="form-error">{errors.feedback}</p>}
      </div>

      <Button type="submit" loading={loading}>
        Save Evaluation
      </Button>
    </form>
  );
};

export default EvaluationForm;