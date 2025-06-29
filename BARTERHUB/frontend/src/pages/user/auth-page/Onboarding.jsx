import React, { useState } from 'react';
import styles from './onboarding.module.css'; // Assuming styles are in this file
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Welcome to BarterHub',
      description: 'A platform for exchanging pre-loved items and making sustainable trades.',
      image: '/slide1.svg', 
    },
    {
      title: 'Why BarterHub?',
      description: 'Join a community that makes trading goods easy, fun, and rewarding.',
      image: '/slide2.svg', 
    },
    {
      title: 'Get Started Today!',
      description: 'Sign up now and start swapping items with others in your community.',
      image: '/slide3.svg', 
    },
  ];

  const handleNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };


  return (
    <main className={styles.container}>
      <div className={styles.slideContainer}>
        <h2 className={styles.title}>{slides[currentSlide].title}</h2>
        <p className={styles.description}>{slides[currentSlide].description}</p>
        <img 
          src={slides[currentSlide].image} 
          alt="Onboarding Slide" 
          className={styles.slideImage} 
        />
        
        <div className={styles.buttonContainer}>
          {currentSlide > 0 && (
            <button className={styles.prevBtn} onClick={handlePrevSlide}>Back</button>
          )}
          {currentSlide < slides.length - 1 ? (
            <button className={styles.nextBtn} onClick={handleNextSlide}>Next</button>
          ) : (
            <button className={styles.ctaBtn} onClick={() => navigate("/login")}>Log In / Create Account</button>
          )}
        </div>
      </div>
    </main>
  );
}
