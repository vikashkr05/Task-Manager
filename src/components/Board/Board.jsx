import { useState, useRef } from 'react';
import {
  Box, Typography, Button, AppBar, Toolbar,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Tooltip, ButtonGroup,
} from '@mui/material';
import { Add, Language } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useBoard } from '../../context/BoardContext';
import Column from '../Column/Column';
import TaskDialog from '../TaskDialog/TaskDialog';

function AddColumnDialog({ open, onClose, onAdd }) {
  const { t } = useTranslation();
  const [name, setName] = useState('');

  const handleAdd = () => {
    if (name.trim()) { onAdd(name.trim()); setName(''); onClose(); }
  };
  const handleClose = () => { setName(''); onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth aria-labelledby="add-col-dialog-title">
      <DialogTitle id="add-col-dialog-title">{t('board.addColumnDialogTitle')}</DialogTitle>
      <DialogContent>
        <TextField
          label={t('board.columnNameLabel')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          inputProps={{ 'data-testid': 'column-name-input', maxLength: 80 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('common.cancel')}</Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          disabled={!name.trim()}
          data-testid="add-column-submit-btn"
        >
          {t('board.addColumnBtn')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Board() {
  const { t, i18n } = useTranslation();
  const { state, addColumn } = useBoard();
  const [taskDialog, setTaskDialog] = useState({ open: false, task: null, columnId: null });
  const [addColumnOpen, setAddColumnOpen] = useState(false);

  // Accessibility: aria-live region announces task mutations to screen readers.
  const [liveMsg, setLiveMsg] = useState('');
  const announce = (msg) => { setLiveMsg(''); setTimeout(() => setLiveMsg(msg), 50); };

  const handleOpenAdd  = (columnId) => setTaskDialog({ open: true, task: null, columnId });
  const handleOpenEdit = (task)     => setTaskDialog({ open: true, task, columnId: null });
  const handleCloseTask = ()        => setTaskDialog({ open: false, task: null, columnId: null });

  const toggleLang = () => i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en');

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Accessibility: polite live region for dynamic content announcements */}
      <Box
        role="status"
        aria-live="polite"
        aria-atomic="true"
        sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}
      >
        {liveMsg}
      </Box>

      <AppBar position="static" elevation={1} component="header">
        <Toolbar>
          {/* Accessibility: h1 – only one per page */}
          <Typography
            component="h1"
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 700 }}
          >
            {t('board.title')}
          </Typography>

          {/* i18n: toggle between English and Spanish */}
          <Tooltip title={t('board.switchLang')}>
            <Button
              color="inherit"
              onClick={toggleLang}
              startIcon={<Language />}
              aria-label={t('board.switchLang')}
              size="small"
              sx={{ mr: 1 }}
            >
              {i18n.language === 'en' ? 'ES' : 'EN'}
            </Button>
          </Tooltip>

          <Button
            color="inherit"
            startIcon={<Add />}
            onClick={() => setAddColumnOpen(true)}
            data-testid="add-column-btn"
          >
            {t('board.addColumn')}
          </Button>
        </Toolbar>
      </AppBar>

      {/* Accessibility: <main> landmark with id targeted by SkipLink */}
      <Box
        component="main"
        id="main-content"
        aria-label={t('a11y.boardRegion')}
        tabIndex={-1}
        sx={{
          display: 'flex',
          p: 2,
          gap: 2,
          overflowX: 'auto',
          flexGrow: 1,
          bgcolor: 'background.default',
          alignItems: 'flex-start',
          outline: 'none',
        }}
      >
        {state.columns.map(column => (
          <Column
            key={column.id}
            column={column}
            onAddTask={() => handleOpenAdd(column.id)}
            onEditTask={handleOpenEdit}
            onAnnounce={announce}
          />
        ))}
      </Box>

      <TaskDialog
        open={taskDialog.open}
        onClose={handleCloseTask}
        task={taskDialog.task}
        columnId={taskDialog.columnId}
        onAnnounce={announce}
      />

      <AddColumnDialog
        open={addColumnOpen}
        onClose={() => setAddColumnOpen(false)}
        onAdd={addColumn}
      />
    </Box>
  );
}
