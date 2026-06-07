import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./styles/index.css";
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/landing.css";
import "./styles/auth.css";
import "./styles/layout.css";
import "./styles/admin.css";
import "./styles/teacher.css";
import "./styles/student.css";
import "./styles/dashboard.css";
import "./styles/forms.css";
import "./styles/tables.css";
import "./styles/responsive.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);