import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { selectCourse } from '../store/slices/courseSlice';
import { BookOpen, Calendar, User, ArrowRight, GraduationCap, Plus, Edit2 } from 'lucide-react';
import AddCourseForm from './AddCourseForm';
import EditCourseForm from './EditCourseForm';

const CourseList: React.FC = () => {
  const { courses } = useAppSelector(state => state.course);
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<string | null>(null);

  const isAdmin = isAuthenticated && user?.role === 'admin';

  const handleCourseSelect = (courseId: string) => {
    dispatch(selectCourse(courseId));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'technology':
        return 'bg-blue-100 text-blue-800';
      case 'marketing':
        return 'bg-green-100 text-green-800';
      case 'data science':
        return 'bg-purple-100 text-purple-800';
      case 'design':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <GraduationCap className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to Course Tracker
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Track your learning journey with our comprehensive course management system. 
              Select a course below to begin your educational adventure.
            </p>
          </div>
        </div>
      </div>

      {/* Course List Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-12">
          <div className="text-center flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Courses</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our selection of expertly crafted courses designed to advance your skills and career.
            </p>
          </div>
          
          {isAdmin && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Add Course</span>
            </button>
          )}
        </div>

        {/* Add Course Form */}
        {showAddForm && (
          <div className="mb-8">
            <AddCourseForm onClose={() => setShowAddForm(false)} />
          </div>
        )}

        {/* Edit Course Form */}
        {editingCourse && (
          <div className="mb-8">
            <EditCourseForm 
              courseId={editingCourse} 
              onClose={() => setEditingCourse(null)} 
            />
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group relative"
            >
              {/* Admin Controls */}
              {isAdmin && (
                <div className="absolute top-4 right-4 z-10 flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCourse(course.id);
                    }}
                    className="p-2 bg-white bg-opacity-90 text-blue-600 rounded-lg hover:bg-opacity-100 transition-all duration-200 shadow-sm"
                    title="Edit course"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div
                onClick={() => handleCourseSelect(course.id)}
                className="cursor-pointer transform hover:scale-[1.02] transition-transform duration-300"
              >
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(course.category)}`}>
                      {course.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Course Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-2" />
                      <span>{course.instructor}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(course.startDate)} - {formatDate(course.endDate)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span>{course.duration} • {course.totalWeeks} weeks</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      16-week program
                    </div>
                    <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                      <span className="mr-2">Start Learning</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {courses.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Available</h3>
            <p className="text-gray-600 mb-6">
              {isAdmin ? 'Get started by adding your first course.' : 'Courses will be added by administrators soon.'}
            </p>
            {isAdmin && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-200"
              >
                Add First Course
              </button>
            )}
          </div>
        )}

        {/* Features Section */}
        <div className="mt-20 grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive Tracking</h3>
            <p className="text-gray-600">Track coursework, reading materials, and assignments all in one place.</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Weekly Progress</h3>
            <p className="text-gray-600">Monitor your progress week by week with visual indicators and completion tracking.</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <User className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Role-Based Access</h3>
            <p className="text-gray-600">Students can view and track progress while administrators manage content.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseList;