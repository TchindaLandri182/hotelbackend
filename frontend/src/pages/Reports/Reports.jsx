import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { FileDown, BarChart3, PieChart, TrendingUp, Users, DollarSign } from 'lucide-react'
import { format } from 'date-fns'

const Reports = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState(0)
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })
  const [selectedHotel, setSelectedHotel] = useState('')

  // Mock data
  const hotels = [
    { _id: '1', name: 'Grand Palace Hotel' },
    { _id: '2', name: 'Seaside Resort' },
    { _id: '3', name: 'Mountain View Lodge' },
  ]

  const occupancyData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Occupancy Rate (%)',
        data: [75, 82, 68, 91],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  }

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [45000, 52000, 48000, 61000, 55000, 67000],
        backgroundColor: '#10b981',
      },
    ],
  }

  const roomTypeData = {
    labels: ['Standard', 'Deluxe', 'Suite', 'Presidential'],
    datasets: [
      {
        data: [45, 30, 20, 5],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
      },
    ],
  }

  const clientData = [
    { nationality: 'American', count: 245, percentage: 35 },
    { nationality: 'French', count: 189, percentage: 27 },
    { nationality: 'German', count: 134, percentage: 19 },
    { nationality: 'British', count: 98, percentage: 14 },
    { nationality: 'Other', count: 34, percentage: 5 },
  ]

  const financialSummary = {
    totalRevenue: 328000,
    totalBookings: 1247,
    averageStayDuration: 3.2,
    averageRoomRate: 185,
    occupancyRate: 78.5,
    revenuePeriod: 'This Month',
  }

  const handleExportPDF = () => {
    // Implement PDF export functionality
    console.log('Exporting PDF...')
  }

  const handleExportExcel = () => {
    // Implement Excel export functionality
    console.log('Exporting Excel...')
  }

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {t('reports.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive analytics and reporting dashboard
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<FileDown size={20} />}
            onClick={handleExportPDF}
            sx={{ textTransform: 'none' }}
          >
            {t('reports.export_pdf')}
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDown size={20} />}
            onClick={handleExportExcel}
            sx={{ textTransform: 'none' }}
          >
            {t('reports.export_excel')}
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={t('reports.from_date')}
                  value={dateRange.from}
                  onChange={(newValue) => setDateRange(prev => ({ ...prev, from: newValue }))}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={t('reports.to_date')}
                  value={dateRange.to}
                  onChange={(newValue) => setDateRange(prev => ({ ...prev, to: newValue }))}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Hotel</InputLabel>
                <Select
                  value={selectedHotel}
                  onChange={(e) => setSelectedHotel(e.target.value)}
                  label="Hotel"
                >
                  <MenuItem value="">{t('common.all')} Hotels</MenuItem>
                  {hotels.map((hotel) => (
                    <MenuItem key={hotel._id} value={hotel._id}>
                      {hotel.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                fullWidth
                sx={{ height: 56, textTransform: 'none', fontWeight: 600 }}
              >
                {t('reports.generate_report')}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Financial Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <DollarSign size={32} color="#10b981" style={{ marginBottom: 8 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                ${financialSummary.totalRevenue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Revenue
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {financialSummary.revenuePeriod}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <BarChart3 size={32} color="#3b82f6" style={{ marginBottom: 8 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {financialSummary.totalBookings.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Bookings
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {financialSummary.revenuePeriod}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp size={32} color="#f59e0b" style={{ marginBottom: 8 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {financialSummary.occupancyRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Occupancy Rate
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Average
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Users size={32} color="#8b5cf6" style={{ marginBottom: 8 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                ${financialSummary.averageRoomRate}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg. Room Rate
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Per Night
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Report Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label={t('reports.occupancy_report')} />
            <Tab label={t('reports.revenue_report')} />
            <Tab label={t('reports.client_report')} />
            <Tab label={t('reports.financial_summary')} />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              {t('reports.occupancy_report')}
            </Typography>
            <Box sx={{ height: 400 }}>
              <Line data={occupancyData} options={{ maintainAspectRatio: false }} />
            </Box>
          </CardContent>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              {t('reports.revenue_report')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={8}>
                <Box sx={{ height: 400 }}>
                  <Bar data={revenueData} options={{ maintainAspectRatio: false }} />
                </Box>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Room Type Distribution
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Doughnut data={roomTypeData} options={{ maintainAspectRatio: false }} />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              {t('reports.client_report')}
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nationality</TableCell>
                    <TableCell align="right">Count</TableCell>
                    <TableCell align="right">Percentage</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clientData.map((row) => (
                    <TableRow key={row.nationality}>
                      <TableCell component="th" scope="row">
                        {row.nationality}
                      </TableCell>
                      <TableCell align="right">{row.count}</TableCell>
                      <TableCell align="right">{row.percentage}%</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={row.percentage > 20 ? 'High' : row.percentage > 10 ? 'Medium' : 'Low'}
                          color={row.percentage > 20 ? 'success' : row.percentage > 10 ? 'warning' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              {t('reports.financial_summary')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    ${financialSummary.totalRevenue.toLocaleString()}
                  </Typography>
                  <Typography variant="body1">
                    Total Revenue ({financialSummary.revenuePeriod})
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {financialSummary.totalBookings.toLocaleString()}
                  </Typography>
                  <Typography variant="body1">
                    Total Bookings ({financialSummary.revenuePeriod})
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    {financialSummary.averageStayDuration} days
                  </Typography>
                  <Typography variant="body2">
                    Average Stay Duration
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    ${financialSummary.averageRoomRate}
                  </Typography>
                  <Typography variant="body2">
                    Average Room Rate
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    {financialSummary.occupancyRate}%
                  </Typography>
                  <Typography variant="body2">
                    Occupancy Rate
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </TabPanel>
      </Card>
    </Box>
  )
}

export default Reports