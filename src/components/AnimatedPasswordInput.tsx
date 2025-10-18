
import { useState, useEffect } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AnimatedPasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AnimatedPasswordInput = ({ 
  className, 
  value, 
  onChange, 
  id, 
  placeholder,
  ...props 
}: AnimatedPasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastTyped, setLastTyped] = useState(0);
  
  // Trigger animation when typing
  useEffect(() => {
    if (value.length > 0) {
      setLastTyped(Date.now());
      setIsAnimating(true);
      
      // Reset animation after 1 second
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [value]);
  
  // Control eye position based on how recently user typed
  const getEyeClass = () => {
    if (!isAnimating) return "translate-y-0";
    
    // Alternate between peeking and hiding
    const timeSinceTyped = Date.now() - lastTyped;
    if (timeSinceTyped < 300) return "-translate-y-[2px]"; // Eye peeking up
    if (timeSinceTyped < 600) return "translate-y-[1px]"; // Eye moving down
    if (timeSinceTyped < 900) return "-translate-y-[1px]"; // Eye peeking again but less
    return "translate-y-0"; // Eye returns to normal
  };

  return (
    <div className="relative">
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        className={className}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
      
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-all duration-200",
          isAnimating && "animate-pulse"
        )}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        <div className="relative w-5 h-5 overflow-hidden">
          {showPassword ? (
            <EyeIcon className={cn("absolute transition-transform duration-200", getEyeClass())} />
          ) : (
            <EyeOffIcon className={cn("absolute transition-transform duration-200", getEyeClass())} />
          )}
        </div>
      </button>
    </div>
  );
};

export { AnimatedPasswordInput };
