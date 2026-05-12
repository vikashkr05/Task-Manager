import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BoardProvider } from './context/BoardContext';
import Board from './components/Board/Board';
import TaskDetail from './pages/TaskDetail/TaskDetail';

const theme = createTheme({
  palette: {
    primary: { main: '#1565c0' },
    background: { default: '#f0f2f5' },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BoardProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Board />} />
            <Route path="/task/:id" element={<TaskDetail />} />
          </Routes>
        </BrowserRouter>
      </BoardProvider>
    </ThemeProvider>
  );
}
