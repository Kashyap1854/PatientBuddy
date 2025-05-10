import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../types/User";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("medvault_user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock login function
  async function login(email: string) {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, create a mock user
      const user: User = {
        id: "1",
        name: "John Doe",
        email,
        profilePicture:
          "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
      };

      setCurrentUser(user);
      localStorage.setItem("medvault_user", JSON.stringify(user));
    } finally {
      setLoading(false);
    }
  }

  // Mock signup function
  async function signup(email: string, _password: string, name: string) {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, create a mock user
      const user: User = {
        id: "1",
        name,
        email,
        profilePicture:
          "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
      };

      setCurrentUser(user);
      localStorage.setItem("medvault_user", JSON.stringify(user));
    } finally {
      setLoading(false);
    }
  }

  // Mock logout function
  async function logout() {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setCurrentUser(null);
      localStorage.removeItem("medvault_user");
    } finally {
      setLoading(false);
    }
  }

  function updateUser(userData: Partial<User>) {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      setCurrentUser(updatedUser);
      localStorage.setItem("medvault_user", JSON.stringify(updatedUser));
    }
  }

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!currentUser,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
