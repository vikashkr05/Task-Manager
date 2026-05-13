import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Alert,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useBoard } from '../../context/BoardContext';
import { validateTaskForm, validateImageFile, logSecurityEvent } from '../../utils/security';

export default function TaskDialog({ open, onClose, task, columnId, onAnnounce }) {
  const { t } = useTranslation();
  const { addTask, editTask } = useBoard();
  const isEdit = Boolean(task);

  const [form, setForm]           = useState({ name: '', description: '', deadline: '', image: null });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(
        task
          ? { name: task.name, description: task.description || '', deadline: task.deadline || '', image: task.image || null }
          : { name: '', description: '', deadline: '', image: null }
      );
      setFieldErrors({});
    }
  }, [task, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: undefined }));
  };

  // OWASP A03/A08: validate MIME type and size before reading file into memory.
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const err = validateImageFile(file);
    if (err) {
      logSecurityEvent('InvalidFileUpload', { type: file.type, size: file.size });
      setFieldErrors(prev => ({ ...prev, image: err }));
      e.target.value = '';
      return;
    }
    setFieldErrors(prev => ({ ...prev, image: undefined }));
    const reader = new FileReader();
    reader.onload = (ev) => setForm(prev => ({ ...prev, image: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    // OWASP A04: client-side validation (server must mirror these checks).
    const errors = validateTaskForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      logSecurityEvent('InvalidFormSubmission', { errors });
      return;
    }
    if (isEdit) {
      editTask({ ...task, ...form });
    } else {
      addTask(columnId, form);
    }
    onAnnounce?.(isEdit ? t('a11y.taskUpdated') : t('a11y.taskAdded'));
    onClose();
  };

  const dialogTitleId = 'task-dialog-title';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth aria-labelledby={dialogTitleId}>
      <DialogTitle id={dialogTitleId}>
        {isEdit ? t('taskDialog.editTitle') : t('taskDialog.addTitle')}
      </DialogTitle>
      <DialogContent>
        <TextField
          name="name"
          label={t('taskDialog.nameLabel')}
          value={form.name}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          error={Boolean(fieldErrors.name)}
          helperText={fieldErrors.name ? t(fieldErrors.name) : ''}
          inputProps={{ 'data-testid': 'task-name-input', maxLength: 200 }}
        />
        <TextField
          name="description"
          label={t('taskDialog.descriptionLabel')}
          value={form.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          margin="normal"
          error={Boolean(fieldErrors.description)}
          helperText={fieldErrors.description ? t(fieldErrors.description) : ''}
          inputProps={{ 'data-testid': 'task-description-input', maxLength: 2000 }}
        />
        <TextField
          name="deadline"
          label={t('taskDialog.deadlineLabel')}
          type="date"
          value={form.deadline}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={Boolean(fieldErrors.deadline)}
          helperText={fieldErrors.deadline ? t(fieldErrors.deadline) : ''}
          InputLabelProps={{ shrink: true }}
          inputProps={{ 'data-testid': 'task-deadline-input' }}
        />

        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" component="label" size="small">
            {t('taskDialog.attachImage')}
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              hidden
              onChange={handleImageChange}
              data-testid="image-file-input"
            />
          </Button>
          {fieldErrors.image && (
            <Alert severity="error" sx={{ mt: 1 }}>{t(fieldErrors.image)}</Alert>
          )}
          {form.image && (
            <Box sx={{ mt: 1 }}>
              <Box
                component="img"
                src={form.image}
                alt={t('taskDialog.imagePreview')}
                sx={{ maxWidth: '100%', maxHeight: 200, borderRadius: 1, display: 'block' }}
              />
              <Button
                size="small"
                color="error"
                onClick={() => setForm(prev => ({ ...prev, image: null }))}
                data-testid="remove-image-btn"
              >
                {t('taskDialog.removeImage')}
              </Button>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} data-testid="dialog-cancel-btn">{t('common.cancel')}</Button>
        <Button onClick={handleSubmit} variant="contained" data-testid="dialog-submit-btn">
          {isEdit ? t('taskDialog.saveBtn') : t('taskDialog.addBtn')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
