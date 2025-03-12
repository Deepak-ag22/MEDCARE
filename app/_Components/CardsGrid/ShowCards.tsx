import CardComp from "../Card/Card";
import Search from "../SearchBar/Search";
import styles from "./CardsGrid.module.css";

const doctors = [
  {
    id: 1,
    name: "Dr. Jane Doe",
    degree: "MBBS",
    specialty: "Dentist",
    experience: "9 Years",
    rating: 4,
    image: "https://www.shutterstock.com/image-vector/male-doctor-smiling-happy-face-600nw-2481032615.jpg",
  },
  {
    id: 2,
    name: "Dr. Sam Wilson",
    degree: "BDS",
    specialty: "Dentist",
    experience: "5 Years",
    rating: 5,
    image: "https://www.shutterstock.com/image-vector/male-doctor-smiling-happy-face-600nw-2481032615.jpg",
  },
  {
    id: 3,
    name: "Dr. Pepper Potts",
    degree: "BHMS",
    specialty: "Dentist",
    experience: "5 Years",
    rating: 4,
    image: "https://www.shutterstock.com/image-vector/male-doctor-smiling-happy-face-600nw-2481032615.jpg",
  },
  {
    id: 4,
    name: "Dr. Bruce Banner",
    degree: "MD",
    specialty: "Neurologist",
    experience: "15 Years",
    rating: 5,
    image: "https://www.shutterstock.com/image-vector/male-doctor-smiling-happy-face-600nw-2481032615.jpg",
  },
  {
    id: 5,
    name: "Dr. Tony Stark",
    degree: "MBBS",
    specialty: "Cardiologist",
    experience: "20 Years",
    rating: 5,
    image: "https://www.shutterstock.com/image-vector/male-doctor-smiling-happy-face-600nw-2481032615.jpg",
  },
  {
    id: 6,
    name: "Dr. Natasha Romanoff",
    degree: "MD",
    specialty: "Pediatrician",
    experience: "10 Years",
    rating: 4,
    image: "https://www.shutterstock.com/image-vector/male-doctor-smiling-happy-face-600nw-2481032615.jpg",
  },
  {
    id: 7,
    name: "Dr. Steve Rogers",
    degree: "MBBS",
    specialty: "Orthopedic Surgeon",
    experience: "12 Years",
    rating: 5,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 8,
    name: "Dr. Wanda Maximoff",
    degree: "MD",
    specialty: "Psychiatrist",
    experience: "8 Years",
    rating: 4,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 9,
    name: "Dr. Stephen Strange",
    degree: "MBBS",
    specialty: "Neurosurgeon",
    experience: "18 Years",
    rating: 5,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 10,
    name: "Dr. Carol Danvers",
    degree: "BAMS",
    specialty: "General Physician",
    experience: "7 Years",
    rating: 4,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 11,
    name: "Dr. Scott Lang",
    degree: "BHMS",
    specialty: "Dermatologist",
    experience: "6 Years",
    rating: 4,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 12,
    name: "Dr. Peter Parker",
    degree: "MBBS",
    specialty: "ENT Specialist",
    experience: "5 Years",
    rating: 5,
    image: "https://via.placeholder.com/150",
  },
];

export default function ShowCards() {
  return (
    <div className={styles.pageContainer}>
      <Search/>
      <div className={styles.infoText}>
          <p className={styles.docCount}> {doctors.length} doctors available</p>
          <p className={styles.subText}>Book appointments with minimum wait-time & verified doctor details</p>
      </div>
      
      <div className={styles.mainContent}>
        <div className={styles.filtersContainer}>
          <div className={styles.filterHeader}>
            <p>Filter By:</p>
            <button className={styles.resetButton}>Reset</button>
          </div>

          <div className={styles.filterSection}>
            <h4 className={styles.filterTitle}>Rating</h4>
            <div className={styles.filterOptions}>
              <label className={styles.filterOption}>
                <input type="radio" name="rating" value="show-all" defaultChecked />
                <span>Show All</span>
              </label>
              <label className={styles.filterOption}>
                <input type="radio" name="rating" value="5" />
                <span>5 star</span>
              </label>
              <label className={styles.filterOption}>
                <input type="radio" name="rating" value="4" />
                <span>4 star</span>
              </label>
              <label className={styles.filterOption}>
                <input type="radio" name="rating" value="3" />
                <span>3 star</span>
              </label>
              <label className={styles.filterOption}>
                <input type="radio" name="rating" value="2" />
                <span>2 star</span>
              </label>
            </div>
          </div>

          <div className={styles.filterSection}>
            <h4 className={styles.filterTitle}>Experience</h4>
            <div className={styles.filterOptions}>
              <label className={styles.filterOption}>
                <input type="radio" name="experience" value="15+" defaultChecked />
                <span>15+ years</span>
              </label>
              <label className={styles.filterOption}>
                <input type="radio" name="experience" value="10-15" />
                <span>10-15 years</span>
              </label>
              <label className={styles.filterOption}>
                <input type="radio" name="experience" value="5-10" />
                <span>5-10 years</span>
              </label>
              <label className={styles.filterOption}>
                <input type="radio" name="experience" value="3-5" />
                <span>3-5 years</span>
              </label>
              <label className={styles.filterOption}>
                <input type="radio" name="experience" value="1-3" />
                <span>1-3 years</span>
              </label>
              <label className={styles.filterOption}>
                <input type="radio" name="experience" value="0-1" />
                <span>0-1 years</span>
              </label>
            </div>
          </div>

          <div className={styles.filterSection}>
            <h4 className={styles.filterTitle}>Gender</h4>
            <div className={styles.filterOptions}>
              <label className={styles.filterOption}>
                <input type="radio" name="gender" value="any" defaultChecked />
                <span>Show all</span>
              </label>
              <label className={styles.filterOption}>
                <input type="radio" name="gender" value="male" />
                <span>Male</span>
              </label>
              <label className={styles.filterOption}>
                <input type="radio" name="gender" value="female" />
                <span>Female</span>
              </label>
            </div>
          </div>
        </div>

        <div className={styles.gridContainer}>
          {doctors.map((doctor) => (
            <CardComp key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </div>
    </div>
  );
}