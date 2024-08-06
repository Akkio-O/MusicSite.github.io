// Импорт модулей относительно текущего JavaScript-файла
import { displayOptions } from './modules/items/searchItems.mjs';
import { loadData, showCategories, filterData, updateItemsDisplay, addSortEventListeners, handleCategoryClicks, dropdownItemCategory, dropdownSubCategory, dropdownCategory } from './modules/items/filterItems.mjs';
import { navHamburger } from './modules/header/nav.mjs';

// Pagination
// Глобальные переменные для хранения выбранных категорий
const CategoryDropdown = document.querySelector('#category_menu__profiles__CategoryText');
const SubCategoryDropdown = document.querySelector('#category_menu__profiles__SubCategoryText');
const SubSubCategoryDropdown = document.querySelector('#category_menu__profiles__subSubCategoryText');

//search
const instruments = [];
const search = document.querySelector('.search');
const searchOptions = document.querySelector('.options');
const formSearch = document.querySelector('.promo_search__form')
const searchIcon = formSearch.querySelector('i');
let dataLoaded = false; // Флаг для отслеживания загрузки данных
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Ошибка HTTP: ' + response.status);
        }
        const data = await response.json();
        instruments.push(...data);
        console.log("Данные успешно загружены:", instruments);
        dataLoaded = true;
    } catch (error) {
        console.error('Произошла ошибка при загрузке данных:', error);
    }
}
function handleSearch() {
    const value = search.value.trim();
    if (value) {
        const url = `http://localhost:8080/search?text=${encodeURIComponent(value)}`;
        window.open(url, '_blank');
    }
}
search.addEventListener('input', function () {
    const value = this.value;
    displayOptions(value, instruments);
});
search.addEventListener('click', function () {
    if (!dataLoaded) {
        fetchData('http://localhost:8080/getProductsData');
    }
});
document.addEventListener('click', function (event) {
    const isClickInsideformSearch = formSearch.contains(event.target)
    if (!isClickInsideformSearch) {
        search.value = '';
        searchOptions.innerHTML = '';
        searchOptions.style.backgroundColor = 'transparent';
    }
});
search.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
});
searchIcon.addEventListener('click', handleSearch);

// Получаем параметры URL
const urlParams = new URLSearchParams(window.location.search);
const searchToText = urlParams.get('text');
const searchToProduct = urlParams.get('search');
const categorylink = urlParams.get('category');
const subcategorylink = urlParams.get('subcategory');
const subsubcategorylink = urlParams.get('subsubcategory');
// Получаем кнопки сортировки
const asc = document.getElementById('sort-asc');
const desc = document.getElementById('sort-desc');

// Основная функция
async function main() {
    try {
        const data = await loadData('http://localhost:8080/getProductsData');
        showCategories(data);
        if (categorylink) {
            CategoryDropdown.textContent = categorylink;
            dropdownCategory(data, categorylink);
        }
        if (subcategorylink) {
            SubCategoryDropdown.textContent = subcategorylink;
            dropdownSubCategory(data, categorylink, subcategorylink);
        }
        if (subsubcategorylink) {
            SubSubCategoryDropdown.textContent = subsubcategorylink;
            dropdownItemCategory(data, categorylink, subcategorylink, subsubcategorylink);
        }
        document.querySelector("#categoryDropdown").classList.remove("show");
        document.querySelector("#subCategoryDropdown").classList.remove("show");
        document.querySelector("#subSubCategoryDropdown").classList.remove("show");
        
        let filteredItems = filterData(data, categorylink, subcategorylink, subsubcategorylink, searchToText, searchToProduct);
        addSortEventListeners(filteredItems);
        updateItemsDisplay(filteredItems);

        CategoryDropdown.addEventListener('click', function () {
            document.querySelector("#categoryDropdown").classList.toggle("show");
        });
        SubCategoryDropdown.addEventListener('click', function () {
            document.querySelector("#subCategoryDropdown").classList.toggle("show");
        });
        SubSubCategoryDropdown.addEventListener('click', function () {
            document.querySelector("#subSubCategoryDropdown").classList.toggle("show");
        });

        window.addEventListener('click', function (event) {
            if (event.target === asc || event.target === desc) {
                event.preventDefault();
            } else {
                handleCategoryClicks(event, filteredItems);
            }
        });
    } catch (error) {
        console.error('Произошла ошибка:', error);
    }
}
main();

async function handleSubmitButtonClick(event) {
    let fileInput = document.getElementById('fileInput');
    let file = fileInput.files[0];
    if (!file) {
        console.error('Файл не выбран.');
        return;
    }

    // Создаем объект FormData и добавляем в него файл
    let formData = new FormData();
    formData.append('file', file);

    // Создаем WebSocket-подключение к серверу
    const ws = new WebSocket('ws://localhost:8080/progress');
    ws.onopen = function() {
        console.log('WebSocket подключение установлено.');
    };
    ws.onclose = function() {
        console.log('WebSocket подключение закрыто.');
    };
    ws.onerror = function(error) {
        console.error('WebSocket ошибка:', error);
    };

    // Обновляем прогресс при получении сообщения от сервера
    ws.onmessage = function(event) {
        let progress = JSON.parse(event.data).progress;
        let progressBar = document.getElementById('fileUploadProgress');
        progressBar.value = progress;
    };

    // Создаем объект XMLHttpRequest
    let xhr = new XMLHttpRequest();

    // Устанавливаем обработчик события успешной загрузки файла на сервер
    xhr.addEventListener('load', function(event) {
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log('Файл успешно загружен на сервер.');
            ws.close(); // Закрываем WebSocket-подключение после завершения загрузки файла
        } else {
            console.error('Произошла ошибка при загрузке файла на сервер.');
        }
    });

    // Отправляем запрос на сервер
    xhr.open('POST', 'http://localhost:8080/fileExcel');

    // Отправляем файл на сервер
    xhr.send(formData);
}

document.querySelector('#fileInput').addEventListener('change', function (event) {
    let file = event.target.files[0];
    event.target.closest('.input-file').querySelector('.input-file-text').innerHTML = file.name;
});

// Назначаем обработчик события нажатия кнопки "Отправить"
document.querySelector('.xlsxFileSubmit').addEventListener('click', handleSubmitButtonClick);

navHamburger();