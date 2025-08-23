import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { locationService } from '../../services/locationService'

// Async thunks for Countries
export const fetchCountries = createAsyncThunk(
  'locations/fetchCountries',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await locationService.getCountries(params)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch countries')
    }
  }
)

export const createCountry = createAsyncThunk(
  'locations/createCountry',
  async (countryData, { rejectWithValue }) => {
    try {
      const response = await locationService.createCountry(countryData)
      return response.country
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create country')
    }
  }
)

// Async thunks for Regions
export const fetchRegions = createAsyncThunk(
  'locations/fetchRegions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await locationService.getRegions(params)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch regions')
    }
  }
)

export const createRegion = createAsyncThunk(
  'locations/createRegion',
  async (regionData, { rejectWithValue }) => {
    try {
      const response = await locationService.createRegion(regionData)
      return response.region
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create region')
    }
  }
)

// Async thunks for Cities
export const fetchCities = createAsyncThunk(
  'locations/fetchCities',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await locationService.getCities(params)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cities')
    }
  }
)

export const createCity = createAsyncThunk(
  'locations/createCity',
  async (cityData, { rejectWithValue }) => {
    try {
      const response = await locationService.createCity(cityData)
      return response.city
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create city')
    }
  }
)

// Async thunks for Zones
export const fetchZones = createAsyncThunk(
  'locations/fetchZones',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await locationService.getZones(params)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch zones')
    }
  }
)

export const createZone = createAsyncThunk(
  'locations/createZone',
  async (zoneData, { rejectWithValue }) => {
    try {
      const response = await locationService.createZone(zoneData)
      return response.zone
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create zone')
    }
  }
)

const initialState = {
  countries: [],
  regions: [],
  cities: [],
  zones: [],
  loading: false,
  error: null,
}

const locationSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Countries
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false
        state.countries = action.payload.countries
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createCountry.fulfilled, (state, action) => {
        state.countries.unshift(action.payload)
      })
      // Regions
      .addCase(fetchRegions.fulfilled, (state, action) => {
        state.regions = action.payload.regions
      })
      .addCase(createRegion.fulfilled, (state, action) => {
        state.regions.unshift(action.payload)
      })
      // Cities
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.cities = action.payload.cities
      })
      .addCase(createCity.fulfilled, (state, action) => {
        state.cities.unshift(action.payload)
      })
      // Zones
      .addCase(fetchZones.fulfilled, (state, action) => {
        state.zones = action.payload.zones
      })
      .addCase(createZone.fulfilled, (state, action) => {
        state.zones.unshift(action.payload)
      })
  },
})

export const { clearError } = locationSlice.actions
export default locationSlice.reducer