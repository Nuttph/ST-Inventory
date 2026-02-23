import React from 'react';

// Simple error boundary to avoid white screens when a component throws.
// Displays a friendly message and logs the error to console.
export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('ErrorBoundary caught an error:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center h-full p-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4">เกิดข้อผิดพลาด</h1>
                        <p className="text-lg">โปรดลองรีเฟรชหน้าหรือกลับมาทีหลัง</p>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
