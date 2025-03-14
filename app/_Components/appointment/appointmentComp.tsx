"use client"
import style from "./booking.module.css"
import { useState,useEffect } from "react"
export default function Appointment(){
    const [offileGreen,setOffineGreen]=useState(true);
    const [HospitalList,setHospitalList]=useState(["MediCareHeart Institute, Okhla Road"]);
    const [slotsAvailable,setSlotsAvailable]=useState([{time:"9:00 AM",isAvailable:true},
        {time:"9:30 AM",isAvailable:true},
        {time:"10:00 AM",isAvailable:true},
        {time:"10:30 AM",isAvailable:false},
        {time:"11:00 AM",isAvailable:true},
        {time:"11:30 AM",isAvailable:false},
        {time:"12:00 PM",isAvailable:true},
        {time:"12:30 AM",isAvailable:true},
    ]);
    const [slotsAvailableE,setSlotsAvailableE]=useState([{time:"9:00 AM",isAvailable:true},
      {time:"3:00 AM",isAvailable:true},
      {time:"3:30 AM",isAvailable:true},
      {time:"4:00 AM",isAvailable:false},
      {time:"4:30 AM",isAvailable:true},
      {time:"11: AM",isAvailable:false},
      {time:"12:00 PM",isAvailable:true},
      {time:"12:30 AM",isAvailable:true},
    ]);
    const [slotSelected,setSlotSelected]=useState(-1);
    const [slotSelectedE,setSlotSelectedE]=useState(-1);
    const [modeSelected,setModeSelected]=useState(0);
    const [count,setCount]=useState(0);
     useEffect(()=>{
      slotsAvailable.forEach((data)=>{
        if(data.isAvailable)
        setCount(count+1);
      })
         
     },[])
    function handleToggle(i:any){
      if(i==1&&offileGreen){
        return;
      }
      else if(i==2&&!offileGreen){
        return;
      }
      setOffineGreen(!offileGreen);
      setModeSelected(i);
    }
    function handleSlotSelection(i:any){
      setSlotSelected(i);
      
    }
    function handleSlotSelectionE(i:any){
      setSlotSelectedE(i);
      
    }
    return (
      <main className={style.main}>
        <div className={style.info}>
           <h1>
            Book your next doctor's visit in Seconds
           </h1>
           <p>
           CareMate helps you find the best healthcare provider by specialty, 
           location, and more, ensuring you get the care you need.
           </p>
        </div>
        <div className={style.slotsBackground}>
           <div className={style.slots}>
              <div className={style.schedule}>
           <p>Schedule Appointment</p>
           <button>Book Appointment</button>
              </div>
              <div className={style.consult}>
                 <button className={(offileGreen)?style.bgGreen:style.White} onClick={()=>handleToggle(1)}>Book Video Consult</button>
                 <button className={(!offileGreen)?style.bgGreen:style.White} onClick={()=>handleToggle(2)}>Book Hospital Visit</button>
              </div>
              <select className={style.hospitalList}>
                <option>{HospitalList[0]}</option>
              </select>

              
              <div className={style.availableSlots}>
                <div className={style.sunCountOfSlots}>
                        <div className={style.sunMorning}>
                           <div className={style.sun}></div>
                           <div className={style.morning}>Morning</div>
                        </div>
                        <div className={style.countOfSlots}>
                          <span> Slots{count} </span>
                        </div>
                </div>
                <div className={style.horizontalLine}></div>
              <div className={style.availableSlotsContainer}>
                {slotsAvailable.map((data,i)=>{
                    return (
                     <button onClick={()=>handleSlotSelection(i)} className={(i==slotSelected)?style.bgGreen:style.bgWhite} key={i}>{data.time}</button>
                    )
                })}
              </div>
              </div>
              <div className={style.availableSlots}>
                <div className={style.sunCountOfSlots}>
                        <div className={style.sunMorning}>
                           <div className={style.sun}></div>
                           <div className={style.morning}>Evening</div>
                        </div>
                        <div className={style.countOfSlots}>
                          <span> Slots{count} </span>
                        </div>
                </div>
                <div className={style.horizontalLine}></div>
              <div className={style.availableSlotsContainer}>
                {slotsAvailableE.map((data,i)=>{
                    return (
                     <button onClick={()=>handleSlotSelectionE(i)} className={(i==slotSelectedE)?style.bgGreen:style.bgWhite} key={i}>{data.time}</button>
                    )
                })}
              </div>
              </div>
              
           </div>
        </div>
      </main>
    )
}