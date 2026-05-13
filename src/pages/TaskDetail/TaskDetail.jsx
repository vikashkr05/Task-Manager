import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Chip, Paper, AppBar, Toolbar,
  IconButton, Divider,
} from '@mui/material';
import { ArrowBack, Edit, Star, StarBorder } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useBoard } from '../../context/BoardContext';
import TaskDialog from '../../components/TaskDialog/TaskDialog';

export default function TaskDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, toggleFavorite } = useBoard();
  const task = state.tasks[id];
  const [editOpen, setEditOpen] = useState(false);

  if (!task) {
    return (
      // Accessibility: role="main" provides landmark even in the not-found state
      <Box component="main" sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>{t('taskDetail.notFound')}</Typography>
        <Button variant="outlined" onClick={() => navigate('/')}>{t('taskDetail.backToBoard')}</Button>
      </Box>
    );
  }

  const column = state.columns.find(col => col.taskIds.includes(id));
  const favLabel = task.favorite ? t('common.removeFromFavorites') : t('common.addToFavorites');

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" elevation={1} component="header">
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => navigate('/')}
            edge="start"
            aria-label={t('common.goBack')}
          >
            <ArrowBack />
          </IconButton>
          {/* Accessibility: visually the AppBar acts as nav; the h1 is the page title */}
          <Typography component="h1" variant="h6" sx={{ flexGrow: 1, ml: 1 }}>
            {t('taskDetail.heading')}
          </Typography>
          <IconButton color="inherit" onClick={() => toggleFavorite(id)} aria-label={favLabel}>
            {task.favorite ? <Star /> : <StarBorder />}
          </IconButton>
          <Button
            color="inherit"
            startIcon={<Edit />}
            onClick={() => setEditOpen(true)}
            data-testid="edit-task-btn"
          >
            {t('common.edit')}
          </Button>
        </Toolbar>
      </AppBar>

      {/* Accessibility: <main> landmark with skip-link target */}
      <Box
        component="main"
        id="main-content"
        tabIndex={-1}
        sx={{ p: 3, flexGrow: 1, overflowY: 'auto', outline: 'none' }}
      >
        <Paper sx={{ p: 3, maxWidth: 720, mx: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            {/* Accessibility: h2 because this is the primary content heading under the h1 in the AppBar */}
            <Typography component="h2" variant="h4" sx={{ flexGrow: 1 }}>
              {task.name}
            </Typography>
            {task.favorite && (
              <Chip label={t('taskDetail.favoriteChip')} color="warning" size="small" icon={<Star />} />
            )}
          </Box>
          <Divider sx={{ my: 2 }} />

          {column && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="overline" color="text.secondary" component="h3">
                {t('taskDetail.columnLabel')}
              </Typography>
              <Typography variant="body1">{column.name}</Typography>
            </Box>
          )}

          {task.deadline && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="overline" color="text.secondary" component="h3">
                {t('taskDetail.deadlineLabel')}
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip label={task.deadline} color="primary" />
              </Box>
            </Box>
          )}

          <Box sx={{ mb: 3 }}>
            <Typography variant="overline" color="text.secondary" component="h3">
              {t('taskDetail.descriptionLabel')}
            </Typography>
            {task.description ? (
              <Typography variant="body1" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
                {task.description}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {t('taskDetail.noDescription')}
              </Typography>
            )}
          </Box>

          {task.image && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="overline" color="text.secondary" component="h3">
                {t('taskDetail.attachmentLabel')}
              </Typography>
              <Box
                component="img"
                src={task.image}
                alt={t('task.imageAlt')}
                sx={{ display: 'block', maxWidth: '100%', mt: 1, borderRadius: 2, boxShadow: 1 }}
              />
            </Box>
          )}
        </Paper>
      </Box>

      <TaskDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        task={task}
        columnId={null}
      />
    </Box>
  );
}
