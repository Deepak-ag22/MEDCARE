"use client"; 

import React from "react";
import styles from "./Blog.module.css";
import Link from "next/link";

const blogs = [
  {
    title: "10 Key Strategies for a Healthier Lifestyle",
    description: "Simple yet effective methods to improve your health and fitness.",
    link: "https://www.healthline.com/nutrition/10-healthy-lifestyle-tips",
  },
  {
    title: "Superfoods That Enhance Your Immune System",
    description: "A look at nutrient-rich foods that can help boost your immunity.",
    link: "https://www.medicalnewstoday.com/articles/322412",
  },
  {
    title: "Workout Routines Tailored for All Ages",
    description: "Discover exercise plans suitable for different age groups and fitness levels.",
    link: "https://www.self.com/story/best-workouts-for-every-age",
  },
  {
    title: "The Significance of Mental Health",
    description: "Understanding the vital role mental well-being plays in our lives.",
    link: "https://www.verywellmind.com/importance-of-mental-health-5092459",
  },
];

const HealthBlog = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Health Blog</h1>
      <p className={styles.subtext}>Stay updated with the latest health insights and tips.</p>
      <div className={styles.blogList}>
        {blogs.map((blog, index) => (
          <div key={index} className={styles.card}>
            <h2>{blog.title}</h2>
            <p>{blog.description}</p>
            <Link href={blog.link} target="_blank" className={styles.link}>
              Read More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthBlog;

// export async function getStaticProps() {
//     return {
//       props: {
//         blogs, 
//       },
//     };
//   }