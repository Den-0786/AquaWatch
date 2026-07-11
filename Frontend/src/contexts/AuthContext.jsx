import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// Mock user data - in production, this would come from a backend
const MOCK_USERS = [
  { username: "admin", password: "admin123", pin: "1234" },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("aquawatch_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("aquawatch_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (username, password) => {
    const foundUser = MOCK_USERS.find(
      (u) => u.username === username && u.password === password
    );
    
    if (foundUser) {
      const userWithoutPassword = { username: foundUser.username, pin: foundUser.pin };
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem("aquawatch_user", JSON.stringify(userWithoutPassword));
      return { success: true };
    }
    
    return { success: false, error: "Invalid username or password" };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("aquawatch_user");
  };

  const verifyPin = (pin) => {
    return user?.pin === pin;
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("aquawatch_user", JSON.stringify(updatedUser));
    
    // Update in mock users array as well
    const userIndex = MOCK_USERS.findIndex((u) => u.username === user.username);
    if (userIndex !== -1) {
      MOCK_USERS[userIndex] = { ...MOCK_USERS[userIndex], ...updates };
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    verifyPin,
    updateUser,
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
