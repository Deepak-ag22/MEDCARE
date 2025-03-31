"use client";

import { useState, useEffect } from "react";
import styles from "./appoint.module.css";

type Appointment = {
  id: number;
  doctor_id: number;
  doctor_name: string;
  slot_time:string;
  slot_id: number;
  appointment_date: string;
  status: string;
  username: string;
  user_emailid: string;
};

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Fetch Appointments
  const fetchAppointments = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/admin/appointments', {
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch appointments: ${response.status} ${response.statusText}`);
        }
        

        const data = await response.json();
        console.log('Appointments data:', data); // Log the data to see what is returned
        setAppointments(data);
        setLoading(false);
    } catch (err) {
        setError('Failed to load appointments');
        setLoading(false);
    }
};

  // Approve Appointment
  const approveAppointment = async (id: number) => {
    setActionLoading(id);
    try {
      const response = await fetch(`http://localhost:3001/api/admin/appointments/${id}/accept`, {
        method: "PUT",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to approve appointment");
      }

      fetchAppointments(); // Refresh after approval
    } catch (err) {
      setError("Failed to approve appointment");
    } finally {
      setActionLoading(null);
    }
  };

  // Reject Appointment
  const rejectAppointment = async (id: number) => {
    setActionLoading(id);
    try {
      const response = await fetch(`http://localhost:3001/api/admin/appointments/${id}/reject`, {
        method: "PUT",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to reject appointment");
      }

      fetchAppointments(); // Refresh after rejection
    } catch (err) {
      setError("Failed to reject appointment");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete Appointment
  const deleteAppointment = async (id: number) => {
    setActionLoading(id);
    try {
      const response = await fetch(`http://localhost:3001/api/admin/appointments/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete appointment");
      }

      fetchAppointments(); // Refresh after deletion
    } catch (err) {
      setError("Failed to delete appointment");
    } finally {
      setActionLoading(null);
    }
  };

  // Show loading while data is being fetched
  if (loading) {
    return <div className={styles.loading}>Loading appointments...</div>;
  }

  // Show error if fetching failed
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Appointment Requests</h2>
      <div className={styles.appointmentList}>
        {appointments.map((appt) => (
          <div key={appt.id} className={styles.appointmentCard}>
            <div className={styles.info}>
              <p>
                <strong>Doctor:</strong> {appt.doctor_name}
              </p>
              <p>
                <strong>Date:</strong> {new Date(appt.appointment_date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {
                    appt.slot_time
                }
              </p>
              <p>
                <strong>Patient Name:</strong>
                {appt.username}
              </p>
              <p>
                <strong>
                  Status:{" "}
                  <span className={
                    appt.status === "approved" ? styles.approved :
                    appt.status === "rejected" ? styles.rejected :
                    styles.pending
                  }>
                    {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                  </span>
                </strong>
              </p>
            </div>
            <div className={styles.actions}>
              {appt.status === "pending" && (
                <>
                  <button
                    className={styles.approveButton}
                    onClick={() => approveAppointment(appt.id)}
                    disabled={actionLoading === appt.id}
                  >
                    {actionLoading === appt.id ? "Approving..." : "Approve"}
                  </button>
                  <button
                    className={styles.rejectButton}
                    onClick={() => rejectAppointment(appt.id)}
                    disabled={actionLoading === appt.id}
                  >
                    {actionLoading === appt.id ? "Rejecting..." : "Reject"}
                  </button>
                </>
              )}
              <button
                className={styles.deleteButton}
                onClick={() => deleteAppointment(appt.id)}
                disabled={actionLoading === appt.id}
              >
                {actionLoading === appt.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}