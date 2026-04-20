import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
import FoodList from './pages/FoodList'
import AddFood from './pages/AddFood'
import EditFood from './pages/EditFood'
import Bill from './pages/Bill'

export default function App() {
  const [cart, setCart] = useState([])

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<FoodList cart={cart} setCart={setCart} />} />
        <Route path="/add" element={<AddFood />} />
        <Route path="/edit/:id" element={<EditFood />} />
        <Route path="/bill" element={<Bill cart={cart} setCart={setCart} />} />
      </Routes>
    </>
  )
}

export default App
