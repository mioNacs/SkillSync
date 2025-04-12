import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-700 mb-4">
            We encountered an error while rendering this component. Please try refreshing the page.
          </p>
          <details className="text-left bg-gray-50 p-4 rounded-md mb-4">
            <summary className="cursor-pointer text-indigo-600 font-medium">Technical Details</summary>
            <p className="mt-2 text-gray-800 text-sm overflow-auto">
              {this.state.error && this.state.error.toString()}
            </p>
            <div className="mt-2 text-gray-600 text-xs">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </div>
          </details>
          <button 
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 