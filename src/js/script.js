import * as ItemsModule from './modules/items/items.mjs';
import { displayOptions } from './modules/items/searchItems.mjs';
import { addSortEventListeners, addFilterEventListeners } from './modules/items/filterItems.mjs';
// getOptions, displayOptions, clearOptions 


window.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:8080/categoryGroup')
        .then(response => response.json())
        .then(categories => {
            const categoriesList = document.getElementById('categories-list');
            const categoriesContext = document.getElementById('categories-context');

            const uniqueCategories = categories.filter((category, index, self) =>
                index === self.findIndex(c => c.IC_GROUP0 === category.IC_GROUP0)
            );

            // Создаем кнопки для каждой категории
            uniqueCategories.forEach((category, index) => {
                const categoryItem = document.createElement('li');
                categoryItem.classList.add('positionBlock');
                categoryItem.innerHTML = `
                    <button data-index="${index + 1}">${category.IC_GROUP0}</button>
                `;
                categoriesList.appendChild(categoryItem);
            });

            // Создаем контекстное меню для каждой категории
            uniqueCategories.forEach((category, index) => {
                const categoryContext = document.createElement('li');
                categoryContext.classList.add('positionBlock');
                // Определяем уникальные подкатегории для текущей категории
                const uniqueSubcategories = categories.filter(subcategory => subcategory.IC_GROUP0 === category.IC_GROUP0)
                    .reduce((acc, cur) => {
                        if (!acc.includes(cur.IC_GROUP1)) {
                            acc.push(cur.IC_GROUP1);
                        }
                        return acc;
                    }, []);
                categoryContext.innerHTML = `
        <div class="ContextMenu ContextMenuSupport" id="menu${index + 1}">
            <ul>
                ${uniqueSubcategories.map(subcategory => `
                    <li>
                        ${categories.some(item => item.IC_GROUP0 === category.IC_GROUP0 && item.IC_GROUP1 === subcategory && item.IC_GROUP2) ?
                        `<button class="collapsible">${subcategory}</button>` :
                        `<a href="category/products?category=${encodeURIComponent(category.IC_GROUP0)}&subcategory=${encodeURIComponent(subcategory)}" target="_blank">${subcategory}</a>`}
                        <div class="content SubCategoryMenu">
                            <ul>
                                ${categories.filter(item => item.IC_GROUP0 === category.IC_GROUP0 && item.IC_GROUP1 === subcategory).map(item => `
                                    <li><a href="category/products?category=${encodeURIComponent(category.IC_GROUP0)}&subcategory=${encodeURIComponent(subcategory)}&subsubcategory=${encodeURIComponent(item.IC_GROUP2)}" target="_blank">${item.IC_GROUP2}</a></li>`
                        ).join('')}
                            </ul>
                        </div>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
                categoriesContext.appendChild(categoryContext);
            });


            const positionBlockButtons = document.querySelectorAll('.positionBlock button');
            const contextMenus = document.querySelectorAll('.ContextMenuSupport');

            positionBlockButtons.forEach(button => {
                button.addEventListener('mouseenter', event => {
                    const dataIndex = button.dataset.index;
                    const targetMenu = document.querySelector(`#menu${dataIndex}`);
                    if (!button.classList.contains('collapsible')) {
                        if (event.target === button) {
                            contextMenus.forEach(menu => {
                                menu.classList.remove('active');
                            });
                            targetMenu.classList.add('active');
                        }
                    }
                });
            });
            const frameCategories = document.querySelectorAll('.FrameCategory');

            // Функция для удаления класса active у всех контекстных меню
            function removeActiveClassFromMenus() {
                contextMenus.forEach(menu => {
                    menu.classList.remove('active');
                });
            }
            
            // Добавляем обработчик события mouseleave к каждому блоку .FrameCategory
            frameCategories.forEach(frameCategory => {
                let timer; // Переменная для хранения идентификатора таймера
            
                frameCategory.addEventListener('mouseleave', () => {
                    // Удаляем класс active у всех контекстных меню через 500 миллисекунд
                    timer = setTimeout(removeActiveClassFromMenus, 500);
                });
            
                // Если мы возвращаемся в блок .FrameCategory, отменяем предыдущий таймер
                frameCategory.addEventListener('mouseenter', () => {
                    clearTimeout(timer);
                });
            });
            
            // Section_items
            let coll = document.getElementsByClassName("collapsible");
            let i;

            for (i = 0; i < coll.length; i++) {
                coll[i].addEventListener("click", function () {
                    this.classList.toggle("active");
                    let content = this.nextElementSibling;
                    if (content.style.maxHeight) {
                        content.style.maxHeight = null;
                    } else {
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                });
            }
        })
        .catch(error => console.error('Ошибка загрузки категорий:', error));
});

// Получаем параметры URL
const urlParams = new URLSearchParams(window.location.search);
// Получаем категорию и продукт
const categories = urlParams.getAll('category');
if (categories.length != 0) {

}
else {
    // Показать все товары перед загрузкой товаров
    fetch('http://localhost:8080/getProductsData')
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка HTTP: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            ItemsModule.itemsBlock.querySelectorAll('.col-auto').forEach(item => item.remove());
            ItemsModule.setupPagination(data);
            ItemsModule.renderPage(1, data);
            addFilterEventListeners(data);
            addSortEventListeners(data);
        })
}

// Search
const instruments = [];
const search = document.querySelector('.search');
const searchOptions = document.querySelector('.options');
const formSearch = document.querySelector('.promo_search__form')
const searchIcon = formSearch.querySelector('i');
let dataLoaded = false; // Флаг для отслеживания загрузки данных
// Функция для загрузки данных
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Ошибка HTTP: ' + response.status);
        }
        const data = await response.json();
        instruments.push(...data);
        console.log("Данные успешно загружены:", instruments);
        dataLoaded = true; // Устанавливаем флаг загрузки данных
    } catch (error) {
        console.error('Произошла ошибка при загрузке данных:', error);
    }
}
// Обработчик события клика на результаты поиска
function handleSearch() {
    const value = search.value.trim();
    if (value) {
        const url = `http://localhost:8080/search?text=${encodeURIComponent(value)}`;
        window.open(url, '_blank');
    }
}
// Обработчик события input
search.addEventListener('input', function () {
    const value = this.value;
    displayOptions(value, instruments);
});
// Обработчик события click для загрузки данных
search.addEventListener('click', function () {
    if (!dataLoaded) { // Проверяем, загружены ли данные
        fetchData('http://localhost:8080/getProductsData');
    }
});
document.addEventListener('click', function (event) {
    const isClickInsideformSearch = formSearch.contains(event.target)
    if (!isClickInsideformSearch) {
        // Обнуляем значения
        search.value = '';
        searchOptions.innerHTML = '';
        searchOptions.style.backgroundColor = 'transparent';
    }
});
// Обработчик события нажатия клавиши Enter
search.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
});
// Обработчик события клика на иконку поиска
searchIcon.addEventListener('click', handleSearch);

// @media screen
function mediaLg(l) {
    const promo = document.querySelector('.promo')
    const navMain = document.querySelector('.navMain')
    const promoSeatchImg = document.querySelector('.promo_search_img')
    if (l.matches) {
        navMain.classList.remove('container')
        promo.classList.remove('container')
        promoSeatchImg.classList.remove('col-lg-8')
    }
    else {
        promo.classList.add('container')
        navMain.classList.remove('container')
        promoSeatchImg.classList.add('col-lg-8')
    }
}
const l = window.matchMedia("(max-width: 994px)")
mediaLg(l)
l.addListener(mediaLg)

function mediaXl(x) {
    const footerContainer = document.querySelector('.footer_content__container')
    const footerRow = document.querySelector('.footer_content__row')
    if (x.matches) {
        footerContainer.classList.remove('container')
        footerRow.classList.add('row')
    }
    else {
        footerContainer.classList.add('container')
        footerRow.classList.remove('row')
    }
}
const x = window.matchMedia("(max-width: 1200px)")
mediaXl(x)
x.addListener(mediaXl)