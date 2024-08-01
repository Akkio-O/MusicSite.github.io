export let selectedCategory = '';
export let selectedSubcategory = '';
export let selectedSubSubcategory = '';
export const itemsBlock = document.querySelector(".catalog_block");
export const paginationBlock = document.querySelector('#pagination');
export const notesOnPage = 12;
export let items = [];
export let currentPageIndex = 1;
export const maxVisiblePages = 6;
export const itemsPerPage = 12;
export let maxVisibleButtons = 6;
export let active = null;
export let sortOrderAsc = true;
export let totalNumPagination = 0;

function transliterate(text) {
    if (!text) return '';
    const russianLetters = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
    const englishLetters = 'abvgdeejzijklmnoprstufhzcss_y_eua';
    return text.toLowerCase().split('').map(char => {
        const index = russianLetters.indexOf(char);
        return index !== -1 ? englishLetters[index] : char;
    }).join('');
}

// Блок с товаром
export function categoryItem(product) {
    const newItem = document.createElement("div");
    newItem.classList.add("col-auto", "col-xxl-3.5");
    let discount = 100 - (product.CV_PRICE_13 * 100 / product.CV_PRICE_18);
    newItem.innerHTML = `
    <div class="catalog_content text-center" data-XML_ID="${product.IE_XML_ID}">
        <div class="catalog-item" data-itemcategory="${product.IC_GROUP0}" data-itemsubcategories="${product.IC_GROUP1}" data-itemsubSubcategories="${product.IC_GROUP2}">
            <div class="catalog-item__wrapper">
                <div class="catalog-item__content catalog-item__content_active">
                    <img src="${product.IE_DETAIL_PICTURE}" alt="${product.IE_NAME}" class="catalog-item__img">
                </div>
            </div>
            <div class="catalog-item__footer_block">
            <div class="catalog-item__subtitle">${product.IE_NAME}</div>
                <hr>
                <div class="catalog-item__footer">
                    <div class="catalog-item__prices easynetshop-cur-old-price">
                        <div class="catalog-item__old-price">${product.CV_PRICE_18 || " "}</div>
                        ${product.CV_PRICE_18 ? `<span class="discount">${parseInt(discount)}%</span>` : ''}
                        <div data-price="${parseFloat(product.CV_PRICE_13)}" class="catalog-item__price">${product.CV_PRICE_13 || " "} \u20bd</div>
                    </div>
                    <button class="add-to-cart catalog-item__btn" data-buy="buy_items">Добавить</button>
                </div>
                <a href="/category/products/${product.IC_GROUP0}/${product.IC_GROUP1}${product.IC_GROUP2 ? '/' + product.IC_GROUP2 : ''}/${encodeURIComponent(product.IE_NAME)}" target="_blank"><button class="catalog-item__link">Подробнее</button></a>
            </div>
        </div>
    </div>
`;
    return newItem;
}

// Фильтрация товаров по категориям
export function filterItems(selectedCategory, selectedSubcategory, selectedSubSubcategory, category) {
    const filteredItems = category.filter(product => {
        const categoryFilter = (selectedCategory && product.IC_GROUP0 === selectedCategory) ||
            (selectedSubcategory && product.IC_GROUP1 === selectedSubcategory) ||
            (selectedSubSubcategory && product.IC_GROUP2 === selectedSubSubcategory) ||
            (selectedSubcategory && product.IC_GROUP0 === selectedCategory) ||
            (selectedSubSubcategory && product.IC_GROUP0 === selectedCategory && product.IC_GROUP1 === selectedSubcategory);
        return categoryFilter;
    });
    return filteredItems;
}

// Обновление пагинаций
export function updatePaginationVisibility(currentPageIndex, filteredItems) {
    const totalNumPagination = Math.ceil(filteredItems.length / itemsPerPage);
    currentPageIndex = Math.min(currentPageIndex, totalNumPagination - 1);
    const halfVisible = Math.floor(maxVisibleButtons / 2);
    let start = currentPageIndex - halfVisible;
    let end = currentPageIndex + halfVisible;
    start = Math.max(0, Math.min(start, totalNumPagination - maxVisibleButtons));
    end = Math.min(totalNumPagination, start + maxVisibleButtons);
    items.forEach((item, index) => {
        item.style.display = (index + 1 >= start && index < end) ? '' : 'none';
    });
}

// Клики пагинаций
export function handlePaginationClick(item, filteredItems) {
    const currentActiveItem = paginationBlock.querySelector('.active');
    if (currentActiveItem) {
        currentActiveItem.classList.remove('active');
    }
    item.classList.add('active');
    let pageNum = +item.innerHTML;
    let currentSearch = window.location.search;
    let pageParam = `page=${pageNum}`;
    let newSearch;
    if (currentSearch.includes('page=')) {
        newSearch = currentSearch.replace(/page=\d+/, pageParam);
    } else {
        newSearch = currentSearch ? currentSearch + `&${pageParam}` : `?${pageParam}`;
    }
    window.history.pushState({ page: pageNum }, "", newSearch);
    let start = (pageNum - 1) * notesOnPage;
    let sortedItems = filteredItems.slice();
    let end = start + notesOnPage;
    let notes = sortedItems.slice(start, end);
    itemsBlock.querySelectorAll('.col-auto').forEach(item => item.remove());
    for (let product of notes) {
        if (!itemsBlock.querySelector(`[data-XML_ID="${product.IE_XML_ID}"]`)) {
            const newItem = categoryItem(product);
            paginationBlock.parentNode.insertBefore(newItem, paginationBlock);
        }
    }
    updatePaginationVisibility(pageNum - 1, filteredItems);
}


// Отображение пагинаций
export function setupPagination(filteredItems) {
    const { page } = getUrlParams(); // Получаем текущую страницу из параметров URL
    items = []; // Очищаем массив items перед созданием новой пагинации
    paginationBlock.innerHTML = '';
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    totalNumPagination = totalPages;

    // Add "начало" before pagination
    const startItem = document.createElement('li');
    startItem.classList.add('pagination-start');
    startItem.classList.add('pagination-number');
    startItem.innerHTML = 'начало';
    paginationBlock.appendChild(startItem);
    startItem.addEventListener('click', () => {
        handlePaginationClick(items[0], filteredItems);
    });

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.classList.add('pagination-number');
        li.innerHTML = i;
        paginationBlock.appendChild(li);
        items.push(li);
        if (i === page) {
            li.classList.add('active'); // Устанавливаем класс active для текущей страницы
        }
        // Добавляем обработчик события для клика по номеру страницы
        li.addEventListener('click', () => {
            handlePaginationClick(li, filteredItems);
        });
    }

    // Add "конец" after pagination
    const endItem = document.createElement('li');
    endItem.classList.add('pagination-end');
    endItem.classList.add('pagination-number');
    endItem.innerHTML = 'Конец';
    paginationBlock.appendChild(endItem);
    endItem.addEventListener('click', () => {
        handlePaginationClick(items[items.length - 1], filteredItems);
    });

    // Обновляем видимость пагинации только один раз при инициализации
    updatePaginationVisibility(page - 1, filteredItems);
}

// Отображение товаров
export function renderPage(pageNum, filteredItems) {
    const startIndex = (pageNum - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredItems.length);

    for (let i = startIndex; i < endIndex; i++) {
        const product = filteredItems[i];
        const newItem = categoryItem(product);
        itemsBlock.insertBefore(newItem, paginationBlock);
    }
}

export function getUrlParams() {
    const searchParams = new URLSearchParams(window.location.search);
    const page = searchParams.get('page');
    return {
        page: page ? parseInt(page) : 1
    };
}