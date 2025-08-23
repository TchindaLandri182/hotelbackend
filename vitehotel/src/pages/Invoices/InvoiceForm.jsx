import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Formik, Form, Field, FieldArray } from 'formik'
import * as Yup from 'yup'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
  CircularProgress,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { createInvoice, updateInvoice, fetchInvoiceById, clearCurrentInvoice } from '../../store/slices/invoiceSlice'
import { fetchStays } from '../../store/slices/staySlice'
import { toast } from 'react-toastify'

const InvoiceForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()
  const isEdit = !!id

  const { currentInvoice, loading } = useSelector(state => state.invoices)
  const { stays } = useSelector(state => state.stays)

  useEffect(() => {
    dispatch(fetchStays())

    if (isEdit) {
      dispatch(fetchInvoiceById(id))
    }

    return () => {
      dispatch(clearCurrentInvoice())
    }
  }, [dispatch, id, isEdit])

  const validationSchema = Yup.object({
    stay: Yup.string()
      .required(t('errors.required_field')),
    totalAmount: Yup.number()
      .positive(t('errors.invalid_number'))
      .required(t('errors.required_field')),
    paymentStatus: Yup.string()
      .required(t('errors.required_field')),
    payments: Yup.array().of(
      Yup.object({
        amountPaid: Yup.number().positive().required(),
        datePaid: Yup.date().required(),
        method: Yup.string().required(),
      })
    ),
  })

  const initialValues = {
    stay: currentInvoice?.stay?._id || '',
    totalAmount: currentInvoice?.totalAmount || '',
    paymentStatus: currentInvoice?.paymentStatus || 'pending',
    payments: currentInvoice?.payments || [],
  }

  const handleSubmit = async (values) => {
    const invoiceData = {
      stay: values.stay,
      totalAmount: parseFloat(values.totalAmount),
      paymentStatus: values.paymentStatus,
      payments: values.payments.map(payment => ({
        ...payment,
        amountPaid: parseFloat(payment.amountPaid),
        datePaid: payment.datePaid?.toISOString ? payment.datePaid.toISOString() : payment.datePaid,
      })),
    }

    const result = isEdit 
      ? await dispatch(updateInvoice({ id, invoiceData }))
      : await dispatch(createInvoice(invoiceData))

    if (result.type.includes('fulfilled')) {
      toast.success(isEdit ? t('invoices.invoice_updated') : t('invoices.invoice_created'))
      navigate('/invoices')
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/invoices')} sx={{ mr: 2 }}>
            <ArrowLeft size={24} />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {isEdit ? t('invoices.edit_invoice') : t('invoices.create_invoice')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {isEdit ? 'Update invoice information' : 'Create a new invoice for a stay'}
            </Typography>
          </Box>
        </Box>

        <Card>
          <CardContent>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ errors, touched, values, setFieldValue }) => (
                <Form>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Autocomplete
                        options={stays}
                        getOptionLabel={(option) => 
                          `${option.client?.firstName} ${option.client?.lastName} - Room ${option.room?.roomNumber}`
                        }
                        value={stays.find(stay => stay._id === values.stay) || null}
                        onChange={(_, newValue) => setFieldValue('stay', newValue?._id || '')}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={t('invoices.select_stay')}
                            error={touched.stay && Boolean(errors.stay)}
                            helperText={touched.stay && errors.stay}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="totalAmount"
                        label={t('invoices.total_amount')}
                        type="number"
                        fullWidth
                        variant="outlined"
                        InputProps={{
                          startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                        }}
                        error={touched.totalAmount && Boolean(errors.totalAmount)}
                        helperText={touched.totalAmount && errors.totalAmount}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth error={touched.paymentStatus && Boolean(errors.paymentStatus)}>
                        <InputLabel>{t('invoices.payment_status')}</InputLabel>
                        <Select
                          value={values.paymentStatus}
                          onChange={(e) => setFieldValue('paymentStatus', e.target.value)}
                          label={t('invoices.payment_status')}
                        >
                          <MenuItem value="pending">{t('invoices.pending')}</MenuItem>
                          <MenuItem value="partially_paid">{t('invoices.partially_paid')}</MenuItem>
                          <MenuItem value="paid">{t('invoices.paid')}</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 4 }} />

                  {/* Payments Section */}
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    {t('invoices.payments')}
                  </Typography>

                  <FieldArray name="payments">
                    {({ push, remove }) => (
                      <Box>
                        {values.payments.map((payment, index) => (
                          <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                  Payment {index + 1}
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={() => remove(index)}
                                  sx={{ color: 'error.main' }}
                                >
                                  <Trash2 size={16} />
                                </IconButton>
                              </Box>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                  <Field
                                    as={TextField}
                                    name={`payments.${index}.amountPaid`}
                                    label={t('invoices.amount_paid')}
                                    type="number"
                                    fullWidth
                                    variant="outlined"
                                    InputProps={{
                                      startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <DatePicker
                                    label={t('invoices.date_paid')}
                                    value={payment.datePaid ? new Date(payment.datePaid) : null}
                                    onChange={(newValue) => setFieldValue(`payments.${index}.datePaid`, newValue)}
                                    renderInput={(params) => (
                                      <TextField {...params} fullWidth />
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <FormControl fullWidth>
                                    <InputLabel>{t('invoices.method')}</InputLabel>
                                    <Select
                                      value={payment.method || ''}
                                      onChange={(e) => setFieldValue(`payments.${index}.method`, e.target.value)}
                                      label={t('invoices.method')}
                                    >
                                      <MenuItem value="cash">{t('invoices.cash')}</MenuItem>
                                      <MenuItem value="card">{t('invoices.card')}</MenuItem>
                                      <MenuItem value="mobile_money">{t('invoices.mobile_money')}</MenuItem>
                                      <MenuItem value="bank_transfer">{t('invoices.bank_transfer')}</MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        ))}
                        
                        <Button
                          variant="outlined"
                          startIcon={<Plus size={20} />}
                          onClick={() => push({ amountPaid: '', datePaid: new Date(), method: '' })}
                          sx={{ textTransform: 'none', mb: 3 }}
                        >
                          {t('invoices.add_payment')}
                        </Button>
                      </Box>
                    )}
                  </FieldArray>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/invoices')}
                      sx={{ textTransform: 'none' }}
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                      {loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        isEdit ? t('common.update') : t('common.create')
                      )}
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  )
}

export default InvoiceForm