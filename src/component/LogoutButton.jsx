import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem("user_id");
    navigate("/"); // Redirect to login page
  };

  return (
    <button
      onClick={handleLogout}
      className="logout-button px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
