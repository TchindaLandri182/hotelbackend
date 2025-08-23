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
} from '@mui/material'
import { ArrowLeft } from 'lucide-react'
import { createCategory, updateCategory, fetchCategoryById, clearCurrentCategory } from '../../store/slices/categorySlice'
import { fetchHotels } from '../../store/slices/hotelSlice'
import { toast } from 'react-toastify'

const CategoryForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()
  const isEdit = !!id

  const { currentCategory, loading } = useSelector(state => state.categories)
  const { hotels } = useSelector(state => state.hotels)

  useEffect(() => {
    dispatch(fetchHotels())

    if (isEdit) {
      dispatch(fetchCategoryById(id))
    }

    return () => {
      dispatch(clearCurrentCategory())
    }
  }, [dispatch, id, isEdit])

  const validationSchema = Yup.object({
    nameEn: Yup.string()
      .required(t('errors.required_field')),
    nameFr: Yup.string()
      .required(t('errors.required_field')),
    descriptionEn: Yup.string()
      .required(t('errors.required_field')),
    descriptionFr: Yup.string()
      .required(t('errors.required_field')),
    basePrice: Yup.number()
      .min(0, 'Price must be positive')
      .required(t('errors.required_field')),
    hotel: Yup.string()
      .required(t('errors.required_field')),
  })

  const initialValues = {
    nameEn: currentCategory?.name?.en || '',
    nameFr: currentCategory?.name?.fr || '',
    descriptionEn: currentCategory?.description?.en || '',
    descriptionFr: currentCategory?.description?.fr || '',
    basePrice: currentCategory?.basePrice || '',
    hotel: currentCategory?.hotel?._id || '',
  }

  const handleSubmit = async (values) => {
    const categoryData = {
      name: {
        en: values.nameEn,
        fr: values.nameFr,
      },
      description: {
        en: values.descriptionEn,
        fr: values.descriptionFr,
      },
      basePrice: parseFloat(values.basePrice),
      hotel: values.hotel,
    }

    const result = isEdit 
      ? await dispatch(updateCategory({ id, categoryData }))
      : await dispatch(createCategory(categoryData))

    if (result.type.includes('fulfilled')) {
      toast.success(isEdit ? t('categories.category_updated') : t('categories.category_created'))
      navigate('/categories')
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/categories')} sx={{ mr: 2 }}>
          <ArrowLeft size={24} />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {isEdit ? t('categories.edit_category') : t('categories.create_category')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEdit ? 'Update category information' : 'Add a new room category'}
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
                      label={t('categories.name_en')}
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
                      label={t('categories.name_fr')}
                      fullWidth
                      variant="outlined"
                      error={touched.nameFr && Boolean(errors.nameFr)}
                      helperText={touched.nameFr && errors.nameFr}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      name="descriptionEn"
                      label={t('categories.description_en')}
                      fullWidth
                      multiline
                      rows={3}
                      variant="outlined"
                      error={touched.descriptionEn && Boolean(errors.descriptionEn)}
                      helperText={touched.descriptionEn && errors.descriptionEn}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      name="descriptionFr"
                      label={t('categories.description_fr')}
                      fullWidth
                      multiline
                      rows={3}
                      variant="outlined"
                      error={touched.descriptionFr && Boolean(errors.descriptionFr)}
                      helperText={touched.descriptionFr && errors.descriptionFr}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      name="basePrice"
                      label={t('categories.base_price')}
                      type="number"
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                      }}
                      error={touched.basePrice && Boolean(errors.basePrice)}
                      helperText={touched.basePrice && errors.basePrice}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      options={hotels}
                      getOptionLabel={(option) => option.name || ''}
                      value={hotels.find(hotel => hotel._id === values.hotel) || null}
                      onChange={(_, newValue) => setFieldValue('hotel', newValue?._id || '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('categories.hotel')}
                          error={touched.hotel && Boolean(errors.hotel)}
                          helperText={touched.hotel && errors.hotel}
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/categories')}
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

export default CategoryForm