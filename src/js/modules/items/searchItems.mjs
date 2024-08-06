// Кэширование элементов DOM
const searchOptions = document.querySelector('.options');
// Функция для загрузки данных
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Ошибка HTTP: ' + response.status);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Произошла ошибка при загрузке данных:', error);
        return [];
    }
}
// Функция для получения отфильтрованных опций
function getOptions(value, instruments) {
    const trimmedValue = value.trim().toLowerCase();
    return instruments.filter(instr => {
        const nameMatch = instr.IE_NAME && instr.IE_NAME.toLowerCase().includes(trimmedValue);
        const groupMatch = instr.IC_GROUP0 && instr.IC_GROUP0.toLowerCase().includes(trimmedValue) ||
            instr.IC_GROUP1 && instr.IC_GROUP1.toLowerCase().includes(trimmedValue) ||
            instr.IC_GROUP2 && instr.IC_GROUP2.toLowerCase().includes(trimmedValue);
        return nameMatch || groupMatch;
    });
}

// Функция для отображения опций
function displayOptions(value, instruments) {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
        searchOptions.innerHTML = '';
        searchOptions.style.backgroundColor = 'transparent';
        return;
    }
    const options = getOptions(trimmedValue, instruments);
    const fragment = document.createDocumentFragment(); // Создаем фрагмент
    options.slice(0, 10).forEach(instrument => {
        const regex = new RegExp(trimmedValue, 'gi');
        const instrumentName = instrument.IE_NAME.replace(regex, `<span class="hl">${value}</span>`);
        const li = document.createElement('li');
        li.innerHTML = `<span>${instrumentName}</span>`;
        li.addEventListener('click', function (event) {
            const group0 = instrument.IC_GROUP0;
            const group1 = instrument.IC_GROUP1;
            const group2 = instrument.IC_GROUP2;
            const product = instrument.IE_NAME;
    
            let searchParams = [];
    
            if (!group0 && group1) {
                const category = instruments.find(item => item.IC_GROUP1 === group1)?.IC_GROUP0;
                searchParams.push(`category=${encodeURIComponent(decodeURIComponent(category))}`);
                searchParams.push(`subcategory=${encodeURIComponent(decodeURIComponent(group1))}`);
                searchParams.push(`search=${encodeURIComponent(decodeURIComponent(product))}`);
            } else {
                searchParams.push(`category=${encodeURIComponent(decodeURIComponent(group0))}`);
                searchParams.push(`subcategory=${encodeURIComponent(decodeURIComponent(group1))}`);
                if (group2) {
                    searchParams.push(`subsubcategory=${encodeURIComponent(decodeURIComponent(group2))}`);
                }
                searchParams.push(`search=${encodeURIComponent(decodeURIComponent(product))}`);
            }
    
            const url = `/category/products?${searchParams.join('&')}`;
    
            window.open(url, '_blank');
    
            event.stopPropagation();
            event.preventDefault();
        });
    
        fragment.appendChild(li);
    });

    searchOptions.innerHTML = ''; // Очищаем предыдущие результаты
    searchOptions.appendChild(fragment); // Добавляем новые результаты
    searchOptions.style.backgroundColor = options.length > 0 ? '#ea7e67' : 'transparent';
}

export { fetchData, getOptions, displayOptions };