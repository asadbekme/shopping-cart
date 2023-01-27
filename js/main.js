// SELECT ELEMENTS:
let menuBtn = document.querySelector('#menu-btn');
let cartBtn = document.querySelector('#cart-btn');
let closeCart = document.querySelector('#close-cart');
let navbar = document.querySelector('.header__navbar');
let cartSection = document.querySelector('.header__cart');
const cartItems = document.querySelector('.header__cart--items');
const subtotal = document.querySelector('.header__cart--subtotal');
const counter = document.querySelector('.header__cart--counter');
const productItems = document.querySelector('.product .product__items');

// Open cart
cartBtn.onclick = () => {
    cartSection.classList.add('active');
}

// Close cart
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
        productItems.innerHTML += `
            <div class="product__item">
                <a href="#" class="fa-solid fa-heart"></a>
                <div class="product__image">
                    <img src="${product.imgSrc}" alt="${product.name} image">
                </div>
                <div class="product__content">
                    <h3 class="product__title">${product.name}</h3>
                    <div class="product__stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                        <span>(50)</span>
                    </div>
                    <div class="product__price">
                        from $${product.price} 
                        <span>$${product.deletedPrice}</span> 
                    </div>
                    <button class="btn add-cart" onclick="addToCart(${product.id})">add to cart</button>
                </div>
            </div>
        `
    });
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
            <div class="header__cart--item">
                <div class="item-info" onclick="removeItemFromCart(${item.id})">
                    <img src="${item.imgSrc}" alt="${item.name} image">
                    <h4>${item.name}</h4>
                </div>

                <div class="unit-price"><small>$</small>${item.price}</div>

                <div class="units">
                    <button class="btn minus" onclick="changeNumberOfUnits('minus', ${item.id})"> 
                        - 
                    </button>
                    <div class="number">
                        ${item.numberOfUnits}
                    </div>
                    <button class="btn plus" onclick="changeNumberOfUnits('plus', ${item.id})"> 
                        + 
                    </button>           
                </div>
            </div>
        `
    });
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
