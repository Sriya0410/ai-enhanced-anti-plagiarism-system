import { useEffect, useState } from "react";
import { createOrUpdateSetting, getSettings } from "../../api/settingsApi";
import { getErrorMessage } from "../../api/axios";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";

const SystemSettings = () => {
  const [settings, setSettings] = useState([]);
  const [formData, setFormData] = useState({
    key: "",
    value: "",
    description: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await getSettings();
      setSettings(response?.data?.data?.settings || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setMessage("");
    setError("");
  };

  const parseValue = (value) => {
    if (value === "true") return true;
    if (value === "false") return false;

    if (!Number.isNaN(Number(value)) && value.trim() !== "") {
      return Number(value);
    }

    if (value.includes(",")) {
      return value.split(",").map((item) => item.trim());
    }

    return value;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.key.trim()) {
      setError("Setting key is required.");
      return;
    }

    if (formData.value === "") {
      setError("Setting value is required.");
      return;
    }

    try {
      setSaving(true);

      await createOrUpdateSetting({
        key: formData.key,
        value: parseValue(formData.value),
        description: formData.description
      });

      setMessage("Setting saved successfully.");
      setFormData({
        key: "",
        value: "",
        description: ""
      });

      fetchSettings();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader text="Loading settings..." />;
  }

  return (
    <div>
      <PageHeader
        title="System Settings"
        subtitle="Manage thresholds, allowed file types, and system configuration."
      />

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="content-grid two">
        <form className="form-card" onSubmit={handleSubmit}>
          <Input
            label="Setting Key"
            name="key"
            value={formData.key}
            placeholder="Example: plagiarismHighThreshold"
            onChange={handleChange}
          />

          <Input
            label="Value"
            name="value"
            value={formData.value}
            placeholder="Example: 70 or pdf,docx,txt"
            onChange={handleChange}
          />

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input form-textarea"
              name="description"
              value={formData.description}
              placeholder="Enter setting description"
              onChange={handleChange}
            />
          </div>

          <Button type="submit" loading={saving}>
            Save Setting
          </Button>
        </form>

        <div className="panel-card">
          <h3>Current Settings</h3>

          <div className="settings-list">
            {settings.map((setting) => (
              <div className="settings-item" key={setting._id}>
                <h4>{setting.key}</h4>
                <p>
                  <strong>Value:</strong>{" "}
                  {Array.isArray(setting.value)
                    ? setting.value.join(", ")
                    : String(setting.value)}
                </p>
                <span>{setting.description || "No description"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;