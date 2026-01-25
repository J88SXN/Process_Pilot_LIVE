
import { AlertCircle } from "lucide-react";

interface EmptyRequestStateProps {
  message?: string;
  description?: string;
}

export const EmptyRequestState = ({ 
  message = "No matching requests found", 
  description = "Try adjusting your search term" 
}: EmptyRequestStateProps) => {
  return (
    <div className="text-center p-12">
      <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-lg font-medium">{message}</p>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
