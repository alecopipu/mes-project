import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <div>
      <Typography variant="h4">Welcome, {user?.username}!</Typography>
      <Typography>Your Roles: {user?.roles.join(', ')}</Typography>
      <Typography>Your Permissions: {user?.permissions.join(', ')}</Typography>
    </div>
  );
};


function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const AppContent: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MES Portal
          </Typography>
          {isAuthenticated ? (
            <Button color="inherit" onClick={logout}>Logout</Button>
          ) : (
            <Button color="inherit" component={Link} to="/login">Login</Button>
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            {/* Other protected routes go here */}
          </Route>
        </Routes>
      </Container>
    </>
  );
};


export default App;
