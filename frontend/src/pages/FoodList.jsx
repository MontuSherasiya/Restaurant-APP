import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFoods, deleteFood } from '../services/api'

export default function FoodList({ cart, setCart }) {
    const [foods, setFoods] = useState([])
    const [categories, setCategories] = useState([])
    const [activeTab, setActiveTab] = useState('All')
    const [loading, setLoading] = useState(true)
    const [alert, setAlert] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        loadFoods()
    }, [])

    const loadFoods = async () => {
        setLoading(true)
        try {
            const res = await getFoods()
            const data = res.data.data
            setFoods(data)
            const cats = ['All', ...new Set(data.map(f => f.category))]
            setCategories(cats)
        } catch {
            showAlert('Failed to load food items. Is the backend running?', 'error')
        } finally {
            setLoading(false)
        }
    }

    const showAlert = (msg, type = 'success') => {
        setAlert({ msg, type })
        setTimeout(() => setAlert(null), 3000)
    }

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete "${name}"?`)) return
        try {
            await deleteFood(id)
            showAlert(`"${name}" deleted successfully.`)
            loadFoods()
        } catch {
            showAlert('Failed to delete item.', 'error')
        }
    }

    const filtered = activeTab === 'All'
        ? foods
        : foods.filter(f => f.category === activeTab)

    const getQty = (id) => cart.find(c => c.id === id)?.qty || 0

    const changeQty = (food, delta) => {
        setCart(prev => {
            const existing = prev.find(c => c.id === food.id)
            if (!existing && delta > 0) return [...prev, { ...food, qty: 1 }]
            if (existing && existing.qty + delta <= 0) return prev.filter(c => c.id !== food.id)
            return prev.map(c => c.id === food.id ? { ...c, qty: c.qty + delta } : c)
        })
    }

    return (
        <div className="page">
            <h1 className="page-title">Menu</h1>
            <p className="page-sub">Browse and manage all food items. Add to cart to generate a bill.</p>

            {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

            <div className="category-tabs">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`tab-btn ${activeTab === cat ? 'active' : ''}`}
                        onClick={() => setActiveTab(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="loading">Loading menu items...</div>
            ) : filtered.length === 0 ? (
                <div className="empty-state">
                    <div style={{ fontSize: '2.5rem' }}>🍽</div>
                    <p>No items found. <a href="/add" style={{ color: 'var(--accent)' }}>Add some!</a></p>
                </div>
            ) : (
                <div className="food-grid">
                    {filtered.map(food => (
                        <div className="food-card" key={food.id}>
                            <span className="food-card-cat">{food.category}</span>
                            <span className="food-card-name">{food.name}</span>
                            <span className="food-card-price">₹{Number(food.price).toFixed(2)}</span>
                            {food.description && <span className="food-card-desc">{food.description}</span>}

                            <div className="qty-control">
                                <button className="qty-btn" onClick={() => changeQty(food, -1)}>−</button>
                                <span className="qty-val">{getQty(food.id)}</span>
                                <button className="qty-btn" onClick={() => changeQty(food, +1)}>+</button>
                                <span style={{ fontSize: '0.75rem', color: 'var(--muted)', marginLeft: '4px' }}>
                                    {getQty(food.id) > 0 ? 'In cart' : 'Add'}
                                </span>
                            </div>

                            <div className="food-card-actions">
                                <button className="btn btn-edit btn-sm" onClick={() => navigate(`/edit/${food.id}`)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(food.id, food.name)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {cart.length > 0 && (
                <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
                    <button className="btn btn-primary" onClick={() => navigate('/bill')}>
                        View Bill ({cart.reduce((s, c) => s + c.qty, 0)} items) →
                    </button>
                </div>
            )}
        </div>
    )
}