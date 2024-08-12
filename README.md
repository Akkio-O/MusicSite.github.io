# Music Site

Welcome to the Music Site project! This project showcases a music website that can be run both as a static site and with a server and database for full functionality.

## Live Demo

You can view the live demo of the project here: [Music Site](https://akkio-o.github.io/MusicSite.github.io/)

## Getting Started

To run the project locally with full functionality, including a server and database support, follow these steps:

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20.16.0 recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Akkio-O/MusicSite.github.io.git
   ```
2. **Navigate to the project directory:**
   ```cd MusicSite.github.io```
3. **Install the dependencies**:
   ```npm install```
   
### Running the Server
To run the server and connect to the database, use the following command: ```npm start```

This will run node server.cjs, starting the server and enabling full site functionality.

### Adding Products
Products can be added using .xlsx files. Examples and templates for these files are provided in the xlsx folder. Ensure the files are formatted correctly as per the examples to ensure successful product addition.

## Technologies Used

### Backend
- **Node.js**: JavaScript runtime for the backend server.
- **Express.js**: Web framework for building the server and handling routes.
- **mysql2**: Node.js connector for MySQL, used for database interactions.
- **bcrypt/bcryptjs**: Libraries for hashing passwords for secure storage.
- **cookie-parser**: Middleware to parse cookies for session handling.
- **express-session**: Session middleware for storing session data.
- **express-ws**: WebSocket extension for Express.js to handle real-time communication.
- **csrf/csurf**: Middleware for CSRF (Cross-Site Request Forgery) protection.
- **nodemailer**: Module to send emails from the server.
- **axios**: Promise-based HTTP client for making requests to external APIs.

### Frontend
- **Webpack**: Module bundler for compiling JavaScript, CSS, and assets.
- **HTMLWebpackPlugin**: Plugin for Webpack to simplify the creation of HTML files to serve your bundles.
- **SASS/CSS**: Styling preprocessor and CSS for designing the site.
- **jQuery**: JavaScript library for DOM manipulation and AJAX requests.

### Other Tools and Libraries
- **ejs**: Embedded JavaScript templating to generate HTML markup with plain JavaScript.
- **browser-sync**: Tool for testing and synchronizing browser testing across devices.
- **xlsx**: Library for parsing and writing Excel spreadsheets, used for product data management.
- **nodemailer-smtp-transport**: SMTP transport module for Nodemailer.

### Build Tools
- **gulp**: Task runner for automating development workflows.
- **gulp-sass**: Gulp plugin to compile SASS to CSS.
- **gulp-autoprefixer**: Adds vendor prefixes to CSS rules using values from "Can I Use".
- **gulp-clean-css**: Minifies CSS files to reduce file size.
- **gulp-rename**: Renames files with ease.
- **sass-loader**: Loads and compiles SASS/SCSS files.
- **style-loader**: Injects styles into the DOM.
- **css-loader**: Resolves CSS imports into JavaScript.
- **terser-webpack-plugin**: Plugin to minify JavaScript files with Terser.
- **css-minimizer-webpack-plugin**: Plugin to optimize and minimize CSS assets.

### WebSocket and Real-Time
- **ws**: WebSocket library for real-time communication.
