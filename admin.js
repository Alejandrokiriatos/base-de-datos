let products = [];
let categories = [];

// Load data when page loads
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
});

async function loadProducts() {
  try {
    const response = await fetch('/api/products');
    products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error('Error loading products:', error);
    alert('Error al cargar los productos');
  }
}

function displayProducts(productsToShow) {
  const tbody = document.getElementById('products-tbody');
  tbody.innerHTML = '';
  
  productsToShow.forEach(product => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${product.name}</td>
      <td>$${product.price.toFixed(2)}</td>
      <td>${product.unit}</td>
      <td>${product.category_name}</td>
      <td>${product.description || ''}</td>
      <td class="actions">
        <button class="edit-btn" onclick="editProduct(${product.id})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="delete-btn" onclick="deleteProduct(${product.id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function filterProducts() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const selectedCategory = document.getElementById('category-filter').value;
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm));
    const matchesCategory = !selectedCategory || product.category_name === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  displayProducts(filteredProducts);
}

function showProductForm(productId = null) {
  const modal = document.getElementById('product-modal');
  const form = document.getElementById('product-form');
  const titleElement = document.getElementById('modal-title');
  
  form.reset();
  
  if (productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
      titleElement.textContent = 'Editar Producto';
      document.getElementById('product-id').value = product.id;
      document.getElementById('product-name').value = product.name;
      document.getElementById('product-price').value = product.price;
      document.getElementById('product-unit').value = product.unit;
      document.getElementById('product-category').value = product.category_name;
      document.getElementById('product-description').value = product.description || '';
    }
  } else {
    titleElement.textContent = 'Nuevo Producto';
    document.getElementById('product-id').value = '';
  }
  
  modal.style.display = 'block';
}

function hideProductForm() {
  document.getElementById('product-modal').style.display = 'none';
}

document.getElementById('product-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const productId = document.getElementById('product-id').value;
  const productData = {
    name: document.getElementById('product-name').value,
    price: parseFloat(document.getElementById('product-price').value),
    unit: document.getElementById('product-unit').value,
    category_name: document.getElementById('product-category').value,
    description: document.getElementById('product-description').value
  };
  
  try {
    const url = productId ? `/api/products/${productId}` : '/api/products';
    const method = productId ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    });
    
    if (response.ok) {
      hideProductForm();
      await loadProducts();
      alert(productId ? 'Producto actualizado con éxito' : 'Producto creado con éxito');
    } else {
      throw new Error('Error al guardar el producto');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al guardar el producto');
  }
});

async function deleteProduct(productId) {
  if (confirm('¿Está seguro de que desea eliminar este producto?')) {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await loadProducts();
        alert('Producto eliminado con éxito');
      } else {
        throw new Error('Error al eliminar el producto');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el producto');
    }
  }
}

function editProduct(productId) {
  showProductForm(productId);
}