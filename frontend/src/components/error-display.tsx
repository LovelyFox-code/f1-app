import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./button";
import styles from "./error-display.module.css";

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

const ErrorDisplay = ({
  message = "Something went wrong",
  onRetry,
}: ErrorDisplayProps) => {
  return (
    <div className={styles.container} role="alert" aria-live="assertive">
      <AlertCircle className={styles.icon} aria-hidden="true" />

      <h3 className={styles.title}>Error</h3>
      <p className={styles.message}>{message}</p>

      {onRetry && (
        <Button
          onClick={onRetry}
          className={styles.retryButton}
          variant="outline"
          aria-label="Retry loading data"
        >
          <RefreshCw className={styles.retryIcon} aria-hidden="true" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorDisplay;
