module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    compass: {
      dist: {
        options: {
          sassDir: '.build-tmp/sass',
          cssDir: '.build-tmp/css',
          environment: 'production'
        }
      },
      dev: {
        options: {
          sassDir: 'src/sass',
          cssDir: 'src/css'
        }
      }
    },
    clean: {
      dist: ['dist/'],
      temp: ['.build-tmp/']
    },
    copy: {

      // Copy files to temporary location
      temp: {
        expand: true,
        cwd: 'src/',
        src: ['**'],
        dest: '.build-tmp/'
      },

      // Copy files from temporary location to the final destination
      dist: {
        expand: true,
        cwd: '.build-tmp/',
        src: [
          '**',
          '!**/sass/**', // SASS source is not needed. Only CSS.
          '!**/templates/**', // Templates are bundled with RequireJS package

          '!*.html', // compress task copies these files
          '!**/js/**', // compress task copies these files
          '!**/css/**', // compress task copies these files
          // '!**/fonts/**', // compress task copies these files
          '!**/images/svg/**', // compress task copies these files
          '!**/images/icons/**' // compress task copies these files
        ],
        dest: 'dist/'
      }
    },
    watch: {
      css: {
        files: '**/*.scss',
        tasks: ['compass:dev']
      },
      configFiles: {
        files: [ 'Gruntfile.js' ],
        options: {
          reload: true
        }
      }
    },
    filerev: {
      options: {
        algorithm: 'md5',
        length: 8
      },
      images: {
        expand: true,
        src: '.build-tmp/images/**/*'
      },
      css: {
        src: ['.build-tmp/css/*']
      },
      js: {
        src: '.build-tmp/js/*'
      }
    },
    usemin: {
      html: '.build-tmp/*.html',
      css: '.build-tmp/css/style.css'
    },
    requirejs: {
      compile: {
        options: {
          mainConfigFile: ".build-tmp/js/app.js",
          out: ".build-tmp/js/app.js",
          include: "app",
          name: "almond",
          insertRequire: ['app/main']
        }
      }
    },
    replace: {
      requirejs: {
        src: ['.build-tmp/*.html'],
        overwrite: true,
        replacements: [{
          from: '<script data-main="js/app" src="vendor/require.js"></script>',
          to: '<script src="js/app.js"></script>'
        }]
      }
    },
    compress: {
      main: {
        options: {
          mode: 'gzip'
        },
        files: [
          {expand: true, cwd: '.build-tmp/', src: [
            '*.html',
            'js/*',
            'css/*',
            // 'fonts/**/*',
            'images/svg/*',
            'images/icons/*'
          ], dest: 'dist/'}
        ]
      }
    },
    aws: grunt.file.readJSON('aws-keys.json'),
    aws_s3: {
      options: {
        accessKeyId: '<%= aws.AWSAccessKeyId %>', // Use the variables
        secretAccessKey: '<%= aws.AWSSecretKey %>', // You can also use env variables
        uploadConcurrency: 5, // 5 simultaneous uploads
        downloadConcurrency: 5 // 5 simultaneous downloads
      },
      staging: {
        options: {
          bucket: 'www.sharetri.be',
          differential: false // Only uploads the files that have changed
        },
        files: [
          // Cleanup all old files. Because of differential: true, this deleted only
          // files that do not exists locally
          {cwd: 'dist/', dest: '/', action: 'delete'},

          // Upload files with cache

          {expand: true, cwd: 'dist/', src: ['js/*'], dest: '', params: {
            ContentEncoding: "gzip",
            CacheControl: 3600 * 24 * 365 + "" // One year
          }},
          {expand: true, cwd: 'dist/', src: ['css/*'], dest: '', params: {
            ContentEncoding: "gzip",
            CacheControl: 3600 * 24 * 365 + "" // One year
          }},
          {expand: true, cwd: 'dist/', src: ['images/svg/*', 'images/icons/*'], dest: '', params: {
            ContentEncoding: "gzip",
            CacheControl: 3600 * 24 * 365 + "" // One year
          }},
          {expand: true, cwd: 'dist/', src: ['images/*'], dest: '', params: {
            CacheControl: 3600 * 24 * 365 + "" // One year
          }},
          {expand: true, cwd: 'dist/', src: ['fonts/**/*'], dest: '', params: {
            ContentEncoding: "gzip"
          }},
          {expand: true, cwd: 'dist/', src: ['*.html'], dest: '', params: {
            ContentEncoding: "gzip"
          }},
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-debug-task');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-aws-s3');
  grunt.loadNpmTasks('grunt-contrib-compress');

  /**
    Task to build a distribution package. Outputs to `dist` directory.

    The main idea of the build is this:

    1. Copy all files from `src` to `.build-tmp`
    2. In the `.build-tmp` directory, do all the necessary minifications and revving
    3. Copy necessary files from `.build-tmp` to `dist`
  */
  grunt.registerTask('build', [
    'clean',
    'copy:temp',
    'requirejs:compile',
    'replace:requirejs',
    'compass:dist',
    'filerev',
    'usemin',
    'compress',
    'copy:dist'
  ]);

  grunt.registerTask('deploy', [
    'aws_s3'
  ]);
};
