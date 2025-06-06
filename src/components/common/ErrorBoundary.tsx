import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onReset?: () => void;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // You can log the error to an error reporting service
        console.error('Error caught by ErrorBoundary:', error, errorInfo);

        // Call the onError callback if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    handleReset = (): void => {
        // Reset the state
        this.setState({
            hasError: false,
            error: null,
        });

        // Call the onReset callback if provided
        if (this.props.onReset) {
            this.props.onReset();
        }
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // If a custom fallback is provided, render it
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Otherwise, render the default error UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="max-w-lg w-full bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                            <AlertTriangle className="h-8 w-8 text-red-600" aria-hidden="true" />
                        </div>
                        <h2 className="mt-6 text-2xl font-semibold text-gray-900">Something went wrong</h2>
                        <p className="mt-3 text-gray-600">
                            We're sorry, but an unexpected error occurred. Our team has been notified, and we're working to fix the issue.
                        </p>
                        {this.state.error && (
                            <div className="mt-4 p-4 bg-gray-100 rounded-md overflow-x-auto text-left">
                                <p className="text-sm font-mono text-red-600">{this.state.error.toString()}</p>
                            </div>
                        )}
                        <div className="mt-6">
                            <Button
                                variant="primary"
                                icon={<RefreshCw className="w-5 h-5" />}
                                onClick={this.handleReset}
                            >
                                Try Again
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        // If there's no error, render the children
        return this.props.children;
    }
}

export default ErrorBoundary;