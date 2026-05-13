import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BoardProvider } from './context/BoardContext';
import Board from './components/Board/Board';
import TaskDetail from './pages/TaskDetail/TaskDetail';
import SkipLink from './components/SkipLink/SkipLink';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import './i18n/index.js'; // initialise i18next before any component renders

const theme = createTheme({
  palette: {
    primary: { main: '#1565c0' },
    background: { default: '#f0f2f5' },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Accessibility: skip navigation link – visible only on keyboard focus */}
      <SkipLink />
      <ErrorBoundary>
        <BoardProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Board />} />
              <Route path="/task/:id" element={<TaskDetail />} />
            </Routes>
          </BrowserRouter>
        </BoardProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
