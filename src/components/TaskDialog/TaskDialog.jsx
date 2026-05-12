import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography,
} from '@mui/material';
import { useBoard } from '../../context/BoardContext';

export default function TaskDialog({ open, onClose, task, columnId }) {
  const { addTask, editTask } = useBoard();
  const isEdit = Boolean(task);

  const [form, setForm] = useState({ name: '', description: '', deadline: '', image: null });
  const [nameError, setNameError] = useState(false);

  useEffect(() => {
    if (open) {
      if (task) {
        setForm({ name: task.name, description: task.description || '', deadline: task.deadline || '', image: task.image || null });
      } else {
        setForm({ name: '', description: '', deadline: '', image: null });
      }
      setNameError(false);
    }
  }, [task, open]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === 'name') setNameError(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(prev => ({ ...prev, image: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setNameError(true);
      return;
    }
    if (isEdit) {
      editTask({ ...task, ...form });
    } else {
      addTask(columnId, form);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Task' : 'Add Task'}</DialogTitle>
      <DialogContent>
        <TextField
          name="name"
          label="Task Name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          error={nameError}
          helperText={nameError ? 'Name is required' : ''}
          inputProps={{ 'data-testid': 'task-name-input' }}
        />
        <TextField
          name="description"
          label="Description"
          value={form.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          margin="normal"
          inputProps={{ 'data-testid': 'task-description-input' }}
        />
        <TextField
          name="deadline"
          label="Deadline"
          type="date"
          value={form.deadline}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          inputProps={{ 'data-testid': 'task-deadline-input' }}
        />
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" component="label" size="small">
            Attach Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
              data-testid="image-file-input"
            />
          </Button>
          {form.image && (
            <Box sx={{ mt: 1 }}>
              <Box
                component="img"
                src={form.image}
                alt="preview"
                sx={{ maxWidth: '100%', maxHeight: 200, borderRadius: 1, display: 'block' }}
              />
              <Button
                size="small"
                color="error"
                onClick={() => setForm(prev => ({ ...prev, image: null }))}
                data-testid="remove-image-btn"
              >
                Remove Image
              </Button>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} data-testid="dialog-cancel-btn">Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          data-testid="dialog-submit-btn"
        >
          {isEdit ? 'Save Changes' : 'Add Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
