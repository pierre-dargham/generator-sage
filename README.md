# generator-sage

A very simple [Yeoman](http://yeoman.io) generator for WordPress starter theme [sage](https://roots.io/sage).


## Getting Started

Install [Yeoman](http://yeoman.io)

```
npm install -g yo
```

Install generator-sage

```
npm install -g generator-sage
```

Create a folder in your WordPress themes folder and initiate the generator

```
mkdir theme-name && cd $_
yo sage
```

Answer some questions in the prompt and you're done!


## To do:

1. Handle bower.json, composer.json and package.json search & replace
2. Handle lang/sage.pot search & replace
2. Check that [roots-wrapper-override](https://roots.io/plugins/roots-wrapper-override/) doesn't use a namespace/variable/hook that we're  changing here
3. Ask for soil modules and update lib/setup.php
  - If GA soil module is active, ask for Google Analytics and update lib/setup.php
4. Choose the frontend framework (bootstrap should not be the only choice)
5. Allow options to be passed from command line (and prompt only for the missing ones)
6. Setup a web page/endpoint that returns an archive of generated theme, using one of the following methods:
   - html5 form UI
   - direct http POST requests (so we could get generated themes with a simple curL request in other scripts)
 