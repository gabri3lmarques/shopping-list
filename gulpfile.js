const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

// Compilar SASS para CSS e minificar
gulp.task('styles', function() {
    return gulp.src('src/css/styles.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'));
});

// Concatenar e minificar JS
gulp.task('scripts', function() {
    return gulp.src('src/js/*.js')
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/js'));
});

// Tarefa de observação
gulp.task('watch', function() {
    gulp.watch('src/css/*.scss', gulp.series('styles'));
    gulp.watch('src/js/*.js', gulp.series('scripts'));
});

// Tarefa padrão
gulp.task('default', gulp.series('styles', 'scripts', 'watch'));
