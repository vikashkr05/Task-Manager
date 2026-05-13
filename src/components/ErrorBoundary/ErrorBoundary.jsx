import { Component } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { logSecurityEvent } from '../../utils/security';

// OWASP A09: Security Logging – catch unhandled render errors and emit a security event.
// In production the logSecurityEvent call should forward to a real monitoring service.
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logSecurityEvent('UnhandledRenderError', {
      message: error.message,
      componentStack: info.componentStack,
    });
  }

  handleReset = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) {
      return (
        <Box
          role="alert"
          sx={{ p: 6, textAlign: 'center' }}
        >
          <Typography variant="h5" gutterBottom>
            Something went wrong.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            An unexpected error occurred. Please try again.
          </Typography>
          <Button variant="contained" onClick={this.handleReset}>
            Try Again
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}
