document.addEventListener("DOMContentLoaded", () => {
  const cardsContainer = document.querySelector(".cards-container");
  const categoryButtons = document.querySelectorAll(".cards-left-section-btn");
  const card = document.getElementById("shop");
  const modal = document.querySelector(".modal-container");
  const closeBtn = document.querySelector(".close-btn");

  modal.style.display = "none";

  async function fetchProducts() {
    try {
      const response = await fetch('js/shoes.json');
      const products = await response.json();
      renderCart();
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  function renderProducts(products, filter = null) {
    cardsContainer.innerHTML = "";
    const filteredProducts = filter ? products.filter(p => p.brand.toLowerCase() === filter.toLowerCase()) : products;

    if (filteredProducts.length === 0) {
      cardsContainer.innerHTML = "<p>No products found for this category.</p>";
      return;
    }

    filteredProducts.forEach((product, index) => {
      const productCard = document.createElement("div");
      productCard.classList.add("card1");

      const productId = `${product.name}-${index}`;

      productCard.innerHTML = `
        <div class="card-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="card-content">
          <h1>${product.name}</h1>
          <p>${product.description}</p>
          <span class="price">${product.price}</span>
          <button class="card-btn" data-id="${productId}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">Add To Cart</button>
        </div>
      `;

      cardsContainer.appendChild(productCard);
    });

    document.querySelectorAll(".card-btn").forEach(button => {
      button.addEventListener("click", addToCart);
    });
  }

  function addToCart(event) {
    const button = event.target;
    const id = button.getAttribute("data-id");
    const name = button.getAttribute("data-name");
    const price = button.getAttribute("data-price");
    const image = button.getAttribute("data-image");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id, name, price, image, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartBadge();
    renderCart();

    Toastify({
      text: `"${name}" has been added to your cart!`,
      duration: 3000,
      backgroundColor: "green",
      position: "center"
    }).showToast();
  }

  function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector(".card-badge").textContent = totalItems;
  }

  function renderCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = document.querySelector(".modal-container");
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    } else {
      cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("shop-card");
        cartItem.setAttribute("data-id", item.id);

        cartItem.innerHTML = `
          <img src="${item.image}" alt="Item image">
          <div class="shop-card-content flex">
            <button class="decrease midle-btn"><i class="fa-solid fa-minus"></i></button>
            <span class="quantity">${item.quantity}</span>
            <button class="increase"><i class="fa-solid fa-plus"></i></button>
            <button class="remove-item"><i class="fa-solid fa-trash"></i></button>
          </div>
        `;

        cartItem.querySelector(".remove-item").addEventListener("click", () => {
          removeFromCart(item.id);
        });

        cartItem.querySelector(".increase").addEventListener("click", () => {
          increaseQuantity(item.id);
        });

        cartItem.querySelector(".decrease").addEventListener("click", () => {
          decreaseQuantity(item.id);
        });

        cartContainer.appendChild(cartItem);
      });
    }
  }

  function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== id);

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartBadge();

    Toastify({
      text: "Item has been removed from your cart.",
      duration: 3000,
      backgroundColor: "red",
      position: "center"
    }).showToast();
  }

  function increaseQuantity(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart.find(item => item.id === id);
    if (item) {
      item.quantity += 1;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
      updateCartBadge();
    }
  }

  function decreaseQuantity(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart.find(item => item.id === id);
    if (item && item.quantity > 1) {
      item.quantity -= 1;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
      updateCartBadge();
    }
  }

  categoryButtons.forEach(button => {
    button.addEventListener("click", async () => {
      const selectedCategory = button.textContent.trim();
      const products = await fetchProducts();
      renderProducts(products, selectedCategory);
    });
  });

  card.addEventListener("click", () => {
    modal.style.display = "flex";
    fetchProducts().then(products => {
      renderProducts(products);
    });
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  fetchProducts().then(products => {
    renderProducts(products);
    updateCartBadge();
  });
});
