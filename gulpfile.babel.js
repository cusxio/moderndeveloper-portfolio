import gulp from 'gulp';
import bs from 'browser-sync';
import del from 'del';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';

const $ = gulpLoadPlugins();
const PRODUCTION = process.env.NODE_ENV === 'production';

gulp.task('styles', () => {
    const BROWSERS = [
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ie >= 10',
        'ie_mob >= 10',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10',
    ];

    return gulp.src([
        'app/styles/**/*.css',
        'app/styles/**/*.sass',
    ])
    .pipe($.if(!PRODUCTION, $.newer('./tmp/styles')))
    .pipe($.sass({ precision: 10 }).on('error', $.sass.logError))
    .pipe($.autoprefixer(BROWSERS))
    .pipe($.if(!PRODUCTION, gulp.dest('.tmp/styles')))
    .pipe($.if(PRODUCTION, $.cssnano()))
    .pipe($.if(PRODUCTION, $.size({ title: 'Styles' })))
    .pipe($.if(PRODUCTION, gulp.dest('dist/styles')))
    .pipe(bs.stream({ match: '**/*.css' }));
});

gulp.task('scripts', () => {
    gulp.src([
        'app/scripts/main.js',
    ])
    .pipe($.if(!PRODUCTION, $.newer('./tmp/scripts')))
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe($.if(!PRODUCTION, gulp.dest('.tmp/scripts')))
    .pipe($.if(PRODUCTION, $.concat('main.min.js')))
    .pipe($.if(PRODUCTION, $.uglify()))
    .pipe($.if(PRODUCTION, $.size({ title: 'Scripts' })))
    .pipe($.if(PRODUCTION, $.sourcemaps.write('.')))
    .pipe($.if(PRODUCTION, gulp.dest('dist/scripts')));
});

gulp.task('development', ['scripts', 'styles'], () => {
    bs.init({
        server: ['.tmp', 'app'],
        port: 8080,
        logPrefix: 'MD',
        notify: false,
    });

    gulp.watch(['app/**/*.html'], bs.reload);
    gulp.watch(['app/styles/**/*.{sass,scss,css}'], ['styles']);
    gulp.watch(['app/scripts/**/*.js'], ['scripts', bs.reload]);
    gulp.watch(['app/images/**/*'], bs.reload);
});

gulp.task('html', () => {
    return gulp.src('app/**/*.html')
        .pipe($.useref({ noAssets: true }))
        .pipe($.if('*.html', $.htmlmin({
            removeAttributeQuotes: true,
            removeComments: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            removeOptionalTags: true,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
        })))
        .pipe($.if('*.html', $.size({ title: 'HTML', showFiles: true })))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', () => {
    del(['dist/*', '.tmp'], { dot: true });
});

gulp.task('copy', () => {
    return gulp.src([
        'app/*',
        '!app/*.sass',
        '!app/*.html',
    ], {
        dot: true,
    })
    .pipe(gulp.dest('dist'))
    .pipe($.size({ title: 'Copy' }));
});

gulp.task('build', ['clean'], (cb) => {
    runSequence(
        'styles',
        ['html', 'scripts', 'copy'],
        cb
    );
});

gulp.task('deploy', [], () => {
    return $.surge({
        project: './dist',
        domain: 'md-portfolio.surge.sh',
    });
});
