const { src, dest, series, watch } = require('gulp')
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer')
const pug = require('gulp-pug');
const concat = require('gulp-concat')
const htmlmin = require('gulp-htmlmin')
const cleanCSS = require('gulp-clean-css')
const svgSprite = require('gulp-svg-sprite')
const del = require('del')
const babel = require('gulp-babel')
const image = require('gulp-image')
const webpImages = require('gulp-webp')
const uglify = require('gulp-uglify-es').default;
const notify = require('gulp-notify')
const sourcemaps = require('gulp-sourcemaps')
const browserSync = require('browser-sync').create()

/* Projects paths */
const buildPath = 'build';
const devPath = 'dev';

/*
  DEV PIPES

  run developer: gulp dev
*/

const cleanDirDev = () => {
  return del(devPath)
}

const stylesDev = () => {
  // return src('src/scss/**/*.scss')
  return src('src/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(autoprefixer({cascade: false }))
    .pipe(sourcemaps.write())
    .pipe(dest(devPath + '/css'))
    .pipe(browserSync.stream())
}

const pugDev = () => {
  return src('src/*.pug')
    .pipe(pug({
      doctype: 'html'
    }))
    .pipe(dest(devPath + '/'))
    .pipe(browserSync.stream())
}

const scriptsDev = () => {
  return src(['src/js/**/*.js', 'src/js/scripts.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('scripts.js'))
    .pipe(sourcemaps.write())
    .pipe(dest(devPath + '/js'))
    .pipe(browserSync.stream())
}

const fontsDev = () => {
  return src('src/fonts/**/*.*')
    .pipe(dest(devPath + '/fonts'))
    .pipe(browserSync.stream())
}

const imagesDev = () => {
  return src([
    'src/img/**/*.svg'
  ])
    .pipe(image())
    .pipe(dest(devPath + '/img'))
    .pipe(browserSync.stream())
}

const svgSpritesDev = () => {
  return src('src/img/svg/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: 'sprite.svg'
        }
      }
    }))
    .pipe(dest(devPath + '/img'))
}

const images2webpDev = () => {
  return src([
    'src/img/**/*.jpg',
    'src/img/**/*.png',
    'src/img/**/*.gif'
  ])
    .pipe(webpImages())
    .pipe(dest(devPath + '/img'))
    .pipe(browserSync.stream())
}

/* copy files to the root directory */
const copyFilesDev = () => {
  return src([
    'src/*.jpg',
    'src/*.svg'
  ])
    .pipe(dest(devPath))
    .pipe(browserSync.stream())
}

const watchFilesDev = () => {
  browserSync.init({
    server: {
      baseDir: devPath
    }
  })
  watch('src/scss/**/*.scss', stylesDev)
  watch('src/**/*.pug', pugDev)
  watch('src/js/**/*.js', scriptsDev)
  watch('src/fonts/**/*.*', fontsDev)
  watch('src/img/**/*.*', imagesDev)
  watch('src/img/svg/*.svg', svgSpritesDev)
  watch('src/img/**/*.*', images2webpDev)
}

exports.cleanDirDev = cleanDirDev
exports.stylesDev = stylesDev
exports.pugDev = pugDev
exports.scriptsDev = scriptsDev
exports.fontsDev = fontsDev
exports.copyFilesDev = copyFilesDev
exports.svgSpritesDev = svgSpritesDev
exports.watchFilesDev = watchFilesDev
exports.dev = series(cleanDirDev, stylesDev, pugDev, scriptsDev, fontsDev, imagesDev, images2webpDev, copyFilesDev, svgSpritesDev, watchFilesDev)
exports.default = series(cleanDirDev, stylesDev, pugDev, scriptsDev, fontsDev, imagesDev, images2webpDev, copyFilesDev, svgSpritesDev, watchFilesDev)

/*
  BUILD PIPES

  run build: gulp build
*/

const cleanDirBuild = () => {
  return del(buildPath)
}

const stylesBuild = () => {
  return src('src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
      cascade: true
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(dest(buildPath + '/css'))
}

const pugBuild = () => {
  return src('src/*.pug')
    .pipe(pug({
      doctype: 'html'
    }))
    .pipe(dest(buildPath + '/'))
}

const scriptsBuild = () => {
  return src(['src/js/validate.js', 'src/js/**/*.js', 'src/js/scripts.js'])
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(concat('scripts.js'))
    .pipe(uglify({
      toplevel: true
    }).on('error', notify.onError()))
    .pipe(dest(buildPath + '/js'))
}

const fontsBuild = () => {
  return src('src/fonts/**/*.*')
    .pipe(dest(buildPath + '/fonts'))
}

const imagesBuild = () => {
  return src([
    'src/img/**/*.svg'
  ])
    .pipe(image())
    .pipe(dest(buildPath + '/img'))
}

const svgSpritesBuild = () => {
  return src('src/img/svg/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(dest(buildPath + '/img'))
}

const images2webpBuild = () => {
  return src([
    'src/img/**/*.jpg',
    'src/img/**/*.png',
    'src/img/**/*.gif'
  ])
    .pipe(webpImages())
    .pipe(dest(buildPath + '/img'))
}

const copyFilesBuild = () => {
  return src([
    'src/*.jpg',
    'src/*.svg'
  ])
    .pipe(dest(buildPath))
}

exports.cleanDirBuild = cleanDirBuild
exports.stylesBuild = stylesBuild
exports.pugBuild = pugBuild
exports.scriptsBuild = scriptsBuild
exports.fontsBuild = fontsBuild
exports.copyFilesBuild = copyFilesBuild
exports.svgSpritesBuild = svgSpritesBuild
exports.build = series(cleanDirBuild, stylesBuild, pugBuild, scriptsBuild, fontsBuild, imagesBuild, images2webpBuild, copyFilesBuild, svgSpritesBuild)


/*
run build by default: gulp


exports.default = series(cleanDirBuild, stylesBuild, pugBuild, scriptsBuild, fontsBuild, imagesBuild, images2webpBuild, copyFilesBuild, svgSpritesBuild)
*/
