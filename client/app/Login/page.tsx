"use client";

import { useLogin } from "@/app/_providers/loginProvider";
import LoginComp from "../_Components/Login-Component/Login";
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