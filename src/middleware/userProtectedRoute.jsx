import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userId = localStorage.getItem("user_id");
  const role = localStorage.getItem("user_role");

  if (!userId || role !== "user") {
    // Redirige vers la page de login si non authentifié ou mauvais rôle
    return <Navigate to="/login" replace />;
  }

  // Sinon, autoriser l'accès à la page
  return children;
};

export default ProtectedRoute;
