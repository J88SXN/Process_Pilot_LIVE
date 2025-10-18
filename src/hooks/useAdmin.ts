
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";

const ADMIN_EMAIL = "jason.stolworthy@processpilot.co.uk";

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);

    if (!user?.email) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const normalizedEmail = user.email.toLowerCase();
    setIsAdmin(normalizedEmail === ADMIN_EMAIL);
    setLoading(false);
  }, [user]);

  return { isAdmin, loading };
};
