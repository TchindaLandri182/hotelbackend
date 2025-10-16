import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
import { toast } from 'react-toastify'

const PricePeriodForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const [loading, setLoading] = useState(false)

  // Mock data - replace with real data from Redux store
  const rooms = [
    { _id: '1', roomNumber: '101', hotel: { name: 'Grand Palace Hotel' } },
    { _id: '2', roomNumber: '102', hotel: { name: 'Grand Palace Hotel' } },
  ]

  const foodItems = [
    { _id: '1', name: { en: 'Grilled Chicken' }, price: 25 },
    { _id: '2', name: { en: 'Caesar Salad' }, price: 15 },
  ]

  const validationSchema = Yup.object({
    entityType: Yup.string()
      .required(t('errors.required_field')),
    entityId: Yup.string()
      .required(t('errors.required_field')),
    startDate: Yup.date()
      .required(t('errors.required_field')),
    endDate: Yup.date()
      .min(Yup.ref('startDate'), 'End date must be after start date')
      .required(t('errors.required_field')),
    newPrice: Yup.number()
      .positive(t('errors.invalid_number'))
      .required(t('errors.required_field')),
  })

  const initialValues = {
    entityType: 'Room',
    entityId: '',
    startDate: null,
    endDate: null,
    newPrice: '',
  }

  const handleSubmit = async (values) => {
    setLoading(true)
    
    try {
      const pricePeriodData = {
        entityType: values.entityType,
        entityId: values.entityId,
        startDate: values.startDate?.toISOString(),
        endDate: values.endDate?.toISOString(),
        newPrice: parseFloat(values.newPrice),
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success(isEdit ? t('price_periods.price_period_updated') : t('price_periods.price_period_created'))
      navigate('/price-periods')
    } catch (error) {
      toast.error('Failed to save price period')
    } finally {
      setLoading(false)
    }
  }

  const getEntityOptions = (entityType) => {
    return entityType === 'Room' ? rooms : foodItems
  }

  const getEntityLabel = (option, entityType) => {
    if (entityType === 'Room') {
      return `Room ${option.roomNumber} - ${option.hotel?.name}`
    } else {
      return `${option.name?.en} - $${option.price}`
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/price-periods')} sx={{ mr: 2 }}>
            <ArrowLeft size={24} />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {isEdit ? t('price_periods.edit_price_period') : t('price_periods.create_price_period')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {isEdit ? 'Update price period information' : 'Create a new pricing period'}
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
                      <FormControl fullWidth error={touched.entityType && Boolean(errors.entityType)}>
                        <InputLabel>{t('price_periods.entity_type')}</InputLabel>
                        <Select
                          value={values.entityType}
                          onChange={(e) => {
                            setFieldValue('entityType', e.target.value)
                            setFieldValue('entityId', '') // Reset entity selection
                          }}
                          label={t('price_periods.entity_type')}
                        >
                          <MenuItem value="Room">{t('price_periods.room')}</MenuItem>
                          <MenuItem value="Food">{t('price_periods.food')}</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Autocomplete
                        options={getEntityOptions(values.entityType)}
                        getOptionLabel={(option) => getEntityLabel(option, values.entityType)}
                        value={getEntityOptions(values.entityType).find(entity => entity._id === values.entityId) || null}
                        onChange={(_, newValue) => setFieldValue('entityId', newValue?._id || '')}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={t('price_periods.select_entity')}
                            error={touched.entityId && Boolean(errors.entityId)}
                            helperText={touched.entityId && errors.entityId}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <DatePicker
                        label={t('price_periods.start_date')}
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

                    <Grid item xs={12} md={4}>
                      <DatePicker
                        label={t('price_periods.end_date')}
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

                    <Grid item xs={12} md={4}>
                      <Field
                        as={TextField}
                        name="newPrice"
                        label={t('price_periods.new_price')}
                        type="number"
                        fullWidth
                        variant="outlined"
                        InputProps={{
                          startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                        }}
                        error={touched.newPrice && Boolean(errors.newPrice)}
                        helperText={touched.newPrice && errors.newPrice}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/price-periods')}
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

export default PricePeriodForm