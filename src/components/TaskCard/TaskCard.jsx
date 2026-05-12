import { Card, CardContent, CardActions, Typography, IconButton, Chip, Select, MenuItem, Box, Tooltip } from '@mui/material';
import { Edit, Delete, Star, StarBorder, OpenInNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useBoard } from '../../context/BoardContext';

export default function TaskCard({ taskId, columnId, onEdit }) {
  const { state, deleteTask, toggleFavorite, moveTask } = useBoard();
  const task = state.tasks[taskId];
  const navigate = useNavigate();

  if (!task) return null;

  return (
    <Card
      sx={{ mb: 1, border: task.favorite ? '2px solid #ffc107' : '1px solid #e0e0e0' }}
      data-testid={`task-card-${taskId}`}
    >
      <CardContent sx={{ pb: 0 }}>
        <Typography variant="subtitle2" fontWeight="bold">
          {task.name}
        </Typography>
        {task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }} noWrap>
            {task.description}
          </Typography>
        )}
        {task.deadline && (
          <Chip
            label={`Due: ${task.deadline}`}
            size="small"
            color="primary"
            sx={{ mt: 0.5 }}
          />
        )}
        {task.image && (
          <Box
            component="img"
            src={task.image}
            alt="attachment"
            sx={{ width: '100%', mt: 1, borderRadius: 1, maxHeight: 120, objectFit: 'cover' }}
          />
        )}
      </CardContent>
      <CardActions sx={{ pt: 0, flexWrap: 'wrap', gap: 0 }}>
        <Tooltip title="View details">
          <IconButton
            size="small"
            onClick={() => navigate(`/task/${taskId}`)}
            aria-label="view task details"
          >
            <OpenInNew fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit task">
          <IconButton
            size="small"
            onClick={() => onEdit(task)}
            aria-label="edit task"
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete task">
          <IconButton
            size="small"
            onClick={() => deleteTask(taskId)}
            color="error"
            aria-label="delete task"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={task.favorite ? 'Remove from favorites' : 'Add to favorites'}>
          <IconButton
            size="small"
            onClick={() => toggleFavorite(taskId)}
            color="warning"
            aria-label={task.favorite ? 'remove from favorites' : 'add to favorites'}
          >
            {task.favorite ? <Star /> : <StarBorder />}
          </IconButton>
        </Tooltip>
        <Select
          size="small"
          value={columnId}
          onChange={(e) => moveTask(taskId, columnId, e.target.value)}
          variant="standard"
          sx={{ ml: 'auto', fontSize: 12, minWidth: 80 }}
          inputProps={{ 'aria-label': 'move task to column' }}
        >
          {state.columns.map(col => (
            <MenuItem key={col.id} value={col.id} disabled={col.id === columnId}>
              {col.name}
            </MenuItem>
          ))}
        </Select>
      </CardActions>
    </Card>
  );
}
