import { cart, cartItemsElement, emptyCartMessage, easynetshopGoods, btn_buy__decoration } from '../modules/cart/cart.mjs';
import { updateTotalPrice } from '../modules/cart/price.mjs';

const createdItems = [];

function updateCartCounter() {
    const totalCount = createdItems.length;
    cart.textContent = totalCount;
}

function removeFromCart(cartItem) {
    cartItem.remove();
    const index = createdItems.indexOf(cartItem);
    if (index !== -1) {
        createdItems.splice(index, 1);
    }
    const remainingItems = document.querySelectorAll('.itemBlock');
    if (remainingItems.length === 0) {
        easynetshopGoods.style.display = 'none';
        emptyCartMessage.style.display = 'block';
        btn_buy__decoration.style.display = 'none';
    }
    updateTotalPrice();
    updateCartCounter();
}

function handleBuyButtonClickBuy(target) {
    const card = target.closest('.catalog_content');
    const product = {
        id: card.getAttribute('data-XML_ID'),
        imgSrc: card.querySelector('.catalog-item__img').getAttribute('src'),
        name: card.querySelector('.catalog-item__subtitle').textContent,
        priceOld: card.querySelector('.catalog-item__old-price').textContent,
        price: card.querySelector('.catalog-item__price').textContent,
        discount: card.querySelector('.discount').textContent
    };
    const alreadyInCart = Array.from(cartItemsElement.querySelectorAll('.easynetshop-goodtitle')).some(item => item.getAttribute('data-XML_ID') === product.id);
    if (!alreadyInCart) {
        const cartItem = document.createElement('div');
        cartItem.className = 'row itemBlock';
        cartItem.innerHTML = `
            <div class="easynetshop-goodtitle col" data-XML_ID="${product.id}">
                <img src="${product.imgSrc}" class="item-img col">
            </div>
            <div class="col">
                <span class="easynetshop-goodtitle-name col">${product.name}</span><br>
            </div>
            <div class="easynetshop col">
                <div class="catalog-item__items counter-wrapper">
                    <div class="items_control control" data-action="minus">-</div>
                    <div class="items_control" data-counter>1</div>
                    <div class="items_control control" data-action="plus">+</div>
                </div>
            </div>
            <div class="easynetshop price_block col">
            <div data-price="SIGMApc15" class="easynetshop-cur-old-price">
                <span class="old_price">${product.priceOld}</span>
                <span class="discount">${product.discount}%</span>
            </div>
                <span class="easynetshop-cur-price">${product.price}</span>
                <span class="easynetshop-currency">руб.</span>
            </div>
            <div class="col">
                <button type="button" class="easynetshop-delgood" data-rel="1" title="Удалить из корзины">×</button>
            </div>
        `;
        cartItemsElement.appendChild(cartItem);
        createdItems.push(cartItem);
        updateTotalPrice();
        updateCartCounter();
        easynetshopGoods.style.display = 'block';
        emptyCartMessage.style.display = 'none';
        btn_buy__decoration.style.display = 'block';
        const deleteButton = cartItem.querySelector('.easynetshop-delgood');
        deleteButton.addEventListener('click', () => removeFromCart(cartItem));
        window.addEventListener('click', function (event) {
            const target = event.target;
            const action = target.dataset.action;
            if (cartItemsElement.contains(target)) {
                const items = document.querySelectorAll('.itemBlock');
                items.forEach(item => {
                    const counter = parseInt(item.querySelector('[data-counter]').textContent);
                    if (counter === 0) {
                        item.remove();
                        const index = createdItems.indexOf(item);
                        if (index !== -1) {
                            createdItems.splice(index, 1);
                        }
                    }
                });
                const remainingItems = document.querySelectorAll('.itemBlock');
                if (remainingItems.length === 0) {
                    easynetshopGoods.style.display = 'none';
                    emptyCartMessage.style.display = 'block';
                    btn_buy__decoration.style.display = 'none';
                }
                updateTotalPrice();
                updateCartCounter();
                updateQuantity();
            }
        });
    } else {
        console.log("Что-то не так");
    }
}

function updateQuantity() {
    let TotalInfoQuantity = document.querySelector('[data-quanity]');
    const quantityProducts = document.querySelectorAll('[data-counter]');
    const totalQuantity = Array.from(quantityProducts).reduce((total, element) => {
        return total + parseInt(element.textContent, 10);
    }, 0);
    TotalInfoQuantity.textContent = totalQuantity;
}

function handleBuyButtonClickProduct(target) {
    const card = target.closest('main');
    const imgElement = card.querySelector('.product__container_img');
    const backgroundImageStyle = imgElement.style.backgroundImage;
    const backgroundImageURL = backgroundImageStyle.replace('url("', '').replace('")', '');
    const product = {
        id: card.querySelector('.product__container').getAttribute('data-XML_ID'),
        imgSrc: backgroundImageURL,
        name: card.querySelector('.product__container_title').textContent,
        priceOld: card.querySelector('.catalog-item__old-price').textContent,
        price: card.querySelector('.catalog-item__price').textContent,
        discount: card.querySelector('.discount').textContent
    };
    const alreadyInCart = Array.from(cartItemsElement.querySelectorAll('.easynetshop-goodtitle')).some(item => item.getAttribute('data-XML_ID') === product.id);
    if (!alreadyInCart) {
        const cartItem = document.createElement('div');
        cartItem.className = 'row itemBlock';
        cartItem.innerHTML = `
            <div class="easynetshop-goodtitle col" data-XML_ID="${product.id}">
                <img src="${product.imgSrc}" class="item-img col">
            </div>
            <div class="col">
                <span class="easynetshop-goodtitle-name col">${product.name}</span><br>
            </div>
            <div class="easynetshop col">
                <div class="catalog-item__items counter-wrapper">
                    <div class="items_control control" data-action="minus">-</div>
                    <div class="items_control" data-counter>1</div>
                    <div class="items_control control" data-action="plus">+</div>
                </div>
            </div>
            <div class="easynetshop price_block col">
                <div data-price="SIGMApc15" class="easynetshop-cur-old-price">
                    <span class="old_price">${product.priceOld}</span>
                    <span class="discount">${product.discount}%</span>
                </div>
                <span class="easynetshop-cur-price">${product.price}</span>
                <span class="easynetshop-currency">руб.</span>
            </div>
            <div class="col">
                <button type="button" class="easynetshop-delgood" data-rel="1" title="Удалить из корзины">×</button>
            </div>
        `;
        cartItemsElement.appendChild(cartItem);
        createdItems.push(cartItem);
        updateTotalPrice();
        updateCartCounter();
        easynetshopGoods.style.display = 'block';
        emptyCartMessage.style.display = 'none';
        btn_buy__decoration.style.display = 'block';
        const deleteButton = cartItem.querySelector('.easynetshop-delgood');
        deleteButton.addEventListener('click', () => removeFromCart(cartItem));
        window.addEventListener('click', function (event) {
            const target = event.target;
            if (cartItemsElement.contains(target)) {
                const items = document.querySelectorAll('.itemBlock');
                items.forEach(item => {
                    const counter = parseInt(item.querySelector('[data-counter]').textContent);
                    if (counter === 0) {
                        item.remove();
                        const index = createdItems.indexOf(item);
                        if (index !== -1) {
                            createdItems.splice(index, 1);
                        }
                    }
                });
                const remainingItems = document.querySelectorAll('.itemBlock');
                if (remainingItems.length === 0) {
                    easynetshopGoods.style.display = 'none';
                    emptyCartMessage.style.display = 'block';
                    btn_buy__decoration.style.display = 'none';
                }
                updateTotalPrice();
                updateCartCounter();
                updateQuantity();
            }
        });
    } else {
        console.log("Что-то не так");
    }
}

window.addEventListener('click', function (event) {
    const target = event.target;
    const action = target.dataset.action;
    const buy = target.hasAttribute('data-buy');
    const buyItem = target.hasAttribute('data-buyItem');
    if (action) {
        const counterWrapper = target.closest('.counter-wrapper');
        if (!counterWrapper) return;
        const counter = counterWrapper.querySelector('[data-counter]');

        let count = parseInt(counter.textContent);

        if (action === "plus") {
            count++;
        } else if (action === "minus" && count > 0) {
            count--;
        }
        counter.textContent = count;

    }
    if (buy) {
        handleBuyButtonClickBuy(target);
        updateQuantity();
    }
    if (buyItem) {
        handleBuyButtonClickProduct(target)
        updateQuantity();
    }
});