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
} from '@mui/material'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'

const CountryForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const [loading, setLoading] = useState(false)

  const validationSchema = Yup.object({
    nameEn: Yup.string()
      .required(t('errors.required_field')),
    nameFr: Yup.string()
      .required(t('errors.required_field')),
    code: Yup.string()
      .length(2, 'Country code must be 2 characters')
      .required(t('errors.required_field')),
  })

  const initialValues = {
    nameEn: '',
    nameFr: '',
    code: '',
  }

  const handleSubmit = async (values) => {
    setLoading(true)
    
    try {
      const countryData = {
        name: {
          en: values.nameEn,
          fr: values.nameFr,
        },
        code: values.code.toUpperCase(),
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success(isEdit ? t('countries.country_updated') : t('countries.country_created'))
      navigate('/countries')
    } catch (error) {
      toast.error('Failed to save country')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/countries')} sx={{ mr: 2 }}>
          <ArrowLeft size={24} />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {isEdit ? t('countries.edit_country') : t('countries.create_country')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEdit ? 'Update country information' : 'Add a new country to the system'}
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
            {({ errors, touched }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      name="nameEn"
                      label={t('countries.name_en')}
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
                      label={t('countries.name_fr')}
                      fullWidth
                      variant="outlined"
                      error={touched.nameFr && Boolean(errors.nameFr)}
                      helperText={touched.nameFr && errors.nameFr}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      name="code"
                      label={t('countries.country_code')}
                      fullWidth
                      variant="outlined"
                      inputProps={{ maxLength: 2, style: { textTransform: 'uppercase' } }}
                      placeholder="US, FR, UK..."
                      error={touched.code && Boolean(errors.code)}
                      helperText={touched.code && errors.code}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/countries')}
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

export default CountryForm