const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('products.db');

// Initialize database tables
db.serialize(() => {
  // Categories table with parent category
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL
  )`);

  // Products table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    unit TEXT NOT NULL,
    description TEXT,
    category_id INTEGER,
    FOREIGN KEY(category_id) REFERENCES categories(id)
  )`);

  // Insert default categories if they don't exist
  const categories = [
    // Ferretería group
    { name: 'Plomería', type: 'ferreteria' },
    { name: 'Herramientas', type: 'ferreteria' },
    { name: 'Útiles', type: 'ferreteria' },
    // Mercado group 
    { name: 'Productos', type: 'mercado' },
    { name: 'Cárnicos', type: 'mercado' },
    { name: 'Aseo', type: 'mercado' }
  ];

  categories.forEach(category => {
    db.run('INSERT OR IGNORE INTO categories (name, type) VALUES (?, ?)', 
      [category.name, category.type]);
  });

  // Insert sample products if table is empty
  db.get('SELECT COUNT(*) as count FROM products', (err, result) => {
    if (err || result.count > 0) return;

    const products = [
      // Plomería
      {
        name: 'LLAVE DE PASO PVC',
        price: 850,
        unit: '1 Unidad',
        description: 'Llave de paso de PVC de alta calidad',
        category: 'Plomería'
      },
      {
        name: 'CODO PVC 1/2"',
        price: 120,
        unit: '1 Unidad', 
        description: 'Codo de PVC de media pulgada',
        category: 'Plomería'
      },
      // Herramientas
      {
        name: 'MARTILLO',
        price: 1200,
        unit: '1 Unidad',
        description: 'Martillo de acero reforzado',
        category: 'Herramientas'  
      },
      {
        name: 'DESTORNILLADOR',
        price: 450,
        unit: '1 Unidad',
        description: 'Destornillador multifuncional',
        category: 'Herramientas'
      },
      // Útiles
      {
        name: 'CUADERNO', 
        price: 250,
        unit: '1 Unidad',
        description: 'Cuaderno escolar',
        category: 'Útiles'
      },
      {
        name: 'BOLÍGRAFO',
        price: 120, 
        unit: '1 Unidad',
        description: 'Bolígrafo de tinta azul',
        category: 'Útiles'
      },
      // Productos
      {
        name: 'ARROZ',
        price: 500,
        unit: '1 KG',
        description: 'Arroz de primera calidad',
        category: 'Productos'
      },
      {
        name: 'FRIJOLES',
        price: 450,
        unit: '1 KG', 
        description: 'Frijoles negros seleccionados',
        category: 'Productos'
      },
      // Cárnicos
      {
        name: 'CARNE DE RES',
        price: 2500,
        unit: '1 KG',
        description: 'Carne de res fresca de primera',
        category: 'Cárnicos'
      },
      {
        name: 'POLLO ENTERO',
        price: 1800,
        unit: '1 Unidad',
        description: 'Pollo entero limpio',
        category: 'Cárnicos'
      },
      // Aseo
      {
        name: 'DETERGENTE',
        price: 850,
        unit: '1 KG',
        description: 'Detergente en polvo',
        category: 'Aseo'
      },
      {
        name: 'JABÓN DE BAÑO',
        price: 250,
        unit: '1 Unidad',
        description: 'Jabón de tocador',
        category: 'Aseo'
      }
    ];

    products.forEach(product => {
      db.get('SELECT id FROM categories WHERE name = ?', [product.category], (err, category) => {
        if (err || !category) return;
        
        db.run(`INSERT INTO products (name, price, unit, description, category_id) 
                VALUES (?, ?, ?, ?, ?)`,
          [product.name, product.price, product.unit, product.description, category.id]);
      });
    });
  });
});

module.exports = db;