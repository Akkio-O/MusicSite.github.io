const fs = require('fs');
const ejs = require('ejs');
const xlsx = require('xlsx');
const path = require('path');

function transliterate(text) {
    if (!text) return ''; // Если text пуст или undefined, вернуть пустую строку
    const russianLetters = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
    const englishLetters = 'abvgdeejzijklmnoprstufhzcss_y_eua';
    return text.toLowerCase().split('').map(char => {
        const index = russianLetters.indexOf(char);
        return index !== -1 ? englishLetters[index] : char;
    }).join('');
}
const newFolderName = transliterate('твоя_русская_папка');


async function readExcel(filePath) {
    const productData = xlsx.readFile(filePath);
    const data = xlsx.utils.sheet_to_json(productData.Sheets[productData.SheetNames[0]], { header: 1 });
    return data
}

async function insertOrUpdateProducts(products, ejsTemplate, con, productsFolderPath) {
    const conPromise = con.promise();
    await Promise.all(products.map(async (product) => {
        try {
            const { CV_PRICE_13, CV_PRICE_18, IP_PROP140, IC_GROUP0, IC_GROUP1, IC_GROUP2 } = product;
            if (CV_PRICE_13 && CV_PRICE_18 && IP_PROP140 !== "Продукт снят с производства") {
                product.created_at = new Date(); // Установка текущего времени
                const query = "INSERT INTO Product SET ? ON DUPLICATE KEY UPDATE ?";
                await conPromise.query(query, [product, product]);
                console.log("Данные успешно добавлены в таблицу Product или обновлены");
                // Проверяем наличие IC_GROUP2
                if (IC_GROUP2) {
                    await addToCategoryFolder(IC_GROUP2, product, ejsTemplate, productsFolderPath);
                } else if (IC_GROUP1) {
                    await addToCategoryFolder(IC_GROUP1, product, ejsTemplate, productsFolderPath);
                }
            } else {
                console.log("Продукт снят с производства, данные не добавлены в таблицу Product и не обновлены");
            }
        } catch (err) {
            console.error("Ошибка при добавлении или обновлении данных в таблицу Product:", err);
        }
    }));
}
async function deleteUnusedFiles(productsFolderPath, con) {
    const productIdsFromTable = await getProductIdsFromTable(con);
    await deleteFilesRecursive(productsFolderPath, productIdsFromTable);
}
async function deleteFilesRecursive(folderPath, productIdsFromTable) {
    const filesInFolder = await fs.promises.readdir(folderPath);

    await Promise.all(filesInFolder.map(async (fileName) => {
        const filePath = path.join(folderPath, fileName);
        const stats = await fs.promises.stat(filePath);

        if (stats.isDirectory()) {
            await deleteFilesRecursive(filePath, productIdsFromTable);
        } else {
            if (!productIdsFromTable.includes(fileName)) {
                await fs.promises.unlink(filePath);
                console.log(`Файл ${fileName} удален.`);
            }
        }
    }));
}

async function getProductIdsFromTable(con) {
    const conPromise = con.promise();
    const [rows] = await conPromise.query("SELECT IE_XML_ID FROM Product");
    return rows.map(row => row.IE_XML_ID + '.html');
}
async function renderHTMLFiles(productsFolderPath, ejsTemplate, con) {
    const products = await getProductsForHTMLRendering(con);
    const filesNotToUpdate = [];
    await Promise.all(products.map(async (product) => {
        const folders = [
    transliterate(product.IC_GROUP0),
    transliterate(product.IC_GROUP1),
    transliterate(product.IC_GROUP2)
].filter(Boolean)
.map(segment => encodeURIComponent(segment)) // Кодирование каждого сегмента пути
.join('/');
        const fullPath = path.join(productsFolderPath, folders); // Путь к подпапке

        const fileName = `${product.IE_XML_ID}.html`;
        const filePath = path.join(fullPath, fileName); // Путь к файлу в подпапке
        const html = ejs.render(ejsTemplate, { product });
        const existingHtml = await readFileAsync(filePath);
        if (html !== existingHtml) {
            await fs.promises.writeFile(filePath, html, 'utf8');
            console.log(`HTML файл ${fileName} обновлен.`);
        } else {
            filesNotToUpdate.push(fileName);
        }
    }));
    console.log(`${filesNotToUpdate.length} HTML файлов существует и не требует обновления.`);
}

async function createOrCheckFolderStructure(products, productsFolderPath) {
    await Promise.all(products.map(async (product) => {
        const folders = [
    transliterate(product.IC_GROUP0),
    transliterate(product.IC_GROUP1),
    transliterate(product.IC_GROUP2)
].filter(Boolean)
.map(segment => encodeURIComponent(segment)) // Кодирование каждого сегмента пути
.join('/');
        const fullPath = path.join(productsFolderPath, folders);

        try {
            await fs.promises.access(fullPath);
        } catch (err) {
            if (err.code === 'ENOENT') {
                // Папка не существует, создаём её и все промежуточные папки
                await fs.promises.mkdir(fullPath, { recursive: true });
            }
        }
    }));
}

async function addToCategoryFolder(category, product, ejsTemplate, productsFolderPath) {
    const encodedCategories = [
        encodeURIComponent(transliterate(product.IC_GROUP0)),
        encodeURIComponent(transliterate(product.IC_GROUP1)),
        product.IC_GROUP2 ? encodeURIComponent(transliterate(product.IC_GROUP2)) : undefined
    ].filter(Boolean); // Исключаем пустые значения

    const folders = encodedCategories.filter(cat => cat !== category).join('/');
    console.log('Encoded folders:', folders); // Выводим значения folders для отладки
    
    if (folders) { // Проверяем, что есть папки для создания
        const fullPath = path.join(productsFolderPath, folders);
        console.log('Full path:', fullPath); // Выводим fullPath для отладки

        try {
            await fs.promises.mkdir(fullPath, { recursive: true });
        } catch (err) {
            if (err.code !== 'EEXIST') throw err;
        }

        const fileName = `${product.IE_XML_ID}.html`;
        const filePath = path.join(fullPath, fileName);
        const html = ejs.render(ejsTemplate, { product });

        try {
            const existingHtml = await fs.promises.readFile(filePath, 'utf8');
            if (html !== existingHtml) {
                await fs.promises.writeFile(filePath, html, 'utf8');
                console.log(`HTML файл ${fileName} обновлен.`);
            }
        } catch (err) {
            if (err.code === 'ENOENT') {
                await fs.promises.writeFile(filePath, html, 'utf8');
                console.log(`HTML файл ${fileName} создан.`);
            }
        }
    } else {
        console.log(`Не удалось определить путь для категории "${category}"`);
    }
}


async function readFileAsync(filePath) {
    return fs.promises.readFile(filePath, 'utf8').catch(() => '');
}
async function getProductsForHTMLRendering(con) {
    const conPromise = con.promise();
    const [rows] = await conPromise.query("SELECT * FROM Product");
    return rows;
}

module.exports = {
    readExcel,
    insertOrUpdateProducts,
    deleteUnusedFiles,
    deleteFilesRecursive,
    getProductIdsFromTable,
    renderHTMLFiles,
    createOrCheckFolderStructure,
    addToCategoryFolder,
    readFileAsync,
    getProductsForHTMLRendering
};