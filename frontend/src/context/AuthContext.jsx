import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { getMe, loginUser, registerStudent } from "../api/authApi";
import {
  clearAuth,
  getStoredUser,
  getToken,
  saveAuth,
  updateStoredUser
} from "../utils/authStorage";
import { getErrorMessage } from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(getToken());
  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(token && user);

  const refreshUser = async () => {
    const currentToken = getToken();

    if (!currentToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return null;
    }

    try {
      const response = await getMe();
      const freshUser = response?.data?.data?.user;

      setUser(freshUser);
      setToken(currentToken);
      updateStoredUser(freshUser);

      return freshUser;
    } catch (error) {
      clearAuth();
      setUser(null);
      setToken(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (payload) => {
    try {
      const response = await loginUser(payload);
      const data = response?.data?.data;

      saveAuth({
        token: data?.token,
        user: data?.user
      });

      setToken(data?.token);
      setUser(data?.user);

      return {
        success: true,
        user: data?.user
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error)
      };
    }
  };

  const register = async (payload) => {
    try {
      await registerStudent(payload);

      /*
        Important:
        Do not save token after registration.
        Register success ayyaka user login page ki vellali.
        Login chesaka matrame token save avtundi.
      */

      clearAuth();
      setUser(null);
      setToken(null);

      return {
        success: true,
        message: "Registration successful. Please login to continue."
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error)
      };
    }
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    setToken(null);
  };

  const updateAuthUser = (updatedUser) => {
    setUser(updatedUser);
    updateStoredUser(updatedUser);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
      refreshUser,
      updateAuthUser
    }),
    [user, token, loading, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};