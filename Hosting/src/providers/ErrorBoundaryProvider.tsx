import { ReactNode, useCallback, useEffect } from 'react';
import {
  FallbackProps,
  ErrorBoundary,
  useErrorBoundary,
} from 'react-error-boundary';
import { ErrorScreen } from 'components/pages/ErrorScreen';

interface ChildrenProps {
  children: ReactNode;
}

export const ErrorBoundaryProvider = ({ children }: ChildrenProps) => {
  const renderErrorScreen = useCallback(
    (props: FallbackProps) => <ErrorScreen error={props.error} />,
    [],
  );

  return (
    <ErrorBoundary FallbackComponent={renderErrorScreen}>
      <GlobalErrorHandler>{children}</GlobalErrorHandler>
    </ErrorBoundary>
  );
};

const GlobalErrorHandler = ({ children }: ChildrenProps) => {
  const handleError = useErrorBoundary();

  useEffect(() => {
    // 非同期エラーをグローバルキャッチ
    const handleGlobalError = (event: unknown) => {
      if (event instanceof ErrorEvent) {
        handleError.showBoundary(event.error);
      } else if (event instanceof PromiseRejectionEvent) {
        handleError.showBoundary(event.reason);
      } else {
        handleError.showBoundary(event);
      }
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleGlobalError);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleGlobalError);
    };
  }, [handleError]);

  return children;
};
