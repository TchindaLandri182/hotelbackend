import React, { useEffect, useState } from 'react'
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
  CircularProgress,
  Alert,
  Autocomplete,
  Chip,
  IconButton,
} from '@mui/material'
import { ArrowLeft } from 'lucide-react'
import { createHotel, updateHotel, fetchHotelById, clearCurrentHotel } from '../../store/slices/hotelSlice'
import { fetchZones } from '../../store/slices/locationSlice'
import { toast } from 'react-toastify'
import userService from '../../services/userService'
import locationService from '../../services/locationService'

const HotelForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()
  const isEdit = !!id

  const { currentHotel, loading } = useSelector(state => state.hotels)
  // const { zones } = useSelector(state => state.locations)
  const [zones, setZones] = useState([]);
  const [owners, setOwners] = useState([]) // Mock data - replace with real data

  useEffect(() => {
    dispatch(fetchZones())
    
    fetchOwners()

    if (isEdit) {
      dispatch(fetchHotelById(id))
    }

    return () => {
      dispatch(clearCurrentHotel())
    }
  }, [dispatch, id, isEdit])

  const validationSchema = Yup.object({
    name: Yup.string()
      .required(t('errors.required_field')),
    address: Yup.string()
      .required(t('errors.required_field')),
    zone: Yup.string()
      .required(t('errors.required_field')),
    owners: Yup.array()
      .min(1, 'At least one owner is required'),
  })

  const initialValues = {
    name: currentHotel?.name || '',
    address: currentHotel?.address || '',
    logo: currentHotel?.logo || '',
    zone: currentHotel?.zone?._id || '',
    owners: currentHotel?.owners?.map(owner => owner._id) || [],
  }

  const fetchZones = async () => {
    try{
      const response = await locationService.getZones()
      
      setZones(response?.zones || [])
    }catch(error){
      toast.error(error?.response?.data?.message)
    }
  }

  const fetchOwners = async () => {
    try{
      const response = await userService()
      setOwners(response?.users || [])
    }catch(error){
      toast.error(error?.response?.data?.message)
    }
  }

  const handleSubmit = async (values) => {
    const hotelData = {
      name: values.name,
      address: values.address,
      logo: values.logo,
      zone: values.zone,
      owners: values.owners,
    }

    const result = isEdit 
      ? await dispatch(updateHotel({ id, hotelData }))
      : await dispatch(createHotel(hotelData))

    if (result.type.includes('fulfilled')) {
      toast.success(isEdit ? t('hotels.hotel_updated') : t('hotels.hotel_created'))
      navigate('/hotels')
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/hotels')} sx={{ mr: 2 }}>
          <ArrowLeft size={24} />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {isEdit ? t('hotels.edit_hotel') : t('hotels.create_hotel')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEdit ? 'Update hotel information' : 'Add a new hotel to your system'}
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
                    <Field
                      as={TextField}
                      name="name"
                      label={t('hotels.hotel_name')}
                      fullWidth
                      variant="outlined"
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      options={zones}
                      getOptionLabel={(option) => option.name?.en || ''}
                      value={zones.find(zone => zone._id === values.zone) || null}
                      onChange={(_, newValue) => setFieldValue('zone', newValue?._id || '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('hotels.zone')}
                          error={touched.zone && Boolean(errors.zone)}
                          helperText={touched.zone && errors.zone}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="address"
                      label={t('hotels.hotel_address')}
                      fullWidth
                      multiline
                      rows={3}
                      variant="outlined"
                      error={touched.address && Boolean(errors.address)}
                      helperText={touched.address && errors.address}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="logo"
                      label={`${t('hotels.hotel_logo')} (${t('common.optional')})`}
                      fullWidth
                      variant="outlined"
                      placeholder="https://example.com/logo.jpg"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      options={owners}
                      getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.email})`}
                      value={owners.filter(owner => values.owners.includes(owner._id))}
                      onChange={(_, newValue) => setFieldValue('owners', newValue.map(owner => owner._id))}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            variant="outlined"
                            label={`${option.firstName} ${option.lastName}`}
                            {...getTagProps({ index })}
                            key={option._id}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('hotels.owners')}
                          error={touched.owners && Boolean(errors.owners)}
                          helperText={touched.owners && errors.owners}
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/hotels')}
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
  )
}

export default HotelForm