import React from "react";
import { Loader2 } from "lucide-react";
import styles from "./loading-spinner.module.css";
import clx from "clsx";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingSpinner = ({
  size = "md",
  className = "",
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: styles.spinnerSm,
    md: styles.spinnerMd,
    lg: styles.spinnerLg,
  };

  return (
    <div
      className={styles.container}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2
        className={clx(styles.spinner, sizeClasses[size], className)}
        aria-hidden="true"
      />
    </div>
  );
};

export default LoadingSpinner;
