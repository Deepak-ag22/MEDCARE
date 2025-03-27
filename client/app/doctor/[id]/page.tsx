"use client";

import DoctorPage from "@/app/_Components/DetailPage/DoctorDetail";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface DatabaseDoctor {
    id: number;
    name: string;
    specialty: string;
    experience: number;
    rating: number;
    location: string;
    image: string;
}

export default function DynamicDoctorPage() {
    const params = useParams() as { id: string };
    const [doctor, setDoctor] = useState<DatabaseDoctor | null>(null);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/doctors/${params.id}`);
                
                if (!response.ok) {
                    throw new Error("Failed to fetch doctor");
                }

                const data: DatabaseDoctor = await response.json();

                setDoctor({
                    id: data.id,
                    name: data.name || "Unknown Doctor",
                    specialty: data.specialty || "Unknown Specialty",
                    experience: data.experience ?? 0, 
                    rating: data.rating ?? 4, 
                    image: data.image || "/defaultDoctor.png",
                    location: data.location || "Not specified"
                });
            } catch (err) {
                setError("Failed to load doctor information");
                console.error(err);
            }
        };

        if (params.id) {
            console.log("Doctor ID from useParams:", params.id);
            fetchDoctor();
        }
    }, [params.id]);

    if (error) return <div className="text-red-500">{error}</div>;
    if (!doctor) return <div className="text-gray-600">Loading...</div>;
    
    return <DoctorPage doctor={doctor} />;
}
