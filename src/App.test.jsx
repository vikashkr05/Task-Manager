import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the Task Board heading', () => {
    render(<App />);
    expect(screen.getByText('Task Board')).toBeInTheDocument();
  });

  it('renders the default column headers', () => {
    render(<App />);
    expect(screen.getByTestId('column-col-1')).toBeInTheDocument();
    expect(screen.getByTestId('column-col-2')).toBeInTheDocument();
    expect(screen.getByTestId('column-col-3')).toBeInTheDocument();
  });

  it('renders the Add Column button', () => {
    render(<App />);
    expect(screen.getByTestId('add-column-btn')).toBeInTheDocument();
  });
});
