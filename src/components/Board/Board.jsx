import { useState } from 'react';
import {
  Box, Typography, Button, AppBar, Toolbar,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useBoard } from '../../context/BoardContext';
import Column from '../Column/Column';
import TaskDialog from '../TaskDialog/TaskDialog';

function AddColumnDialog({ open, onClose, onAdd }) {
  const [name, setName] = useState('');

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name.trim());
      setName('');
      onClose();
    }
  };

  const handleClose = () => {
    setName('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Add Column</DialogTitle>
      <DialogContent>
        <TextField
          label="Column Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          inputProps={{ 'data-testid': 'column-name-input' }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          disabled={!name.trim()}
          data-testid="add-column-submit-btn"
        >
          Add Column
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Board() {
  const { state, addColumn } = useBoard();
  const [taskDialog, setTaskDialog] = useState({ open: false, task: null, columnId: null });
  const [addColumnOpen, setAddColumnOpen] = useState(false);

  const handleOpenAdd = (columnId) => setTaskDialog({ open: true, task: null, columnId });
  const handleOpenEdit = (task) => setTaskDialog({ open: true, task, columnId: null });
  const handleCloseTask = () => setTaskDialog({ open: false, task: null, columnId: null });

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Task Board
          </Typography>
          <Button
            color="inherit"
            startIcon={<Add />}
            onClick={() => setAddColumnOpen(true)}
            data-testid="add-column-btn"
          >
            Add Column
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', p: 2, gap: 2, overflowX: 'auto', flexGrow: 1, bgcolor: 'background.default', alignItems: 'flex-start' }}>
        {state.columns.map(column => (
          <Column
            key={column.id}
            column={column}
            onAddTask={() => handleOpenAdd(column.id)}
            onEditTask={handleOpenEdit}
          />
        ))}
      </Box>

      <TaskDialog
        open={taskDialog.open}
        onClose={handleCloseTask}
        task={taskDialog.task}
        columnId={taskDialog.columnId}
      />

      <AddColumnDialog
        open={addColumnOpen}
        onClose={() => setAddColumnOpen(false)}
        onAdd={addColumn}
      />
    </Box>
  );
}
