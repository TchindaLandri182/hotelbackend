import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Formik, Form, Field } from 'formik'
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
} from '@mui/material'
import { ArrowLeft } from 'lucide-react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { createStay, updateStay, fetchStayById, clearCurrentStay } from '../../store/slices/staySlice'
import { fetchClients } from '../../store/slices/clientSlice'
import { fetchRooms } from '../../store/slices/roomSlice'
import { toast } from 'react-toastify'

const StayForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()
  const isEdit = !!id

  const { currentStay, loading } = useSelector(state => state.stays)
  const { clients } = useSelector(state => state.clients)
  const { rooms } = useSelector(state => state.rooms)

  useEffect(() => {
    dispatch(fetchClients())
    dispatch(fetchRooms())

    if (isEdit) {
      dispatch(fetchStayById(id))
    }

    return () => {
      dispatch(clearCurrentStay())
    }
  }, [dispatch, id, isEdit])

  const validationSchema = Yup.object({
    client: Yup.string()
      .required(t('errors.required_field')),
    room: Yup.string()
      .required(t('errors.required_field')),
    startDate: Yup.date()
      .required(t('errors.required_field')),
    endDate: Yup.date()
      .min(Yup.ref('startDate'), 'End date must be after start date')
      .required(t('errors.required_field')),
    status: Yup.string()
      .required(t('errors.required_field')),
  })

  const initialValues = {
    client: currentStay?.client?._id || '',
    room: currentStay?.room?._id || '',
    startDate: currentStay?.startDate ? new Date(currentStay.startDate) : null,
    endDate: currentStay?.endDate ? new Date(currentStay.endDate) : null,
    status: currentStay?.status || 'pending',
    notes: currentStay?.notes || '',
  }

  const handleSubmit = async (values) => {
    const stayData = {
      client: values.client,
      room: values.room,
      startDate: values.startDate?.toISOString(),
      endDate: values.endDate?.toISOString(),
      status: values.status,
      notes: values.notes,
    }

    const result = isEdit 
      ? await dispatch(updateStay({ id, stayData }))
      : await dispatch(createStay(stayData))

    if (result.type.includes('fulfilled')) {
      toast.success(isEdit ? t('stays.stay_updated') : t('stays.stay_created'))
      navigate('/stays')
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/stays')} sx={{ mr: 2 }}>
            <ArrowLeft size={24} />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {isEdit ? t('stays.edit_stay') : t('stays.create_stay')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {isEdit ? 'Update booking information' : 'Create a new guest booking'}
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
                        options={clients}
                        getOptionLabel={(option) => 
                          `${option.firstName} ${option.lastName} - ${option.tel}`
                        }
                        value={clients.find(client => client._id === values.client) || null}
                        onChange={(_, newValue) => setFieldValue('client', newValue?._id || '')}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={t('stays.select_client')}
                            error={touched.client && Boolean(errors.client)}
                            helperText={touched.client && errors.client}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Autocomplete
                        options={rooms}
                        getOptionLabel={(option) => 
                          `Room ${option.roomNumber} - ${option.hotel?.name}`
                        }
                        value={rooms.find(room => room._id === values.room) || null}
                        onChange={(_, newValue) => setFieldValue('room', newValue?._id || '')}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={t('stays.select_room')}
                            error={touched.room && Boolean(errors.room)}
                            helperText={touched.room && errors.room}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <DatePicker
                        label={t('stays.start_date')}
                        value={values.startDate}
                        onChange={(newValue) => setFieldValue('startDate', newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={touched.startDate && Boolean(errors.startDate)}
                            helperText={touched.startDate && errors.startDate}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <DatePicker
                        label={t('stays.end_date')}
                        value={values.endDate}
                        onChange={(newValue) => setFieldValue('endDate', newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={touched.endDate && Boolean(errors.endDate)}
                            helperText={touched.endDate && errors.endDate}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth error={touched.status && Boolean(errors.status)}>
                        <InputLabel>{t('common.status')}</InputLabel>
                        <Select
                          value={values.status}
                          onChange={(e) => setFieldValue('status', e.target.value)}
                          label={t('common.status')}
                        >
                          <MenuItem value="pending">{t('stays.pending')}</MenuItem>
                          <MenuItem value="confirmed">{t('stays.confirmed')}</MenuItem>
                          <MenuItem value="in-progress">{t('stays.in_progress')}</MenuItem>
                          <MenuItem value="completed">{t('stays.completed')}</MenuItem>
                          <MenuItem value="cancelled">{t('stays.cancelled')}</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        name="notes"
                        label={t('stays.notes')}
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        placeholder="Special requests, preferences, or additional information..."
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/stays')}
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

export default StayForm