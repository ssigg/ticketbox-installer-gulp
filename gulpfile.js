const gulp = require('gulp');
const download = require('gulp-download');
const decompress = require('gulp-decompress');
const tokenReplace = require('gulp-token-replace');
const rename = require('gulp-rename');
const exec = require('child_process').exec;
var zip = require('gulp-zip');

const branchName = 'master';

gulp.task('download-server', function() {
    return download(`https://github.com/ssigg/ticketbox-server-php/archive/${branchName}.zip`)
        .pipe(gulp.dest('./temp/archives/ticketbox-server-php/'));
});

gulp.task('download-client', function() {
    return download(`https://github.com/ssigg/ticketbox-client-angularjs/archive/${branchName}.zip`)
        .pipe(gulp.dest('./temp/archives/ticketbox-client-angularjs/'));
});

gulp.task('unzip-server', function() {
    return gulp.src(`./temp/archives/ticketbox-server-php/${branchName}.zip`)
        .pipe(decompress())
        .pipe(gulp.dest('./temp/src'));
});

gulp.task('unzip-client', function() {
    return gulp.src(`./temp/archives/ticketbox-client-angularjs/${branchName}.zip`)
        .pipe(decompress())
        .pipe(gulp.dest('./temp/src'));
});

gulp.task('create-dist-server', function() {
    return gulp.src('*.*', { read: false, dot: true })
        .pipe(gulp.dest(`./temp/src/ticketbox-server-php-${branchName}/dist`));
});

gulp.task('create-dist-client', function() {
    return gulp.src('*.*', { read: false })
        .pipe(gulp.dest(`./temp/src/ticketbox-client-angularjs-${branchName}/dist`));
});

gulp.task('build-server', function(callback) {
    exec(`cd ./temp/src/ticketbox-server-php-${branchName}/ ; npm run build`, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        callback(err);
    });
});

gulp.task('build-client', function(callback) {
    exec(`cd ./temp/src/ticketbox-client-angularjs-${branchName}/ ; npm run build`, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        callback(err);
    });
});

gulp.task('copy-server', function() {
    const paths = [
        `./temp/src/ticketbox-server-php-${branchName}/dist/**`,
        `!./temp/src/ticketbox-server-php-${branchName}/dist/admin`,
        `!./temp/src/ticketbox-server-php-${branchName}/dist/admin/**/*`,
        `!./temp/src/ticketbox-server-php-${branchName}/dist/boxoffice`,
        `!./temp/src/ticketbox-server-php-${branchName}/dist/boxoffice/**/*`,
        `!./temp/src/ticketbox-server-php-${branchName}/dist/customer`,
        `!./temp/src/ticketbox-server-php-${branchName}/dist/customer/**/*`,
        `!./temp/src/ticketbox-server-php-${branchName}/dist/*.zip`
    ];
    return gulp.src(paths, { dot: true })
        .pipe(gulp.dest('./dist'));
});

gulp.task('copy-admin', function(done) {
    const config = require('./config.json');
    const serverPaths = [
        `./temp/src/ticketbox-server-php-${branchName}/dist/admin/**`,
        `!./temp/src/ticketbox-server-php-${branchName}/dist/admin/api/config_sample/**`
    ];
    const clientPaths = [
        `./temp/src/ticketbox-client-angularjs-${branchName}/dist/admin/**`,
        `!./temp/src/ticketbox-client-angularjs-${branchName}/dist/admin/config_sample.js`
    ];

    const tasks = [
        () => gulp.src(serverPaths, { dot: true })
            .pipe(gulp.dest('./dist/admin')),
        () => gulp.src(clientPaths, { dot: true })
            .pipe(gulp.dest('./dist/admin')),
        () => gulp.src(['./templates/admin/server.json'])
            .pipe(tokenReplace({global:config.core}, { preserveUnknownTokens: true }))
            .pipe(rename('config.json'))
            .pipe(gulp.dest('./dist/admin/api/config/')),
        () => gulp.src(['./templates/admin/client.js'])
            .pipe(tokenReplace({tokens: config.core, preserveUnknownTokens: true }))
            .pipe(rename('config.js'))
            .pipe(gulp.dest('./dist/admin/'))
    ];

    return gulp.series(...tasks, (seriesDone) => {
        seriesDone();
        done();
    })();
});

gulp.task('copy-boxoffices', function(done) {
    const config = require('./config.json');
    const serverPaths = [
        `./temp/src/ticketbox-server-php-${branchName}/dist/boxoffice/**`,
        `!./temp/src/ticketbox-server-php-${branchName}/dist/boxoffice/api/config_sample/**`
    ];
    const clientPaths = [
        `./temp/src/ticketbox-client-angularjs-${branchName}/dist/boxoffice/**`,
        `!./temp/src/ticketbox-client-angularjs-${branchName}/dist/boxoffice/config_sample.js`
    ];

    const tasks = config.boxoffices.map(boxoffice => {
        return (boxofficeDone) => {
            const boxofficeTasks = [
                () => gulp.src(serverPaths, { dot: true })
                    .pipe(gulp.dest(`./dist/${boxoffice.directoryName}`)),
                () => gulp.src(clientPaths, { dot: true })
                    .pipe(gulp.dest(`./dist/${boxoffice.directoryName}`)),
                () => gulp.src(['./templates/boxoffice/server.json'])
                    .pipe(tokenReplace({tokens: config.core, preserveUnknownTokens: true }))
                    .pipe(tokenReplace({tokens: boxoffice, preserveUnknownTokens: true }))
                    .pipe(rename('config.json'))
                    .pipe(gulp.dest(`./dist/${boxoffice.directoryName}/api/config/`)),
                () => gulp.src(['./templates/boxoffice/client.js'])
                    .pipe(tokenReplace({tokens: config.core, preserveUnknownTokens: true }))
                    .pipe(tokenReplace({tokens: boxoffice, preserveUnknownTokens: true }))
                    .pipe(rename('config.js'))
                    .pipe(gulp.dest(`./dist/${boxoffice.directoryName}/`))
            ];

            return gulp.series(...boxofficeTasks, (seriesDone) => {
                seriesDone();
                boxofficeDone();
            })();
        };
    });

    return gulp.parallel(...tasks, (parallelDone) => {
        parallelDone();
        done();
    })();
});

gulp.task('copy-customers', function(done) {
    const config = require('./config.json');
    const serverPaths = [
        `./temp/src/ticketbox-server-php-${branchName}/dist/customer/**`,
        `!./temp/src/ticketbox-server-php-${branchName}/dist/customer/api/config_sample/**`
    ];
    const clientPaths = [
        `./temp/src/ticketbox-client-angularjs-${branchName}/dist/customer/**`,
        `!./temp/src/ticketbox-client-angularjs-${branchName}/dist/customer/config_sample.js`
    ];

    const tasks = config.customers.map(customer => {
        return (customerDone) => {
            const customerTasks = [
                () => gulp.src(serverPaths, { dot: true })
                    .pipe(gulp.dest(`./dist/${customer.directoryName}`)),
                () => gulp.src(clientPaths, { dot: true })
                    .pipe(gulp.dest(`./dist/${customer.directoryName}`)),
                () => gulp.src(['./templates/customer/server.json'])
                    .pipe(tokenReplace({tokens: config.core, preserveUnknownTokens: true }))
                    .pipe(tokenReplace({tokens: customer, preserveUnknownTokens: true }))
                    .pipe(rename('config.json'))
                    .pipe(gulp.dest(`./dist/${customer.directoryName}/api/config/`)),
                () => gulp.src(['./templates/customer/client.js'])
                    .pipe(tokenReplace({tokens: config.core, preserveUnknownTokens: true }))
                    .pipe(tokenReplace({tokens: customer, preserveUnknownTokens: true }))
                    .pipe(rename('config.js'))
                    .pipe(gulp.dest(`./dist/${customer.directoryName}/`))
            ];

            return gulp.series(...customerTasks, (seriesDone) => {
                seriesDone();
                customerDone();
            })();
        };
    });

    return gulp.parallel(...tasks, (parallelDone) => {
        parallelDone();
        done();
    })();
});

gulp.task('zip', function() {
    return gulp.src('./dist/**', { dot: true })
        .pipe(zip('ticketbox.zip'))
        .pipe(gulp.dest('./'));
});

gulp.task('default',
    gulp.series(
        gulp.parallel(
            gulp.series(
                'download-server',
                'unzip-server',
                'create-dist-server',
                'build-server'
            ),
            gulp.series(
                'download-client',
                'unzip-client',
                'create-dist-client',
                'build-client'
            )
        ),
        'copy-server',
        gulp.parallel('copy-admin', 'copy-boxoffices', 'copy-customers'),
        'zip'
    )
);