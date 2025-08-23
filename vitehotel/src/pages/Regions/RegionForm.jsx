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

const RegionForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const [loading, setLoading] = useState(false)

  // Mock countries data
  const countries = [
    { _id: '1', name: { en: 'United States', fr: 'États-Unis' } },
    { _id: '2', name: { en: 'France', fr: 'France' } },
    { _id: '3', name: { en: 'United Kingdom', fr: 'Royaume-Uni' } },
  ]

  const validationSchema = Yup.object({
    nameEn: Yup.string()
      .required(t('errors.required_field')),
    nameFr: Yup.string()
      .required(t('errors.required_field')),
    country: Yup.string()
      .required(t('errors.required_field')),
  })

  const initialValues = {
    nameEn: '',
    nameFr: '',
    country: '',
  }

  const handleSubmit = async (values) => {
    setLoading(true)
    
    try {
      const regionData = {
        name: {
          en: values.nameEn,
          fr: values.nameFr,
        },
        country: values.country,
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success(isEdit ? t('regions.region_updated') : t('regions.region_created'))
      navigate('/regions')
    } catch (error) {
      toast.error('Failed to save region')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/regions')} sx={{ mr: 2 }}>
          <ArrowLeft size={24} />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {isEdit ? t('regions.edit_region') : t('regions.create_region')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEdit ? 'Update region information' : 'Add a new region to a country'}
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
                      label={t('regions.name_en')}
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
                      label={t('regions.name_fr')}
                      fullWidth
                      variant="outlined"
                      error={touched.nameFr && Boolean(errors.nameFr)}
                      helperText={touched.nameFr && errors.nameFr}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Autocomplete
                      options={countries}
                      getOptionLabel={(option) => option.name?.en || ''}
                      value={countries.find(country => country._id === values.country) || null}
                      onChange={(_, newValue) => setFieldValue('country', newValue?._id || '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('regions.select_country')}
                          error={touched.country && Boolean(errors.country)}
                          helperText={touched.country && errors.country}
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/regions')}
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

export default RegionForm