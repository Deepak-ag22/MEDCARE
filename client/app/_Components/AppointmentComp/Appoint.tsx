"use client";

import Calendar from "../MyCalenderComp/Calender";
import style from "./booking.module.css";
import { useState, useEffect } from "react";
import { formatTime } from "@/utils/formatTime";
import { validateSlots } from "@/utils/validSlot";
import { toast } from "sonner";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

export interface Slot {
    id: number;
    doctor_id: number;
    slot_time: string;
    slot_type: "morning" | "evening";
    is_available: boolean;
}

interface AppointmentProps {
    doctorId: number;
}

export default function Appointment({ doctorId }: AppointmentProps) {
    const [offlineGreen, setOfflineGreen] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );
    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
    const [appointmentType, setAppointmentType] = useState<"online" | "offline">("online");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const HospitalList = ["MediCareHeart Institute, Okhla Road"];

    useEffect(() => {
        if (doctorId) {
            fetchAvailableSlots();
        }
    }, [selectedDate, doctorId]);

    // Fetch available slots and validate them
    const fetchAvailableSlots = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/appointments/available-slots/${doctorId}/${selectedDate}`, {
                headers: { Accept: "application/json" },
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                toast.error(errorData.message || "Failed to fetch slots");
                setError(errorData.message || "Failed to fetch slots");
                return;
            }

            const data = await response.json();
            setSlots(validateSlots(data, selectedDate));
        } catch (err) {
            toast.error("Network error. Please check your connection and try again.");
            setError("Network error. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleBookAppointment = async () => {
        if (!selectedSlotId) {
            const errorMessage = "Please select a time slot";
            setError(errorMessage);
            toast.error(errorMessage);
            return;
        }

        setLoading(true);
        updateSlotAvailability(selectedSlotId, false);

        try {
            const response = await fetch(`${API_BASE_URL}/appointments/book`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    doctorId,
                    slotId: selectedSlotId,
                    appointmentType,
                    appointmentDate: selectedDate,
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                handleBookingError(data, selectedSlotId);
                return;
            }

            setSelectedSlotId(null);
            toast.success(data.message || "Appointment booked successfully!");
            setTimeout(fetchAvailableSlots, 500); // Refresh slots after booking
        } catch (err) {
            updateSlotAvailability(selectedSlotId, true); // Revert slot availability
            toast.error("Network error. Please check your connection and try again.");
            setError("Network error. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    const updateSlotAvailability = (slotId: number, isAvailable: boolean) => {
        setSlots((currentSlots) =>
            currentSlots.map((slot) =>
                slot.id === slotId ? { ...slot, is_available: isAvailable } : slot
            )
        );
    };

    const handleBookingError = (data: any, slotId: number) => {
        updateSlotAvailability(slotId, true); // Revert slot availability
        if (data.message?.includes("already booked")) {
            toast.error(data.message || "Slot already booked");
            fetchAvailableSlots();
        } else {
            toast.error(data.message || "Failed to book appointment");
            setError(data.message || "Failed to book appointment");
        }
    };

    const morningSlots = slots.filter((slot) => slot.slot_type === "morning");
    const eveningSlots = slots.filter((slot) => slot.slot_type === "evening");

    const handleToggle = (type: "online" | "offline") => {
        setAppointmentType(type);
        setOfflineGreen(type === "online");
    };

    return (
        <main className={style.main}>
            <div className={style.info}>
                <h1>Book your next doctor's visit in Seconds</h1>
                <p>
                    Medcare helps you find the best healthcare provider by
                    specialty, location, and more, ensuring you get the care you
                    need.
                </p>
            </div>
            <div className={style.slotsBackground}>
                <div className={style.slots}>
                    <div className={style.schedule}>
                        <p>Schedule Appointment</p>
                        <button onClick={handleBookAppointment} disabled={loading || !selectedSlotId}>
                            {loading ? "Booking..." : "Book Appointment"}
                        </button>
                    </div>
                    <div className={style.consult}>
                        <button className={offlineGreen ? style.bgGreen : style.White} onClick={() => handleToggle("online")}>
                            Book Video Consult
                        </button>
                        <button className={!offlineGreen ? style.bgGreen : style.White} onClick={() => handleToggle("offline")}>
                            Book Hospital Visit
                        </button>
                    </div>
                    <select className={style.hospitalList}>
                        {HospitalList.map((hospital, index) => (
                            <option key={index}>{hospital}</option>
                        ))}
                    </select>
                    <Calendar onDateSelect={(date: string) => setSelectedDate(date)} />
                    {error && <div className={style.error}>{error}</div>}
                    <div className={style.availableSlots}>
                        <SlotSection title="Morning" slots={morningSlots} selectedSlotId={selectedSlotId} setSelectedSlotId={setSelectedSlotId} />
                    </div>
                    <div className={style.availableSlots}>
                        <SlotSection title="Evening" slots={eveningSlots} selectedSlotId={selectedSlotId} setSelectedSlotId={setSelectedSlotId} />
                    </div>
                </div>
            </div>
        </main>
    );
}

const SlotSection = ({ title, slots, selectedSlotId, setSelectedSlotId }: { title: string; slots: Slot[]; selectedSlotId: number | null; setSelectedSlotId: (id: number | null) => void; }) => (
    <>
        <div className={style.sunCountOfSlots}>
            <div className={style.sunMorning}>
                <div className={title === "Morning" ? style.sun : style.sunset}></div>
                <div className={style.morning}>{title}</div>
            </div>
            <div className={style.countOfSlots}>
                <span>Slots {slots.filter((s) => s.is_available).length}</span>
            </div>
        </div>
        <div className={style.horizontalLine}></div>
        <div className={style.availableSlotsContainer}>
            {slots.length > 0 ? (
                slots.map((slot) => (
                    <button
                        key={slot.id}
                        onClick={() => slot.is_available && setSelectedSlotId(slot.id)}
                        className={`${slot.id === selectedSlotId ? style.bgGreen : style.bgWhite} ${!slot.is_available ? style.disabled : ""}`}
                        disabled={!slot.is_available}
                    >
                        {formatTime(slot.slot_time)}
                    </button>
                ))
            ) : (
                <div className={style.noSlots}>No {title.toLowerCase()} slots available</div>
            )}
        </div>
    </>
);