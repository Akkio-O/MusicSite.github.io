let deliveryPrice = 0;
const deliveryTypeSelect = document.getElementById('deliveryType');
const deliveryPriceElement = document.querySelector('.easynetshop-deliveryprice');

deliveryTypeSelect.addEventListener('change', function () {
    const selectedOption = this.value;

    if (selectedOption === 'cityDelivery') {
        deliveryPrice = 300;
    } else {
        deliveryPrice = 0;
    }

    deliveryPriceElement.textContent = deliveryPrice.toFixed(2);
    updateTotalPrice();
});

function updateTotalPrice() {
    const items = document.querySelectorAll('.itemBlock');
    let totalPrice = 0;
    let totalDiscountPrice = 0;
    let totalDeliveryPrice = 0;

    items.forEach(item => {
        const priceElement = item.querySelector('.easynetshop-cur-price');
        const oldPriceElement = item.querySelector('.easynetshop-cur-old-price span.old_price');
        const DeliveryPriceElement = item.querySelector('.easynetshop-deliveryprice');
        const quantityInput = item.querySelector('[data-counter]');
        const quantity = parseInt(quantityInput.textContent);
        if (priceElement) {
            const price = parseFloat(priceElement.textContent.replace(/[^\d.]/g, ''));
            totalPrice += price * quantity;
        }
        if (oldPriceElement) {
            const oldPrice = parseFloat(oldPriceElement.textContent.replace(/[^\d.]/g, ''));
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
    let totalPriceWithDelivery = totalPrice + parseFloat(deliveryPrice);
    totalDeliveryPriceElement.textContent = totalPriceWithDelivery.toLocaleString('ru-RU');
}

export {deliveryPrice, deliveryTypeSelect, deliveryPriceElement, updateTotalPrice };