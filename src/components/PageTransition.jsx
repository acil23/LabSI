import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NeuralTransition from './NeuralTransition';
import './transitions.css';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fadeIn');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setIsTransitioning(true);
      setTransitionStage('fadeOut');
      
      // Scroll to top saat mulai transisi
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location, displayLocation]);

  const handleAnimationEnd = () => {
    if (transitionStage === 'fadeOut') {
      setTransitionStage('fadeIn');
      setDisplayLocation(location);
      
      // Tunggu sebentar sebelum fade in
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    } else if (transitionStage === 'fadeIn') {
      setIsTransitioning(false);
    }
  };

  return (
    <div className="page-transition-wrapper">
      {/* Neural network animation overlay */}
      {isTransitioning && (
        <>
          <NeuralTransition stage={transitionStage} />
          <div className={`transition-overlay ${isTransitioning ? 'active' : ''}`} />
        </>
      )}
      
      {/* Page content dengan animasi */}
      <div
        className={`page-content ${transitionStage}`}
        onAnimationEnd={handleAnimationEnd}
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PageTransition;
