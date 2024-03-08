

const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartItemsElement = document.querySelector('.easynetshop_wrapper');

const deliveryTypeSelect = document.getElementById('deliveryType');
const deliveryPriceElement = document.querySelector('.easynetshop-deliveryprice');

deliveryTypeSelect.addEventListener('change', function() {
    const selectedOption = this.value;
    let deliveryPrice = 0;

    if (selectedOption === 'cityDelivery') {
        deliveryPrice = 300;
    }
    
    deliveryPriceElement.textContent = deliveryPrice.toFixed(2);
    updateTotalPrice();
});

const emptyCartMessage = document.querySelector('.modal_subtitle__visible');
const easynetshopGoods = document.querySelector('.easynetshop-goods');
const btn_buy__decoration = document.querySelector('.btn_buy__decoration');

// Обработчик события для кнопки добавления товара
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const product = button.closest('.catalog-item');
        const productName = product.querySelector('.catalog-item__subtitle').textContent;
        const productPrice = product.querySelector('.catalog-item__price').textContent;
        const productOldPrice = product.querySelector('.catalog-item__old-price').textContent;
        const productImg = product.querySelector('.catalog-item__content img');
        const productImgSrc = productImg.getAttribute('src');
        const dataRel = generateDataRel();
        const cartItem = document.createElement('div');
        cartItem.className = 'easynetshop-row';
        cartItem.innerHTML = `
            <a href="https://easynetshop.ru/demo.html" class="easynetshop-goodhref">
                <div class="easynetshop-6 easynetshop-goodtitle">
                    <img src="${productImgSrc}" class="easynetshop-goodimage">
                    <span class="easynetshop-goodtitle-name">${productName}</span><br>
                    <span class="easynetshop-goodtitle-description">Пикантная пепперони, увеличенная порция моцареллы, томатный соус</span><br>
                    <span class="easynetshop-goodtitle-detail"></span>
                </div>
            </a>
            <div class="easynetshop-3 easynetshop-center">
                <button class="easynetshop-minus-quant" data-rel="${dataRel}">-</button>
                <input class="easyshop-quant-input" maxlength="5" value="1" data-rel="${dataRel}">
                <button class="easynetshop-plus-quant" data-rel="${dataRel}">+</button>
            </div>
            <div class="easynetshop-3 easynetshop-right price_block">
                <button type="button" class="easynetshop-delgood" data-rel="${dataRel}" title="Удалить из корзины">×</button>
                <div data-price="SIGMApc15" class="easynetshop-cur-old-price">
                    <span class="old_price">${productOldPrice}</span>
                    <span class="discount">34%</span>
                </div>
                <span class="easynetshop-cur-price">${productPrice}</span>
                <span class="easynetshop-currency">руб.</span>
            </div>
        `;
        cartItemsElement.appendChild(cartItem);
        
        const count = document.querySelector('.count');
        count.textContent = parseInt(count.textContent) + 1;

        updateTotalPrice();

        easynetshopGoods.style.display = 'block';
        emptyCartMessage.style.display = 'none';
        btn_buy__decoration.style.display = 'block';

        const deleteButton = cartItem.querySelector('.easynetshop-delgood');
        deleteButton.addEventListener('click', () => {
            cartItem.remove();
            updateTotalPrice();

            count.textContent = parseInt(count.textContent) - 1;

            if (cartItemsElement.children.length === 0) {
                easynetshopGoods.style.display = 'none';
                emptyCartMessage.style.display = 'block';
                btn_buy__decoration.style.display = 'none';                
            }
        });
    });
});

function updateTotalPrice() {
    const items = document.querySelectorAll('.easynetshop-row');
    let totalPrice = 0;
    let totalDiscountPrice = 0;
    let totalDeliveryPrice = 0;

    items.forEach(item => {
        const priceElement = item.querySelector('.easynetshop-cur-price');
        const oldPriceElement = item.querySelector('.easynetshop-cur-old-price span.old_price');
        const DeliveryPriceElement = item.querySelector('.easynetshop-deliveryprice');
        const quantityInput = item.querySelector('.easyshop-quant-input');
        if (priceElement) {
            const price = parseFloat(priceElement.textContent.replace(/[^\d.]/g, ''));
            const quantity = parseInt(quantityInput.value);
            totalPrice += price * quantity;
        }
        if (oldPriceElement) {
            const oldPrice = parseFloat(oldPriceElement.textContent.replace(/[^\d.]/g, '')); 
            const quantity = parseInt(quantityInput.value); 
            totalDiscountPrice += oldPrice * quantity; 
        } 
        if (DeliveryPriceElement) {
            const deliveryPrice = parseFloat(DeliveryPriceElement.textContent.replace(/[^\d.]/g, ''));
            totalDeliveryPrice += deliveryPrice;
        } 
    });

    const totalPriceElement = document.querySelector('.easynetshop-discountallprice');
    totalPriceElement.textContent = totalPrice.toLocaleString('ru-RU'); 

    const totalDiscountPriceElement = document.querySelector('.easynetshop-goodsprice');
    totalDiscountPriceElement.textContent = totalDiscountPrice.toLocaleString('ru-RU');

    const totalDeliveryPriceElement = document.querySelector('.easynetshop-allprice');
    totalDeliveryPrice += totalPrice;
    totalDeliveryPriceElement.textContent = totalDeliveryPrice.toLocaleString('ru-RU');
}



cartItemsElement.addEventListener('click', function(event) {
    const button = event.target;
    const dataRel = button.getAttribute('data-rel');
    
    if (button.classList.contains('easynetshop-plus-quant') && dataRel) {
        const input = this.querySelector(`input[data-rel="${dataRel}"]`);
        let quantity = parseInt(input.value, 10);
        quantity++;
        input.value = quantity;
    } else if (button.classList.contains('easynetshop-minus-quant') && dataRel) {
        const input = this.querySelector(`input[data-rel="${dataRel}"]`);
        let quantity = parseInt(input.value, 10);
        quantity = Math.max(1, quantity - 1);
        input.value = quantity;
    }
    updateTotalPrice();
});

function generateDataRel() {
    return Math.random().toString(36).substr(2, 10);
}

