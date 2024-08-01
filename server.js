const express = require('express');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const funcExcel = require('./src/js/modules/server/readExcel');
const datacon = require('../datacon');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');
const WebSocket = require('ws');
const fs = require('fs');

// Запуск сервера
const app = express();
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Для использования в production поменять на true и настроить HTTPS
}));
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
const wss = new WebSocket.Server({ server });
const expressWs = require('express-ws');
expressWs(app);
const csrfProtection = csrf({ cookie: true });
app.use(express.json());
app.use(cors());

// Middleware для обработки данных формы
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src')));

// Применяем CSRF-защиту ко всем маршрутам, кроме ''
app.use((req, res, next) => {
    if (req.path !== '/reg' && req.path !== '/fileExcel') {
        return csrfProtection(req, res, next);
    }
    next();
});

// Middleware для проверки аутентификации пользователя
function authenticateUser(req, res, next) {
    if (req.session && req.session.user) {
        next(); // Если сессия пользователя существует, переходим к следующему middleware
    } else {
        res.status(401).json({ error: 'Пользователь не авторизован' }); // Если сессия пользователя отсутствует, возвращаем ошибку авторизации
    }
}

// Маршрут для получения CSRF токена
app.get('/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Защищенный маршрут, требующий аутентификации
app.get('/protected-route', authenticateUser, (req, res) => {
    // Этот код будет выполнен только в случае успешной аутентификации пользователя
    res.json({ message: 'Это защищенный маршрут' });
});

const escapeHtml = (unsafe) => {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

const con = mysql.createConnection({
    host: datacon.host,
    user: datacon.user,
    password: datacon.password,
    database: datacon.database
});

wss.on('connection', function connection(ws) {
    console.log('Client connected');

    ws.on('close', function () {
        console.log('Client disconnected');
    });
});
app.set('wss', wss); // сохраняем объект WebSocket в приложении Express для доступа из маршрутов

// WebSocket-обработчик для отслеживания прогресса загрузки
app.ws('/progress', function (ws, req) {
    ws.on('message', function (msg) {
        // Принимает сообщение о прогрессе от сервера
    });
});

con.query("CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, first_name VARCHAR(255), last_name VARCHAR(255), phone VARCHAR(255), email VARCHAR(255), password VARCHAR(255))", function (err, result) {
    if (err) {
        console.error("Ошибка при создании таблицы:", err);
    } else {
        console.log("Таблица users создана");
    }
});

// Обработчик POST запроса для регистрации пользователя
app.post('/reg', async function (req, res) {
    const { firstName, lastName, phone, email, password } = req.body;
    // Проверка на пустые поля
    if (!firstName || !lastName || !phone || !email || !password) {
        return res.status(400).json({ error: 'Пожалуйста, заполните все поля' });
    }
    // Проверка на валидность email (можно использовать регулярное выражение)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Пожалуйста, введите корректный email' });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: 'Пароль должен содержать не менее 6 символов' });
    }
    try {
        // Хэшируем пароль перед сохранением в базу данных
        const hashedPassword = await bcrypt.hash(password, 10); // 10 - сила хэширования

        // Проверка на уникальность email
        const checkEmailQuery = "SELECT id FROM users WHERE email = ?";
        const [existingUser] = await con.promise().query(checkEmailQuery, [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email уже зарегистрирован' });
        }

        // Добавляем пользователя в базу данных
        const insertUserQuery = "INSERT INTO users (first_name, last_name, phone, email, password) VALUES (?, ?, ?, ?, ?)";
        await con.promise().query(insertUserQuery, [firstName, lastName, phone, email, hashedPassword]);
        req.session.user = {
            firstName: escapeHtml(firstName),
            lastName,
            email
        };
        // Отправляем успешный ответ с данными о пользователе
        return res.status(200).json({
            message: 'Пользователь успешно зарегистрирован',
            firstName,
            lastName,
            email
        });
    } catch (error) {
        console.error("Ошибка при выполнении запроса:", error);
        return res.status(500).json({ error: 'Произошла ошибка при обработке запроса' });
    }
});

app.post('/log', csrfProtection, async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const sql = "SELECT id, first_name, email, password FROM users WHERE email = ? LIMIT 1";
        const [userRows] = await con.promise().query(sql, [email]);
        if (userRows.length === 0) {
            console.log("Пользователь с указанным email не найден");
            return res.status(401).json({ error: 'Неправильный email' });
        }
        const user = userRows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Неправильный пароль");
            return res.status(401).json({ error: 'Неправильный пароль' });
        }
        if (!req.csrfToken()) {
            return res.status(403).json({ error: 'CSRF токен отсутствует или недействителен' });
        }
        console.log("Пользователь успешно аутентифицирован");
        req.session.user = {
            id: user.id,
            firstName: escapeHtml(user.first_name),
            email: user.email
        };
        return res.status(200).json({
            id: user.id,
            firstName: user.first_name,
            email: user.email
        });
    } catch (error) {
        console.error("Ошибка при выполнении запроса:", error);
        return res.status(500).json({ error: 'Произошла ошибка при обработке запроса' });
    }
});

//create_data_product
con.query("CREATE TABLE IF NOT EXISTS Product (id INT AUTO_INCREMENT PRIMARY KEY, IE_XML_ID VARCHAR(255) UNIQUE, IE_NAME VARCHAR(255), IE_PREVIEW_TEXT VARCHAR(2000), IE_DETAIL_PICTURE VARCHAR(255), CP_QUANTITY VARCHAR(255), IP_PROP140 VARCHAR(255), IP_PROP114 VARCHAR(255), IP_PROP96 VARCHAR(255), IP_PROP110 VARCHAR(255), IC_GROUP0 VARCHAR(255), IC_GROUP1 VARCHAR(255), IC_GROUP2 VARCHAR(255), CV_PRICE_13 VARCHAR(255),  CV_PRICE_18 VARCHAR(255), CV_CURRENCY_13 VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)", function (err, result) {
    if (err) {
        console.error("Ошибка при создании таблицы:", err);
    } else {
        console.log("Таблица Product создана");
    }
});

// product_items
const filePath = path.join(__dirname, 'src', 'xlsx', 'product.xlsx');
const productsFolderPath = path.join(__dirname, 'src', 'products');
const ejsTemplatePath = 'src/product_template.ejs';

app.post('/fileExcel', async function (req, res) {
    try {
        const data = await funcExcel.readExcel(filePath);
        const products = data.slice(1).map(row => ({
            IE_XML_ID: row[0],
            IE_NAME: row[1],
            IE_PREVIEW_TEXT: row[2],
            IE_DETAIL_PICTURE: row[3],
            CP_QUANTITY: row[4],
            IP_PROP140: row[6],
            IP_PROP114: row[9],
            IP_PROP96: row[12],
            IP_PROP110: row[24],
            IC_GROUP0: row[25],
            IC_GROUP1: row[26],
            IC_GROUP2: row[27],
            CV_PRICE_13: row[32],
            CV_PRICE_18: row[37],
            CV_CURRENCY_13: row[34]
        }));
        const ejsTemplate = await fs.promises.readFile(ejsTemplatePath, 'utf8');
        const totalFunctions = 4; // Общее количество функций для отслеживания прогресса
        let processedFunctions = 0; // Количество выполненных функций
        // Отправляем информацию о начале выполнения операций
        sendProgressToClients(req, 0);
        // Вызываем функции с отслеживанием прогресса
        await funcExcel.insertOrUpdateProducts(products, ejsTemplate, con, productsFolderPath);
        sendProgressToClients(req, ++processedFunctions / totalFunctions * 100);
        await funcExcel.deleteUnusedFiles(productsFolderPath, con);
        sendProgressToClients(req, ++processedFunctions / totalFunctions * 100);
        await funcExcel.renderHTMLFiles(productsFolderPath, ejsTemplate, con);
        sendProgressToClients(req, ++processedFunctions / totalFunctions * 100);
        await funcExcel.createOrCheckFolderStructure(products, productsFolderPath);
        sendProgressToClients(req, ++processedFunctions / totalFunctions * 100)
        // Отправляем сообщение о завершении выполнения операций
        sendProgressToClients(req, 100);
        res.status(200).json({ success: true, message: 'HTML файлы сгенерированы успешно.' });
    } catch (error) {
        console.error('Ошибка при обработке файла Excel:', error);
        res.status(500).json({ success: false, message: 'Ошибка при обработке файла Excel' });
    }
});

// Функция для отправки прогресса клиентам через WebSocket
function sendProgressToClients(req, progress) {
    const wss = req.app.get('wss');
    wss.clients.forEach(client => {
        client.send(JSON.stringify({ progress }));
    });
}

//Analog
async function findAlternatives(productId) {
    try {
        // Выполните SQL-запрос для получения альтернативных товаров на основе productId
        const sqlQuery = `SELECT * FROM product WHERE IE_XML_ID != ? LIMIT 10`;
        const [alternativesData] = await con.promise().query(sqlQuery, [productId]);
        return alternativesData;
    } catch (error) {
        console.error('Ошибка при выполнении SQL-запроса для альтернативных товаров:', error);
        throw error;
    }
}
app.get('/api/alternatives/:productId', async function (req, res) {
    try {
        const { productId } = req.params;

        // Вызовите функцию для поиска альтернативных товаров
        const alternatives = await findAlternatives(productId);

        return res.json({ success: true, alternatives });
    } catch (error) {
        console.error('Ошибка при поиске альтернативных товаров:', error);
        return res.status(500).json({ success: false, message: 'Ошибка при поиске альтернативных товаров' });
    }
});

app.get('/main', async function (req, res) {
    try {
        // Определяем, какой тип данных ожидает клиент
        const acceptType = req.accepts(['html', 'json']);
        if (acceptType === 'json') {
            // Если запрос содержит "Accept: application/json", отправляем JSON данные
            res.json({ message: 'JSON response' });
        } else {
            // Отправляем HTML документ
            const filePath = path.join(__dirname, 'src', 'index.html');
            res.sendFile(filePath);
        }
    } catch (error) {
        console.error('Ошибка при обращении к запросу:', error);
        res.status(500).json({ success: false, message: 'Ошибка при обращении к запросу' });
    }
})
app.get('/category', async function (req, res) {
    try {
        return res.sendFile(path.join(__dirname, 'src', 'category.html'));
    } catch (error) {
        console.error('Ошибка при обращении к запросу:', error);
        return res.status(500).json({ success: false, message: 'Ошибка при обращении к запросу' });
    }
});
app.get('/about', async function (req, res) {
    try {
        const acceptType = req.accepts(['html', 'json']);

        if (acceptType === 'json') {
            res.json({ message: 'JSON response' });
        } else {
            const filePath = path.join(__dirname, 'src', 'about.html');
            res.sendFile(filePath);
        }
    } catch (error) {
        console.error('Ошибка при обращении к запросу:', error);
        res.status(500).json({ success: false, message: 'Ошибка при обращении к запросу' });
    }
})

app.get(['/category', '/category/products/:IC_GROUP0?/:IC_GROUP1?/:productName?', '/category/products/:IC_GROUP0?/:IC_GROUP1?/:IC_GROUP2?/:productName?'], async function (req, res) {
    try {
        const { IC_GROUP0, IC_GROUP1, IC_GROUP2, productName } = req.params;
        const sqlQuery = `SELECT DISTINCT IC_GROUP0, IC_GROUP1, IC_GROUP2, IE_XML_ID FROM product`;
        const [routeData] = await con.promise().query(sqlQuery);
        const matchedRoute = routeData.find(route =>
            (route.IC_GROUP0 === IC_GROUP0 || !IC_GROUP0) &&
            (route.IC_GROUP1 === IC_GROUP1 || !IC_GROUP1) &&
            (route.IC_GROUP2 === IC_GROUP2 || !IC_GROUP2)
        );
        if (!matchedRoute) {
            // Маршрут не найден в базе данных, отправляем ошибку
            return res.status(404).send("Маршрут не найден");
        }
        // Если результат не пустой, отправляем файл продукта
        if (matchedRoute && productName) {
            const filePath = path.join(__dirname, 'src', 'products', matchedRoute.IC_GROUP0 || '', matchedRoute.IC_GROUP1 || '', matchedRoute.IC_GROUP2 || '', `${matchedRoute.IE_XML_ID}.html`);
            return res.sendFile(filePath);
        }
        // Иначе, отправляем файл категории
        return res.sendFile(path.join(__dirname, 'src', 'category.html'));
    } catch (error) {
        console.error('Ошибка при обращении к запросу:', error);
        return res.status(500).json({ success: false, message: 'Ошибка при обращении к запросу' });
    }
});
//All_Info_product
app.get('/getProductsData', async function (req, res) {
    try {
        con.query('SELECT * FROM Product ORDER BY CP_QUANTITY DESC', function (err, result) {
            if (err) {
                console.error('Ошибка при выполнении запроса к базе данных:', err);
                res.status(500).json({ success: false, message: 'Ошибка при выполнении запроса к базе данных' });
            } else {
                res.json(result); // Отправляем данные в формате JSON
            }
        });
    }
    catch (error) {
        return res.status(404).send("Маршрут не найден");
    }
});
//category_select
app.get('/categoryGroupFilter', async function (req, res) {
    try {
        const IC_GROUP0 = req.query.IC_GROUP0;
        const IC_GROUP1 = req.query.IC_GROUP1;
        const IC_GROUP2 = req.query.IC_GROUP2;

        // Выполняем SQL-запрос асинхронно
        let sqlSelect = "SELECT * FROM Product WHERE 1=1";
        const values = [];

        if (IC_GROUP0) {
            sqlSelect += " AND IC_GROUP0 = ?";
            values.push(IC_GROUP0);
        }
        if (IC_GROUP1) {
            sqlSelect += " AND IC_GROUP1 = ?";
            values.push(IC_GROUP1);
        }
        if (IC_GROUP2) {
            sqlSelect += " AND IC_GROUP2 = ?";
            values.push(IC_GROUP2);
        }

        const results = await new Promise((resolve, reject) => {
            con.query(sqlSelect, values, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        // Отправляем результаты SQL-запроса как JSON
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(results));
    } catch (error) {
        console.error('Ошибка при обращении к запросу:', error);
        res.status(500).json({ success: false, message: 'Ошибка при обращении к запросу' });
    }
});
app.get('/categoryGroup', async function (req, res) {
    con.query('SELECT DISTINCT IC_GROUP0, IC_GROUP1, IC_GROUP2 FROM Product WHERE 1=1', function (err, result) {
        if (err) {
            console.error('Ошибка при выполнении запроса к базе данных:', err);
            res.status(500).json({ success: false, message: 'Ошибка при выполнении запроса к базе данных' });
        } else {
            res.json(result); // Отправляем данные в формате JSON
        }
    });
});

app.get('/getSimilarProducts/:productId', async function (req, res) {
    try {
        const { productId } = req.params;
        // Получаем данные о товаре, для которого нужно найти аналоги
        const productQuery = `SELECT * FROM product WHERE productId = ?`;
        const [productData] = await con.promise().query(productQuery, [productId]);

        // Проверяем, найден ли товар с указанным productId
        if (productData.length === 0) {
            return res.status(404).send("Товар не найден");
        }

        // Получаем информацию о товаре для сравнения
        const { IC_GROUP0, IC_GROUP1, IC_GROUP2 } = productData[0];

        // Выполняем запрос в базу данных для поиска аналогичных товаров
        const similarProductsQuery = `
            SELECT * 
            FROM product 
            WHERE IC_GROUP0 = ? AND IC_GROUP1 = ? AND IC_GROUP2 = ? AND productId != ?
            LIMIT 5
        `;
        const [similarProductsData] = await con.promise().query(similarProductsQuery, [IC_GROUP0, IC_GROUP1, IC_GROUP2, productId]);

        // Отправляем найденные аналогичные товары клиенту
        res.json(similarProductsData);
    } catch (error) {
        console.error('Ошибка при получении аналогичных товаров:', error);
        return res.status(500).json({ success: false, message: 'Ошибка при получении аналогичных товаров' });
    }
});
app.get('/search', async function (req, res) {
    try {
        const searchText = req.query.text; // Получаем текст из строки запроса
        // Проверяем наличие текста для поиска
        if (!searchText) {
            return res.status(400).send("Текст для поиска не был предоставлен");
        }

        // Проверяем маршрут с базой данных, используя searchText
        const sqlQuery = `SELECT * FROM product WHERE IE_NAME LIKE '%${searchText}%'`;
        const [matchedRoutes] = await con.promise().query(sqlQuery);

        // Проверяем, были ли найдены совпадения
        if (!matchedRoutes || matchedRoutes.length === 0) {
            return res.status(404).send("Ничего не найдено");
        }

        // Возвращаем найденные результаты
        return res.sendFile(path.join(__dirname, 'src', 'category.html'));
    } catch (error) {
        console.error('Ошибка при обращении к запросу:', error);
        return res.status(500).json({ success: false, message: 'Ошибка при обращении к запросу' });
    }
});

app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        res.status(403).send('Ошибка CSRF: форма изменена');
    } else {
        console.error(err.stack);
        res.status(500).send('Что-то пошло не так на сервере');
    }
});

// app.post('/register_order',csrfProtection, function (req, res, next) {
//     const data = req.body;

//     request.post({
//         url: 'https://ecomtest.sberbank.ru/ecomm/gw/partner/api/v1/register.do',
//         json: data
//     }, function(error, response, body){
//         if (!error && response.statusCode == 200) {
//             res.json(body);
//         } else {
//             next(error); // Передаем ошибку в middleware для обработки
//         }
//     });
// });

// Создание SQL-запроса SELECT
// const sql = "SELECT first_name, email FROM users WHERE email = ? AND password = ? LIMIT 1";
// const values = [email, password];
// // Выполнение запроса SELECT
// con.query(sql, values, function (err, result) {
//     if (err) {
//         console.error("Ошибка при выполнении запроса:", err);
//         res.status(500).send('Произошла ошибка при обработке запроса');
//     } else {
//         console.log("Результат запроса SELECT:", result);
//         if (result.length > 0) {
//             console.log("User logined");
//             let response = {
//                 firstName: result[0].first_name,
//                 email: result[0].email
//             };
//             console.log(response)
//             // Возвращаем данные пользователя в формате JSON
//             res.status(200).json(response);
//         } else {
//             console.log("Invalid email or password");
//             res.status(401).send('Неправильный email или пароль');
//         }
//     }
// });

// Ручка для обработки отправки формы
// app.post('/send-email',csrfProtection, async (req, res) => {
//     try {
//         const { name, phone, email } = req.body;

//         // Создание транспортера Nodemailer
//         let transporter = nodemailer.createTransport({
//             host: 'smtp.mail.ru',
//             port: 465,
//             secure: true,
//             auth: {
//                 user: "Адрес",
//                 pass: 'Уникальный пароль от Mail'
//             }
//         });

//         // Опции письма
//         let mailOptions = {
//             from: 'Адрес', // От кого
//             to: `${email}`, // Кому
//             subject: 'Новое сообщение с формы', // Тема письма
//             text: `Имя: ${name}\nТелефон: ${phone}\nEmail: ${email}` // Текст письма
//         };

//         // Отправка письма
//         let info = await transporter.sendMail(mailOptions);
//         console.log('Email sent: ' + info.response);

//         res.status(200).send('Email sent successfully!');
//     } catch (error) {
//         console.error('Error sending email:', error);
//         res.status(500).send('An error occurred while sending the email.');
//     }
// });

