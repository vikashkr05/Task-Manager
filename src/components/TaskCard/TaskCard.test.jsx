import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TaskCard from './TaskCard';
import { useBoard } from '../../context/BoardContext';

jest.mock('../../context/BoardContext');

const mockTask = {
  id: 'task-1',
  name: 'Fix the login bug',
  description: 'Users cannot log in when using SSO',
  deadline: '2026-06-01',
  image: null,
  favorite: false,
};

const mockDeleteTask = jest.fn();
const mockToggleFavorite = jest.fn();
const mockMoveTask = jest.fn();

const buildState = (task = mockTask) => ({
  tasks: { [task.id]: task },
  columns: [
    { id: 'col-1', name: 'To Do', taskIds: [task.id] },
    { id: 'col-2', name: 'In Progress', taskIds: [] },
  ],
});

beforeEach(() => {
  jest.clearAllMocks();
  useBoard.mockReturnValue({
    state: buildState(),
    deleteTask: mockDeleteTask,
    toggleFavorite: mockToggleFavorite,
    moveTask: mockMoveTask,
  });
});

const renderCard = (props = {}) =>
  render(
    <MemoryRouter>
      <TaskCard taskId="task-1" columnId="col-1" onEdit={jest.fn()} {...props} />
    </MemoryRouter>
  );

describe('TaskCard', () => {
  it('renders the task name', () => {
    renderCard();
    expect(screen.getByText('Fix the login bug')).toBeInTheDocument();
  });

  it('renders the task description', () => {
    renderCard();
    expect(screen.getByText('Users cannot log in when using SSO')).toBeInTheDocument();
  });

  it('renders the deadline chip', () => {
    renderCard();
    expect(screen.getByText('Due: 2026-06-01')).toBeInTheDocument();
  });

  it('does not render deadline chip when deadline is absent', () => {
    useBoard.mockReturnValue({
      state: buildState({ ...mockTask, deadline: '' }),
      deleteTask: mockDeleteTask,
      toggleFavorite: mockToggleFavorite,
      moveTask: mockMoveTask,
    });
    renderCard();
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  it('calls deleteTask with the task id when delete is clicked', () => {
    renderCard();
    fireEvent.click(screen.getByRole('button', { name: 'delete task' }));
    expect(mockDeleteTask).toHaveBeenCalledWith('task-1');
  });

  it('calls onEdit with the task object when edit is clicked', () => {
    const onEdit = jest.fn();
    renderCard({ onEdit });
    fireEvent.click(screen.getByRole('button', { name: 'edit task' }));
    expect(onEdit).toHaveBeenCalledWith(mockTask);
  });

  it('calls toggleFavorite when the star button is clicked', () => {
    renderCard();
    fireEvent.click(screen.getByRole('button', { name: 'add to favorites' }));
    expect(mockToggleFavorite).toHaveBeenCalledWith('task-1');
  });

  it('shows "remove from favorites" label when task is already favorited', () => {
    useBoard.mockReturnValue({
      state: buildState({ ...mockTask, favorite: true }),
      deleteTask: mockDeleteTask,
      toggleFavorite: mockToggleFavorite,
      moveTask: mockMoveTask,
    });
    renderCard();
    expect(screen.getByRole('button', { name: 'remove from favorites' })).toBeInTheDocument();
  });

  it('renders a view details button', () => {
    renderCard();
    expect(screen.getByRole('button', { name: 'view task details' })).toBeInTheDocument();
  });

  it('applies a highlighted border when task is favorited', () => {
    useBoard.mockReturnValue({
      state: buildState({ ...mockTask, favorite: true }),
      deleteTask: mockDeleteTask,
      toggleFavorite: mockToggleFavorite,
      moveTask: mockMoveTask,
    });
    const { container } = renderCard();
    const card = container.querySelector('[data-testid="task-card-task-1"]');
    expect(card).toBeInTheDocument();
  });

  it('returns null when task does not exist in state', () => {
    useBoard.mockReturnValue({
      state: { tasks: {}, columns: [] },
      deleteTask: mockDeleteTask,
      toggleFavorite: mockToggleFavorite,
      moveTask: mockMoveTask,
    });
    const { container } = renderCard();
    expect(container.firstChild).toBeNull();
  });
});
