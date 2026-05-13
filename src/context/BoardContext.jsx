import { createContext, useContext, useReducer } from 'react';
import { sanitizeText } from '../utils/security';

const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

// OWASP A03: strip HTML from all text fields before they enter the state tree.
const sanitizePayload = ({ name, description, deadline, image }) => ({
  name: sanitizeText(name),
  description: sanitizeText(description),
  deadline: deadline || '',
  image: image || null,
});

const DEMO_TASKS = {
  't1': { id: 't1', name: 'Design database schema', description: 'Model the entities and relationships for the task manager', deadline: '2026-05-20', image: null, favorite: true },
  't2': { id: 't2', name: 'Implement authentication', description: 'Add user login and registration with JWT', deadline: '2026-05-25', image: null, favorite: false },
  't3': { id: 't3', name: 'Write unit tests', description: 'Cover all components with React Testing Library', deadline: '2026-05-30', image: null, favorite: false },
  't4': { id: 't4', name: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing and deployment', deadline: '2026-06-01', image: null, favorite: false },
};

export const initialState = {
  columns: [
    { id: 'col-1', name: 'To Do', taskIds: ['t2', 't3', 't4'] },
    { id: 'col-2', name: 'In Progress', taskIds: ['t1'] },
    { id: 'col-3', name: 'Done', taskIds: [] },
  ],
  tasks: DEMO_TASKS,
};

export function boardReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK': {
      const id = generateId();
      const task = { id, ...sanitizePayload(action.payload), favorite: false };
      return {
        ...state,
        tasks: { ...state.tasks, [id]: task },
        columns: state.columns.map(col =>
          col.id === action.columnId
            ? { ...col, taskIds: [...col.taskIds, id] }
            : col
        ),
      };
    }
    case 'EDIT_TASK': {
      const existing = state.tasks[action.payload.id];
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.payload.id]: {
            ...existing,
            ...sanitizePayload({ ...existing, ...action.payload }),
            id: existing.id,
            favorite: existing.favorite,
          },
        },
      };
    }
    case 'DELETE_TASK': {
      const { [action.taskId]: _removed, ...rest } = state.tasks;
      return {
        ...state,
        tasks: rest,
        columns: state.columns.map(col => ({
          ...col,
          taskIds: col.taskIds.filter(id => id !== action.taskId),
        })),
      };
    }
    case 'MOVE_TASK': {
      const { taskId, fromColumnId, toColumnId } = action;
      return {
        ...state,
        columns: state.columns.map(col => {
          if (col.id === fromColumnId) return { ...col, taskIds: col.taskIds.filter(id => id !== taskId) };
          if (col.id === toColumnId) return { ...col, taskIds: [...col.taskIds, taskId] };
          return col;
        }),
      };
    }
    case 'ADD_COLUMN': {
      const id = generateId();
      return {
        ...state,
        columns: [...state.columns, { id, name: sanitizeText(action.name), taskIds: [] }],
      };
    }
    case 'TOGGLE_FAVORITE': {
      const task = state.tasks[action.taskId];
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskId]: { ...task, favorite: !task.favorite },
        },
      };
    }
    case 'SORT_COLUMN': {
      const column = state.columns.find(col => col.id === action.columnId);
      const sorted = [...column.taskIds].sort((a, b) => {
        const taskA = state.tasks[a];
        const taskB = state.tasks[b];
        if (taskA.favorite && !taskB.favorite) return -1;
        if (!taskA.favorite && taskB.favorite) return 1;
        return taskA.name.localeCompare(taskB.name);
      });
      return {
        ...state,
        columns: state.columns.map(col =>
          col.id === action.columnId ? { ...col, taskIds: sorted } : col
        ),
      };
    }
    default:
      return state;
  }
}

const BoardContext = createContext(null);

export function BoardProvider({ children }) {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  const addTask      = (columnId, task)                  => dispatch({ type: 'ADD_TASK',       columnId, payload: task });
  const editTask     = (task)                            => dispatch({ type: 'EDIT_TASK',      payload: task });
  const deleteTask   = (taskId)                          => dispatch({ type: 'DELETE_TASK',    taskId });
  const moveTask     = (taskId, fromColumnId, toColumnId)=> dispatch({ type: 'MOVE_TASK',      taskId, fromColumnId, toColumnId });
  const addColumn    = (name)                            => dispatch({ type: 'ADD_COLUMN',     name });
  const toggleFavorite = (taskId)                        => dispatch({ type: 'TOGGLE_FAVORITE',taskId });
  const sortColumn   = (columnId)                        => dispatch({ type: 'SORT_COLUMN',    columnId });

  return (
    <BoardContext.Provider value={{ state, addTask, editTask, deleteTask, moveTask, addColumn, toggleFavorite, sortColumn }}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  const context = useContext(BoardContext);
  if (!context) throw new Error('useBoard must be used within BoardProvider');
  return context;
}
