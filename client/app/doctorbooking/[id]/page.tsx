"use client";

import { useLogin } from "@/app/_providers/loginProvider";
import Link from "next/link";
import styles from "./bookingpage.module.css";
import Appointment from "@/app/_Components/AppointmentComp/Appoint";
import { useParams } from "next/navigation";

export default function Booking() {
    const { user } = useLogin();
    const { id: doctorIdParam } = useParams<{ id: string }>();
    const doctorId = doctorIdParam ? Number(doctorIdParam) : null;

    // Render login required message
    const renderLoginRequired = () => (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Login Required</h1>
                <p className={styles.message}>
                    You need to be logged in to book appointments with our doctors. Please login to your account to continue with the booking process.
                </p>
                <div className={styles.buttonContainer}>
                    <Link href="/login" className={styles.loginButton}>Go to Login</Link>
                    <Link href="/" className={styles.homeButton}>Back to Home</Link>
                </div>
            </div>
        </div>
    );

    // Render invalid doctor message
    const renderInvalidDoctor = () => (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Invalid Doctor</h1>
                <p className={styles.message}>
                    The doctor ID is missing or invalid. Please select a valid doctor.
                </p>
                <div className={styles.buttonContainer}>
                    <Link href="/appointments" className={styles.homeButton}>Browse Doctors</Link>
                </div>
            </div>
        </div>
    );

    // Check user authentication and doctor ID validity
    if (!user) return renderLoginRequired();
    if (!doctorId) return renderInvalidDoctor();

    return <Appointment doctorId={doctorId} />;
}