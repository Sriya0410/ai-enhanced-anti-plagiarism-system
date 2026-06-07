import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyReports } from "../../api/studentApi";
import { getErrorMessage } from "../../api/axios";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import ReportTable from "../../components/tables/ReportTable";

const MyReports = () => {
  const navigate = useNavigate();

  const [plagiarismReports, setPlagiarismReports] = useState([]);
  const [aiContentReports, setAIContentReports] = useState([]);

  const [activeTab, setActiveTab] = useState("plagiarism");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyReports();

      setPlagiarismReports(response?.data?.data?.plagiarismReports || []);
      setAIContentReports(response?.data?.data?.aiContentReports || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleView = (report) => {
    const submissionId = report?.submission?._id || report?.submission;

    if (submissionId) {
      navigate(`/student/submissions/${submissionId}`);
    }
  };

  if (loading) {
    return <Loader text="Loading reports..." />;
  }

  return (
    <div>
      <PageHeader
        title="My Reports"
        subtitle="View plagiarism and AI content reports generated after submission."
      />

      {error && <div className="alert alert-error">{error}</div>}

      <div className="tabs">
        <button
          type="button"
          className={activeTab === "plagiarism" ? "tab active" : "tab"}
          onClick={() => setActiveTab("plagiarism")}
        >
          Plagiarism Reports
        </button>

        <button
          type="button"
          className={activeTab === "ai" ? "tab active" : "tab"}
          onClick={() => setActiveTab("ai")}
        >
          AI Content Reports
        </button>
      </div>

      {activeTab === "plagiarism" ? (
        <ReportTable
          reports={plagiarismReports}
          type="plagiarism"
          onView={handleView}
        />
      ) : (
        <ReportTable
          reports={aiContentReports}
          type="ai"
          onView={handleView}
        />
      )}
    </div>
  );
};

export default MyReports;