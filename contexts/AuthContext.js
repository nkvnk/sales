// contexts/AuthContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN") {
        setUser(session.user);
        await fetchUserProfile(session.user.id);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
        router.push("/login");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkUser() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        await fetchUserProfile(session.user.id);
      }
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserProfile(userId) {
    try {
      // まずmemberテーブルからユーザープロファイルを取得
      const { data: profileData, error: profileError } = await supabase
        .from("member")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) {
        // プロファイルが存在しない場合、新規作成
        if (profileError.code === "PGRST116") {
          const { data: newProfile, error: createError } = await supabase
            .from("member")
            .insert([
              {
                id: userId,
                name: user?.email?.split("@")[0] || "New User",
                role: "member", // デフォルトロール
              },
            ])
            .select()
            .single();

          if (createError) throw createError;
          setProfile(newProfile);
        } else {
          throw profileError;
        }
      } else {
        setProfile(profileData);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

  const value = {
    user,
    profile,
    loading,
    refreshProfile: () => fetchUserProfile(user?.id),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
