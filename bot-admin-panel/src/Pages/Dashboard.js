import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box, // Add Box for positioning
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import "../App.css";

const Dashboard = () => {
  const [apiKey, setApiKey] = useState('');
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [isUpdatingApiKey, setIsUpdatingApiKey] = useState(false);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');

  useEffect(() => {
    fetchApiKey();
    fetchUsers();
  }, []);

  const fetchApiKey = () => {
    axios.get('/admin/api-key')
      .then((response) => {
        setApiKey(response.data);
      })
      .catch((error) => {
        console.error('Error fetching API key:', error);
      });
  };

  const updateApiKey = () => {
    setIsUpdatingApiKey(true);
    axios.post('/admin/api-key', {key:newApiKey})
      .then((response) => {
        alert('API Key updated successfully!');
        setIsDialogOpen(false);
        fetchApiKey();
        setNewApiKey("");
      })
      .catch((error) => {
        console.error('Error updating API key:', error);
        alert('Failed to update API key. Please try again.');
      })
      .finally(() => {
        setIsUpdatingApiKey(false);
      });
  };

  const fetchUsers = () => {
    setIsFetchingUsers(true);
    axios.get('/users')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      })
      .finally(() => {
        setIsFetchingUsers(false);
      });
  };

  const toggleApiKeyVisibility = () => {
    setIsApiKeyVisible(!isApiKeyVisible);
  };

  const getMaskedApiKey = () => {
    if (!apiKey) return '';
    if (isApiKeyVisible) {
      return apiKey;
    } else {
      return `********${apiKey.slice(-8)}`;
    }
  };

  const deleteUser = (chatId) => {
    axios.delete(`/users/${chatId}`)
      .then((response) => {
        alert(response.data.message);
        fetchUsers();
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
  };

  // Handle Logout
  const handleLogout = () => {
    // Clear any relevant session or token
    localStorage.removeItem('token');
    // Redirect to login or home page
    window.location.href = '/login'; 
  };

  return (
    <Container maxWidth="md">
      <div className="weather-background">
        <div className="sun"></div>
      </div>

      <Typography variant="h4" gutterBottom>Weather Admin Dashboard</Typography>

      {/* Logout Button in the top-right corner */}
      <Box position="absolute" top={10} right={10}>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h5" gutterBottom>Manage API Key</Typography>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <Typography variant="body1" style={{ flexGrow: 1 }}>
            Current API Key: {getMaskedApiKey()}
          </Typography>
          <IconButton
            className="eye-icon"
            onClick={toggleApiKeyVisibility}
            aria-label={isApiKeyVisible ? 'Hide API Key' : 'Show API Key'}
          >
            {isApiKeyVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        </div>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsDialogOpen(true)}
          style={{ marginTop: '10px' }}
        >
          Update API Key
        </Button>
      </Paper>

      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>Current Users</Typography>
        {isFetchingUsers ? (
          <CircularProgress />
        ) : users.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Chat ID</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.chatId}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.chatId}</TableCell>
                    <TableCell>{user.city || 'Not set'}</TableCell>
                    <TableCell>
                      <IconButton aria-label="delete" onClick={() => deleteUser(user.chatId)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1" style={{ marginTop: '10px' }}>
            No users available.
          </Typography>
        )}
      </Paper>

      {/* Dialog for updating API key */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Update API Key</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New API Key"
            type="text"
            fullWidth
            value={newApiKey}
            onChange={(e) => setNewApiKey(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={updateApiKey}
            color="primary"
            disabled={isUpdatingApiKey || !newApiKey}
          >
            {isUpdatingApiKey ? <CircularProgress size={24} color="inherit" /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
