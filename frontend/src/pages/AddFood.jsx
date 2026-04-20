import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createFood, getCategories } from '../services/api'

const EMPTY = { name: '', price: '', category_id: '', description: '' }

export default function AddFood() {
    const [form, setForm] = useState(EMPTY)
    const [errors, setErrors] = useState({})
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        getCategories()
            .then(res => setCategories(res.data.data))
            .catch(() => { })
    }, [])

    const validate = () => {
        const e = {}
        if (!form.name.trim()) e.name = 'Food name is required.'
        else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters.'
        if (!form.price) e.price = 'Price is required.'
        else if (Number(form.price) <= 0) e.price = 'Price must be greater than 0.'
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
            await createFood({ ...form, price: Number(form.price) })
            setAlert({ msg: `"${form.name}" added successfully!`, type: 'success' })
            setForm(EMPTY)
            setTimeout(() => navigate('/'), 1200)
        } catch {
            setAlert({ msg: 'Failed to add item. Check backend connection.', type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page">
            <h1 className="page-title">Add Food Item</h1>
            <p className="page-sub">Fill in the details to add a new item to the menu.</p>

            {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

            <div className="card">
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="name">Food Name <span className="req">*</span></label>
                        <input
                            id="name" name="name" type="text"
                            placeholder="e.g. Paneer Tikka"
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
                                placeholder="e.g. 199"
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
                            placeholder="Brief description..."
                            value={form.description} onChange={handleChange}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-outline" onClick={() => navigate('/')}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
