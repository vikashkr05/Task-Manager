import { Box, Typography, Button, IconButton, Paper } from '@mui/material';
import { Add, SortByAlpha } from '@mui/icons-material';
import { useBoard } from '../../context/BoardContext';
import TaskCard from '../TaskCard/TaskCard';

export default function Column({ column, onAddTask, onEditTask }) {
  const { sortColumn } = useBoard();

  return (
    <Paper
      sx={{ width: 290, minWidth: 290, display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 80px)' }}
      data-testid={`column-${column.id}`}
    >
      <Box sx={{ p: 1.5, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', borderRadius: '4px 4px 0 0' }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ flexGrow: 1 }}>
          {column.name} ({column.taskIds.length})
        </Typography>
        <IconButton
          size="small"
          color="inherit"
          onClick={() => sortColumn(column.id)}
          aria-label="sort column"
        >
          <SortByAlpha fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
        {column.taskIds.map(taskId => (
          <TaskCard
            key={taskId}
            taskId={taskId}
            columnId={column.id}
            onEdit={onEditTask}
          />
        ))}
      </Box>
      <Box sx={{ p: 1, borderTop: '1px solid #e0e0e0' }}>
        <Button
          fullWidth
          startIcon={<Add />}
          onClick={onAddTask}
          size="small"
          data-testid={`add-task-btn-${column.id}`}
        >
          Add Task
        </Button>
      </Box>
    </Paper>
  );
}
