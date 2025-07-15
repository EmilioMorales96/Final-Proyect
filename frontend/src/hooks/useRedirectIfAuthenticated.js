import { useEffect } from "react";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

/**
 * Custom hook that redirects authenticated users to home page
 * Useful for login/register pages to prevent authenticated users from accessing them
 */
export default function useRedirectIfAuthenticated() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);
}