"use client";

import Appointment from "@/app/_Components/appointment/appointmentComp";
import { use } from "react";
import { useEffect, useState } from "react";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  location: string;
  gender: string;
  image: string;
}

export default function DynamicBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/doctors/${id}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch doctor details');
        }

        const data = await response.json();
        setDoctor(data);
      } catch (err:any) {
        setError(err instanceof Error ? err.message : 'Failed to load doctor details');
        console.error('Error fetching doctor:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading doctor details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <div>Error: {error}</div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Doctor not found</div>
      </div>
    );
  }

  return <Appointment doctor={doctor} />;
}