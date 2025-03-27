"use client"
import Image from 'next/image';
import styles from './Doctordetail.module.css';
import Link from 'next/link';

interface Doctor {
    id: number;
    name: string;
    specialty: string;
    experience: number;
    location: string;
    rating: number;
    image: string;
}

interface DoctorPageProps {
    doctor: Doctor;
}

export default function DoctorPage({ doctor }: DoctorPageProps) {
    return (
        <>
            <div className={styles.backgroundContainer}></div> {/* Background */}
            <div className={styles.container}>
                <div className={styles.profileCard}>
                    <div className={styles.leftSection}>
                        <Image
                            src={doctor.image}
                            alt={doctor.name}
                            width={150}
                            height={150}
                            className={styles.doctorImage}
                        />
                    </div>
                    <div className={styles.rightSection}>
                        <h1 className={styles.name}>{doctor.name}</h1>
                        <p className={styles.specialty}>{doctor.specialty}</p>
                        <p className={styles.experience}><strong>Experience:</strong> {doctor.experience} years</p>
                        <p className={styles.location}><strong>Location:</strong> {doctor.location}</p>
                        <div className={styles.rating}>
                            <span className={styles.ratingValue}>{doctor.rating.toFixed(1)}</span>
                            <Image src="/star.svg" alt="star" width={20} height={20} />
                        </div>
                        <p className={styles.availability}><strong>Availability:</strong> Mon-Sun (as per slots)</p>
                        <div className={styles.actions}>
                            <Link href={`/bookingpage/${doctor.id}`}>
                                <button className={styles.bookButton}>Book Appointment</button>
                            </Link>
                            <button className={styles.contactButton}>Contact Doctor</button>
                        </div>
                    </div>
                </div>
                <div className={styles.aboutSection}>
                    <h2>About Dr. {doctor.name}</h2>
                    <p>Dr. {doctor.name} is a highly experienced {doctor.specialty} known for providing excellent patient care and medical expertise.</p>
                    <p>With over {doctor.experience} years in the field, {doctor.name} has treated numerous cases with utmost professionalism and dedication.</p>
                </div>
            </div>
        </>
    );
}
