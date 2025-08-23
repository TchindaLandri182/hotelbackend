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
import { createOrderItem, updateOrderItem, fetchOrderItemById, clearCurrentOrderItem } from '../../store/slices/orderItemSlice'
import { toast } from 'react-toastify'

const OrderItemForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()
  const isEdit = !!id

  const { currentOrderItem, loading } = useSelector(state => state.orderItems)

  // Mock data - replace with real data from Redux store
  const stays = [
    {
      _id: '1',
      client: { firstName: 'John', lastName: 'Doe' },
      room: { roomNumber: '101' },
      startDate: '2024-01-15T00:00:00Z',
      endDate: '2024-01-20T00:00:00Z'
    },
    {
      _id: '2',
      client: { firstName: 'Marie', lastName: 'Dubois' },
      room: { roomNumber: '102' },
      startDate: '2024-01-18T00:00:00Z',
      endDate: '2024-01-25T00:00:00Z'
    },
  ]

  const foodItems = [
    {
      _id: '1',
      name: { en: 'Grilled Chicken', fr: 'Poulet Grillé' },
      price: 25,
      category: 'food'
    },
    {
      _id: '2',
      name: { en: 'Caesar Salad', fr: 'Salade César' },
      price: 15,
      category: 'food'
    },
    {
      _id: '3',
      name: { en: 'Red Wine', fr: 'Vin Rouge' },
      price: 45,
      category: 'beverage'
    },
  ]

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchOrderItemById(id))
    }

    return () => {
      dispatch(clearCurrentOrderItem())
    }
  }, [dispatch, id, isEdit])

  const validationSchema = Yup.object({
    stay: Yup.string()
      .required(t('errors.required_field')),
    foodItem: Yup.string()
      .required(t('errors.required_field')),
    quantity: Yup.number()
      .positive(t('errors.invalid_number'))
      .integer('Quantity must be a whole number')
      .required(t('errors.required_field')),
    status: Yup.string()
      .required(t('errors.required_field')),
  })

  const initialValues = {
    stay: currentOrderItem?.stay?._id || '',
    foodItem: currentOrderItem?.foodItem?._id || '',
    quantity: currentOrderItem?.quantity || 1,
    status: currentOrderItem?.status || 'pending',
  }

  const handleSubmit = async (values) => {
    const orderItemData = {
      stay: values.stay,
      foodItem: values.foodItem,
      quantity: parseInt(values.quantity),
      status: values.status,
    }

    const result = isEdit 
      ? await dispatch(updateOrderItem({ id, orderItemData }))
      : await dispatch(createOrderItem(orderItemData))

    if (result.type.includes('fulfilled')) {
      toast.success(isEdit ? t('order_items.order_updated') : t('order_items.order_created'))
      navigate('/order-items')
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/order-items')} sx={{ mr: 2 }}>
          <ArrowLeft size={24} />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {isEdit ? t('order_items.edit_order') : t('order_items.create_order')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEdit ? 'Update order information' : 'Create a new food service order'}
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
                      options={stays}
                      getOptionLabel={(option) => 
                        `${option.client.firstName} ${option.client.lastName} - Room ${option.room.roomNumber}`
                      }
                      value={stays.find(stay => stay._id === values.stay) || null}
                      onChange={(_, newValue) => setFieldValue('stay', newValue?._id || '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('order_items.select_stay')}
                          error={touched.stay && Boolean(errors.stay)}
                          helperText={touched.stay && errors.stay}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      options={foodItems}
                      getOptionLabel={(option) => `${option.name.en} - $${option.price}`}
                      value={foodItems.find(item => item._id === values.foodItem) || null}
                      onChange={(_, newValue) => setFieldValue('foodItem', newValue?._id || '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('order_items.select_food_item')}
                          error={touched.foodItem && Boolean(errors.foodItem)}
                          helperText={touched.foodItem && errors.foodItem}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      name="quantity"
                      label={t('order_items.quantity')}
                      type="number"
                      fullWidth
                      variant="outlined"
                      inputProps={{ min: 1 }}
                      error={touched.quantity && Boolean(errors.quantity)}
                      helperText={touched.quantity && errors.quantity}
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
                        <MenuItem value="pending">{t('order_items.pending')}</MenuItem>
                        <MenuItem value="preparing">{t('order_items.preparing')}</MenuItem>
                        <MenuItem value="served">{t('order_items.served')}</MenuItem>
                        <MenuItem value="cancelled">{t('order_items.cancelled')}</MenuItem>
                      </Select>
                      {touched.status && errors.status && (
                        <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                          {errors.status}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/order-items')}
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

export default OrderItemForm