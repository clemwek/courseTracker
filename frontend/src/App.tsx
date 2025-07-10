import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppSelector } from './hooks/redux';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import CourseList from './components/CourseList';
import WeekSelector from './components/WeekSelector';
import WeekView from './components/WeekView';

const AppContent: React.FC = () => {
  const { isAuthenticated, showLogin } = useAppSelector(state => state.auth);
  const { selectedCourse } = useAppSelector(state => state.course);

  // Show login form when admin login is requested
  if (showLogin && !isAuthenticated) {
    return <LoginForm />;
  }

  // Show course list first (no auth required)
  if (!selectedCourse) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <CourseList />
      </div>
    );
  }

  // Show course content (no auth required for students)
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <WeekSelector />
          </div>
          <div className="lg:col-span-3">
            <WeekView />
          </div>
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;