import { ArrowLeft } from "lucide-react";
import { Button } from "./shadcn/button";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";

function BackButton({
  location,
  className,
}: {
  location: string;
  className?: string;
}) {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => {
        navigate(location);
      }}
      variant="outline"
      size="icon"
      className={cn(
        "mb-4 size-8 rounded-lg border-border/80 text-muted-foreground shadow-2xs transition-colors hover:bg-muted/50 hover:text-foreground cursor-pointer",
        className
      )}
      title="Go back"
    >
      <ArrowLeft className="size-4" />
    </Button>
  );
}

export default BackButton;
