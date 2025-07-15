import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { updateItem, deleteItem } from '../store/slices/courseSlice';
import { BookOpen, FileText, PenTool, Check, Edit2, Trash2, Calendar } from 'lucide-react';
import type { CourseItem } from '../store/slices/courseSlice';

interface CourseItemCardProps {
  item: CourseItem;
  weekNumber: number;
}

const CourseItemCard: React.FC<CourseItemCardProps> = ({ item, weekNumber }) => {
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: item.title,
    description: item.description,
    dueDate: item.dueDate || '',
  });

  // Only admins can edit content
  const canEdit = isAuthenticated && user?.role === 'admin';

  const getIcon = () => {
    switch (item.type) {
      case 'coursework':
        return <BookOpen className="h-5 w-5" />;
      case 'reading':
        return <FileText className="h-5 w-5" />;
      case 'assignment':
        return <PenTool className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getTypeColor = () => {
    switch (item.type) {
      case 'coursework':
        return 'bg-blue-100 text-blue-800';
      case 'reading':
        return 'bg-green-100 text-green-800';
      case 'assignment':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleToggleComplete = () => {
    dispatch(updateItem({
      weekNumber,
      itemId: item.id,
      updates: { completed: !item.completed }
    }));
  };

  const handleSaveEdit = () => {
    dispatch(updateItem({
      weekNumber,
      itemId: item.id,
      updates: {
        title: editForm.title,
        description: editForm.description,
        dueDate: editForm.dueDate || undefined,
      }
    }));
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      dispatch(deleteItem({ weekNumber, itemId: item.id }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="space-y-4">
          <input
            type="text"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Title"
          />
          <textarea
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
            placeholder="Description"
          />
          <input
            type="date"
            value={editForm.dueDate}
            onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 ${
      item.completed ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getTypeColor()}`}>
            {getIcon()}
          </div>
          <div className="flex-1">
            <h3 className={`font-medium text-gray-900 ${item.completed ? 'line-through' : ''}`}>
              {item.title}
            </h3>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getTypeColor()}`}>
              {item.type}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {/* Everyone can mark items as complete */}
          <button
            onClick={handleToggleComplete}
            className={`p-1.5 rounded-lg transition-colors ${
              item.completed
                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
            title={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            <Check className="h-4 w-4" />
          </button>
          
          {/* Only admins can edit and delete */}
          {canEdit && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit item"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete item"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <p className={`text-gray-600 text-sm mb-3 ${item.completed ? 'line-through' : ''}`}>
        {item.description}
      </p>

      {item.dueDate && (
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>Due: {formatDate(item.dueDate)}</span>
        </div>
      )}
    </div>
  );
};

export default CourseItemCard;