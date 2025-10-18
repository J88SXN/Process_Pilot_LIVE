
import { ReactNode, useState } from "react";

interface HoverCardProps {
  children: ReactNode;
  className?: string;
}

const HoverCard = ({ children, className = "" }: HoverCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
        isHovered ? "transform scale-[1.02] shadow-lg" : ""
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-600/10 opacity-0 transition-opacity duration-300 rounded-xl pointer-events-none z-0" 
           style={{ opacity: isHovered ? 1 : 0 }} />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default HoverCard;
