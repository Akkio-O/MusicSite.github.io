//Analog
const productId = document.querySelector('.product__container').getAttribute('data-XML_ID');
loadAlternatives(productId);
async function loadAlternatives(productId) {
    try {
        const response = await fetch(`http://localhost:8080/api/alternatives/${productId}`);
        const data = await response.json();

        if (data.success) {
            // Обработка полученных альтернативных товаров
            displayAlternatives(data.alternatives);
            const slider1 = createSlider('.carousel_inner1', {
                axis: 'horizontal',
                responsive: {
                    992: {
                        edgePadding: 20,
                        gutter: 20,
                        items: 4,
                    },
                    1400: {
                        edgePadding: 20,
                        gutter: 20,
                        items: 3,
                    }
                }
            });
            
            document.querySelector('.product__alternatives_prev').addEventListener('click', () => {
                slider1.goTo('prev');
            });
            
            document.querySelector('.product__alternatives_next').addEventListener('click', () => {
                slider1.goTo('next');
            });
        } else {
            console.error('Ошибка при загрузке альтернативных товаров:', data.message);
        }
    } catch (error) {
        console.error('Ошибка при загрузке альтернативных товаров:', error);
    }
}

// Функция для отображения альтернативных товаров в шаблоне
function displayAlternatives(alternatives) {
    const alternativesContainer = document.querySelector('.product__alternatives .carousel_inner1');

    // Очистим контейнер с альтернативными товарами перед отображением новых
    alternativesContainer.innerHTML = '';

    // Перебираем массив альтернативных товаров и добавляем их в контейнер
    alternatives.forEach(alternative => {
        const alternativeItem = document.createElement('div');
        alternativeItem.innerHTML = `
                <img src="${alternative.IE_DETAIL_PICTURE}" alt="slide">
                <p>${alternative.IE_NAME}</p>
        `;
        alternativesContainer.appendChild(alternativeItem);
    });
}
// Carousel
function createSlider(container, customSettings) {
    const defaultSettings = {
        speed: 1000,
        items: 3,
        slideBy: 'page',
        center: true,
        controls: false,
        autoHeight: true,
        autoplayButtonOutput: false,
        responsive: {
            1400: {
                edgePadding: 20,
                gutter: 20,
                items: 3,
            }
        },
        nav: false,
        axis: 'vertical'
    };

    const settings = { ...defaultSettings, ...customSettings };

    return tns({
        container,
        ...settings
    });
}

const slider = createSlider('.carousel_inner', {
    autoHeight: false
});

document.querySelector('.prev').addEventListener('click', () => {
    slider.goTo('prev');
});

document.querySelector('.next').addEventListener('click', () => {
    slider.goTo('next');
});

//section_option
const descriptionNavBlock = document.querySelector('.info__container button');
function click() {
    descriptionNavBlock.style.dispay = "none";
}
descriptionNavBlock.addEventListener('click', click);

const idDescription = document.getElementById('idDescription');
const idSpecifications = document.getElementById('idSpecifications');
// const idReviews = document.getElementById('idReviews');

function switchCategory(category) {
    const categories = ['Description', 'Specifications',];
    // 'Reviews'  
    for (const ElementsArray of categories) {
        const element = document.querySelector(`.${ElementsArray}`);
        const button = document.getElementById(`id${ElementsArray}`);

        if (ElementsArray === category) {
            button.classList.add('active');
            element.style.display = 'inherit';
        } else {
            button.classList.remove('active');
            element.style.display = 'none';
        }
    }
}

idDescription.onclick = () => switchCategory('Description');
idSpecifications.onclick = () => switchCategory('Specifications');

// сategoryProduct
const CategoryDropdown = document.querySelector('#category_menu__profiles__CategoryText');
const SubCategoryDropdown = document.querySelector('#category_menu__profiles__SubCategoryText');
const SubSubCategoryDropdown = document.querySelector('#category_menu__profiles__subSubCategoryText');

// Переменные для ссылок на выпадающие меню
const categoryDropdown = document.querySelector("#categoryDropdown");
const subcategoryDropdown = document.querySelector("#subCategoryDropdown");
const subSubcategoryDropdown = document.querySelector("#subSubCategoryDropdown");

// Функция для скрытия выпадающих меню при клике вне них
function hideDropdowns(event) {
    if (!event.target.closest('.dropdown-content')) {
        categoryDropdown.classList.remove("show");
        subcategoryDropdown.classList.remove("show");
        subSubcategoryDropdown.classList.remove("show");
    }
}

document.addEventListener("click", hideDropdowns);
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
                a.href = '#';
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
                    const url = `/category/products?category=${encodeURIComponent(selectedCategory)}&subcategory=${encodeURIComponent(selectedSubcategory)}&subsubcategory=${encodeURIComponent(selectedSubSubcategory)}`;
                    // Изменяем адресную строку при выборе подподкатегории
                    window.open(url, '_blank');
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
    const subCategoryValues = new Set(category
        .filter(group0 => group0.IC_GROUP0 && group0.IC_GROUP1 && group0.IC_GROUP0.trim() === selectedCategory)
        .map(group1 => group1.IC_GROUP1.trim()));
    if (existingLinks !== subCategoryValues.size) {
        subcategoryDropdown.innerHTML = '';
        subCategoryValues.forEach((group1, index) => {
            if (group1 && group1.trim() !== '') {
                const a = document.createElement("a");
                a.href = '#';
                a.textContent = group1;
                subcategoryDropdown.appendChild(a);
                a.addEventListener("click", function (event) {
                    SubCategoryDropdown.textContent = event.target.textContent;
                    const selectedCategory = CategoryDropdown.textContent;
                    const selectedSubcategory = event.target.textContent;
                    subcategoryDropdown.classList.remove("show");
                    dropdownItemCategory(category, selectedCategory, selectedSubcategory);
                    const hasIC_GROUP2 = category.some(group => group.IC_GROUP0 === selectedCategory && group.IC_GROUP1 === selectedSubcategory && group.IC_GROUP2);
                    if (hasIC_GROUP2) {
                        // Если есть IC_GROUP2, то ничего не делаем
                    } else {
                        const url = `/category/products?category=${encodeURIComponent(selectedCategory)}&subcategory=${encodeURIComponent(selectedSubcategory)}`;
                        window.open(url, '_blank');
                    }
                });
                a.dataset.subcategory = index;
            }
        });
    }
}

CategoryDropdown.addEventListener("click", function () {
    const url = `http://localhost:8080/getProductsData`;
    fetch(url, {
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
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
                        a.href = '#';
                        a.textContent = group0;
                        categoryDropdown.appendChild(a);
                        a.addEventListener("click", function (event) {
                            CategoryDropdown.textContent = event.target.textContent;
                            const selectedCategory = event.target.textContent;
                            dropdownSubCategory(data, selectedCategory);
                            categoryDropdown.classList.remove("show");
                        });
                        a.dataset.category = index;
                    }
                });
            }
        })
        .catch(error => {
            console.error('Произошла ошибка при получении данных:', error);
        });
});