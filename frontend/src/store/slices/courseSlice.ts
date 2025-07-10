import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CourseItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  type: 'coursework' | 'reading' | 'assignment';
}

export interface Week {
  weekNumber: number;
  title: string;
  items: CourseItem[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  startDate: string;
  endDate: string;
  totalWeeks: number;
  imageUrl?: string;
  category: string;
}

interface CourseState {
  courses: Course[];
  selectedCourse: Course | null;
  weeks: Week[];
  currentWeek: number;
}

const generateInitialWeeks = (): Week[] => {
  return Array.from({ length: 16 }, (_, index) => ({
    weekNumber: index + 1,
    title: `Week ${index + 1}`,
    items: [],
  }));
};

const initialCourses: Course[] = [
  {
    id: '1',
    title: 'Advanced Web Development',
    description: 'Master modern web development with React, Node.js, and advanced JavaScript concepts.',
    instructor: 'Dr. Sarah Johnson',
    duration: '16 weeks',
    startDate: '2024-01-15',
    endDate: '2024-05-15',
    totalWeeks: 16,
    imageUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Technology'
  },
  {
    id: '2',
    title: 'Digital Marketing Strategy',
    description: 'Learn comprehensive digital marketing strategies, SEO, social media, and analytics.',
    instructor: 'Prof. Michael Chen',
    duration: '16 weeks',
    startDate: '2024-02-01',
    endDate: '2024-06-01',
    totalWeeks: 16,
    imageUrl: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Marketing'
  },
  {
    id: '3',
    title: 'Data Science Fundamentals',
    description: 'Explore data analysis, machine learning, and statistical modeling with Python.',
    instructor: 'Dr. Emily Rodriguez',
    duration: '16 weeks',
    startDate: '2024-01-22',
    endDate: '2024-05-22',
    totalWeeks: 16,
    imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Data Science'
  },
  {
    id: '4',
    title: 'UX/UI Design Mastery',
    description: 'Create exceptional user experiences through design thinking and modern UI principles.',
    instructor: 'Alex Thompson',
    duration: '16 weeks',
    startDate: '2024-02-05',
    endDate: '2024-06-05',
    totalWeeks: 16,
    imageUrl: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Design'
  }
];

const initialState: CourseState = {
  courses: initialCourses,
  selectedCourse: null,
  weeks: generateInitialWeeks(),
  currentWeek: 1,
};

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    selectCourse: (state, action: PayloadAction<string>) => {
      const course = state.courses.find(c => c.id === action.payload);
      if (course) {
        state.selectedCourse = course;
        state.currentWeek = 1;
        // Reset weeks when selecting a new course
        state.weeks = generateInitialWeeks();
      }
    },
    deselectCourse: (state) => {
      state.selectedCourse = null;
      state.currentWeek = 1;
    },
    addCourse: (state, action: PayloadAction<Course>) => {
      state.courses.push(action.payload);
    },
    updateCourse: (state, action: PayloadAction<{ id: string; updates: Partial<Course> }>) => {
      const courseIndex = state.courses.findIndex(c => c.id === action.payload.id);
      if (courseIndex !== -1) {
        state.courses[courseIndex] = { ...state.courses[courseIndex], ...action.payload.updates };
        // Update selected course if it's the one being edited
        if (state.selectedCourse?.id === action.payload.id) {
          state.selectedCourse = { ...state.selectedCourse, ...action.payload.updates };
        }
      }
    },
    deleteCourse: (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter(c => c.id !== action.payload);
      // If the deleted course was selected, deselect it
      if (state.selectedCourse?.id === action.payload) {
        state.selectedCourse = null;
        state.currentWeek = 1;
      }
    },
    addItem: (state, action: PayloadAction<{ weekNumber: number; item: CourseItem }>) => {
      const week = state.weeks.find(w => w.weekNumber === action.payload.weekNumber);
      if (week) {
        week.items.push(action.payload.item);
      }
    },
    updateItem: (state, action: PayloadAction<{ weekNumber: number; itemId: string; updates: Partial<CourseItem> }>) => {
      const week = state.weeks.find(w => w.weekNumber === action.payload.weekNumber);
      if (week) {
        const item = week.items.find(i => i.id === action.payload.itemId);
        if (item) {
          Object.assign(item, action.payload.updates);
        }
      }
    },
    deleteItem: (state, action: PayloadAction<{ weekNumber: number; itemId: string }>) => {
      const week = state.weeks.find(w => w.weekNumber === action.payload.weekNumber);
      if (week) {
        week.items = week.items.filter(i => i.id !== action.payload.itemId);
      }
    },
    setCurrentWeek: (state, action: PayloadAction<number>) => {
      state.currentWeek = action.payload;
    },
    updateWeekTitle: (state, action: PayloadAction<{ weekNumber: number; title: string }>) => {
      const week = state.weeks.find(w => w.weekNumber === action.payload.weekNumber);
      if (week) {
        week.title = action.payload.title;
      }
    },
  },
});

export const { 
  selectCourse, 
  deselectCourse, 
  addCourse,
  updateCourse,
  deleteCourse,
  addItem, 
  updateItem, 
  deleteItem, 
  setCurrentWeek, 
  updateWeekTitle 
} = courseSlice.actions;
export default courseSlice.reducer;