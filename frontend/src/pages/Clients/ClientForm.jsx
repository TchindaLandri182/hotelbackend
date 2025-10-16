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
} from '@mui/material'
import { ArrowLeft } from 'lucide-react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { createClient, updateClient, fetchClientById, clearCurrentClient } from '../../store/slices/clientSlice'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'

const ClientForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()
  const isEdit = !!id

  const { user } = useAuth()
  const { currentClient, loading } = useSelector(state => state.clients)

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchClientById(id))
    }

    return () => {
      dispatch(clearCurrentClient())
    }
  }, [dispatch, id, isEdit])

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required(t('errors.required_field')),
    lastName: Yup.string()
      .required(t('errors.required_field')),
    dateOfBirth: Yup.date()
      .required(t('errors.required_field')),
    placeOfBirth: Yup.string()
      .required(t('errors.required_field')),
    nationality: Yup.string()
      .required(t('errors.required_field')),
    country: Yup.string()
      .required(t('errors.required_field')),
    cityOfResidence: Yup.string()
      .required(t('errors.required_field')),
    profession: Yup.string()
      .required(t('errors.required_field')),
    adresse: Yup.string()
      .required(t('errors.required_field')),
    tel: Yup.string()
      .required(t('errors.required_field')),
    nIDC: Yup.string()
      .required(t('errors.required_field')),
    dateOfDelivrance: Yup.date()
      .required(t('errors.required_field')),
    placeOfDelivrance: Yup.string()
      .required(t('errors.required_field')),
  })

  const initialValues = {
    firstName: currentClient?.firstName || '',
    lastName: currentClient?.lastName || '',
    dateOfBirth: currentClient?.dateOfBirth ? new Date(currentClient.dateOfBirth) : null,
    placeOfBirth: currentClient?.placeOfBirth || '',
    nationality: currentClient?.nationality || '',
    country: currentClient?.country || '',
    cityOfResidence: currentClient?.cityOfResidence || '',
    profession: currentClient?.profession || '',
    adresse: currentClient?.adresse || '',
    tel: currentClient?.tel || '',
    nIDC: currentClient?.nIDC || '',
    hotel: user.hotel || '',
    dateOfDelivrance: currentClient?.dateOfDelivrance ? new Date(currentClient.dateOfDelivrance) : null,
    placeOfDelivrance: currentClient?.placeOfDelivrance || '',
  }

  const handleSubmit = async (values) => {
    const clientData = {
      ...values,
      dateOfBirth: values.dateOfBirth?.toISOString(),
      dateOfDelivrance: values.dateOfDelivrance?.toISOString(),
    }

    const result = isEdit 
      ? await dispatch(updateClient({ id, clientData }))
      : await dispatch(createClient(clientData))

      console.log(result)

    if (result.type.includes('fulfilled')) {
      toast.success(isEdit ? t('clients.client_updated') : t('clients.client_created'))
      navigate('/dashboard/stays/create?client='+result.payload._id)
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/dashboard/clients')} sx={{ mr: 2 }}>
            <ArrowLeft size={24} />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {isEdit ? t('clients.edit_client') : t('clients.create_client')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {isEdit ? 'Update client information' : 'Add a new client to your system'}
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
                        name="firstName"
                        label={t('clients.first_name')}
                        fullWidth
                        variant="outlined"
                        error={touched.firstName && Boolean(errors.firstName)}
                        helperText={touched.firstName && errors.firstName}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="lastName"
                        label={t('clients.last_name')}
                        fullWidth
                        variant="outlined"
                        error={touched.lastName && Boolean(errors.lastName)}
                        helperText={touched.lastName && errors.lastName}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <DatePicker
                        label={t('clients.date_of_birth')}
                        value={values.dateOfBirth}
                        onChange={(newValue) => setFieldValue('dateOfBirth', newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
                            helperText={touched.dateOfBirth && errors.dateOfBirth}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="placeOfBirth"
                        label={t('clients.place_of_birth')}
                        fullWidth
                        variant="outlined"
                        error={touched.placeOfBirth && Boolean(errors.placeOfBirth)}
                        helperText={touched.placeOfBirth && errors.placeOfBirth}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="nationality"
                        label={t('clients.nationality')}
                        fullWidth
                        variant="outlined"
                        error={touched.nationality && Boolean(errors.nationality)}
                        helperText={touched.nationality && errors.nationality}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="country"
                        label={t('clients.country')}
                        fullWidth
                        variant="outlined"
                        error={touched.country && Boolean(errors.country)}
                        helperText={touched.country && errors.country}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="cityOfResidence"
                        label={t('clients.city_of_residence')}
                        fullWidth
                        variant="outlined"
                        error={touched.cityOfResidence && Boolean(errors.cityOfResidence)}
                        helperText={touched.cityOfResidence && errors.cityOfResidence}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="profession"
                        label={t('clients.profession')}
                        fullWidth
                        variant="outlined"
                        error={touched.profession && Boolean(errors.profession)}
                        helperText={touched.profession && errors.profession}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        name="adresse"
                        label={t('clients.address')}
                        fullWidth
                        multiline
                        rows={2}
                        variant="outlined"
                        error={touched.adresse && Boolean(errors.adresse)}
                        helperText={touched.adresse && errors.adresse}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="tel"
                        label={t('clients.telephone')}
                        fullWidth
                        variant="outlined"
                        error={touched.tel && Boolean(errors.tel)}
                        helperText={touched.tel && errors.tel}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="nIDC"
                        label={t('clients.id_number')}
                        fullWidth
                        variant="outlined"
                        error={touched.nIDC && Boolean(errors.nIDC)}
                        helperText={touched.nIDC && errors.nIDC}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <DatePicker
                        label={t('clients.date_of_delivery')}
                        value={values.dateOfDelivrance}
                        onChange={(newValue) => setFieldValue('dateOfDelivrance', newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={touched.dateOfDelivrance && Boolean(errors.dateOfDelivrance)}
                            helperText={touched.dateOfDelivrance && errors.dateOfDelivrance}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="placeOfDelivrance"
                        label={t('clients.place_of_delivery')}
                        fullWidth
                        variant="outlined"
                        error={touched.placeOfDelivrance && Boolean(errors.placeOfDelivrance)}
                        helperText={touched.placeOfDelivrance && errors.placeOfDelivrance}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/dashboard/clients')}
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

export default ClientForm