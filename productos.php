<?php require_once 'config.php'; ?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Productos del Mercado</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  <link href="styles.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css">
</head>
<body>
  <a href="cart.html" class="cart-icon">
    <i class="fas fa-shopping-cart"></i>
    <span id="cart-count" class="cart-count">0</span>
  </a>

  <div class="container">
    <div class="header">
      <h1>Productos del Mercado</h1>
      <div class="buttons-container">
        <a href="index.html" class="back-button"><i class="fas fa-home"></i> Volver al Inicio</a>
        <a href="https://wa.me/5355841127?text=Hola,%20me%20gustaría%20consultar%20sobre%20un%20tema%20diferente%20a%20los%20productos%20mostrados%20en%20la%20página.%20¿Podríamos%20conversar%20al%20respecto?" class="consult-button" target="_blank">
          <i class="fab fa-whatsapp"></i> Consulta Externa
        </a>
      </div>
    </div>

    <div class="productos">
      <?php
      $category_id = 4; // ID for "Productos" category
      $stmt = $conn->prepare("SELECT * FROM products WHERE category_id = ?");
      $stmt->bind_param("i", $category_id);
      $stmt->execute();
      $result = $stmt->get_result();
      
      while ($product = $result->fetch_assoc()): ?>
          <div class="producto">
            <img src="<?php echo htmlspecialchars($product['image_url']); ?>" 
                 alt="<?php echo htmlspecialchars($product['name']); ?>" 
                 class="producto-imagen">
            <div class="producto-nombre"><?php echo htmlspecialchars($product['name']); ?></div>
            <div class="producto-unidad"><?php echo htmlspecialchars($product['unit']); ?></div>
            <div class="producto-precio">$<?php echo number_format($product['price'], 2); ?></div>
            <div class="producto-descripcion"><?php echo htmlspecialchars($product['description']); ?></div>
            <button onclick="addToCart(<?php echo $product['id']; ?>, '<?php echo htmlspecialchars($product['name']); ?>', 
                    <?php echo $product['price']; ?>, '<?php echo htmlspecialchars($product['unit']); ?>')" 
                    class="add-to-cart">
              <i class="fas fa-cart-plus"></i> Añadir al Carrito
            </button>
          </div>
      <?php endwhile; ?>
    </div>
  </div>
  <script src="cart.js"></script>
</body>
</html>