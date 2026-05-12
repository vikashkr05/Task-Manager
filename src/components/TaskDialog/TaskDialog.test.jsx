import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskDialog from './TaskDialog';
import { useBoard } from '../../context/BoardContext';

jest.mock('../../context/BoardContext');

const mockAddTask = jest.fn();
const mockEditTask = jest.fn();
const mockOnClose = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  useBoard.mockReturnValue({ addTask: mockAddTask, editTask: mockEditTask });
});

const existingTask = {
  id: 'task-99',
  name: 'Existing Task',
  description: 'Existing description',
  deadline: '2026-07-01',
  image: null,
  favorite: false,
};

describe('TaskDialog – Add mode', () => {
  const renderAdd = () =>
    render(<TaskDialog open={true} onClose={mockOnClose} task={null} columnId="col-1" />);

  it('shows the "Add Task" dialog title', () => {
    renderAdd();
    expect(screen.getByText('Add Task', { selector: 'h2' })).toBeInTheDocument();
  });

  it('renders the task name, description, and deadline fields', () => {
    renderAdd();
    expect(screen.getByTestId('task-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('task-description-input')).toBeInTheDocument();
    expect(screen.getByTestId('task-deadline-input')).toBeInTheDocument();
  });

  it('renders the Attach Image button', () => {
    renderAdd();
    expect(screen.getByText('Attach Image')).toBeInTheDocument();
  });

  it('calls addTask with form data and closes on submit', () => {
    renderAdd();
    fireEvent.change(screen.getByTestId('task-name-input'), { target: { value: 'New Task' } });
    fireEvent.change(screen.getByTestId('task-description-input'), { target: { value: 'Some description' } });
    fireEvent.click(screen.getByTestId('dialog-submit-btn'));

    expect(mockAddTask).toHaveBeenCalledWith(
      'col-1',
      expect.objectContaining({ name: 'New Task', description: 'Some description' })
    );
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('does not call addTask when name is empty', () => {
    renderAdd();
    fireEvent.click(screen.getByTestId('dialog-submit-btn'));
    expect(mockAddTask).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('shows an error message when name is blank and submit is attempted', () => {
    renderAdd();
    fireEvent.click(screen.getByTestId('dialog-submit-btn'));
    expect(screen.getByText('Name is required')).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked without submitting', () => {
    renderAdd();
    fireEvent.change(screen.getByTestId('task-name-input'), { target: { value: 'Partial' } });
    fireEvent.click(screen.getByTestId('dialog-cancel-btn'));
    expect(mockOnClose).toHaveBeenCalled();
    expect(mockAddTask).not.toHaveBeenCalled();
  });
});

describe('TaskDialog – Edit mode', () => {
  const renderEdit = () =>
    render(<TaskDialog open={true} onClose={mockOnClose} task={existingTask} columnId={null} />);

  it('shows the "Edit Task" dialog title', () => {
    renderEdit();
    expect(screen.getByText('Edit Task', { selector: 'h2' })).toBeInTheDocument();
  });

  it('pre-fills name field with the existing task name', () => {
    renderEdit();
    expect(screen.getByTestId('task-name-input')).toHaveValue('Existing Task');
  });

  it('pre-fills description field with the existing description', () => {
    renderEdit();
    expect(screen.getByTestId('task-description-input')).toHaveValue('Existing description');
  });

  it('pre-fills deadline with the existing deadline', () => {
    renderEdit();
    expect(screen.getByTestId('task-deadline-input')).toHaveValue('2026-07-01');
  });

  it('calls editTask with updated data on submit', () => {
    renderEdit();
    fireEvent.change(screen.getByTestId('task-name-input'), { target: { value: 'Updated Task' } });
    fireEvent.click(screen.getByTestId('dialog-submit-btn'));

    expect(mockEditTask).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'task-99', name: 'Updated Task' })
    );
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows "Save Changes" on the submit button in edit mode', () => {
    renderEdit();
    expect(screen.getByTestId('dialog-submit-btn')).toHaveTextContent('Save Changes');
  });
});
