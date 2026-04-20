import { NavLink } from 'react-router-dom'

export default function Navbar() {
    return (
        <nav className="navbar">
            <NavLink to="/" className="navbar-brand">🍽 RestaurantManager</NavLink>
            <div className="navbar-links">
                <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Menu</NavLink>
                <NavLink to="/add" className={({ isActive }) => isActive ? 'active' : ''}>Add Item</NavLink>
                <NavLink to="/bill" className={({ isActive }) => isActive ? 'active' : ''}>Generate Bill</NavLink>
            </div>
        </nav>
    )
}
