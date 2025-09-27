import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  IconButton,
  Chip,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { Search, Plus, Edit, Trash2, FileText, DollarSign } from 'lucide-react'
import { fetchInvoices, deleteInvoice } from '../../store/slices/invoiceSlice'
import { toast } from 'react-toastify'

const Invoices = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { invoices, loading } = useSelector(state => state.invoices)
  const { user } = useSelector(state => state.auth)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [viewMode, setViewMode] = useState('grid')

  const hasPermission = (permission) => {
    if (!user) return false
    if (user.role === 'admin') return true
    return user.permissions && user.permissions.includes(permission)
  }

  // Mock data for demonstration
  const mockInvoices = [
    {
      _id: '1',
      stay: {
        _id: '1',
        client: { firstName: 'John', lastName: 'Smith' },
        room: { roomNumber: '101' },
        startDate: '2024-01-15T00:00:00Z',
        endDate: '2024-01-20T00:00:00Z'
      },
      totalAmount: 500,
      issueDate: '2024-01-20T00:00:00Z',
      paymentStatus: 'paid',
      payments: [
        { amountPaid: 500, datePaid: '2024-01-20T00:00:00Z', method: 'card' }
      ],
      createdAt: '2024-01-20T10:30:00Z'
    },
    {
      _id: '2',
      stay: {
        _id: '2',
        client: { firstName: 'Marie', lastName: 'Dubois' },
        room: { roomNumber: '102' },
        startDate: '2024-01-18T00:00:00Z',
        endDate: '2024-01-25T00:00:00Z'
      },
      totalAmount: 1050,
      issueDate: '2024-01-25T00:00:00Z',
      paymentStatus: 'pending',
      payments: [],
      createdAt: '2024-01-25T14:20:00Z'
    },
  ]

  useEffect(() => {
    dispatch(fetchInvoices({ search: searchTerm, paymentStatus: filterStatus }))
  }, [dispatch, searchTerm, filterStatus])

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning'
      case 'partially_paid':
        return 'info'
      case 'paid':
        return 'success'
      default:
        return 'default'
    }
  }

  const handleDelete = async () => {
    if (selectedInvoice) {
      const result = await dispatch(deleteInvoice(selectedInvoice._id))
      if (result.type === 'invoices/deleteInvoice/fulfilled') {
        toast.success(t('invoices.invoice_deleted'))
        setDeleteDialogOpen(false)
        setSelectedInvoice(null)
      }
    }
  }

  const handleGeneratePDF = async (invoice) => {
    try {
      // Create PDF content
      const pdfContent = generateInvoicePDF(invoice)
      
      // Create blob and download
      const blob = new Blob([pdfContent], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `invoice-${invoice._id.slice(-6).toUpperCase()}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success('Invoice PDF generated successfully')
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Failed to generate PDF')
    }
  }

  const generateInvoicePDF = (invoice) => {
    // Simple PDF content generation (in a real app, use a proper PDF library like jsPDF)
    return `
INVOICE

Invoice Number: INV-${invoice._id.slice(-6).toUpperCase()}
Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}

Guest: ${invoice.stay.client.firstName} ${invoice.stay.client.lastName}
Room: ${invoice.stay.room.roomNumber}
Stay Period: ${new Date(invoice.stay.startDate).toLocaleDateString()} - ${new Date(invoice.stay.endDate).toLocaleDateString()}

Total Amount: $${invoice.totalAmount}
Payment Status: ${invoice.paymentStatus}

Payments:
${invoice.payments.map(payment => 
  `- $${payment.amountPaid} paid on ${new Date(payment.datePaid).toLocaleDateString()} via ${payment.method}`
).join('\n')}

Thank you for your business!
    `
  }
  const displayInvoices = invoices.length > 0 ? invoices : mockInvoices

  const columns = [
    {
      field: 'invoiceNumber',
      headerName: 'Invoice #',
      width: 120,
      renderCell: (params) => `INV-${params.row._id.slice(-6).toUpperCase()}`,
    },
    {
      field: 'guest',
      headerName: 'Guest',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => 
        `${params.row.stay.client.firstName} ${params.row.stay.client.lastName}`,
    },
    {
      field: 'room',
      headerName: 'Room',
      width: 100,
      renderCell: (params) => params.row.stay.room.roomNumber,
    },
    {
      field: 'totalAmount',
      headerName: t('invoices.total_amount'),
      width: 120,
      renderCell: (params) => `$${params.row.totalAmount}`,
    },
    {
      field: 'issueDate',
      headerName: t('invoices.issue_date'),
      width: 120,
      renderCell: (params) => new Date(params.row.issueDate).toLocaleDateString(),
    },
    {
      field: 'paymentStatus',
      headerName: t('invoices.payment_status'),
      width: 140,
      renderCell: (params) => (
        <Chip
          label={t(`invoices.${params.row.paymentStatus}`)}
          color={getStatusColor(params.row.paymentStatus)}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: t('common.actions'),
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          {hasPermission(5003) && (
            <IconButton
              size="small"
              onClick={() => navigate(`/invoices/edit/${params.row._id}`)}
              sx={{ color: 'primary.main' }}
            >
              <Edit size={16} />
            </IconButton>
          )}
          <IconButton
            size="small"
            onClick={() => handleGeneratePDF(params.row)}
            sx={{ color: 'success.main' }}
          >
            <Download size={16} />
          </IconButton>
          {hasPermission(5004) && (
            <IconButton
              size="small"
              onClick={() => {
                setSelectedInvoice(params.row)
                setDeleteDialogOpen(true)
              }}
              sx={{ color: 'error.main' }}
            >
              <Trash2 size={16} />
            </IconButton>
          )}
        </Box>
      ),
    },
  ]

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {t('invoices.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage billing and payment processing
          </Typography>
        </Box>
        {hasPermission(5001) && (
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => navigate('/invoices/create')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {t('invoices.create_invoice')}
          </Button>
        )}
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                placeholder={t('common.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} />
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Payment Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Payment Status"
                >
                  <MenuItem value="">{t('common.all')} Status</MenuItem>
                  <MenuItem value="pending">{t('invoices.pending')}</MenuItem>
                  <MenuItem value="partially_paid">{t('invoices.partially_paid')}</MenuItem>
                  <MenuItem value="paid">{t('invoices.paid')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('grid')}
                  sx={{ textTransform: 'none', minWidth: 'auto', px: 2 }}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('table')}
                  sx={{ textTransform: 'none', minWidth: 'auto', px: 2 }}
                >
                  Table
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Content */}
      {displayInvoices.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <FileText size={64} color="#9ca3af" style={{ marginBottom: 16 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {t('invoices.no_invoices')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Invoices will appear here when stays are completed.
            </Typography>
            {hasPermission(5001) && (
              <Button
                variant="contained"
                startIcon={<Plus size={20} />}
                onClick={() => navigate('/invoices/create')}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                {t('invoices.create_invoice')}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {displayInvoices.map((invoice, index) => (
            <Grid item xs={12} sm={6} lg={4} key={invoice._id}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: getStatusColor(invoice.paymentStatus) === 'success' ? 'success.main' : 
                                getStatusColor(invoice.paymentStatus) === 'warning' ? 'warning.main' :
                                getStatusColor(invoice.paymentStatus) === 'info' ? 'info.main' : 'primary.main',
                        mr: 2,
                      }}
                    >
                      {invoice.paymentStatus === 'paid' ? <DollarSign size={20} /> : <FileText size={20} />}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        INV-{invoice._id.slice(-6).toUpperCase()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {invoice.stay.client.firstName} {invoice.stay.client.lastName}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        ${invoice.totalAmount}
                      </Typography>
                      <Chip
                        label={t(`invoices.${invoice.paymentStatus}`)}
                        color={getStatusColor(invoice.paymentStatus)}
                        size="small"
                      />
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Room: {invoice.stay.room.roomNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Issue Date: {new Date(invoice.issueDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Payments: {invoice.payments.length}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Created {new Date(invoice.createdAt).toLocaleDateString()}
                    </Typography>
                    <Box>
                      {hasPermission(5003) && (
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/invoices/edit/${invoice._id}`)}
                          sx={{ color: 'primary.main' }}
                        >
                          <Edit size={16} />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => handleGeneratePDF(invoice)}
                        sx={{ color: 'success.main' }}
                      >
                        <Download size={16} />
                      </IconButton>
                      {hasPermission(5004) && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedInvoice(invoice)
                            setDeleteDialogOpen(true)
                          }}
                          sx={{ color: 'error.main' }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card>
          <Box sx={{ height: 600 }}>
            <DataGrid
              rows={displayInvoices}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              loading={loading}
              getRowId={(row) => row._id}
              sx={{
                border: 0,
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #f3f4f6',
                },
                '& .MuiDataGrid-columnHeaders': {
                  bgcolor: 'grey.50',
                  borderBottom: '1px solid #e5e7eb',
                },
              }}
            />
          </Box>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('invoices.confirm_delete')}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this invoice? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Invoices