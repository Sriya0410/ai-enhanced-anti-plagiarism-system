import { LogOut, Menu, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import getRoleRedirect from "../../utils/getRoleRedirect";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleProfile = () => {
    if (!user) {
      return;
    }

    const basePath = getRoleRedirect(user.role).replace("/dashboard", "");
    navigate(`${basePath}/profile`);
  };

  return (
    <header className="top-navbar">
      <div className="top-navbar-left">
        <button className="icon-button mobile-menu-button" type="button">
          <Menu size={20} />
        </button>
        <div>
          <p className="navbar-eyebrow">AI-Enhanced Anti-Plagiarism System</p>
          <h2>Welcome, {user?.name || "User"}</h2>
        </div>
      </div>

      <div className="top-navbar-right">
        <button className="profile-chip" type="button" onClick={handleProfile}>
          <UserCircle size={20} />
          <span>{user?.role || "USER"}</span>
        </button>

        <button className="logout-button" type="button" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;