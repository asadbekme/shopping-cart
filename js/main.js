// SELECT ELEMENTS:
let menuBtn = document.querySelector('.header #menu-btn');
let navbar = document.querySelector('.header .navbar');
let cartBtn = document.querySelector('.header #cart-btn');
let cartSection = document.querySelector('.header .cart');
let closeCart = document.querySelector('.header .cart #close-cart');
const productsContainer = document.querySelector('.products .products-container');
const cartItems = document.querySelector('.cart-items');
const subtotal = document.querySelector('.subtotal');
const counter = document.querySelector('.counter');

// Open Cart
cartBtn.onclick = () => {
    cartSection.classList.add('active');
}

// Close Cart
closeCart.onclick = () => {
    cartSection.classList.remove('active');
}

// Menu 
menuBtn.onclick = () => {
    menuBtn.classList.toggle('fa-times');
    navbar.classList.toggle('active');
}

window.onscroll = () => {
    menuBtn.classList.remove('fa-times');
    navbar.classList.remove('active');
}

// RENDER PRODUCTS:
function renderProducts() {
    products.forEach((product) => {
        productsContainer.innerHTML += `
            <div class="product">
                <a href="#" class="fa-solid fa-heart"></a>
                <div class="image">
                    <img src="${product.imgSrc}" alt="${product.name} image">
                </div>
                <div class="content">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                        <span> (50) </span>
                    </div>
                    <div class="price">from $${product.price} <span>$${product.deletedPrice}</span> </div>
                    <button class="btn add-cart" onclick="addToCart(${product.id})"> add to cart </button>
                </div>
            </div>
        `
    })
}

renderProducts(); 

// cart array
let cart = JSON.parse(localStorage.getItem("CART")) || [];
updateCart();

// ADD TO CART
function addToCart(id) {
    // check if product already exist in cart
    if (cart.some((item) => item.id === id)) {
        changeNumberOfUnits('plus', id);
        // alert('Product already in cart!');
    } else {
        const item = products.find((product) => product.id === id);

        cart.push({
            ...item,
            numberOfUnits: 1
        });

        updateCart();
        // console.log(cart);
    }
}

// update cart
function updateCart() {
    renderCartItems();
    renderSubtotal();

    // Save to Local Storage
    localStorage.setItem("CART", JSON.stringify(cart));
}

// calculate and render subtotal
function renderSubtotal() {
    let totalPrice = 0, totalItems = 0;

    cart.forEach((item) => {
        totalPrice += item.price * item.numberOfUnits;
        totalItems += item.numberOfUnits;
    }) 

    subtotal.innerHTML = `Subtotal (${totalItems} items): ${totalPrice.toFixed(2)}`;
    counter.innerHTML = totalItems;
} 

// render cart items
function renderCartItems() {
    cartItems.innerHTML = ""; // clear cart element

    cart.forEach((item) => {
        cartItems.innerHTML += `
            <div class="cart-item">
                <div class="item-info" onclick="removeItemFromCart(${item.id})">
                    <img src="${item.imgSrc}" alt="${item.name} image">
                    <h4>${item.name}</h4>
                </div>

                <div class="unit-price"> <small>$</small>${item.price}</div>

                <div class="units">
                    <div class="btn minus" onclick="changeNumberOfUnits('minus', ${item.id})">-</div>
                    <div class="number">${item.numberOfUnits}</div>
                    <div class="btn plus" onclick="changeNumberOfUnits('plus', ${item.id})">+</div>           
                </div>
            </div>
        `
    })
}

// remove item from cart
function removeItemFromCart(id) {
    cart = cart.filter((item) => item.id !== id);

    updateCart();
}

// change number of units for an item
function changeNumberOfUnits(action, id) {
    cart = cart.map((item) => {
        let numberOfUnits = item.numberOfUnits;

        if (item.id === id) {
            if (action === 'minus' && numberOfUnits >= 1) {
                numberOfUnits -= 1;
            } else if (action === 'plus') {
                numberOfUnits += 1;
            }
        }

        return {
            ...item,
            numberOfUnits: numberOfUnits
        }
    })

    updateCart();
} 
