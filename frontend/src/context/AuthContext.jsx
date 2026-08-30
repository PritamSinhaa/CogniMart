
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";


import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../api/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(user);

  const login = async (credentials) => {
    const response = await loginUser(credentials);

    const loggedInUser =
      response?.data?.user || response?.user || null;

    setUser(loggedInUser);

    return response;
  };

  const register = async (payload) => {
    const response = await registerUser(payload);

    const registeredUser =
      response?.data?.user || response?.user || null;

    setUser(registeredUser);

    return response;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await getCurrentUser();

      const currentUser =
        response?.data?.user || response?.user || null;

      setUser(currentUser);

      return currentUser;
    } catch {
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      try {
        const response = await getCurrentUser();

        if (!mounted) {
          return;
        }

        const currentUser =
          response?.data?.user ||
          response?.user ||
          null;

        setUser(currentUser);
      } catch {
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
}

