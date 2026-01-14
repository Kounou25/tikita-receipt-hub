import { Navigate } from "react-router-dom";
import { getCookie } from '@/lib/cookies';

const UserProtectedRoute = ({ children }) => {
  const userId = getCookie("user_id");
  const role = getCookie("user_role");

  if (!userId || role !== "user") {
    // Redirige vers la page de login si non authentifié ou mauvais rôle
    return <Navigate to="/login" replace />;
  }

  // Sinon, autoriser l'accès à la page
  return children;
};

export default UserProtectedRoute;
