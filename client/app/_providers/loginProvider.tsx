"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

interface User {
    user_name: string;
    user_emailid: string;
    user_id: number;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    fetchUser: () => Promise<void>;
    logout: () => Promise<void>;
}

export const LoginContext = createContext<UserContextType | undefined>(undefined);

export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchUser = async () => {
        try {
            const response = await fetch(`/api/users/me?_t=` + new Date().getTime(), {
                credentials: "include",
                cache: "no-cache",
                headers: {
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    Pragma: "no-cache",
                },
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                console.warn("User not authenticated, resetting user state.");
                setUser(null);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await fetch("/api/users/logout", {
                method: "POST",
                credentials: "include",
            });
            setUser(null);
            toast.success("Successfully logged out.");
            router.push("/");
        } catch (error) {
            toast.error("Logout unsuccessful. Please try again.");
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);


    if (isLoading) {
        return null; // Optionally, return a loading spinner or placeholder
    }

    return (
        <LoginContext.Provider value={{ user, setUser, fetchUser, logout }}>
            {children}
        </LoginContext.Provider>
    );
};

export const useLogin = () => {
    const context = useContext(LoginContext);
    if (!context) 
        throw new Error("useLogin must be used within a LoginProvider");
    return context;
};