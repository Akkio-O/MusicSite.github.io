let deliveryPrice = 0;
const deliveryTypeSelect = document.getElementById('deliveryType');
const deliveryPriceElement = document.querySelector('.easynetshop-deliveryprice');

deliveryTypeSelect.addEventListener('change', function () {
    const selectedOption = this.value;
    deliveryPrice = selectedOption === 'cityDelivery' ? 300 : 0;
    deliveryPriceElement.textContent = deliveryPrice.toFixed(2);
    updateTotalPrice();
    let PriceDelivery = document.querySelector('[data-Delivery]');
    PriceDelivery = deliveryPrice !== 0 ? PriceDelivery.textContent = deliveryPrice : PriceDelivery.textContent = 'Бесплатно';
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
    const totalDiscountPriceElement = document.querySelector('.easynetshop-goodsprice');
    const totalDeliveryPriceElement = document.querySelector('.easynetshop-allprice');
    let totalPriceWithDelivery = totalPrice + parseFloat(deliveryPrice);
    let TotalInfoTotalPrice = document.querySelector('[data-preTotalPrice]');
    let TotalInfoPrePrice = document.querySelector('[data-TotalPrice]');

    function calculation(TotalPriceElement, TotalPrice) {
        TotalPriceElement.textContent = TotalPrice.toLocaleString('ru-RU').replace(/[^\d.]/g, '');
    }

    calculation(totalPriceElement, totalPrice);
    calculation(TotalInfoTotalPrice, totalDiscountPrice);
    calculation(TotalInfoPrePrice, totalPriceWithDelivery);
    calculation(totalDiscountPriceElement, totalDiscountPrice);
    calculation(totalDeliveryPriceElement, totalPriceWithDelivery);

    let totalDiscount = document.querySelector('[data-TotalDiscount]');
    let discountAmount = totalDiscountPrice - totalPriceWithDelivery;
    totalDiscount.textContent = discountAmount.toLocaleString('ru-RU');
}

export { deliveryPrice, deliveryTypeSelect, deliveryPriceElement, updateTotalPrice };