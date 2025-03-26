"use client"
import SignUpComp from "../_Components/signUp/SignUp";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useLogin } from "@/app/providers/loginProvider";


export default function Register(){
      const { user } = useLogin();
      const router = useRouter();
      
      useEffect(() => {
          if (user) router.replace("/");  
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
                  <SignUpComp />
              </div>
          </>
      );
}