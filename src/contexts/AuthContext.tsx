
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

type UserProfile = {
  id: string;
  username: string;
  email: string;
  learning_style: string;
  name: string;
  avatar_url?: string;
};

type AuthContextType = {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  getAvatarUrl: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state when the component mounts
  useEffect(() => {
    // Set up the auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event);
        setSession(newSession);
        
        // Fetch profile data if session exists
        if (newSession?.user) {
          // Use setTimeout to avoid potential Supabase auth deadlocks
          setTimeout(() => {
            fetchUserProfile(newSession.user.id);
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      // Fetch profile data if session exists
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Function to fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Could not fetch user profile");
        setUser(null);
      } else if (data) {
        setUser(data as UserProfile);
      }
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function using Supabase auth
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message || "Login failed");
        throw error;
      }

      // Profile fetch is handled by onAuthStateChange
      toast.success("Logged in successfully");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Register function using Supabase auth
  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            name: username, // Default name to username
          },
        },
      });

      if (error) {
        toast.error(error.message || "Registration failed");
        throw error;
      }

      // Profile creation is handled by the database trigger
      toast.success("Registration successful");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  // Update profile function
  const updateProfile = async (profile: Partial<UserProfile>) => {
    if (!user || !user.id) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user.id);

      if (error) {
        toast.error(error.message || "Failed to update profile");
        throw error;
      }

      // Update local user state
      setUser(prev => prev ? { ...prev, ...profile } : null);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Get avatar URL function
  const getAvatarUrl = async () => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .storage
        .from('avatars')
        .createSignedUrl(`${user.id}`, 60 * 60); // 1 hour expiry
        
      if (error || !data) {
        return null;
      }
      
      return data.signedUrl;
    } catch (error) {
      console.error("Error getting avatar URL:", error);
      return null;
    }
  };

  const value = {
    user,
    session,
    isAuthenticated: !!session,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    getAvatarUrl,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
