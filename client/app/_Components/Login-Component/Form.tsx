"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Login.module.css";
import Image from "next/image";
import { useLogin } from "@/app/_providers/loginProvider";
import { useRouter } from "next/navigation";
import GoogleSignInButton from "../googleButton/Google";
import { toast } from "sonner";

export default function LoginForm() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const router = useRouter();
    const { fetchUser } = useLogin();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const { email, password } = formData;

        if (!email || !password) {
            toast.error("Please enter both email and password");
            return;
        }

        try {
            const response = await fetch("/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                toast.error(errorData.message || "Login failed");
                return;
            }

            await fetchUser();
            toast.success("Logged in successfully!");
            router.push("/");
        } catch (error) {
            console.error("Login error:", error);
            toast.error("An error occurred while logging in. Please try again.");
        }
    };

    const handleReset = () => {
        setFormData({ email: "", password: "" });
        toast.info("Form reset");
    };

    const handleGoogleSignIn = () => {
        window.location.href = "http://localhost:3001/api/users/google";
    };

    return (
        <div className={styles.loginContainer}>
            <h2>Login</h2>
            <p>
                Are you a new member?{" "}
                <Link href="/register" className={styles.linkButton}>
                    Sign up here.
                </Link>
            </p>
            <form onSubmit={handleLogin}>
                <label>Email</label>
                <div className={styles.inputField}>
                    <section className={styles.inputcontainer}>
                        <span>
                            <Image src="/email.svg" alt="Email logo" height={20} width={20} />
                        </span>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </section>
                </div>

                <label>Password</label>
                <div className={styles.inputField}>
                    <section className={styles.inputcontainer}>
                        <span>
                            <Image src="/lockPass.svg" alt="Password logo" height={20} width={20} />
                        </span>
                        <input
                            type="password"
                            name="password"
                            placeholder="********"
                            required
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                    </section>
                </div>

                <button type="submit" className={`${styles.button} ${styles.loginButton}`}>
                    Login
                </button>
                <button type="button" onClick={handleReset} className={`${styles.button} ${styles.resetButton}`}>
                    Reset
                </button>
                <p className={styles.forgot}>
                    <Link href="/forgot-password">Forgot Password?</Link>
                </p>
                <div className={styles.divider}>
                    <span>or</span>
                </div>

                <GoogleSignInButton onClick={handleGoogleSignIn} />
            </form>
        </div>
    );
}