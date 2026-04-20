import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' }
})

// Foods
export const getFoods = () => api.get('/foods')
export const getFoodById = (id) => api.get(`/foods/${id}`)
export const createFood = (data) => api.post('/foods', data)
export const updateFood = (id, data) => api.put(`/foods/${id}`, data)
export const deleteFood = (id) => api.delete(`/foods/${id}`)

// Categories
export const getCategories = () => api.get('/categories')

export default api