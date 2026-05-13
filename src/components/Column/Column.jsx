import { Box, Typography, Button, IconButton, Paper } from '@mui/material';
import { Add, SortByAlpha } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useBoard } from '../../context/BoardContext';
import TaskCard from '../TaskCard/TaskCard';

export default function Column({ column, onAddTask, onEditTask, onAnnounce }) {
  const { t } = useTranslation();
  const { sortColumn } = useBoard();

  const headingId = `col-heading-${column.id}`;

  return (
    // Accessibility: <section> with aria-labelledby ties the region to its h2 heading.
    <Paper
      component="section"
      aria-labelledby={headingId}
      sx={{ width: 290, minWidth: 290, display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 80px)' }}
      data-testid={`column-${column.id}`}
    >
      <Box sx={{ p: 1.5, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', borderRadius: '4px 4px 0 0' }}>
        {/* Accessibility: h2 column heading – one per column, nested under the page h1 */}
        <Typography
          id={headingId}
          component="h2"
          variant="subtitle1"
          fontWeight="bold"
          sx={{ flexGrow: 1 }}
        >
          {column.name} {t('column.taskCount', { count: column.taskIds.length })}
        </Typography>
        <IconButton
          size="small"
          color="inherit"
          onClick={() => sortColumn(column.id)}
          aria-label={t('column.sortAriaLabel')}
        >
          <SortByAlpha fontSize="small" />
        </IconButton>
      </Box>

      {/* Accessibility: <ul> conveys item count and list semantics to screen readers */}
      <Box
        component="ul"
        aria-label={column.name}
        sx={{ flexGrow: 1, overflowY: 'auto', p: 1, listStyle: 'none', m: 0 }}
      >
        {column.taskIds.map(taskId => (
          <Box component="li" key={taskId} sx={{ mb: 0 }}>
            <TaskCard
              taskId={taskId}
              columnId={column.id}
              onEdit={onEditTask}
              onAnnounce={onAnnounce}
            />
          </Box>
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
          {t('column.addTask')}
        </Button>
      </Box>
    </Paper>
  );
}
