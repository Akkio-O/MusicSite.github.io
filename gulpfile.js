const cleanCSS = require('gulp-clean-css'); // минификация
const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass')(require('sass'));
const rename = require("gulp-rename");
const connect = require('gulp-connect');

// Static server
gulp.task('server', function () {
    connect.server({
        root: 'src',
        livereload: true,
        middleware: function (connect, opt) {
            return [
                (req, res, next) => {
                    if (!req.url.includes('.')) {
                        req.url = '/index.html';
                    }
                    return next();
                }
            ];
        }
    });
});

gulp.task('styles', async function () {
    const autoprefixer = (await import('gulp-autoprefixer')).default;

    return gulp.src("src/sass/**/*.+(scss|sass)")
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError)) // минификация (compressed -> expanded)
        .pipe(rename({
            prefix: "",
            suffix: ".min",
        }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS({ compatibility: 'ie8' })) // минификация CSS
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream());
});

gulp.task('watch', function () {
    gulp.watch("src/sass/**/*.+(scss|sass)", gulp.series('styles', 'reload'));
    gulp.watch("src/*.html").on("change", gulp.series('reload'));
});
gulp.task('reload', function () {
    return gulp.src('src/*.html')
        .pipe(connect.reload());
});

// fixing this
// gulp.task('webp', async function () {
//     const gulpWebp = (await import('gulp-webp')).default;

//     return gulp.src('src/img/**/*.png')
//         .pipe(gulpWebp())
//         .pipe(gulp.dest('src/img'));
// });
gulp.task('default', gulp.parallel('watch', 'server', 'styles'));

