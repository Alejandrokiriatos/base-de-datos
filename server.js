const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// Get all products
app.get('/api/products', (req, res) => {
  db.all(`SELECT products.*, categories.name as category_name 
          FROM products 
          JOIN categories ON products.category_id = categories.id`, 
    (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add new product
app.post('/api/products', (req, res) => {
  const {name, price, unit, description, category_id} = req.body;
  db.run(`INSERT INTO products (name, price, unit, description, category_id) 
          VALUES (?, ?, ?, ?, ?)`,
    [name, price, unit, description, category_id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    });
});

// Update product
app.put('/api/products/:id', (req, res) => {
  const {name, price, unit, description, category_id} = req.body;
  db.run(`UPDATE products 
          SET name = ?, price = ?, unit = ?, description = ?, category_id = ? 
          WHERE id = ?`,
    [name, price, unit, description, category_id, req.params.id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true });
    });
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', req.params.id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true });
  });
});

// Get categories
app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add route to get products by category
app.get('/api/products/category/:name', (req, res) => {
  db.all(`SELECT products.* 
          FROM products 
          JOIN categories ON products.category_id = categories.id
          WHERE categories.name = ?`, 
    [req.params.name],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});