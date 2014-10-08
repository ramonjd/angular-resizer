[angular-resizer](https://github.com/ramonjd/angular-resizer) 
===================

Angular module/service that listens to resize event and returns current breakpoint, orientation and whether the page has increased/decreased (and in which direction).

See app.js for usage examples.

Requires angular and jquery (installed via bower) and protractor for the e2e tests.

```
npm install -g grunt
npm install -g protractor
npm install
bower install

```

start webserver:

```
grunt
```

run protractor/selenium tests:

```
webdriver-manager start
protractor tests/conf.js
```

For help getting protractor up and running, see: https://github.com/angular/protractor/blob/master/docs/tutorial.md

Then open http://localhost:8888/index.html