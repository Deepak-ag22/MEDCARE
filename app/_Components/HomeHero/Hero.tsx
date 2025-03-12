import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.textContainer}>
        <h1>Health in Your Hands.</h1>
        <p>
          Take control of your healthcare with CareMate. Book appointments with
          ease, explore health blogs, and stay on top of your well-being, all in
          one place.
        </p>
        <button className={styles.ctaButton}>Get Started</button>
      </div>

      <div className={styles.heroSection}>
      </div>
    </section>
  );
}
