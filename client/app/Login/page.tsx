"use client";

import { useLogin } from "@/app/providers/loginProvider";
import LoginComp from "../_Components/LoginComp/LoginComp";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
    const { user } = useLogin();
    const router = useRouter();

    useEffect(() => {
        if (user)  router.replace("/");    
    }, [user]);

    if (user) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                }}
            >
                Already Logged in, redirecting to homePage!
            </div>
        );
    }

    return (
        <>
            <div>
                <LoginComp />
            </div>
        </>
    );
}