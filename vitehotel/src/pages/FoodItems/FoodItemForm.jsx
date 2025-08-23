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
import { createFoodItem, updateFoodItem, fetchFoodItemById, clearCurrentFoodItem } from '../../store/slices/foodItemSlice'
import { fetchHotels } from '../../store/slices/hotelSlice'
import { toast } from 'react-toastify'

const FoodItemForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()
  const isEdit = !!id

  const { currentFoodItem, loading } = useSelector(state => state.foodItems)
  const { hotels } = useSelector(state => state.hotels)

  useEffect(() => {
    dispatch(fetchHotels())

    if (isEdit) {
      dispatch(fetchFoodItemById(id))
    }

    return () => {
      dispatch(clearCurrentFoodItem())
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
    price: Yup.number()
      .positive(t('errors.invalid_number'))
      .required(t('errors.required_field')),
    hotel: Yup.string()
      .required(t('errors.required_field')),
    category: Yup.string()
      .required(t('errors.required_field')),
  })

  const initialValues = {
    nameEn: currentFoodItem?.name?.en || '',
    nameFr: currentFoodItem?.name?.fr || '',
    descriptionEn: currentFoodItem?.description?.en || '',
    descriptionFr: currentFoodItem?.description?.fr || '',
    price: currentFoodItem?.price || '',
    hotel: currentFoodItem?.hotel?._id || '',
    category: currentFoodItem?.category || '',
  }

  const handleSubmit = async (values) => {
    const foodItemData = {
      name: {
        en: values.nameEn,
        fr: values.nameFr,
      },
      description: {
        en: values.descriptionEn,
        fr: values.descriptionFr,
      },
      price: parseFloat(values.price),
      hotel: values.hotel,
      category: values.category,
    }

    const result = isEdit 
      ? await dispatch(updateFoodItem({ id, foodItemData }))
      : await dispatch(createFoodItem(foodItemData))

    if (result.type.includes('fulfilled')) {
      toast.success(isEdit ? t('food_items.food_item_updated') : t('food_items.food_item_created'))
      navigate('/food-items')
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/food-items')} sx={{ mr: 2 }}>
          <ArrowLeft size={24} />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {isEdit ? t('food_items.edit_food_item') : t('food_items.create_food_item')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEdit ? 'Update food item information' : 'Add a new item to your menu'}
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
                      label={t('food_items.name_en')}
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
                      label={t('food_items.name_fr')}
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
                      label={t('food_items.description_en')}
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
                      label={t('food_items.description_fr')}
                      fullWidth
                      multiline
                      rows={3}
                      variant="outlined"
                      error={touched.descriptionFr && Boolean(errors.descriptionFr)}
                      helperText={touched.descriptionFr && errors.descriptionFr}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Field
                      as={TextField}
                      name="price"
                      label={t('food_items.price')}
                      type="number"
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                      }}
                      error={touched.price && Boolean(errors.price)}
                      helperText={touched.price && errors.price}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Autocomplete
                      options={hotels}
                      getOptionLabel={(option) => option.name || ''}
                      value={hotels.find(hotel => hotel._id === values.hotel) || null}
                      onChange={(_, newValue) => setFieldValue('hotel', newValue?._id || '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('food_items.hotel')}
                          error={touched.hotel && Boolean(errors.hotel)}
                          helperText={touched.hotel && errors.hotel}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth error={touched.category && Boolean(errors.category)}>
                      <InputLabel>{t('food_items.category')}</InputLabel>
                      <Select
                        value={values.category}
                        onChange={(e) => setFieldValue('category', e.target.value)}
                        label={t('food_items.category')}
                      >
                        <MenuItem value="food">{t('food_items.food')}</MenuItem>
                        <MenuItem value="beverage">{t('food_items.beverage')}</MenuItem>
                      </Select>
                      {touched.category && errors.category && (
                        <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                          {errors.category}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/food-items')}
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

export default FoodItemForm