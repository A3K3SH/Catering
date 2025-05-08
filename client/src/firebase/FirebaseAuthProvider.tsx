import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { 
  loginWithEmailAndPassword, 
  registerWithEmailAndPassword, 
  signInWithGoogle, 
  logoutUser, 
  subscribeToAuthChanges 
} from './auth';

type UserRole = 'admin' | 'user' | null;

interface FirebaseUser extends User {
  role?: UserRole;
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<FirebaseUser>;
  register: (email: string, password: string) => Promise<FirebaseUser>;
  loginWithGoogle: () => Promise<FirebaseUser>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  login: async () => { throw new Error('Not implemented'); },
  register: async () => { throw new Error('Not implemented'); },
  loginWithGoogle: async () => { throw new Error('Not implemented'); },
  logout: async () => { throw new Error('Not implemented'); },
  isAdmin: false
});

export const useFirebaseAuth = () => useContext(AuthContext);

export const FirebaseAuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      // Here you would typically fetch user role from your database
      // For now, we'll use a simple approach - admin email addresses
      if (user) {
        const userWithRole = user as FirebaseUser;
        
        // Check if the user's email contains "admin" (for demonstration)
        // In a real app, you'd check this against a database role
        const adminEmails = ['admin@example.com']; // Example admin emails
        userWithRole.role = adminEmails.includes(user.email || '') ? 'admin' : 'user';
        
        setCurrentUser(userWithRole);
        setIsAdmin(userWithRole.role === 'admin');
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const user = await loginWithEmailAndPassword(email, password);
      return user as FirebaseUser;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const user = await registerWithEmailAndPassword(email, password);
      return user as FirebaseUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const loginWithGoogleFunction = async () => {
    try {
      const user = await signInWithGoogle();
      return user as FirebaseUser;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    loginWithGoogle: loginWithGoogleFunction,
    logout,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};