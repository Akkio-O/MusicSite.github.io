import * as ItemsModule from './items.mjs';
//for category
const CategoryDropdown = document.querySelector('#category_menu__profiles__CategoryText');
const SubCategoryDropdown = document.querySelector('#category_menu__profiles__SubCategoryText');
const SubSubCategoryDropdown = document.querySelector('#category_menu__profiles__subSubCategoryText');
let selectedCategory = ItemsModule.selectedCategory;
let selectedSubcategory = ItemsModule.selectedSubcategory;
let selectedSubSubcategory = ItemsModule.selectedSubSubcategory;
const asc = document.getElementById('sort-asc');
const desc = document.getElementById('sort-desc');
// category
function dropdownItemCategory(category, selectedCategory, selectedSubcategory) {
    const subSubcategoryDropdown = document.querySelector("#subSubCategoryDropdown");
    const existingLinks = subSubcategoryDropdown.querySelectorAll("a").length;
    subSubcategoryDropdown.classList.toggle("show");
    const itemsCategoryValues = new Set(category.filter(group0 => group0.IC_GROUP0.trim() === selectedCategory).filter(group1 => group1.IC_GROUP1.trim() === selectedSubcategory).map(group2 => group2.IC_GROUP2));
    if (existingLinks !== itemsCategoryValues.size) {
        subSubcategoryDropdown.innerHTML = '';
        itemsCategoryValues.forEach((group2, index) => {
            if (group2 && group2.trim() !== '') {
                const a = document.createElement("a");
                a.textContent = group2;
                subSubcategoryDropdown.appendChild(a);
                a.addEventListener("click", function (event) {
                    SubSubCategoryDropdown.textContent = event.target.textContent;
                    const selectedCategory = CategoryDropdown.textContent;
                    const selectedSubcategory = SubCategoryDropdown.textContent;
                    const selectedSubSubcategory = event.target.textContent;
                    // Функция dropdownItemCategory должна быть обновлена для учета подподкатегории
                    dropdownItemCategory(category, selectedCategory, selectedSubcategory, selectedSubSubcategory);
                    subSubcategoryDropdown.classList.remove("show");
                    // Изменяем адресную строку при выборе подподкатегории
                    history.pushState(null, null, `/category/products?category=${encodeURIComponent(selectedCategory)}&subcategory=${encodeURIComponent(selectedSubcategory)}&subsubcategory=${encodeURIComponent(selectedSubSubcategory)}`);
                });
                a.dataset.subSubcategory = index;
            }
        });
    }
}
function dropdownSubCategory(category, selectedCategory) {
    const subcategoryDropdown = document.querySelector("#subCategoryDropdown");
    subcategoryDropdown.classList.toggle("show");
    document.querySelector("#categoryDropdown").classList.remove("show");
    document.querySelector("#subSubCategoryDropdown").classList.remove("show");
    const existingLinks = subcategoryDropdown.querySelectorAll("a").length;
    const subCategoryValues = new Set(category.filter(group0 => group0.IC_GROUP0 && group0.IC_GROUP1 && group0.IC_GROUP0.trim() === selectedCategory).map(group1 => group1.IC_GROUP1.trim()));

    // Если категория не выбрана, но выбрана подкатегория, выбираем первую подходящую категорию
    if (!selectedCategory && selectedSubcategory && subCategoryValues.size > 0) {
        selectedCategory = category.find(group0 => group0.IC_GROUP1.trim() === selectedSubcategory).IC_GROUP0.trim();
        CategoryDropdown.textContent = selectedCategory;
    }

    if (existingLinks !== subCategoryValues.size) {
        subcategoryDropdown.innerHTML = '';

        subCategoryValues.forEach((group1, index) => {
            if (group1 && group1.trim() !== '') {
                const a = document.createElement("a");
                a.textContent = group1;
                subcategoryDropdown.appendChild(a);
                a.addEventListener("click", function (event) {
                    SubCategoryDropdown.textContent = event.target.textContent;
                    const selectedCategory = CategoryDropdown.textContent;
                    const selectedSubcategory = event.target.textContent;
                    dropdownItemCategory(category, selectedCategory, selectedSubcategory);
                    subcategoryDropdown.classList.remove("show");
                    // Изменяем адресную строку при выборе подкатегории
                    history.pushState(null, null, `/category/products?category=${encodeURIComponent(selectedCategory)}&subcategory=${encodeURIComponent(selectedSubcategory)}`);
                });
                a.dataset.subcategory = index;
            }
        });
    }
}
function dropdownCategory(data, selectedCategory) {
    const CategoryValues = new Set(data.map(group0 => group0.IC_GROUP0));
    const categoryDropdown = document.querySelector("#categoryDropdown");
    categoryDropdown.classList.toggle("show");
    document.querySelector("#subCategoryDropdown").classList.remove("show");
    document.querySelector("#subSubCategoryDropdown").classList.remove("show");
    const existingLinks = categoryDropdown.querySelectorAll("a").length;
    if (existingLinks !== CategoryValues.size) {
        categoryDropdown.innerHTML = '';
        CategoryValues.forEach((group0, index) => {
            if (typeof group0 === 'string' && group0.trim() !== '') {
                const a = document.createElement("a");
                a.textContent = group0;
                categoryDropdown.appendChild(a);
                a.addEventListener("click", function (event) {
                    const selectedCategoryValue = event.target.textContent || selectedCategory;
                    CategoryDropdown.textContent = selectedCategoryValue;
                    console.log(selectedCategoryValue);
                    dropdownSubCategory(data, selectedCategoryValue);
                    categoryDropdown.classList.remove("show");
                    // Изменяем адресную строку при выборе категории
                    history.pushState(null, null, `/category/products?category=${encodeURIComponent(selectedCategoryValue)}`);
                });

                a.dataset.category = index;
            }
        });
    }
}

// Функция для обновления отображаемых элементов
function updateItemsDisplay(items) {
    ItemsModule.itemsBlock.querySelectorAll('.col-auto').forEach(item => item.remove());
    ItemsModule.setupPagination(items);
    ItemsModule.renderPage(1, items);
}
// Функция для добавления обработчиков событий для кнопок сортировки
function addSortEventListeners(filteredItems) {
    asc.addEventListener('click', function (event) {
        filteredItems.sort((a, b) => a.CV_PRICE_13 - b.CV_PRICE_13); // Сортировка по возрастанию цены
        updateItemsDisplay(filteredItems);
    });

    desc.addEventListener('click', function (event) {
        filteredItems.sort((a, b) => b.CV_PRICE_13 - a.CV_PRICE_13); // Сортировка по убыванию цены
        updateItemsDisplay(filteredItems);
    });
}

// Функция для загрузки данных
async function loadData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Ошибка HTTP: ' + response.status);
    }
    return response.json();
}

// Функция для отображения категорий
function showCategories(data) {
    CategoryDropdown.addEventListener('click', function () {
        dropdownCategory(data);
        document.querySelector("#categoryDropdown").classList.toggle("show");
    });
}

// Функция для фильтрации данных
function filterData(data, categorylink, subcategorylink, subsubcategorylink, searchToText, searchToProduct) {
    let filteredItems = data;

    if (searchToText !== null && searchToText !== '') {
        // Фильтрация по тексту
        filteredItems = data.filter(product => product.IE_NAME.toLowerCase().includes(searchToText.toLowerCase()));
    } else if (searchToProduct) {
        // Фильтрация для продукта из параметра search
        const searchProduct = data.find(product => product.IE_NAME.toLowerCase().includes(searchToProduct.toLowerCase()));
        if (searchProduct) {
            filteredItems.unshift(searchProduct);
        }
    }

    // Дополнительная фильтрация для остальных продуктов
    filteredItems = filteredItems.filter(product => {
        const categoryFilter = (!categorylink || product.IC_GROUP0 === categorylink);
        const subcategoryFilter = (!subcategorylink || product.IC_GROUP1 === subcategorylink);
        const subsubcategoryFilter = (!subsubcategorylink || product.IC_GROUP2 === subsubcategorylink);
        return categoryFilter && subcategoryFilter && subsubcategoryFilter;
    });

    return filteredItems;
}
function handleCategoryClicks(event, filteredItems) {
    const dataSet = event.target.dataset;
    selectedSubSubcategory = dataSet.subSubcategory;
    selectedSubcategory = dataSet.subcategory;
    selectedCategory = dataSet.category;
    if (selectedCategory || selectedSubcategory || selectedSubSubcategory) {
        fetch('http://localhost:8080/categoryGroupFilter')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка HTTP: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                const filteredItems = ItemsModule.filterItems(selectedCategory, selectedSubcategory, selectedSubSubcategory, data);
                addSortEventListeners(filteredItems);
                updateItemsDisplay(filteredItems);
            })
    }
}

//for main
function addFilterEventListeners(data) {
    window.addEventListener('click', function (event) {
        const target = event.target;
        const buttons = document.querySelectorAll('.btn_filter');
        // Проверяем, является ли целью клика одна из кнопок
        const isButtonClick = Array.from(buttons).some(button => button.contains(target));
        // Если клик был выполнен на кнопке или внутри кнопки, добавляем класс active на нее
        if (isButtonClick) {
            buttons.forEach(button => button.classList.remove('active'));
            target.classList.add('active');
        }

        if (target.classList.contains('btn_filter')) {
            const dataDefault = target.getAttribute('data-default');
            const dataNew = target.getAttribute('data-new');
            const dataDiscount = target.getAttribute('data-discount');
            const dataNewTime = target.getAttribute('data-newTime');
            if (dataDefault !== null) {
                // Фильтрация для кнопки "Все"
                ItemsModule.itemsBlock.querySelectorAll('.col-auto').forEach(item => item.remove());
                ItemsModule.setupPagination(data);
                ItemsModule.renderPage(1, data);
            } else if (dataNew !== null) {
                // Обработка нажатия на кнопку "Новинки"
                const filteredItems = data
                // Сначала сортируем по дате создания в убывающем порядке
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                ItemsModule.itemsBlock.querySelectorAll('.col-auto').forEach(item => item.remove());
                ItemsModule.setupPagination(filteredItems);
                ItemsModule.renderPage(1, filteredItems);
            } else if (dataDiscount !== null) {
                // Фильтрация для кнопки "Скидки"
                const filteredItems = data.filter(product => {
                    return product.CV_PRICE_13 &&
                        product.CV_PRICE_18 &&
                        product.CV_PRICE_18 !== 0 &&
                        product.CP_QUANTITY !== 0 &&
                        product.IP_PROP140 !== "Продукт снят с производства";
                }).filter(product => {
                    // Рассчитываем величину скидки
                    const discountAmount = 100 - (product.CV_PRICE_13 * 100 / product.CV_PRICE_18);
                    return discountAmount > 0;
                }).sort((a, b) => {
                    // Сортируем товары по убыванию скидки
                    return ((a.CV_PRICE_13 - a.CV_PRICE_18) / a.CV_PRICE_13) - ((b.CV_PRICE_13 - b.CV_PRICE_18) / b.CV_PRICE_13);
                }).concat(
                    // Добавляем товары с нулевым количеством в конец списка
                    data.filter(product => {
                        return product.CV_PRICE_13 &&
                            product.CV_PRICE_18 &&
                            product.CV_PRICE_18 !== 0 &&
                            product.CP_QUANTITY === 0 &&
                            product.IP_PROP140 !== "Продукт снят с производства";
                    })
                );
                ItemsModule.itemsBlock.querySelectorAll('.col-auto').forEach(item => item.remove());
                ItemsModule.setupPagination(filteredItems);
                ItemsModule.renderPage(1, filteredItems);
            } else if (dataNewTime !== null) {
                // Обработка нажатия на кнопку "Предложения"
            }
        }
    });
}
export {loadData, showCategories, filterData, updateItemsDisplay, addSortEventListeners, handleCategoryClicks, dropdownItemCategory, dropdownSubCategory, dropdownCategory, addFilterEventListeners };