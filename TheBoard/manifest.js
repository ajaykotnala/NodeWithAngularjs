module.exports = {
    self: 'manifest.js',
    src: ['controllers/**/*.js','data/**/*.js'],
    tests: ['src/**/*.spec.js'],
    harness: {
        // pre: 'harness/harness.pre.js',
        // post: 'harness/harness.post.js',
        // config: {
        //     src:'harness/harness.config.js',
        //     result: 'build/harness.config.js'
        // }
    },
        
    bower: [
        // bower:js
        
        // endbower
    ],
            
    css: [
        'bower_components/aveva.connect.web.core/dist/aveva.connect.web.core.min.css'
    ],

    html: {
        templates: 'src/**/*.html',
        views: '**/*.html',
        index: {
            template: '_index.html',
            result: 'index.html'
        },
        test: {
            template: '_test.html',
            result: 'test.html'
        }
    }
};