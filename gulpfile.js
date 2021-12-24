const gulp = require("gulp");
const babel = require("gulp-babel");
// const browserSync = require("browser-sync").create();
const sass = require("gulp-sass")(require("sass"));
const minifyCSS = require("gulp-csso");
// const minifyImg = require('gulp-imagemin');
const minifyJS = require("gulp-uglify");
// const minifyHTML = require("gulp-htmlmin");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const del = require("del");

// gulp.task("browser-sync", () => {
//   browserSync.init({
//     server: {
//       baseDir: "dist",
//     },
//   });
// });

// Gulp ile css dosyalarını takip edip minify ediyoruz. Src içerisinde takip edilecek klasör mevcut.
// Diğer önemli nokta ise scss kullandığımız için bunu derleyecek gereklilikleri yüklemek ve dahil etmek.
gulp.task("css", () => {
  return gulp
    .src("src/scss/**/*.scss")
    .pipe(
      sass({
        outputStyle: "compressed",
      }).on("error", sass.logError)
    )
    .pipe(minifyCSS())
    .pipe(autoprefixer())
    .pipe(concat("app.min.css"))
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
});

// Gulp ile js dosyalarını takip edip minify ediyoruz. Src içerisinde takip edilecek klasör mevcut.
// Diğer önemli nokta ise JS5 üzeri versiyon kullandığımızda bunun her tarayıcının anlayacağı JS5 sürümüne dönüştürülmesi bunun içinde babel kullandık.
gulp.task("js", () => {
  return gulp
    .src("src/js/**/*.js")
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(concat("app.min.js"))
    .pipe(minifyJS())
    .pipe(gulp.dest("dist/js"))
    .pipe(browserSync.stream());
});

// Html dosyalarını istersek bu şekilde minify edebiliriz.

// gulp.task("html", () => {
//   return gulp
//     .src("src/**/*.html")
//     .pipe(
//       minifyHTML({
//         collapseWhitespace: true,
//         removeComments: true,
//       })
//     )
//     .pipe(gulp.dest("dist"))
//     .pipe(browserSync.stream());
// });

gulp.task("delete", () =>
  del(["dist/css", "dist/js", "dist/img", "dist/**/*.html"])
);

// Olası değişiklikleri anlık yakalayıp ekrana yazdırmak için watch kullanıyoruz.
gulp.task("watch", () => {
  gulp.watch("src/scss/**/*.scss", gulp.series("css"));
  gulp.watch("src/js/**/*.js", gulp.series("js"));
});

// Gulp için "default" fonksiyonu yazıyoruz. Böylece bizim yazdığımız sıra ile yukarıda tanımladığımız fonksiyonlar çalışacak.
// Çalıştırmak için package-json üzerinde bir atama yapmadığımdan varsayılan "Gulp" komutunu kullanabiliriz.
gulp.task(
  "default",
  gulp.series("delete", "css", "js", "watch",)
);
