import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Salary = () => {
  // Sample data - replace with actual API data
  const salaryData = [
    { employee: 'John Doe', position: 'Developer', baseSalary: 75000, bonus: 5000, deductions: 2000, netPay: 78000 },
    { employee: 'Jane Smith', position: 'Manager', baseSalary: 90000, bonus: 8000, deductions: 3000, netPay: 95000 },
    { employee: 'Mike Johnson', position: 'Designer', baseSalary: 65000, bonus: 3000, deductions: 1500, netPay: 66500 },
  ];

  const departmentSalaryData = [
    { name: 'Development', value: 250000 },
    { name: 'Marketing', value: 180000 },
    { name: 'Design', value: 120000 },
    { name: 'HR', value: 90000 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const monthlyTrend = [
    { month: 'Jan', salary: 200000 },
    { month: 'Feb', salary: 220000 },
    { month: 'Mar', salary: 240000 },
    { month: 'Apr', salary: 230000 },
    { month: 'May', salary: 250000 },
    { month: 'Jun', salary: 260000 },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Salary Management
      </Typography>
      
      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 3, marginBottom: 3 }}>
        <Paper sx={{ padding: 2, flex: 1 }}>
          <Typography variant="h6">Total Monthly Payroll</Typography>
          <Typography variant="h4">$285,500</Typography>
        </Paper>
        <Paper sx={{ padding: 2, flex: 1 }}>
          <Typography variant="h6">Average Salary</Typography>
          <Typography variant="h4">$78,200</Typography>
        </Paper>
        <Paper sx={{ padding: 2, flex: 1 }}>
          <Typography variant="h6">Highest Paid Dept</Typography>
          <Typography variant="h4">Development</Typography>
        </Paper>
      </Box>
      
      {/* Salary Distribution by Department */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom>Salary Distribution by Department</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={departmentSalaryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {departmentSalaryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      
      {/* Monthly Salary Trend */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom>Monthly Salary Trend</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="salary" fill="#8884d8" name="Total Salary" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      
      {/* Employee Salary Details */}
      <Typography variant="h6" gutterBottom>Employee Salary Details</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Position</TableCell>
              <TableCell align="right">Base Salary</TableCell>
              <TableCell align="right">Bonus</TableCell>
              <TableCell align="right">Deductions</TableCell>
              <TableCell align="right">Net Pay</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salaryData.map((row) => (
              <TableRow key={row.employee}>
                <TableCell>{row.employee}</TableCell>
                <TableCell>{row.position}</TableCell>
                <TableCell align="right">${row.baseSalary.toLocaleString()}</TableCell>
                <TableCell align="right">${row.bonus.toLocaleString()}</TableCell>
                <TableCell align="right">${row.deductions.toLocaleString()}</TableCell>
                <TableCell align="right">${row.netPay.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Salary;