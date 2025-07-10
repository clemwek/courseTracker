import React from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { setCurrentWeek } from '../store/slices/courseSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WeekSelector: React.FC = () => {
  const { weeks, currentWeek } = useAppSelector(state => state.course);
  const dispatch = useAppDispatch();

  const handlePrevWeek = () => {
    if (currentWeek > 1) {
      dispatch(setCurrentWeek(currentWeek - 1));
    }
  };

  const handleNextWeek = () => {
    if (currentWeek < 16) {
      dispatch(setCurrentWeek(currentWeek + 1));
    }
  };

  const getWeekProgress = (weekNum: number) => {
    const week = weeks.find(w => w.weekNumber === weekNum);
    if (!week || week.items.length === 0) return 0;
    const completed = week.items.filter(item => item.completed).length;
    return Math.round((completed / week.items.length) * 100);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Course Timeline</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevWeek}
            disabled={currentWeek === 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium text-gray-700 px-3">
            Week {currentWeek} of 16
          </span>
          <button
            onClick={handleNextWeek}
            disabled={currentWeek === 16}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {weeks.map((week) => {
          const progress = getWeekProgress(week.weekNumber);
          const isActive = week.weekNumber === currentWeek;
          
          return (
            <button
              key={week.weekNumber}
              onClick={() => dispatch(setCurrentWeek(week.weekNumber))}
              className={`relative p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-105'
              }`}
            >
              <div className="text-center">
                <div className="text-xs opacity-75 mb-1">Week</div>
                <div className="font-bold">{week.weekNumber}</div>
              </div>
              {progress > 0 && (
                <div className="absolute bottom-1 left-1 right-1">
                  <div className="bg-white bg-opacity-30 rounded-full h-1">
                    <div
                      className="bg-white rounded-full h-1 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-center">
        <div className="text-sm text-gray-600">
          Overall Progress: {Math.round(weeks.reduce((acc, week) => acc + getWeekProgress(week.weekNumber), 0) / 16)}%
        </div>
        <div className="mt-2 bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-full h-2 transition-all duration-500"
            style={{
              width: `${weeks.reduce((acc, week) => acc + getWeekProgress(week.weekNumber), 0) / 16}%`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WeekSelector;