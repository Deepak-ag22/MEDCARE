"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./doctor.module.css";

const DEFAULT_DOCTOR_IMAGE = "/default-doctor.png";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  location: string;
  gender: string;
  rating: number;
  image: string;
}

export default function DoctorList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fetch doctors from API
  const fetchDoctors = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/admin/all-docs",
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }

      const data = await response.json();
      setDoctors(data.data.rows);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError("Failed to load doctors");
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) {
      return;
    }

    try {
      // Ensure id is a valid integer
      const doctorId = parseInt(String(id), 10);
      if (isNaN(doctorId)) {
        throw new Error("Invalid doctor ID");
      }

      console.log("Attempting to delete doctor with ID:", doctorId); // Debug log

      const response = await fetch(
        `http://localhost:3001/api/admin/${doctorId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        throw new Error(errorText);
      }

      // Refresh the doctor list after successful deletion
      await fetchDoctors();
      
    } catch (err) {
      console.error("Error deleting doctor:", err);
      setError(err instanceof Error ? err.message : "Failed to delete doctor");
    }
  };


  // Get doctor image URL
  const getImageUrl = (photoUrl: string | null | undefined): string => {
    if (!photoUrl) return DEFAULT_DOCTOR_IMAGE;
    if (photoUrl.startsWith("http")) return photoUrl;
    if (photoUrl.startsWith("/")) return photoUrl;
    return DEFAULT_DOCTOR_IMAGE;
  };

  // Loading state
  if (loading) {
    return <div className={styles.loading}>Loading doctors...</div>;
  }

  // Error state
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Doctors List</h2>
      {error && <div className={styles.error}>{error}</div>}
      <ul className={styles.doctorList}>
        {Array.isArray(doctors) && doctors.map((doctor, index) => (
          <li key={`doctor-${doctor.id}-${index}`} className={styles.doctorItem}>
            <div className={styles.doctorDetails}>
              <div className={styles.doctorHeader}>
                <h3 className={styles.doctorName}>{doctor.name}</h3>
              </div>
              <div className={styles.doctorInfo}>
                <p key={`degree-${doctor.id}`} className={styles.doctorText}>
                  Degree: {doctor.specialty}
                </p>
                <p key={`exp-${doctor.id}`} className={styles.doctorText}>
                  Experience: {doctor.experience} years
                </p>
                <p key={`loc-${doctor.id}`} className={styles.doctorText}>
                  Location: {doctor.location}
                </p>
                <p key={`gender-${doctor.id}`} className={styles.doctorText}>
                  Gender: {doctor.gender}
                </p>
                <p key={`rating-${doctor.id}`} className={styles.doctorText}>
                  Rating: {doctor.rating}
                </p>
              </div>
              {doctor.image && (
                <div key={`img-${doctor.id}`} className={styles.imageContainer}>
                  <Image
                    src={getImageUrl(doctor.image)}
                    alt={`Dr. ${doctor.name}`}
                    className={styles.doctorImage}
                    width={120}
                    height={120}
                    priority={true}
                    unoptimized={doctor.image.startsWith("data:")}
                  />
                </div>
              )}
              <div className={styles.actionButtons}>
                <button
                  className={styles.deleteBtn}
                  onClick={() => {
                    if (!isNaN(doctor.id)) {
                      handleDelete(doctor.id);
                    } else {
                      setError("Invalid doctor ID");
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
        {Array.isArray(doctors) && doctors.length === 0 && (
          <li>No doctors found</li>
        )}
      </ul>
    </div>
  );
}