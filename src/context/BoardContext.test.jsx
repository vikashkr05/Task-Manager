import { boardReducer, initialState } from './BoardContext';

const addTaskToState = (state, columnId, name) =>
  boardReducer(state, {
    type: 'ADD_TASK',
    columnId,
    payload: { name, description: '', deadline: '', image: null },
  });

describe('boardReducer', () => {
  describe('ADD_TASK', () => {
    it('adds the task to the tasks map', () => {
      const col = initialState.columns[0];
      const next = addTaskToState(initialState, col.id, 'New Task');
      const ids = Object.keys(next.tasks);
      const newId = ids.find(id => !initialState.tasks[id]);
      expect(next.tasks[newId].name).toBe('New Task');
    });

    it('sets favorite to false by default', () => {
      const col = initialState.columns[0];
      const next = addTaskToState(initialState, col.id, 'Task');
      const newId = Object.keys(next.tasks).find(id => !initialState.tasks[id]);
      expect(next.tasks[newId].favorite).toBe(false);
    });

    it('appends the task id to the target column', () => {
      const col = initialState.columns[0];
      const prevLen = col.taskIds.length;
      const next = addTaskToState(initialState, col.id, 'Task');
      expect(next.columns[0].taskIds).toHaveLength(prevLen + 1);
    });
  });

  describe('EDIT_TASK', () => {
    it('updates the specified task fields', () => {
      const [col] = initialState.columns;
      let state = addTaskToState(initialState, col.id, 'Old Name');
      const taskId = Object.keys(state.tasks).find(id => !initialState.tasks[id]);

      state = boardReducer(state, {
        type: 'EDIT_TASK',
        payload: { id: taskId, name: 'New Name', description: 'Updated desc' },
      });

      expect(state.tasks[taskId].name).toBe('New Name');
      expect(state.tasks[taskId].description).toBe('Updated desc');
    });

    it('preserves fields that are not updated', () => {
      const [col] = initialState.columns;
      let state = addTaskToState(initialState, col.id, 'Task');
      const taskId = Object.keys(state.tasks).find(id => !initialState.tasks[id]);
      const originalDeadline = state.tasks[taskId].deadline;

      state = boardReducer(state, {
        type: 'EDIT_TASK',
        payload: { id: taskId, name: 'Changed' },
      });

      expect(state.tasks[taskId].deadline).toBe(originalDeadline);
    });
  });

  describe('DELETE_TASK', () => {
    it('removes the task from the tasks map', () => {
      const [col] = initialState.columns;
      let state = addTaskToState(initialState, col.id, 'To Delete');
      const taskId = Object.keys(state.tasks).find(id => !initialState.tasks[id]);

      state = boardReducer(state, { type: 'DELETE_TASK', taskId });

      expect(state.tasks[taskId]).toBeUndefined();
    });

    it('removes the task id from its column', () => {
      const [col] = initialState.columns;
      let state = addTaskToState(initialState, col.id, 'To Delete');
      const taskId = Object.keys(state.tasks).find(id => !initialState.tasks[id]);

      state = boardReducer(state, { type: 'DELETE_TASK', taskId });

      expect(state.columns[0].taskIds).not.toContain(taskId);
    });
  });

  describe('MOVE_TASK', () => {
    it('removes task from source column and adds to target column', () => {
      const col1 = initialState.columns[0];
      const col2 = initialState.columns[1];
      let state = addTaskToState(initialState, col1.id, 'Move Me');
      const taskId = Object.keys(state.tasks).find(id => !initialState.tasks[id]);

      state = boardReducer(state, {
        type: 'MOVE_TASK',
        taskId,
        fromColumnId: col1.id,
        toColumnId: col2.id,
      });

      expect(state.columns[0].taskIds).not.toContain(taskId);
      expect(state.columns[1].taskIds).toContain(taskId);
    });
  });

  describe('ADD_COLUMN', () => {
    it('appends a new column with the given name', () => {
      const state = boardReducer(initialState, { type: 'ADD_COLUMN', name: 'Review' });
      const last = state.columns[state.columns.length - 1];
      expect(last.name).toBe('Review');
      expect(last.taskIds).toEqual([]);
    });

    it('increments the column count', () => {
      const state = boardReducer(initialState, { type: 'ADD_COLUMN', name: 'Review' });
      expect(state.columns).toHaveLength(initialState.columns.length + 1);
    });
  });

  describe('TOGGLE_FAVORITE', () => {
    it('sets favorite to true when currently false', () => {
      const [col] = initialState.columns;
      let state = addTaskToState(initialState, col.id, 'Task');
      const taskId = Object.keys(state.tasks).find(id => !initialState.tasks[id]);

      state = boardReducer(state, { type: 'TOGGLE_FAVORITE', taskId });
      expect(state.tasks[taskId].favorite).toBe(true);
    });

    it('toggles back to false on second call', () => {
      const [col] = initialState.columns;
      let state = addTaskToState(initialState, col.id, 'Task');
      const taskId = Object.keys(state.tasks).find(id => !initialState.tasks[id]);

      state = boardReducer(state, { type: 'TOGGLE_FAVORITE', taskId });
      state = boardReducer(state, { type: 'TOGGLE_FAVORITE', taskId });
      expect(state.tasks[taskId].favorite).toBe(false);
    });
  });

  describe('SORT_COLUMN', () => {
    it('sorts alphabetically when no favorites', () => {
      const colId = initialState.columns[0].id;
      let state = initialState;
      state = addTaskToState(state, colId, 'Zebra');
      state = addTaskToState(state, colId, 'Alpha');
      state = addTaskToState(state, colId, 'Middle');
      state = boardReducer(state, { type: 'SORT_COLUMN', columnId: colId });

      const names = state.columns[0].taskIds
        .filter(id => ['Zebra', 'Alpha', 'Middle'].includes(state.tasks[id]?.name))
        .map(id => state.tasks[id].name);

      expect(names).toEqual(['Alpha', 'Middle', 'Zebra']);
    });

    it('sorts favorited tasks to the top before alphabetical sort', () => {
      const colId = 'col-fresh';
      const freshState = {
        columns: [{ id: colId, name: 'Test', taskIds: [] }],
        tasks: {},
      };
      let state = addTaskToState(freshState, colId, 'Zebra');
      const zebraId = Object.keys(state.tasks)[0];
      state = addTaskToState(state, colId, 'Alpha');
      const alphaId = Object.keys(state.tasks).find(id => id !== zebraId);
      state = addTaskToState(state, colId, 'Favorite One');
      const favId = Object.keys(state.tasks).find(id => id !== zebraId && id !== alphaId);

      state = boardReducer(state, { type: 'TOGGLE_FAVORITE', taskId: favId });
      state = boardReducer(state, { type: 'SORT_COLUMN', columnId: colId });

      const sorted = state.columns[0].taskIds;
      expect(sorted[0]).toBe(favId);       // favorite first
      expect(sorted[1]).toBe(alphaId);     // Alpha
      expect(sorted[2]).toBe(zebraId);     // Zebra
    });
  });

  describe('unknown action', () => {
    it('returns state unchanged', () => {
      const state = boardReducer(initialState, { type: 'UNKNOWN' });
      expect(state).toBe(initialState);
    });
  });
});
