'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var fs = require('fs');
var chalk = require('chalk');

var SageGenerator = module.exports = function SageGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(SageGenerator, yeoman.generators.Base);

SageGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log('Sage generator version 0.1.2');

  var prompts = [
  {
    name: 'themename',
    message: 'What is the name of your theme?',
    default: 'My Theme'
  },
  {
    name: 'themeuri',
    message: 'What is the URL of your theme?',
    default: 'https://roots.io/sage/'
  },
  {
    name: 'themedescription',
    message: 'Enter the theme description:',
    default: 'A starter theme based on sage'
  },
  {
    name: 'author',
    message: 'What is your name?',
    default: 'Roots'
  },
  {
    name: 'authoruri',
    message: 'What is your URL?',
    default: 'https://roots.io/'
  },
  {
    name: 'namespace',
    message: 'Enter the theme namespace:',
    default: 'Roots\\Sage'
  },
  {
    type: 'confirm',
    name: 'acf',
    message: 'Would you like to create an acf-json directory?',
    default: true
  },
  {
    type: 'list',
    name: 'framework',
    message: 'What Framework do you want to use?',
    choices: ['Bootstrap', 'Materialize CSS', 'None'],
    default: 'Bootstrap'
  }
  ];

  this.prompt(prompts, function (props) {
    this.themename = props.themename;
    this.themeuri = props.themeuri;
    this.author = props.author;
    this.authoruri = props.authoruri;
    this.themedescription = props.themedescription;
    this.namespace = props.namespace;
    this.acf = props.acf;
    this.framework = choseframework.call(this, props.framework);
    this.mainscss = fillmainscss.call(this, props.framework);
    cb();
  }.bind(this));
};

SageGenerator.prototype.installsage = function installsage() {
  this.startertheme = 'https://github.com/roots/sage/archive/8.5.0.tar.gz';
  this.log.info('Downloading & extracting ' + chalk.yellow('sage'));
  this.tarball(this.startertheme, '.', this.async());
};

function choseframework(framework) {
  switch (framework) {
    case 'Bootstrap':
      return "\"bootstrap\": \"git://github.com/twbs/bootstrap.git#v4.0.0-alpha.4\"";
    case 'Materialize CSS':
      return "\"materialize\": \"^0.97.8\"\n  },\n  \"overrides\": {\n    \"materialize\": {\n      \"main\": [\n        \"./dist/js/materialize.js\",\n        \"./sass/materialize.scss\",\n        \"./fonts/roboto/Roboto-Bold.eot\",\n        \"./fonts/roboto/Roboto-Bold.ttf\",\n        \"./fonts/roboto/Roboto-Bold.woff\",\n        \"./fonts/roboto/Roboto-Bold.woff2\",\n        \"./fonts/roboto/Roboto-Light.eot\",\n        \"./fonts/roboto/Roboto-Light.ttf\",\n        \"./fonts/roboto/Roboto-Light.woff\",\n        \"./fonts/roboto/Roboto-Light.woff2\",\n        \"./fonts/roboto/Roboto-Medium.eot\",\n        \"./fonts/roboto/Roboto-Medium.ttf\",\n        \"./fonts/roboto/Roboto-Medium.woff\",\n        \"./fonts/roboto/Roboto-Medium.woff2\",\n        \"./fonts/roboto/Roboto-Regular.eot\",\n        \"./fonts/roboto/Roboto-Regular.ttf\",\n        \"./fonts/roboto/Roboto-Regular.woff\",\n        \"./fonts/roboto/Roboto-Regular.woff2\",\n        \"./fonts/roboto/Roboto-Thin.eot\",\n        \"./fonts/roboto/Roboto-Thin.ttf\",\n        \"./fonts/roboto/Roboto-Thin.woff\",\n        \"./fonts/roboto/Roboto-Thin.woff2\"\n      ]\n    }";
    default:
      return " ";
  }
}

function fillmainscss(framework) {
  switch (framework) {
    case 'Bootstrap':
      return "@import \"common/variables\";\n\n// Automatically injected Bower dependencies via wiredep (never manually edit this block)\n// bower:scss\n@import \"../../bower_components/bootstrap/scss/bootstrap.scss\";\n// endbower\n\n@import \"common/global\";\n@import \"components/buttons\";\n@import \"components/comments\";\n@import \"components/forms\";\n@import \"components/grid\";\n@import \"components/wp-classes\";\n@import \"layouts/header\";\n@import \"layouts/sidebar\";\n@import \"layouts/footer\";\n@import \"layouts/pages\";\n@import \"layouts/posts\";\n@import \"layouts/tinymce\";";
    case 'Materialize CSS':
      return "$roboto-font-path: \"../fonts/\";\n\n// Automatically injected Bower dependencies via wiredep (never manually edit this block)\n// bower:scss\n@import \"../../bower_components/materialize/sass/materialize.scss\";\n// endbower\n\n";
    default:
      return " ";
  }
}

function findandreplace(dir) {
  var self = this;
  var _ = this._;

  var files = fs.readdirSync(dir);
  files.forEach(function (file) {
    file = path.join(dir, file);
    var stat = fs.statSync(file);

    if (stat.isFile() && (path.extname(file) == '.php' || path.extname(file) == '.css')) {
      self.log.info('Find and replace sage in ' + chalk.yellow(file));
      var data = fs.readFileSync(file, 'utf8');
      var result;
      result = data.replace(/Roots\\Sage/g, self.namespace);
      result = result.replace(/'sage'/g, "'" + _.slugify(self.themename) + "'");
      result = result.replace(/\$sage/g, "$" + _.underscored(_.slugify(self.themename)));
      result = result.replace(/Sage includes/g, self.themename + " includes");
      result = result.replace(/'sage\//g, "'" + _.slugify(self.themename) + "/");

      if (file == 'style.css') {
        result = result.replace(/sage/g, _.slugify(self.themename));
      }
      fs.writeFileSync(file, result, 'utf8');
    }
    else if (stat.isFile() && path.basename(file) == 'sage.pot') {
      self.log.info('Renaming language file ' + chalk.yellow(file));
      fs.renameSync(file, path.join(path.dirname(file), _.slugify(self.themename) + '.pot'));
    }
    else if (stat.isDirectory()) {
      findandreplace.call(self, file);
    }
  });
}

SageGenerator.prototype.removefiles = function removefiles() {
  this.log(chalk.yellow('Remove roots/sage project related files'));
  this.log(chalk.green(SageGenerator.prototype.props));
  fs.unlinkSync('CHANGELOG.md');
  fs.unlinkSync('LICENSE.md');
  fs.unlinkSync('README.md');
  fs.unlinkSync('style.css');
  fs.unlinkSync('.github/CONTRIBUTING.md');
  fs.unlinkSync('.github/ISSUE_TEMPLATE.md');
  fs.rmdirSync('.github');
  fs.unlinkSync('bower.json');
  fs.unlinkSync('assets/styles/main.scss');
};

SageGenerator.prototype.addfiles = function addfiles() {
  this.log(chalk.yellow('Copy style.css, bower.json and main.scss template'));
  this.copy('style.css', 'style.css');
  this.copy('bower.json', 'bower.json');
  this.copy('main.scss', 'assets/styles/main.scss');
};

SageGenerator.prototype.renamesage = function renamesage() {
  this.log('Replace string ' + chalk.yellow('sage'));
  findandreplace.call(this, '.');
  this.log.ok('Done replacing string ' + chalk.yellow('sage'));
};

SageGenerator.prototype.initacf = function initacf() {
  if (this.acf) {
    this.log(chalk.yellow('Create acf-json directory'));
    this.mkdir('acf-json');
    this.copy('_gitkeep', 'acf-json/.gitkeep');
  }
};
