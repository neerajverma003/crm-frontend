import React from 'react';
import { Box, Typography } from '@mui/material';

const MySalarySlip = () => {
  return (
    <Box sx={styles.backgroundContainer}>
      <Box sx={styles.container}>
        <Typography variant="h4" sx={styles.title}>
          Salary Slips
        </Typography>
        <Typography variant="subtitle1" sx={styles.subtitle}>
          You can view your Salary Slips here
        </Typography>
        
        <Box sx={styles.messageBox}>
          <Typography variant="body1" sx={styles.message}>
            Salary has not been processed yet. Contact HR for details.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const styles = {
  backgroundContainer: {
    backgroundImage: 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '8px',
    padding: '40px',
    width: '100%',
    maxWidth: '600px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    textAlign: 'center'
  },
  title: {
    color: '#2c3e50',
    fontWeight: '600',
    marginBottom: '8px'
  },
  subtitle: {
    color: '#7f8c8d',
    marginBottom: '32px'
  },
  messageBox: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '6px',
    borderLeft: '4px solid #3498db'
  },
  message: {
    color: '#34495e',
    fontSize: '16px',
    lineHeight: '1.6'
  }
};

export default MySalarySlip;