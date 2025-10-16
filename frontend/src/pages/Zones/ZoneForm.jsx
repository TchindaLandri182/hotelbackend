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
} from '@mui/material'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'

const ZoneForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const [loading, setLoading] = useState(false)

  // Mock cities data
  const cities = [
    { _id: '1', name: { en: 'New York', fr: 'New York' } },
    { _id: '2', name: { en: 'Paris', fr: 'Paris' } },
    { _id: '3', name: { en: 'London', fr: 'Londres' } },
  ]

  const validationSchema = Yup.object({
    nameEn: Yup.string()
      .required(t('errors.required_field')),
    nameFr: Yup.string()
      .required(t('errors.required_field')),
    city: Yup.string()
      .required(t('errors.required_field')),
  })

  const initialValues = {
    nameEn: '',
    nameFr: '',
    city: '',
  }

  const handleSubmit = async (values) => {
    setLoading(true)
    
    try {
      const zoneData = {
        name: {
          en: values.nameEn,
          fr: values.nameFr,
        },
        city: values.city,
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success(isEdit ? t('zones.zone_updated') : t('zones.zone_created'))
      navigate('/zones')
    } catch (error) {
      toast.error('Failed to save zone')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/zones')} sx={{ mr: 2 }}>
          <ArrowLeft size={24} />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {isEdit ? t('zones.edit_zone') : t('zones.create_zone')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEdit ? 'Update zone information' : 'Add a new zone to a city'}
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
                      label={t('zones.name_en')}
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
                      label={t('zones.name_fr')}
                      fullWidth
                      variant="outlined"
                      error={touched.nameFr && Boolean(errors.nameFr)}
                      helperText={touched.nameFr && errors.nameFr}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Autocomplete
                      options={cities}
                      getOptionLabel={(option) => option.name?.en || ''}
                      value={cities.find(city => city._id === values.city) || null}
                      onChange={(_, newValue) => setFieldValue('city', newValue?._id || '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('zones.select_city')}
                          error={touched.city && Boolean(errors.city)}
                          helperText={touched.city && errors.city}
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/zones')}
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

export default ZoneForm