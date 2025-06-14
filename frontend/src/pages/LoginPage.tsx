import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setError(null);
            try {
              const response = await api.post('/auth/login', values);
              login(response.data.access_token);
              navigate('/');
            } catch (err) {
              setError('Invalid username or password');
              console.error(err);
            }
            setSubmitting(false);
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Field
                as={TextField}
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username && errors.username}
              />
              <Field
                as={TextField}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              {error && <Alert severity="error">{error}</Alert>}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSubmitting}
              >
                Sign In
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default LoginPage; 