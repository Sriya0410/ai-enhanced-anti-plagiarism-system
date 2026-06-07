import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

const Sidebar = ({ title, links = [] }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <ShieldCheck size={24} />
        </div>

        <div>
          <h1>{title}</h1>
          <p>Anti-Plagiarism</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={`${link.path}-${link.label}`}
              to={link.path}
              className="sidebar-link"
            >
              <Icon size={19} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;