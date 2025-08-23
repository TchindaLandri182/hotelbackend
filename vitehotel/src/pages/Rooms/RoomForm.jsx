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
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import { ArrowLeft } from 'lucide-react'
import { createRoom, updateRoom, fetchRoomById, clearCurrentRoom } from '../../store/slices/roomSlice'
import { fetchHotels } from '../../store/slices/hotelSlice'
import { toast } from 'react-toastify'

const RoomForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()
  const isEdit = !!id

  const { currentRoom, loading } = useSelector(state => state.rooms)
  const { hotels } = useSelector(state => state.hotels)
  
  // Mock categories - replace with real data
  const categories = [
    { _id: '1', name: { en: 'Standard Room', fr: 'Chambre Standard' }, basePrice: 100 },
    { _id: '2', name: { en: 'Deluxe Room', fr: 'Chambre Deluxe' }, basePrice: 150 },
    { _id: '3', name: { en: 'Suite', fr: 'Suite' }, basePrice: 250 },
  ]

  useEffect(() => {
    dispatch(fetchHotels())

    if (isEdit) {
      dispatch(fetchRoomById(id))
    }

    return () => {
      dispatch(clearCurrentRoom())
    }
  }, [dispatch, id, isEdit])

  const validationSchema = Yup.object({
    roomNumber: Yup.string()
      .required(t('errors.required_field')),
    hotel: Yup.string()
      .required(t('errors.required_field')),
    category: Yup.string()
      .required(t('errors.required_field')),
  })

  const initialValues = {
    roomNumber: currentRoom?.roomNumber || '',
    hotel: currentRoom?.hotel?._id || '',
    category: currentRoom?.category?._id || '',
    isInMaintenance: currentRoom?.isInMaintenance || false,
  }

  const handleSubmit = async (values) => {
    const roomData = {
      roomNumber: values.roomNumber,
      hotel: values.hotel,
      category: values.category,
      isInMaintenance: values.isInMaintenance,
    }

    const result = isEdit 
      ? await dispatch(updateRoom({ id, roomData }))
      : await dispatch(createRoom(roomData))

    if (result.type.includes('fulfilled')) {
      toast.success(isEdit ? t('rooms.room_updated') : t('rooms.room_created'))
      navigate('/rooms')
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/rooms')} sx={{ mr: 2 }}>
          <ArrowLeft size={24} />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {isEdit ? t('rooms.edit_room') : t('rooms.create_room')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEdit ? 'Update room information' : 'Add a new room to your hotel'}
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
                      name="roomNumber"
                      label={t('rooms.room_number')}
                      fullWidth
                      variant="outlined"
                      error={touched.roomNumber && Boolean(errors.roomNumber)}
                      helperText={touched.roomNumber && errors.roomNumber}
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
                          label={t('rooms.hotel')}
                          error={touched.hotel && Boolean(errors.hotel)}
                          helperText={touched.hotel && errors.hotel}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      options={categories}
                      getOptionLabel={(option) => `${option.name?.en} - $${option.basePrice}/night` || ''}
                      value={categories.find(category => category._id === values.category) || null}
                      onChange={(_, newValue) => setFieldValue('category', newValue?._id || '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('rooms.category')}
                          error={touched.category && Boolean(errors.category)}
                          helperText={touched.category && errors.category}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.isInMaintenance}
                          onChange={(e) => setFieldValue('isInMaintenance', e.target.checked)}
                        />
                      }
                      label={t('rooms.maintenance')}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/rooms')}
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

export default RoomForm