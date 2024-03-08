const express = require('express');
const datacon = require('../datacon');
const xlsx = require('xlsx');
const path = require('path');
const request = require('request');
const mysql = require('mysql2');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 8080;

// Middleware для обработки данных формы
app.use(express.urlencoded({ extended: true }));
// Middleware для обработки ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Что-то пошло не так на сервере');
});

const con = mysql.createConnection({
    host: datacon.host,
    user: datacon.user,
    password: datacon.password,
    database: datacon.database
});

con.query("CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, first_name VARCHAR(255), last_name VARCHAR(255), phone VARCHAR(255), email VARCHAR(255), password VARCHAR(255))", function (err, result) {
    if (err) {
        console.error("Ошибка при создании таблицы:", err);
    } else {
        console.log("Таблица users создана");
    }
});

app.post('/reg', function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phone = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;

    const checkEmailQuery = "SELECT id FROM users WHERE email = ?";
    const checkEmailValues = [email];
    // Выполнение запроса SELECT для проверки уникальности email
    con.query(checkEmailQuery, checkEmailValues, function (err, result) {
        if (err) {
            console.error("Ошибка при выполнении запроса:", err);
            res.status(500).send('Произошла ошибка при обработке запроса');
        } else {
            if (result.length > 0) {
                console.log("Email already registered");
                res.status(400).send('Email уже зарегистрирован');
            } else {
                // Создание SQL-запроса INSERT
                const sql = "INSERT INTO users (first_name, last_name, phone, email, password) VALUES (?, ?, ?, ?, ?)";
                const values = [firstName, lastName, phone, email, password];
                // Выполнение запроса INSERT
                con.query(sql, values, function (err, result) {
                    if (err) {
                        console.error("Ошибка при выполнении запроса:", err);
                        res.status(500).send('Произошла ошибка при обработке запроса');
                    } else {
                        console.log("User registered");
                        res.status(200).send('Регистрация прошла успешно');
                    }
                });
            }
        }
    });
});
app.post('/login', function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const sql = "SELECT first_name, email FROM users WHERE email = ? AND password = ? LIMIT 1";
    const values = [email, password];
    con.query(sql, values, function (err, result) {
        if (err) {
            console.error("Ошибка при выполнении запроса:", err);
            res.status(500).send('Произошла ошибка при обработке запроса');
        } else {
            console.log("Результат запроса SELECT:", result);
            if (result.length > 0) {
                console.log("User logined");
                let response = {
                    firstName: result[0].first_name,
                    email: result[0].email
                };
                console.log(response)
                res.status(200).json(response);
            } else {
                console.log("Invalid email or password");
                res.status(401).send('Неправильный email или пароль');
            }
        }
    });
});

// product_items
con.query("CREATE TABLE IF NOT EXISTS Product (id INT AUTO_INCREMENT PRIMARY KEY, IE_XML_ID VARCHAR(255), IE_NAME VARCHAR(255), IE_PREVIEW_TEXT VARCHAR(2000), IE_DETAIL_PICTURE VARCHAR(255), CP_QUANTITY VARCHAR(255), IP_PROP114 VARCHAR(255), IP_PROP96 VARCHAR(255), IP_PROP110 VARCHAR(255), IC_GROUP0 VARCHAR(255), IC_GROUP1 VARCHAR(255), IC_GROUP2 VARCHAR(255), CV_PRICE_13 VARCHAR(255), CV_CURRENCY_13 VARCHAR(255))", function(err, result) {
    if (err) {
      console.error("Ошибка при создании таблицы:", err);
    } else {
      console.log("Таблица Product создана");
    }
  });

app.post('/fileExcel', function(req, res){
    const filePath = path.join(__dirname, 'src', 'xlsx', 'product.xlsx');
    const ProductData = xlsx.readFile(filePath);
    ProductData.SheetNames.forEach(function(sheetName) {
        const worksheet = ProductData.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
        data.forEach(function(row) {
            const insertSql = "INSERT INTO Product (IE_XML_ID, IE_NAME, IE_PREVIEW_TEXT, IE_DETAIL_PICTURE, CP_QUANTITY, IP_PROP114, IP_PROP96, IP_PROP110, IC_GROUP0, IC_GROUP1, IC_GROUP2, CV_PRICE_13, CV_CURRENCY_13) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            connection.query(insertSql, row, function (err, result) {
                if (err) {
                    console.error('Ошибка при выполнении запроса к базе данных:', err);
                    return;
                }
                console.log('Данные успешно добавлены в базу данных');
            });
        });
    });
});

// app.post('/register_order', function (req, res, next) {
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
// app.post('/send-email', async (req, res) => {
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

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});