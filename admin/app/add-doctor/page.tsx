"use client"
import DoctorForm from "../_Components/doctorComp/DoctorForm";

export default function Doctor(){
    const handleDoctorAdded = (doctor: any) => {
        console.log('Doctor added:', doctor);
    };

    return(
        <DoctorForm onDoctorAdded={handleDoctorAdded}/>
    )
}