import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Chip, Paper, AppBar, Toolbar,
  IconButton, Divider, Select, MenuItem, FormControl,
} from '@mui/material';
import { ArrowBack, Edit, Star, StarBorder } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useBoard } from '../../context/BoardContext';
import TaskDialog from '../../components/TaskDialog/TaskDialog';
import ImageLightbox from '../../components/ImageLightbox/ImageLightbox';

export default function TaskDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, toggleFavorite, moveTask } = useBoard();
  const task = state.tasks[id];
  const [editOpen, setEditOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(null);

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
                {t('taskDetail.statusLabel')}
              </Typography>
              <FormControl size="small" sx={{ mt: 0.5 }}>
                <Select
                  value={column.id}
                  onChange={(e) => moveTask(id, column.id, e.target.value)}
                  inputProps={{ 'aria-label': t('taskDetail.statusLabel') }}
                  data-testid="status-select"
                >
                  {state.columns.map(col => (
                    <MenuItem key={col.id} value={col.id}>{col.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
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

          {task.images && task.images.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="overline" color="text.secondary" component="h3">
                {t('taskDetail.attachmentsLabel')}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 1 }}>
                {task.images.map((img, idx) => (
                  <Box
                    key={idx}
                    component="img"
                    src={img}
                    alt={`${t('task.imageAlt')} ${idx + 1}`}
                    onClick={() => setLightboxSrc(img)}
                    sx={{ width: 200, height: 150, objectFit: 'cover', borderRadius: 2, boxShadow: 1, cursor: 'pointer', transition: 'opacity 0.15s', '&:hover': { opacity: 0.85 } }}
                  />
                ))}
              </Box>
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
      <ImageLightbox
        src={lightboxSrc}
        alt={t('task.imageAlt')}
        onClose={() => setLightboxSrc(null)}
      />
    </Box>
  );
}
