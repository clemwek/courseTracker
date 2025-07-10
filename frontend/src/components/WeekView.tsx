import React from 'react';
import { useAppSelector } from '../hooks/redux';
import CourseItemCard from './CourseItemCard';
import AddItemForm from './AddItemForm';

const WeekView: React.FC = () => {
  const { weeks, currentWeek } = useAppSelector(state => state.course);
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  
  const currentWeekData = weeks.find(w => w.weekNumber === currentWeek);
  
  if (!currentWeekData) return null;

  const courseworkItems = currentWeekData.items.filter(item => item.type === 'coursework');
  const readingItems = currentWeekData.items.filter(item => item.type === 'reading');
  const assignmentItems = currentWeekData.items.filter(item => item.type === 'assignment');

  // Only admins can edit content
  const canEdit = isAuthenticated && user?.role === 'admin';

  const getSectionStats = (items: typeof currentWeekData.items) => {
    const total = items.length;
    const completed = items.filter(item => item.completed).length;
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const Section: React.FC<{ title: string; items: typeof currentWeekData.items; color: string }> = ({ title, items, color }) => {
    const stats = getSectionStats(items);
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {stats.completed}/{stats.total}
              </span>
              {stats.total > 0 && (
                <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color} transition-all duration-300`}
                    style={{ width: `${stats.percentage}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No {title.toLowerCase()} added yet</p>
              {!canEdit && (
                <p className="text-sm mt-2">Content will be added by course administrators</p>
              )}
            </div>
          ) : (
            items.map(item => (
              <CourseItemCard
                key={item.id}
                item={item}
                weekNumber={currentWeek}
              />
            ))
          )}
          
          {canEdit && (
            <AddItemForm weekNumber={currentWeek} />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentWeekData.title}
            </h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Week {currentWeek} of 16</span>
              <span>•</span>
              <span>{currentWeekData.items.length} items total</span>
              <span>•</span>
              <span>{currentWeekData.items.filter(item => item.completed).length} completed</span>
            </div>
          </div>
          
          {!isAuthenticated && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Student View</p>
              <p className="text-xs text-gray-400">Track your progress</p>
            </div>
          )}
          
          {canEdit && (
            <div className="text-right">
              <p className="text-sm text-blue-600 font-medium">Admin Mode</p>
              <p className="text-xs text-gray-400">You can edit content</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        <Section
          title="Coursework"
          items={courseworkItems}
          color="bg-blue-500"
        />
        <Section
          title="Reading Materials"
          items={readingItems}
          color="bg-green-500"
        />
        <Section
          title="Assignments"
          items={assignmentItems}
          color="bg-amber-500"
        />
      </div>
    </div>
  );
};

export default WeekView;