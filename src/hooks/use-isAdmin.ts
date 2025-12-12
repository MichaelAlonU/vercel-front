import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";

export default function useAdminGuard() {
  const isAdmin = useSelector((state: RootState) => state.auth.user.isAdmin);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate("/Forbidden", { replace: true });
    }
  }, [isAdmin, navigate]);
}
