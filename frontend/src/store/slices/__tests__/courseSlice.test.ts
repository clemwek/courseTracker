import { describe, it, expect } from 'vitest';
import courseReducer, {
  selectCourse,
  deselectCourse,
  addCourse,
  updateCourse,
  deleteCourse,
  addItem,
  updateItem,
  deleteItem,
  setCurrentWeek,
  updateWeekTitle,
} from '../courseSlice';
import { mockCourse, mockCourseItem } from '../../../test/utils';

describe('courseSlice', () => {
  const initialState = {
    courses: [mockCourse],
    selectedCourse: null,
    weeks: Array.from({ length: 16 }, (_, index) => ({
      weekNumber: index + 1,
      title: `Week ${index + 1}`,
      items: [],
    })),
    currentWeek: 1,
  };

  describe('course management', () => {
    it('should select a course', () => {
      const action = selectCourse(mockCourse.id);
      const state = courseReducer(initialState, action);
      
      expect(state.selectedCourse).toEqual(mockCourse);
      expect(state.currentWeek).toBe(1);
    });

    it('should deselect a course', () => {
      const stateWithSelected = {
        ...initialState,
        selectedCourse: mockCourse,
        currentWeek: 5,
      };
      
      const action = deselectCourse();
      const state = courseReducer(stateWithSelected, action);
      
      expect(state.selectedCourse).toBeNull();
      expect(state.currentWeek).toBe(1);
    });

    it('should add a new course', () => {
      const newCourse = { ...mockCourse, id: 'new-course', title: 'New Course' };
      const action = addCourse(newCourse);
      const state = courseReducer(initialState, action);
      
      expect(state.courses).toHaveLength(2);
      expect(state.courses[1]).toEqual(newCourse);
    });

    it('should update a course', () => {
      const updates = { title: 'Updated Course Title' };
      const action = updateCourse({ id: mockCourse.id, updates });
      const state = courseReducer(initialState, action);
      
      expect(state.courses[0].title).toBe('Updated Course Title');
    });

    it('should update selected course when editing', () => {
      const stateWithSelected = {
        ...initialState,
        selectedCourse: mockCourse,
      };
      
      const updates = { title: 'Updated Selected Course' };
      const action = updateCourse({ id: mockCourse.id, updates });
      const state = courseReducer(stateWithSelected, action);
      
      expect(state.selectedCourse?.title).toBe('Updated Selected Course');
    });

    it('should delete a course', () => {
      const action = deleteCourse(mockCourse.id);
      const state = courseReducer(initialState, action);
      
      expect(state.courses).toHaveLength(0);
    });

    it('should deselect course when deleting selected course', () => {
      const stateWithSelected = {
        ...initialState,
        selectedCourse: mockCourse,
      };
      
      const action = deleteCourse(mockCourse.id);
      const state = courseReducer(stateWithSelected, action);
      
      expect(state.selectedCourse).toBeNull();
      expect(state.currentWeek).toBe(1);
    });
  });

  describe('week and item management', () => {
    it('should add an item to a week', () => {
      const action = addItem({ weekNumber: 1, item: mockCourseItem });
      const state = courseReducer(initialState, action);
      
      expect(state.weeks[0].items).toHaveLength(1);
      expect(state.weeks[0].items[0]).toEqual(mockCourseItem);
    });

    it('should update an item', () => {
      const stateWithItem = {
        ...initialState,
        weeks: [
          { ...initialState.weeks[0], items: [mockCourseItem] },
          ...initialState.weeks.slice(1),
        ],
      };
      
      const updates = { completed: true, title: 'Updated Item' };
      const action = updateItem({
        weekNumber: 1,
        itemId: mockCourseItem.id,
        updates,
      });
      const state = courseReducer(stateWithItem, action);
      
      expect(state.weeks[0].items[0].completed).toBe(true);
      expect(state.weeks[0].items[0].title).toBe('Updated Item');
    });

    it('should delete an item', () => {
      const stateWithItem = {
        ...initialState,
        weeks: [
          { ...initialState.weeks[0], items: [mockCourseItem] },
          ...initialState.weeks.slice(1),
        ],
      };
      
      const action = deleteItem({ weekNumber: 1, itemId: mockCourseItem.id });
      const state = courseReducer(stateWithItem, action);
      
      expect(state.weeks[0].items).toHaveLength(0);
    });

    it('should set current week', () => {
      const action = setCurrentWeek(5);
      const state = courseReducer(initialState, action);
      
      expect(state.currentWeek).toBe(5);
    });

    it('should update week title', () => {
      const action = updateWeekTitle({ weekNumber: 1, title: 'Custom Week Title' });
      const state = courseReducer(initialState, action);
      
      expect(state.weeks[0].title).toBe('Custom Week Title');
    });
  });
});