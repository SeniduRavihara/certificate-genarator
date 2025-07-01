import type { User } from "firebase/auth";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import type { ReactNode } from "react";
import React, { createContext, useEffect, useState } from "react";
import { auth, getGoogleDriveProvider } from "../firebase/config";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  accessToken: string | null;
  signInWithGoogleDrive: () => Promise<void>;
  signOutGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  accessToken: null,
  signInWithGoogleDrive: async () => {},
  signOutGoogle: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  console.log(accessToken);
  

  const signInWithGoogleDrive = async () => {
    const provider = getGoogleDriveProvider();
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    setAccessToken(credential?.accessToken || null);
    setUser(result.user);
  };

  const signOutGoogle = async () => {
    await signOut(auth);
    setAccessToken(null);
    setUser(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      setAccessToken(null);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        accessToken,
        signInWithGoogleDrive,
        signOutGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
