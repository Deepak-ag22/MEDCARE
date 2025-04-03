import Image from "next/image";
import styles from "./Card.module.css";
import Link from "next/link";

interface Doctor {
    id: number;
    name: string;
    degree: string;
    specialty: string;
    rating: number;
    image: string;
    experience: string;
}

interface CardProps {
    doctor: Doctor;
}

export default function CardComp({ doctor }: CardProps) {
    return (
        <div className={styles.card}>
            <Link href={`/doctor/${doctor.id}`} className={styles.imageContainer}>
                    <Image
                    src={doctor.image}
                    alt={doctor.name}
                    width={100}
                    height={100}
                    className={styles.profileImage}
                />
            </Link>
            <Link href={`/doctor/${doctor.id}`} className={styles.name}>
                {doctor.name}, {doctor.degree}
            </Link>
            <div className={styles.infoContainer}>
                <Image
                    src={"/Stethoscope.svg"}
                    width={20}
                    height={20}
                    alt="Stethoscope"
                />
                <p className={styles.experience}>{doctor.specialty}</p>
                <Image
                    src={"/Hourglass.svg"}
                    width={20}
                    height={20}
                    alt="Hourglass"
                />
                <p className={styles.experience}>{doctor.experience} years</p>
            </div>
            <div className={styles.ratingContainer}>
                Rating: {doctor.rating}{" "}
                <Image alt="star" width={20} height={20} src={"/star.svg"} />
            </div>
            <Link href={`/doctorbooking/${doctor.id}`} className={styles.bookButton}>
                Book Appointment
            </Link>
        </div>
    );
}