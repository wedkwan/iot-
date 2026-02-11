import React from 'react';

interface MaterialIconProps {
  icon: string;
  size?: number;
  filled?: boolean;
  className?: string;
}

const MaterialIcon: React.FC<MaterialIconProps> = ({ 
  icon, 
  size = 24, 
  filled = false,
  className = '' 
}) => {
  return (
    <span 
      className={`material-symbols-outlined ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`
      }}
    >
      {icon}
    </span>
  );
};

export default MaterialIcon;