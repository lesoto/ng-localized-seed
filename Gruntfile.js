'use strict';

var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({
    port: LIVERELOAD_PORT
});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);
    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-html-snapshot');
    grunt.loadNpmTasks('grunt-angular-gettext');
    grunt.loadNpmTasks('grunt-json2po');

    var yeomanConfig = {
        dist: 'dist'
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        requirejs: {
            dist: {
                // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    baseUrl: yeomanConfig.app + '/js',
                    optimize: 'none',
                    mainConfigFile: '<%= yeoman.app %>/js/app.js',
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: true,
                    dir: 'dist'
                }
            }
        },

        nggettext_extract: {
            pot: {
                files: {
                    'app/data/translations.pot': ['app/views/*.html', 'app/views/users/*.html', 'app/views/worldcup/*.html']
                }
            },
        },
        json2po: {
            options: {
                format: 'json',
                original: 'en',
                path: 'LCCC',
                filename: 'locale.po'
            },
            files: {
                'app/i18n': ['app/data/translations.pot']
            },
        },
        nggettext_compile: {
            all: {
                files: {
                    'src/js/translations.js': ['po/*.po']
                }
            },
        },
        htmlSnapshot: {
            all: {
                options: {
                    //that's the path where the snapshots should be placed
                    //it's empty by default which means they will go into the directory
                    //where your Gruntfile.js is placed
                    snapshotPath: 'snapshots/',
                    //This should be either the base path to your index.html file
                    //or your base URL. Currently the task does not use it's own
                    //webserver. So if your site needs a webserver to be fully
                    //functional configure it here.
                    sitePath: 'http://localhost:5000/#/',
                    //you can choose a prefix for your snapshots
                    //by default it's 'snapshot_'
                    fileNamePrefix: 'sp_',
                    //by default the task waits 500ms before fetching the html.
                    //this is to give the page enough time to to assemble itself.
                    //if your page needs more time, tweak here.
                    msWaitForPages: 1000,
                    //sanitize function to be used for filenames. Converts '#!/' to '_' as default
                    //has a filename argument, must have a return that is a sanitized string
                    sanitize: function (requestUri) {
                        //returns 'index.html' if the url is '/', otherwise a prefix
                        if (/\/$/.test(requestUri)) {
                            return 'index.html';
                        } else {
                            return requestUri.replace(/\//g, 'prefix-');
                        }
                    },
                    //if you would rather not keep the script tags in the html snapshots
                    //set `removeScripts` to true. It's false by default
                    removeScripts: true,
                    //set `removeLinkTags` to true. It's false by default
                    removeLinkTags: true,
                    //set `removeMetaTags` to true. It's false by default
                    removeMetaTags: true,
                    //Replace arbitrary parts of the html
                    replaceStrings: [
                        {
                            'this': 'will get replaced by this'
                        },
                        {
                            '/old/path/': '/new/path'
                        }
                    ],
                    // allow to add a custom attribute to the body
                    bodyAttr: 'data-prerendered',
                    //here goes the list of all urls that should be fetched
                    urls: ['', '#!/en-gb/showcase'],
                    // a list of cookies to be put into the phantomjs cookies jar for the visited page
                    cookies: [
                        {
                            "path": "/",
                            "domain": "localhost",
                            "name": "lang",
                            "value": "en-gb"
                        }
                    ]
                }
            }
        },

        yeoman: yeomanConfig,

        watch: {
            coffee: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.coffee'],
                tasks: ['coffee:dist']
            },
            coffeeTest: {
                files: ['test/spec/{,*/}*.coffee'],
                tasks: ['coffee:test']
            },

            js: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
                tasks: ['newer:jshint:all'],
                options: {
                    livereload: true
                }
            },
            jsTest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['newer:jshint:test', 'karma']
            },
            compass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:server', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: ['<%= yeoman.app %>/{,*/}*.html', '.tmp/styles/{,*/}*.css', '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}']
            }
        },
        autoshot: {
            dist: {
                options: {
                    path: './dist/screenshots',
                    remote: {
                        files: [
                            {
                                src: 'http://localhost:5000 %>',
                                dest: 'app.jpg',
                                delay: "3000"
                            }
                        ]
                    },
                    viewport: ['320x480', '480x320', '384x640', '640x384', '602x963', '963x602', '600x960', '960x600', '800x1280', '1280x800', '768x1024', '1024x768']
                }
            }
        },
        responsive_images: {
            dev: {
                options: {
                    sizes: [
                        {
                            width: 320,
                        },
                        {
                            width: 640
                        },
                        {
                            width: 1024
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '{,*/}*.{png,jpg,jpeg}',
                        dest: '<%= yeoman.dist %>/images'
                    }
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [lrSnippet, mountFolder(connect, '.tmp'), mountFolder(connect, yeomanConfig.app)];
                    }
                }
            },
            test: {
                options: {
                    middleware: function (connect) {
                        return [mountFolder(connect, '.tmp'), mountFolder(connect, 'test')];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [mountFolder(connect, yeomanConfig.dist)];
                    }
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: ['public/js/**/*.js', '!public/js/libs/**/*.js', '!<%= yeoman.app %>/scripts/vendor/*', 'test/spec/{,*/}*.js'
                // 'Gruntfile.js',
                // '<%= yeoman.app %>/scripts/{,*/}*.js'
            ],
            test: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: ['test/spec/{,*/}*.js']
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            },
            nexus4: {
                path: 'http://www.browserstack.com/start#os=android&os_version=4.2&device=LG+Nexus+4&speed=1&start=true&url=http://rnikitin.github.io/examples/jumbotron/'
            },
            nexus7: {
                path: 'http://www.browserstack.com/start#os=android&os_version=4.1&device=Google+Nexus+7&speed=1&start=true&url=http://rnikitin.github.io/examples/jumbotron/'
            },
            iphone5: {
                path: 'http://www.browserstack.com/start#os=ios&os_version=6.0&device=iPhone+5&speed=1&start=true&url=http://rnikitin.github.io/examples/jumbotron/'
            }

        },
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: ['.tmp', '<%= yeoman.dist %>/*', '!<%= yeoman.dist %>/.git*']
                    }
                ]
            },
            server: '.tmp'
        },
        browser_sync: {
            dev: {
                bsFiles: {
                    src: '<%= yeoman.app %>/styles/style.css'
                },
                options: {
                    watchTask: false,
                    debugInfo: true,
                    // Change to 0.0.0.0 to access externally
                    host: 'http://localhost:<%= connect.options.port %>',
                    server: {
                        baseDir: '<%= yeoman.app %>'
                    },
                    ghostMode: {
                        clicks: true,
                        scroll: true,
                        links: true,
                        forms: true
                    }
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/styles/',
                        src: '{,*/}*.css',
                        dest: '.tmp/styles/'
                    }
                ]
            }
        },

        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/styles',
                cssDir: '.tmp/styles',
                generatedImagesDir: '.tmp/images/generated',
                imagesDir: '<%= yeoman.app %>/images',
                javascriptsDir: '<%= yeoman.app %>/scripts',
                fontsDir: '<%= yeoman.app %>/styles/fonts',
                importPath: '<%= yeoman.app %>/lib',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/styles/fonts',
                relativeAssets: false,
                assetCacheBuster: false,
                raw: 'Sass::Script::Number.precision = 10\n'
            },
            dist: {
                options: {
                    generatedImagesDir: '<%= yeoman.dist %>/images/generated'
                }
            },
            server: {
                options: {
                    debugInfo: true
                }
            }
        },

        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: ['<%= yeoman.dist %>/scripts/{,*/}*.js', '<%= yeoman.dist %>/styles/{,*/}*.css', '<%= yeoman.dist %>/images/{,*/}*.{gif,jpeg,jpg,png,webp}', '<%= yeoman.dist %>/styles/fonts/{,*/}*.*']
                }
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            options: {
                dest: '<%= yeoman.dist %>'
            },
            html: '<%= yeoman.app %>/index.html'
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            options: {
                assetsDirs: ['<%= yeoman.dist %>']
            },
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css']
        },

        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '{,*/}*.{gif,jpeg,jpg,png}',
                        dest: '<%= yeoman.dist %>/images'
                    }
                ]
            }
        },
        svgmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '{,*/}*.svg',
                        dest: '<%= yeoman.dist %>/images'
                    }
                ]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: '{,*/}*.html',
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },

        // ngmin tries to make the code safe for minification automatically by
        // using the Angular long form for dependency injection. It doesn't work on
        // things like resolve or inject so those have to be done manually.
        ngmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/concat/scripts',
                        src: '*.js',
                        dest: '.tmp/concat/scripts'
                    }
                ]
            }
        },

        // Replace Google CDN references
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html']
            }
        },
        // Generates a custom Modernizr build that includes only the tests you
        // reference in your app
        modernizr: {
            devFile: '<%= yeoman.app %>/lib/modernizr/modernizr.js',
            outputFile: '<%= yeoman.dist %>/lib/modernizr/modernizr.js',
            files: ['<%= yeoman.dist %>/scripts/{,*/}*.js', '<%= yeoman.dist %>/styles/{,*/}*.css', '!<%= yeoman.dist %>/scripts/vendor/*'],
            uglify: true
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: ['*.{ico,png,txt}', '.htaccess', '*.html', 'views/{,*/}*.html', 'images/{,*/}*.{webp}', 'fonts/*']
                    },
                    {
                        expand: true,
                        cwd: '.tmp/images',
                        dest: '<%= yeoman.dist %>/images',
                        src: ['generated/*']
                    }
                ]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: ['compass:server'],
            test: ['compass'],
            //dist: [/*'compass:dist',*/ 'imagemin', 'svgmin']
        },

        // Test settings
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        }
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run(['clean:server', 
            //'concurrent:server',
            'autoprefixer', 'connect:livereload', 'watch']);

        //var server = require('./server/start.js');
        //server.use(require('connect-livereload')({
        //port: 35729
        //}));
    });

    grunt.registerTask('server', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve:' + target]);
    });

    grunt.registerTask('test', ['clean:server', 'concurrent:test', 'autoprefixer', 'connect:test',
        //'karma',
        'jshint']);

    grunt.registerTask('build', ['clean:dist', 'useminPrepare', 'nggettext_extract', 'json2po', 'concurrent:dist', 'autoprefixer', 'ngmin', 'copy:dist', 'cdnify', 'rev', 'usemin', 'htmlmin', 'requirejs', 'requirejs:dist' /* 'autoshot', 'cssmin', 'concat', 'modernizr', 'responsive_images:dev', 'htmlSnapshot', 'uglify', */   ]);

    grunt.registerTask('default', ['newer:jshint', 'test', 'build']);

    grunt.registerTask('screenshots', ['clean:server', 'concurrent:server', 'connect:livereload', 'autoshot']);

    grunt.registerTask('travis', 'lint');

};
