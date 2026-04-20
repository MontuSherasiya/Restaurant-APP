import { useNavigate } from 'react-router-dom'

export default function Bill({ cart, setCart }) {
    const navigate = useNavigate()

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
    const tax = subtotal * 0.05   // 5% GST
    const total = subtotal + tax

    const changeQty = (id, delta) => {
        setCart(prev => {
            return prev
                .map(c => c.id === id ? { ...c, qty: c.qty + delta } : c)
                .filter(c => c.qty > 0)
        })
    }

    const handlePrint = () => window.print()

    const handleClear = () => {
        if (window.confirm('Clear the entire bill?')) setCart([])
    }

    if (cart.length === 0) {
        return (
            <div className="page">
                <h1 className="page-title">Bill</h1>
                <div className="empty-state">
                    <div style={{ fontSize: '2.5rem' }}>🧾</div>
                    <p>No items in cart. Add items from the menu first.</p>
                    <br />
                    <button className="btn btn-primary" onClick={() => navigate('/')}>← Back to Menu</button>
                </div>
            </div>
        )
    }

    return (
        <div className="page">
            <h1 className="page-title">Generate Bill</h1>
            <p className="page-sub">Review selected items and print the bill.</p>

            <div className="card bill-section">
                {/* Bill Header */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '1px dashed var(--border)', paddingBottom: '1rem' }}>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: 'var(--accent)' }}>🍽 RestaurantManager</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '4px' }}>
                        {new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                </div>

                {/* Bill Table */}
                <table className="bill-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Item</th>
                            <th>Price</th>
                            <th>Qty</th>
                            <th>Amount</th>
                            <th className="no-print">Adjust</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item, i) => (
                            <tr key={item.id}>
                                <td>{i + 1}</td>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{item.category}</div>
                                </td>
                                <td>₹{Number(item.price).toFixed(2)}</td>
                                <td>{item.qty}</td>
                                <td style={{ fontWeight: 700 }}>₹{(item.price * item.qty).toFixed(2)}</td>
                                <td className="no-print">
                                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                        <button className="qty-btn" onClick={() => changeQty(item.id, -1)}>−</button>
                                        <button className="qty-btn" onClick={() => changeQty(item.id, +1)}>+</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div style={{ borderTop: '1px dashed var(--border)', marginTop: '1rem', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Subtotal: <strong>₹{subtotal.toFixed(2)}</strong></div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>GST (5%): <strong>₹{tax.toFixed(2)}</strong></div>
                        <div className="bill-total">Total: ₹{total.toFixed(2)}</div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--muted)', borderTop: '1px dashed var(--border)', paddingTop: '1rem' }}>
                    Thank you for dining with us! 🙏
                </div>
            </div>

            {/* Actions */}
            <div className="form-actions no-print">
                <button className="btn btn-outline" onClick={handleClear}>Clear Bill</button>
                <button className="btn btn-outline" onClick={() => navigate('/')}>← Back to Menu</button>
                <button className="btn btn-primary" onClick={handlePrint}>🖨 Print Bill</button>
            </div>

            <style>{`
        @media print {
          .navbar, .no-print { display: none !important; }
          .page { margin: 0; padding: 0; }
          .card { box-shadow: none; border: none; }
        }
      `}</style>
        </div>
    )
}
