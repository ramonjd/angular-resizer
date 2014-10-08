// spec.js
describe('angular resizer', function() {


    var breakpoint = element(by.css('.breakpoint')),
        orientation = element(by.css('.orientation')),
        direction = element(by.css('.direction'));

    browser.get('http://localhost:3000/index.html');

    
    it('should set the correct values for xs at 320, 480', function() {
        browser.manage().window().setSize(320, 480).then(function() {
            expect(breakpoint.getText()).toEqual('xs');
            expect(orientation.getText()).toEqual('landscape');
            expect(direction.getText()).toEqual('x: -1, y: -1');
        });
    });

    it('should set the correct values for sm at 600, 800', function() {
        browser.manage().window().setSize(600, 800).then(function() {
            expect(breakpoint.getText()).toEqual('sm');
            expect(orientation.getText()).toEqual('portrait');
            expect(direction.getText()).toEqual('x: 1, y: 1');
        });
    });


    it('should set the correct values for md at 800, 600', function() {
        browser.manage().window().setSize(800, 600).then(function() {
            expect(breakpoint.getText()).toEqual('md');
            expect(orientation.getText()).toEqual('landscape');
            expect(direction.getText()).toEqual('x: 1, y: -1');
        });
    });


    it('should set the correct values for lg at 1024, 768', function() {
        browser.manage().window().setSize(1024, 768).then(function() {
            expect(breakpoint.getText()).toEqual('lg');
            expect(orientation.getText()).toEqual('landscape');
            expect(direction.getText()).toEqual('x: 1, y: 1');
        });
    });


    it('should set the correct values for xl at 1280, 1024', function() {
        browser.manage().window().setSize(1280, 1024).then(function() {
            expect(breakpoint.getText()).toEqual('xl');
            expect(orientation.getText()).toEqual('landscape');
            expect(direction.getText()).toEqual('x: 1, y: 1');
        });
    });


    it('should set the correct values for sm at 480, 1024', function() {
        browser.manage().window().setSize(480, 1024).then(function() {
            expect(breakpoint.getText()).toEqual('sm');
            expect(orientation.getText()).toEqual('portrait');
            expect(direction.getText()).toEqual('x: -1, y: 0');
        });
    });

    it('should set the correct values for md at 768, 1024', function() {
        browser.manage().window().setSize(768, 1024).then(function() {
            expect(breakpoint.getText()).toEqual('md');
            expect(orientation.getText()).toEqual('portrait');
            expect(direction.getText()).toEqual('x: 1, y: 0');
        });
    });

});