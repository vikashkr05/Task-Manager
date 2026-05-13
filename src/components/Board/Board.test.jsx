import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BoardProvider } from '../../context/BoardContext';
import Board from './Board';

const renderBoard = () =>
  render(
    <MemoryRouter>
      <BoardProvider>
        <Board />
      </BoardProvider>
    </MemoryRouter>
  );

describe('Board', () => {
  it('renders the Task Board title', () => {
    renderBoard();
    expect(screen.getByText('Task Board')).toBeInTheDocument();
  });

  it('renders all three default columns by data-testid', () => {
    renderBoard();
    expect(screen.getByTestId('column-col-1')).toBeInTheDocument();
    expect(screen.getByTestId('column-col-2')).toBeInTheDocument();
    expect(screen.getByTestId('column-col-3')).toBeInTheDocument();
  });

  it('renders the Add Column button in the toolbar', () => {
    renderBoard();
    expect(screen.getByTestId('add-column-btn')).toBeInTheDocument();
  });

  it('opens the Add Column dialog when the toolbar button is clicked', () => {
    renderBoard();
    fireEvent.click(screen.getByTestId('add-column-btn'));
    // The dialog is open when the column-name input is in the DOM
    expect(screen.getByTestId('column-name-input')).toBeInTheDocument();
  });

  it('adds a new column and renders it after submission', () => {
    renderBoard();
    fireEvent.click(screen.getByTestId('add-column-btn'));
    fireEvent.change(screen.getByTestId('column-name-input'), { target: { value: 'Review' } });
    fireEvent.click(screen.getByTestId('add-column-submit-btn'));
    expect(screen.getByText(/Review \(0\)/)).toBeInTheDocument();
  });

  it('opens the task add dialog when the Add Task button in a column is clicked', () => {
    renderBoard();
    fireEvent.click(screen.getByTestId('add-task-btn-col-1'));
    // Task name input appears when the add-task dialog opens
    expect(screen.getByTestId('task-name-input')).toBeInTheDocument();
  });

  it('renders Add Task buttons for every column', () => {
    renderBoard();
    expect(screen.getByTestId('add-task-btn-col-1')).toBeInTheDocument();
    expect(screen.getByTestId('add-task-btn-col-2')).toBeInTheDocument();
    expect(screen.getByTestId('add-task-btn-col-3')).toBeInTheDocument();
  });
});
