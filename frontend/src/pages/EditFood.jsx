import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getFoodById, updateFood, getCategories } from '../services/api'

export default function EditFood() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [form, setForm] = useState({ name: '', price: '', category_id: '', description: '' })
    const [errors, setErrors] = useState({})
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [alert, setAlert] = useState(null)

    useEffect(() => {
        Promise.all([getFoodById(id), getCategories()])
            .then(([foodRes, catRes]) => {
                const f = foodRes.data.data
                setForm({
                    name: f.name,
                    price: f.price,
                    category_id: f.category_id,
                    description: f.description || ''
                })
                setCategories(catRes.data.data)
            })
            .catch(() => setAlert({ msg: 'Failed to load food item.', type: 'error' }))
            .finally(() => setFetching(false))
    }, [id])

    const validate = () => {
        const e = {}
        if (!form.name.trim()) e.name = 'Food name is required.'
        if (!form.price || Number(form.price) <= 0) e.price = 'Valid price is required.'
        if (!form.category_id) e.category_id = 'Please select a category.'
        return e
    }

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
        setErrors(prev => ({ ...prev, [e.target.name]: '' }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }
        setLoading(true)
        try {
            await updateFood(id, { ...form, price: Number(form.price) })
            setAlert({ msg: 'Item updated successfully!', type: 'success' })
            setTimeout(() => navigate('/'), 1200)
        } catch {
            setAlert({ msg: 'Failed to update item.', type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    if (fetching) return <div className="page"><div className="loading">Loading...</div></div>

    return (
        <div className="page">
            <h1 className="page-title">Edit Food Item</h1>
            <p className="page-sub">Update the details below.</p>

            {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

            <div className="card">
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="name">Food Name <span className="req">*</span></label>
                        <input
                            id="name" name="name" type="text"
                            value={form.name} onChange={handleChange}
                            className={errors.name ? 'invalid' : ''}
                        />
                        {errors.name && <span className="error-msg">{errors.name}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="price">Price (₹) <span className="req">*</span></label>
                            <input
                                id="price" name="price" type="number" min="0" step="0.01"
                                value={form.price} onChange={handleChange}
                                className={errors.price ? 'invalid' : ''}
                            />
                            {errors.price && <span className="error-msg">{errors.price}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="category_id">Category <span className="req">*</span></label>
                            <select
                                id="category_id" name="category_id"
                                value={form.category_id} onChange={handleChange}
                                className={errors.category_id ? 'invalid' : ''}
                            >
                                <option value="">-- Select Category --</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            {errors.category_id && <span className="error-msg">{errors.category_id}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description" name="description" rows="3"
                            value={form.description} onChange={handleChange}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-outline" onClick={() => navigate('/')}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}