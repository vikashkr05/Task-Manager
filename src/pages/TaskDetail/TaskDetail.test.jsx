import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TaskDetail from './TaskDetail';
import { useBoard } from '../../context/BoardContext';

jest.mock('../../context/BoardContext');

const mockToggleFavorite = jest.fn();

const mockTask = {
  id: 'task-42',
  name: 'Implement drag and drop',
  description: 'Allow users to drag tasks between columns',
  deadline: '2026-06-15',
  image: null,
  favorite: false,
};

const mockState = {
  tasks: { 'task-42': mockTask },
  columns: [{ id: 'col-1', name: 'In Progress', taskIds: ['task-42'] }],
};

beforeEach(() => {
  jest.clearAllMocks();
  useBoard.mockReturnValue({ state: mockState, toggleFavorite: mockToggleFavorite });
});

const renderDetail = (id = 'task-42') =>
  render(
    <MemoryRouter initialEntries={[`/task/${id}`]}>
      <Routes>
        <Route path="/task/:id" element={<TaskDetail />} />
      </Routes>
    </MemoryRouter>
  );

describe('TaskDetail', () => {
  it('renders the task name as a heading', () => {
    renderDetail();
    expect(screen.getByText('Implement drag and drop')).toBeInTheDocument();
  });

  it('renders the task description', () => {
    renderDetail();
    expect(screen.getByText('Allow users to drag tasks between columns')).toBeInTheDocument();
  });

  it('renders the deadline', () => {
    renderDetail();
    expect(screen.getByText('2026-06-15')).toBeInTheDocument();
  });

  it('renders the column the task belongs to', () => {
    renderDetail();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('renders the Edit button', () => {
    renderDetail();
    expect(screen.getByTestId('edit-task-btn')).toBeInTheDocument();
  });

  it('renders the go-back button', () => {
    renderDetail();
    expect(screen.getByRole('button', { name: 'go back' })).toBeInTheDocument();
  });

  it('renders the favorite toggle button', () => {
    renderDetail();
    expect(screen.getByRole('button', { name: 'add to favorites' })).toBeInTheDocument();
  });

  it('calls toggleFavorite when the favorite button is clicked', () => {
    renderDetail();
    fireEvent.click(screen.getByRole('button', { name: 'add to favorites' }));
    expect(mockToggleFavorite).toHaveBeenCalledWith('task-42');
  });

  it('shows "remove from favorites" label when task is favorited', () => {
    useBoard.mockReturnValue({
      state: { ...mockState, tasks: { 'task-42': { ...mockTask, favorite: true } } },
      toggleFavorite: mockToggleFavorite,
    });
    renderDetail();
    expect(screen.getByRole('button', { name: 'remove from favorites' })).toBeInTheDocument();
  });

  it('opens the edit dialog when Edit button is clicked', () => {
    useBoard.mockReturnValue({
      state: mockState,
      toggleFavorite: mockToggleFavorite,
      addTask: jest.fn(),
      editTask: jest.fn(),
    });
    renderDetail();
    fireEvent.click(screen.getByTestId('edit-task-btn'));
    expect(screen.getByText('Edit Task', { selector: 'h2' })).toBeInTheDocument();
  });

  it('shows "no description" placeholder when description is empty', () => {
    useBoard.mockReturnValue({
      state: { ...mockState, tasks: { 'task-42': { ...mockTask, description: '' } } },
      toggleFavorite: mockToggleFavorite,
    });
    renderDetail();
    expect(screen.getByText('No description provided.')).toBeInTheDocument();
  });

  it('displays "Task not found" for a non-existent task id', () => {
    renderDetail('does-not-exist');
    expect(screen.getByText('Task not found.')).toBeInTheDocument();
  });

  it('renders a Back to Board button when task is not found', () => {
    renderDetail('does-not-exist');
    expect(screen.getByText('Back to Board')).toBeInTheDocument();
  });
});
