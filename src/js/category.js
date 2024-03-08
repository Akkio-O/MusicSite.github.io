// Category
const category = {
    1:["Струнные инструменты"],
    2:["Духовые инструменты"],
    3:["Ударные инструменты"],
    4:["Клавишные инструменты"],
    5:["Звук и аудио"],
    6:["Аксессуары и оборудование"],
    7:["Торговое оборудование"]
}

const subcategories = {
    1: ["Гитары", "Народные струнные инструменты", "Смычковые инструменты", "Арфы и акссесуары"],
    2: ["Духовые инструменты"],
    3: ["Ударные инструменты", "перкуссия"],
    4: ["Аккордеоны, баяны", "Клавишные"],
    5: ["Звуковое оборудование", "Микрофоны и аксессуары", "Коммутация"],
    6: ["Тюнеры, метрономы, камертоны", "Аксессуары", "Ноты, самоучители"],
    7: ["Торговое оборудование"]
};

const subSubcategories = {
    1: {
        1: ["Акустические гитары", "Акустический бас", "Бас-гитары", "Классические гитары", "Электрогитары"],
        2: ["Балалайки, аксессуары", "Банджо, аксессуары", "Бузуки, аксессуары", "Варганы", "Гусли, аксессуары", "Домры, аксессуары", "Кобза", "Мандола", "Мандолины, аксессуары", "Псалтерионы", "Укулеле, аксессуары", "Цимбалы"],
        3: ["Аксессуары для смычковых", "Альты, аксессуары", "Виолончели, аксессуары", "Контрабасы, аксессуары", "Скрипки, аксессуары"],
        4: ["Струны для арфы"]
    },
    2: {
        1: ["Аксессуары для духовых", "Баритоны, аксессуары", "Блок-флейты, аксессуары", "Валторны, аксессуары", "Гобои, аксессуары", "Губные Гармошки, аксессуары", "Казу", "Кларнеты, аксессуары", "Корнеты, аксессуары", "Мелодики, кларины", "Пан-флейты", "Ремни для духовых инструментов", "Рожки, аксессуары", "Саксофоны, аксессуары", "Стойки для духовых", "Тенора, аксессуары", "Тромбоны, аксессуары", "Трубы, аксессуары", "Тубы, аксессуары", "Фаготы, аксессуары", "Флейты, аксессуары", "Цуг-флейты, Окарины, Свистки"],
    },
    3: {
        1: ["Аксессуары для ударных", "Барабанные палочки, аксессуары", "Гонги, аксессуары", "Детские барабаны", "Малые барабаны", "Маршевые инструменты", "Пластики для барабанов", "Табуреты для ударника", "Тарелки", "Тренировочные барабаны, пэды", "Ударные установки", "Чехлы для барабанов и тарелок", "Щетки и рюты", "Электронные барабаны"],
        2: ["Агого", "Блоки", "Бонги", "Вибраслэп", "Гуиро", "Джембе", "Кабасы", "Кастаньеты", "Ковбелы", "Колокольчики", "Конги", "Ксилофоны", "Маракасы и шейкеры", "Металлофоны", "Наборы перкуссии", "Тамбурины", "Тон-блоки, Коробочки", "Треугольники", "Трещотки, кокирико", "Чехлы для перкуссии", "Чимесы"]
    },
    4: {
        1: ["Аккордеоны", "Баяны, кнопочные аккордеоны", "Концертины", "Ремни для баянов и аккордеонов", "Чехлы для баянов и аккордеонов"], 
        2: ["Аксессуары для клавишных", "Банкетки", "Синтезаторы", "Стойки для клавишных", "Стулья", "Чехлы и накидки для клавишных"]
    },
    5: {
        1: ["Акустические системы", "Кейсы, рэки, чехлы", "Комплекты акустических систем", "Микшерные пульты", "Обработка звука", "Сабвуферы", "Стойки под акустику", "Усилители мощности"], 
        2: ["Ветрозащиты", "Держатели для микрофона", "Микрофонные стойки", "Микрофоны проводные"], 
        3: ["Кабель в бобинах", "Шнуры соединительные"]
    },
    6: {
        1: ["Камертоны", "Метрономы", "Метротюнеры", "Тюнеры"], 
        2: ["Дирижерские палочки", "Источники питания", "Средства для ухода", "Стойки, подставки", "Тренажеры", "Чехлы, ремни"], 
        3:["Вокальная музыка", "Диски CD DVD", "Книги", "Ноты для духовых инструментов", "Ноты для клавишных инструментов", "Ноты для народных инструментов", "Ноты для струнных инструментов", "Ноты для ударных инструментов", "Папки для нот", "Популярная музыка", "Справочно-энциклопедические издания", "Учебники"]
    },
    7: {
        1: ["Торговое оборудование", "Витрины", "Стойки", "Каталоги"]
    }
};
const dropdown = document.querySelector("#category_menu__profiles__CategoryText");
dropdown.addEventListener("click",function () {
    const categoryDropdown = document.querySelector("#categoryDropdown");
    categoryDropdown.classList.toggle("show");
    document.querySelector("#subCategoryDropdown").classList.remove("show");
    document.querySelector("#subSubCategoryDropdown").classList.remove("show");
    const existingLinks = categoryDropdown.querySelectorAll("a").length;

    if (existingLinks !== Object.keys(category).length) {
        categoryDropdown.innerHTML = '';

        for (let key in category) {
            const a = document.createElement("a");
            a.href = '#';
            a.textContent = category[key][0];
            categoryDropdown.appendChild(a);
            a.addEventListener("click", function(event) {
                const selectedCategory = parseInt(event.target.dataset.category);
                dropdown.textContent = event.target.textContent;
                updateSubcategories(selectedCategory);
                categoryDropdown.classList.remove("show");
            });
            a.dataset.category = key;
        }
    }
});
const subCategoryDropdown = document.querySelector("#category_menu__profiles__SubCategoryText");

function updateSubcategories(selectedCategory) {
    const SubcategoryDropdown = document.querySelector("#subCategoryDropdown");
    const existingLinks = SubcategoryDropdown.querySelectorAll("a").length;
    SubcategoryDropdown.classList.toggle("show");
    if (existingLinks !== subcategories[selectedCategory].length) {
        SubcategoryDropdown.innerHTML = '';

        subcategories[selectedCategory].forEach((subcategory, index) => {
            const a = document.createElement("a");
            a.textContent = subcategory;
            SubcategoryDropdown.appendChild(a);
            a.addEventListener("click", function(event) {
                subCategoryDropdown.textContent = event.target.textContent;
                SubcategoryDropdown.classList.remove("show");
                updateSubSubcategories(selectedCategory, index + 1);
            });
        });
    }
}
const subSubCategoryDropdown = document.querySelector("#category_menu__profiles__subSubCategoryText");
function updateSubSubcategories(selectedCategory, selectedSubCategory) {
    const SubSubcategoryDropdown = document.querySelector("#subSubCategoryDropdown");
    const existingLinks = SubSubcategoryDropdown.querySelectorAll("a").length;
    SubSubcategoryDropdown.classList.toggle("show");
    if (existingLinks !== subSubcategories[selectedCategory][selectedSubCategory].length) {
        SubSubcategoryDropdown.innerHTML = '';

        subSubcategories[selectedCategory][selectedSubCategory].forEach(subSubcategory => {
            const a = document.createElement("a");
            a.textContent = subSubcategory;
            SubSubcategoryDropdown.appendChild(a);
            a.addEventListener("click", function(event) {
                subSubCategoryDropdown.textContent = event.target.textContent;
                SubSubcategoryDropdown.classList.remove("show");
            });
        });
    }
}
subCategoryDropdown.addEventListener("click",function(){
    document.querySelector("#subCategoryDropdown").classList.toggle("show");
    document.querySelector("#categoryDropdown").classList.remove("show");
    document.querySelector("#subSubCategoryDropdown").classList.remove("show");
})
subSubCategoryDropdown.addEventListener("click",function(){
    document.querySelector("#subCategoryDropdown").classList.remove("show");
    document.querySelector("#categoryDropdown").classList.remove("show");
    document.querySelector("#subSubCategoryDropdown").classList.toggle("show");
})

//file
document.querySelectorAll('.input-file input[type=file]').forEach(input => {
    input.addEventListener('change', function() {
        let file = this.files[0];
        this.closest('.input-file').querySelector('.input-file-text').innerHTML = file.name;

        let formData = new FormData();
        formData.append('file', file);

        fetch('http://localhost:8080/fileExcel', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.text();
        })
        .then(data => {
            console.log(data); 
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    });
});

