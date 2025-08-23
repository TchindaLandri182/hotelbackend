import React, { useState } from 'react'
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
} from '@mui/material'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'

const CityForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const [loading, setLoading] = useState(false)

  // Mock regions data
  const regions = [
    { _id: '1', name: { en: 'New York State', fr: 'État de New York' } },
    { _id: '2', name: { en: 'Île-de-France', fr: 'Île-de-France' } },
    { _id: '3', name: { en: 'England', fr: 'Angleterre' } },
  ]

  const validationSchema = Yup.object({
    nameEn: Yup.string()
      .required(t('errors.required_field')),
    nameFr: Yup.string()
      .required(t('errors.required_field')),
    region: Yup.string()
      .required(t('errors.required_field')),
  })

  const initialValues = {
    nameEn: '',
    nameFr: '',
    region: '',
  }

  const handleSubmit = async (values) => {
    setLoading(true)
    
    try {
      const cityData = {
        name: {
          en: values.nameEn,
          fr: values.nameFr,
        },
        region: values.region,
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success(isEdit ? t('cities.city_updated') : t('cities.city_created'))
      navigate('/cities')
    } catch (error) {
      toast.error('Failed to save city')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/cities')} sx={{ mr: 2 }}>
          <ArrowLeft size={24} />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {isEdit ? t('cities.edit_city') : t('cities.create_city')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEdit ? 'Update city information' : 'Add a new city to a region'}
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
                      name="nameEn"
                      label={t('cities.name_en')}
                      fullWidth
                      variant="outlined"
                      error={touched.nameEn && Boolean(errors.nameEn)}
                      helperText={touched.nameEn && errors.nameEn}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      name="nameFr"
                      label={t('cities.name_fr')}
                      fullWidth
                      variant="outlined"
                      error={touched.nameFr && Boolean(errors.nameFr)}
                      helperText={touched.nameFr && errors.nameFr}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Autocomplete
                      options={regions}
                      getOptionLabel={(option) => option.name?.en || ''}
                      value={regions.find(region => region._id === values.region) || null}
                      onChange={(_, newValue) => setFieldValue('region', newValue?._id || '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('cities.select_region')}
                          error={touched.region && Boolean(errors.region)}
                          helperText={touched.region && errors.region}
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/cities')}
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

export default CityForm