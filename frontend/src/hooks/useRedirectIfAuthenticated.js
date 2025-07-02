import { useEffect } from "react";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

export default function useRedirectIfAuthenticated() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);
}