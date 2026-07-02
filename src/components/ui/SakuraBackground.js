import React, { useMemo, useContext } from 'react';
import { SettingsContext } from '../../contexts/SettingsContext';
import './SakuraBackground.css';

const SakuraBackground = () => {
  const { sakuraEnabled } = useContext(SettingsContext);

  // Generate random petals
  const petals = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => {
      const size = Math.random() * 12 + 8; // 8px to 20px
      const left = Math.random() * 100; // 0% to 100%
      const animationDuration = Math.random() * 10 + 5; // 5s to 15s
      const animationDelay = Math.random() * -15; // Random start time
      
      return {
        id: i,
        size,
        left,
        animationDuration,
        animationDelay,
      };
    });
  }, []);

  if (!sakuraEnabled) return null;

  return (
    <div className="sakura-container">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="petal"
          style={{
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            left: `${petal.left}vw`,
            animationDuration: `${petal.animationDuration}s, ${petal.animationDuration}s`,
            animationDelay: `${petal.animationDelay}s, ${petal.animationDelay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default SakuraBackground;
