import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Chip, Paper, AppBar, Toolbar,
  IconButton, Divider,
} from '@mui/material';
import { ArrowBack, Edit, Star, StarBorder } from '@mui/icons-material';
import { useBoard } from '../../context/BoardContext';
import TaskDialog from '../../components/TaskDialog/TaskDialog';

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, toggleFavorite } = useBoard();
  const task = state.tasks[id];
  const [editOpen, setEditOpen] = useState(false);

  if (!task) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>Task not found.</Typography>
        <Button variant="outlined" onClick={() => navigate('/')}>
          Back to Board
        </Button>
      </Box>
    );
  }

  const column = state.columns.find(col => col.taskIds.includes(id));

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => navigate('/')} edge="start" aria-label="go back">
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 1 }}>Task Details</Typography>
          <IconButton
            color="inherit"
            onClick={() => toggleFavorite(id)}
            aria-label={task.favorite ? 'remove from favorites' : 'add to favorites'}
          >
            {task.favorite ? <Star /> : <StarBorder />}
          </IconButton>
          <Button
            color="inherit"
            startIcon={<Edit />}
            onClick={() => setEditOpen(true)}
            data-testid="edit-task-btn"
          >
            Edit
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
        <Paper sx={{ p: 3, maxWidth: 720, mx: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="h4" sx={{ flexGrow: 1 }}>{task.name}</Typography>
            {task.favorite && <Chip label="Favorite" color="warning" size="small" icon={<Star />} />}
          </Box>
          <Divider sx={{ my: 2 }} />

          {column && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="overline" color="text.secondary">Column</Typography>
              <Typography variant="body1">{column.name}</Typography>
            </Box>
          )}

          {task.deadline && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="overline" color="text.secondary">Deadline</Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip label={task.deadline} color="primary" />
              </Box>
            </Box>
          )}

          {task.description ? (
            <Box sx={{ mb: 3 }}>
              <Typography variant="overline" color="text.secondary">Description</Typography>
              <Typography variant="body1" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
                {task.description}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ mb: 3 }}>
              <Typography variant="overline" color="text.secondary">Description</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>No description provided.</Typography>
            </Box>
          )}

          {task.image && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="overline" color="text.secondary">Attachment</Typography>
              <Box
                component="img"
                src={task.image}
                alt="task attachment"
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
