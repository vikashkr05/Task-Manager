import { Card, CardContent, CardActions, Typography, IconButton, Chip, Select, MenuItem, Box, Tooltip } from '@mui/material';
import { Edit, Delete, Star, StarBorder } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useBoard } from '../../context/BoardContext';

export default function TaskCard({ taskId, columnId, onEdit, onAnnounce }) {
  const { t } = useTranslation();
  const { state, deleteTask, toggleFavorite, moveTask } = useBoard();
  const task = state.tasks[taskId];
  const navigate = useNavigate();

  if (!task) return null;

  const favLabel = task.favorite
    ? t('common.removeFromFavorites')
    : t('common.addToFavorites');

  const handleDelete = () => {
    deleteTask(taskId);
    onAnnounce?.(t('a11y.taskDeleted'));
  };

  const handleMove = (toColumnId) => {
    moveTask(taskId, columnId, toColumnId);
    onAnnounce?.(t('a11y.taskMoved'));
  };

  return (
    <Card
      sx={{ mb: 1, border: task.favorite ? '2px solid #ffc107' : '1px solid #e0e0e0' }}
      data-testid={`task-card-${taskId}`}
    >
      <CardContent
        sx={{ pb: 0, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
        onClick={() => navigate(`/task/${taskId}`)}
      >
        {/* Accessibility: h3 task heading – nested under the h2 column heading */}
        <Typography component="h3" variant="subtitle2" fontWeight="bold">
          {task.name}
        </Typography>
        {task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }} noWrap>
            {task.description}
          </Typography>
        )}
        {task.deadline && (
          <Chip
            label={`${t('task.duePrefix')} ${task.deadline}`}
            size="small"
            color="primary"
            sx={{ mt: 0.5 }}
          />
        )}
        {task.images && task.images.length > 0 && (
          <Box sx={{ position: 'relative', mt: 1 }}>
            <Box
              component="img"
              src={task.images[0]}
              alt={t('task.imageAlt')}
              sx={{ width: '100%', borderRadius: 1, maxHeight: 120, objectFit: 'cover', display: 'block' }}
            />
            {task.images.length > 1 && (
              <Chip
                label={`+${task.images.length - 1}`}
                size="small"
                sx={{ position: 'absolute', bottom: 4, right: 4, bgcolor: 'rgba(0,0,0,0.6)', color: 'white' }}
              />
            )}
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ pt: 0, flexWrap: 'wrap', gap: 0 }}>
        <Tooltip title={t('task.editAriaLabel')}>
          <IconButton
            size="small"
            onClick={() => onEdit(task)}
            aria-label={t('task.editAriaLabel')}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title={t('task.deleteAriaLabel')}>
          <IconButton
            size="small"
            onClick={handleDelete}
            color="error"
            aria-label={t('task.deleteAriaLabel')}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title={favLabel}>
          <IconButton
            size="small"
            onClick={() => toggleFavorite(taskId)}
            color="warning"
            aria-label={favLabel}
          >
            {task.favorite ? <Star /> : <StarBorder />}
          </IconButton>
        </Tooltip>

        {/* Accessibility: visually-labelled Select for moving tasks between columns */}
        <Select
          size="small"
          value={columnId}
          onChange={(e) => handleMove(e.target.value)}
          variant="standard"
          sx={{ ml: 'auto', fontSize: 12, minWidth: 80 }}
          inputProps={{ 'aria-label': t('task.moveAriaLabel') }}
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
