import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';

interface ProtectedRouteProps {
  module: string;
  action?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  module,
  action,
  fallback,
  children,
}) => {
  const { canAccess, hasPermission, loading } = usePermissions();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading permissions...</div>
      </div>
    );
  }

  // Check if user has access to the module
  if (!canAccess(module)) {
    return (
      fallback || (
        <div className="flex items-center justify-center h-screen bg-red-50 border border-red-200 rounded-lg">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-800 mb-2">Access Denied</h2>
            <p className="text-red-600">You don't have permission to access this module.</p>
          </div>
        </div>
      )
    );
  }

  // If specific action is required, check it
  if (action && !hasPermission(module, action)) {
    return (
      fallback || (
        <div className="flex items-center justify-center h-screen bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-center">
            <h2 className="text-xl font-bold text-yellow-800 mb-2">Insufficient Permissions</h2>
            <p className="text-yellow-600">
              You don't have permission to {action} in this module.
            </p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
