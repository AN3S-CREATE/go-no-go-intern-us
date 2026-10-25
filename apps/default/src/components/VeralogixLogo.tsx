import React from 'react';

export const VeralogixLogo: React.FC = () => {
  return (
    <div className="fixed top-3 left-3 sm:top-4 sm:left-4 z-50 animate-fade-in">
      <img
        src="https://files.taskade.com/space-files/e697b425-b607-4541-a53d-3d87004d788a/original/KeG9tjt.png"
        alt="NeuroLogix Logo"
        className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
        style={{
          filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.4))',
        }}
      />
    </div>
  );
};
