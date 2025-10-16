import api from './api'

export const locationService = {
  // Countries
  getCountries: async (params = {}) => {
    const response = await api.get('/country', { params })
    return response.data
  },

  getCountry: async (id) => {
    const response = await api.get(`/country/${id}`)
    return response.data
  },

  createCountry: async (countryData) => {
    const response = await api.post('/country', countryData)
    return response.data
  },

  updateCountry: async (id, countryData) => {
    const response = await api.put(`/country/${id}`, countryData)
    return response.data
  },

  deleteCountry: async (id) => {
    const response = await api.delete(`/country/${id}`)
    return response.data
  },

  // Regions
  getRegions: async (params = {}) => {
    const response = await api.get('/region', { params })
    return response.data
  },

  getRegion: async (id) => {
    const response = await api.get(`/region/${id}`)
    return response.data
  },

  createRegion: async (regionData) => {
    const response = await api.post('/region', regionData)
    return response.data
  },

  updateRegion: async (id, regionData) => {
    const response = await api.put(`/region/${id}`, regionData)
    return response.data
  },

  deleteRegion: async (id) => {
    const response = await api.delete(`/region/${id}`)
    return response.data
  },

  // Cities
  getCities: async (params = {}) => {
    const response = await api.get('/city', { params })
    return response.data
  },

  getCity: async (id) => {
    const response = await api.get(`/city/${id}`)
    return response.data
  },

  createCity: async (cityData) => {
    const response = await api.post('/city', cityData)
    return response.data
  },

  updateCity: async (id, cityData) => {
    const response = await api.put(`/city/${id}`, cityData)
    return response.data
  },

  deleteCity: async (id) => {
    const response = await api.delete(`/city/${id}`)
    return response.data
  },

  // Zones
  getZones: async (params = {}) => {
    const response = await api.get('/zone', { params })
    return response.data
  },

  getZone: async (id) => {
    const response = await api.get(`/zone/${id}`)
    return response.data
  },

  createZone: async (zoneData) => {
    const response = await api.post('/zone', zoneData)
    return response.data
  },

  updateZone: async (id, zoneData) => {
    const response = await api.put(`/zone/${id}`, zoneData)
    return response.data
  },

  deleteZone: async (id) => {
    const response = await api.delete(`/zone/${id}`)
    return response.data
  },
}

export default locationService