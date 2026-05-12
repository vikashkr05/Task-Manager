import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BoardProvider } from '../../context/BoardContext';
import Column from './Column';

const mockColumn = { id: 'col-test', name: 'Test Column', taskIds: [] };

const renderColumn = (props = {}) =>
  render(
    <MemoryRouter>
      <BoardProvider>
        <Column
          column={mockColumn}
          onAddTask={jest.fn()}
          onEditTask={jest.fn()}
          {...props}
        />
      </BoardProvider>
    </MemoryRouter>
  );

describe('Column', () => {
  it('renders the column name', () => {
    renderColumn();
    expect(screen.getByText(/Test Column/)).toBeInTheDocument();
  });

  it('renders the task count in parentheses', () => {
    renderColumn();
    expect(screen.getByText(/Test Column \(0\)/)).toBeInTheDocument();
  });

  it('renders the Add Task button', () => {
    renderColumn();
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  it('calls onAddTask when Add Task button is clicked', () => {
    const onAddTask = jest.fn();
    renderColumn({ onAddTask });
    fireEvent.click(screen.getByText('Add Task'));
    expect(onAddTask).toHaveBeenCalledTimes(1);
  });

  it('renders the sort button', () => {
    renderColumn();
    expect(screen.getByRole('button', { name: 'sort column' })).toBeInTheDocument();
  });

  it('updates task count when column has task ids', () => {
    const colWithTasks = { id: 'col-test', name: 'Test Column', taskIds: ['t1', 't2'] };
    renderColumn({ column: colWithTasks });
    expect(screen.getByText(/Test Column \(2\)/)).toBeInTheDocument();
  });
});
