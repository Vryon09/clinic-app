import blackLogoText from "@/ui/assets/images/black-logo-text.png";
import whiteLogoText from "@/ui/assets/images/white-logo-text.png";
import blackLogo from "@/ui/assets/images/black-logo.png";
import whiteLogo from "@/ui/assets/images/white-logo.png";
import { cn } from "@/lib/utils";

export interface AppLogoProps {
  variant?: "full" | "icon";
  className?: string;
  imageClassName?: string;
  alt?: string;
}

export function AppLogo({
  variant = "full",
  className,
  imageClassName,
  alt = "ClinicSync",
}: AppLogoProps) {
  const lightSrc = variant === "full" ? blackLogoText : blackLogo;
  const darkSrc = variant === "full" ? whiteLogoText : whiteLogo;

  return (
    <div className={cn("inline-flex items-center justify-center select-none", className)}>
      <img
        src={lightSrc}
        alt={alt}
        className={cn("block dark:hidden h-full w-full object-contain", imageClassName)}
      />
      <img
        src={darkSrc}
        alt={alt}
        className={cn("hidden dark:block h-full w-full object-contain", imageClassName)}
      />
    </div>
  );
}

export default AppLogo;
