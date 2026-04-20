import db from '../config/db.js';

const getAllFoods = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT f.id, f.name, f.price, f.description, f.created_at,
             c.id AS category_id, c.name AS category
      FROM foods f
      JOIN categories c ON f.category_id = c.id
      ORDER BY c.name, f.name
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getFoodById = async (req, res) => {
  try {
    const [rows] = await query(`
      SELECT f.*, c.name AS category
      FROM foods f JOIN categories c ON f.category_id = c.id
      WHERE f.id = ?`, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Food not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createFood = async (req, res) => {
  const { name, price, category_id, description } = req.body;
  if (!name || !price || !category_id) {
    return res.status(400).json({ success: false, message: 'name, price and category_id are required' });
  }
  try {
    const [result] = await query(
      'INSERT INTO foods (name, price, category_id, description) VALUES (?, ?, ?, ?)',
      [name.trim(), price, category_id, description || null]
    );
    res.status(201).json({ success: true, message: 'Food item added', id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateFood = async (req, res) => {
  const { name, price, category_id, description } = req.body;
  if (!name || !price || !category_id) {
    return res.status(400).json({ success: false, message: 'name, price and category_id are required' });
  }
  try {
    const [result] = await query(
      'UPDATE foods SET name=?, price=?, category_id=?, description=? WHERE id=?',
      [name.trim(), price, category_id, description || null, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Food not found' });
    res.json({ success: true, message: 'Food item updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteFood = async (req, res) => {
  try {
    const [result] = await query('DELETE FROM foods WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Food not found' });
    res.json({ success: true, message: 'Food item deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export default { getAllFoods, getFoodById, createFood, updateFood, deleteFood };