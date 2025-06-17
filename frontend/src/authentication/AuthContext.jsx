import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const tokenResult = await user.getIdTokenResult(true);
          setUser(user);
          setTeam(tokenResult.claims.team || null);
        } catch (error) {
          console.error("Error fetching token claims:", error);
          setUser(user);
          setTeam(null);
        }
      } else {
        setUser(null);
        setTeam(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Add a function to get fresh token on demand
  const getToken = async () => {
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken();
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, team, loading, getToken }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


