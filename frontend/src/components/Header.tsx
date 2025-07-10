import React from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { logout, showLoginForm } from '../store/slices/authSlice';
import { deselectCourse } from '../store/slices/courseSlice';
import { BookOpen, User, LogOut, ArrowLeft, Shield } from 'lucide-react';

const Header: React.FC = () => {
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const { selectedCourse } = useAppSelector(state => state.course);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleBackToCourses = () => {
    dispatch(deselectCourse());
  };

  const handleAdminLogin = () => {
    dispatch(showLoginForm());
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            {selectedCourse && (
              <button
                onClick={handleBackToCourses}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors mr-4"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm font-medium">Back to Courses</span>
              </button>
            )}
            
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {selectedCourse ? selectedCourse.title : 'Course Tracker'}
              </h1>
              <p className="text-sm text-gray-500">
                {selectedCourse ? `${selectedCourse.duration} Program` : '16-Week Programs'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Show admin info if authenticated */}
            {isAuthenticated && user && (
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">{user.name}</span>
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                  user.role === 'admin' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.role}
                </span>
              </div>
            )}

            {/* Admin button or logout button */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            ) : (
              <button
                onClick={handleAdminLogin}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-105"
              >
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;