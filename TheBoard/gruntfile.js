module.exports = function(grunt) {    
    
    var config = {};
    try {
        config = require('./config.js');
    } catch(ex) { 
        config = { };     
    }
    config.name = config.name || '';
    config.testAccountId = config.testAccountId || 'TESTACCOUNTID';
    config.Api = config.api || '';
    config.src = config.src || 'empty';
    config.jshint = config.jshint || 'empty';
    
    var wireDepConfig = {
        run: {
            src: ['<%= manifest.self %>', '<%= manifest.html.index.result %>', '<%= manifest.html.test.result %>']
        }
    };
    var injectorConfig = {
        run: {
            options: { addRootSlash: false },
            files: {
                '<%= manifest.html.index.result %>': [
                    '<%= manifest.css %>',
                    '<%= manifest.harness.pre %>', 
                    '<%= config.src %>',
                    '<%= manifest.src %>',
                    '<%= manifest.harness.post %>',
                    '<%= manifest.harness.config.result %>'],
                '<%= manifest.html.test.result %>': [ 
                    'bower_components/angular-mocks/angular-mocks.js',
                    '<%= manifest.harness.pre %>', 
                    '<%= config.src %>',
                    '<%= manifest.src %>', 
                    '<%= manifest.tests %>']
            }
        }
    };
    var cleanConfig = {
        all: ['dist/', 'build/', '<%= manifest.html.test.result %>', '<%= manifest.html.index.result %>']
    };
    var copyConfig = {
        run: {
            files: [{
                src: '<%= manifest.html.test.template %>',
                dest: '<%= manifest.html.test.result %>'
            }, {
                src: '<%= manifest.html.index.template %>',
                dest: '<%= manifest.html.index.result %>'
            }]
        }
    };
    var jshintConfig = {
        options: {
            curly: true,
            eqeqeq: true,
            eqnull: true,
            browser: true,
            undef: true,
            unused: true,
            strict: true,
            maxcomplexity: 5,
            maxdepth: 3,
            esversion: 6,
            globals: {
                "beforeEach": true,
                "beforeAll": true,
                "spyOn": true,
                "it": true,
                "describe": true,
                "angular": true,
                "module": true,
                "OidcTokenManager": true,
                "expect": true,
                "inject": true,
                "apigPlatformClientFactory": true,
                "AWS": true,
                "jasmine": true,
                "require":true,
                "console":true
            },
            reporter: require('jshint-stylish')
        },
        all: ['<%= manifest.src %>', '<%= manifest.tests %>', '<%= config.jshint %>']
    };
    var bootlintConfig = {
        options: {
            relaxerror: {
                'E001': ['<%= manifest.html.templates %>'],
                'W001': ['<%= manifest.html.templates %>'],
                'W002': ['<%= manifest.html.templates %>'],
                'W003': ['<%= manifest.html.templates %>'],
                'W005': []
            }
        },
        files: ['<%= manifest.html.templates %>']
    };
    var ngAnnotateConfig = {
        options: {
            singleQuotes: true
        },
        package: {
            src: ['<%= config.src %>', '<%= manifest.src %>'],
            dest: 'build/ngAnnotate.js'
        }
    };
    var htmlminConfig = {
        package: {
            options: {
                removeComments: true,
                collapseWhitespace: true
            },
            files: [{
                expand: true,
                src: '<%= manifest.html.templates %>',
                dest: 'build/htmlmin/'
            }]
        }
    };
    var html2jsConfig = {
        package: {
            options: {
                base: './build/htmlmin/',
                module: '', //put your module
                singleModule: true,
                existingModule: true
            },
            src: ['build/htmlmin/**/*.html'],
            dest: 'build/templates.js'
        }
    };
    var stringReplaceConfig = {
        run: {
            files: {
                '<%= manifest.harness.config.result %>': '<%= manifest.harness.config.src %>'
            },
            options: {
                replacements: [{
                    pattern: '{{TESTACCOUNTID}}',
                    replacement: '<%= config.testAccountId %>'
                }, {
                    pattern: '{{API}}',
                    replacement: '<%= config.Api %>'
                }, {
                    pattern: '{{TOKENMANAGER.AUTHORITY}}',
                    replacement: '<%= config.tokenManager.authority %>'
                }, {
                    pattern: '{{TOKENMANAGER.CLIENTID}}',
                    replacement: '<%= config.tokenManager.clientId %>'
                }]
            }
        }
    };
    var concatConfig = {
        package: {
            src: [
                '<%= ngAnnotate.package.dest %>',
                '<%= html2js.package.dest %>'
            ],
            dest: 'build/concatOutput.js'
        }
    };
    var uglifyConfig = {
        package: {
            files: [{
                dest: 'dist/<%= config.name %>.min.js',
                src: '<%= concat.package.dest %>'
            }]
        }
    };
    var karmaConfig = {
        unit: {
            options: {
                reporters: ['progress'],
                files: [
                    '<%= manifest.bower %>',
                    'bower_components/angular-mocks/angular-mocks.js',
                    '<%= manifest.harness.pre %>',
                    '<%= config.src %>',
                    '<%= manifest.src %>',
                    '<%= manifest.tests %>'
                ],
                frameworks: ['jasmine'],
                browsers: ['PhantomJS'],
                singleRun: true
            }
        }
    };
    var fileAppendConfig = {
        default_options: {
            files: [{
                prepend: "/**574AA7B4-C992-4509-92A5-E7AD6804F6A2**/",
                input: 'dist/<%= config.name %>.min.js',
            }]
        }        
    };
    
    var watchConfig = {
        run: {
            files: [
                '<%= manifest.harness.pre %>',
                '<%= manifest.harness.post %>',
                '<%= manifest.html.index.template %>',
                '<%= manifest.html.test.template %>',
                '<%= manifest.html.templates %>',
                '<%= manifest.src %>',
                '<%= manifest.tests %>'              
            ],
            tasks: ['test'],
            options: {
                spawn: false,
                atBegin: true,
                reload: true
            }
        }
    };
    
    grunt.initConfig(grunt.util._.extend({
        wiredep: wireDepConfig,
        injector: injectorConfig,
        watch: watchConfig, 
        copy: copyConfig,
        jshint: jshintConfig,
        clean: cleanConfig,
        bootlint: bootlintConfig,
        ngAnnotate: ngAnnotateConfig,
        htmlmin: htmlminConfig,
        html2js: html2jsConfig,
        concat: concatConfig,
        uglify: uglifyConfig,
        karma: karmaConfig,
        file_append: fileAppendConfig,
        'string-replace': stringReplaceConfig
    }, { manifest: require('./manifest.js') }, { config: config }));
    
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-injector');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-bootlint');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-file-append');
    grunt.loadNpmTasks('grunt-string-replace');
    
    grunt.registerTask('html_create', [
        'copy:run', 
        'wiredep:run', 
        'injector:run'
    ]);
    grunt.registerTask('validate', [
       'jshint',
       'bootlint' 
    ]);
    grunt.registerTask('package_js', [
        'ngAnnotate:package',
        'htmlmin:package',
        'html2js:package',
        'concat:package',
        'uglify:package',
        'file_append'  
    ]);  
    grunt.registerTask('run', [
        'watch:run'
    ]);
    grunt.registerTask('package', [
        'test',        
        'package_js'
    ]);
    grunt.registerTask('test', [
        'clean',
        'validate',
        'string-replace:run',
        'html_create',
        'karma'
    ]);
};