"use strict";

/*global describe:true, it:true*/

var chai = require('chai');
var expect = chai.expect;
var Dependencies = require('../index.js');

describe('VengeanceDependencies', function(){
    it('should give an ordered list of dependencies', () => {
        var deps = new Dependencies();
        deps.add('test', {});
        expect(deps.getOrder()).to.deep.equal(['test']);
    });
    
    it('should sort dependencies alphabetically', () => {
        var deps = new Dependencies();
        deps.add('test', {});
        deps.add('b', {});
        deps.add('a', {});
        expect(deps.getOrder()).to.deep.equal(['a', 'b', 'test']);
    });
    
    it('should sort based on sub dependencies', () => {
        var deps = new Dependencies();
        deps.add('test', {});
        deps.add('b', {});
        deps.add('a', { 'b':{} });
        expect(deps.getOrder()).to.deep.equal(['b', 'a', 'test']);
    });
    
    it('should add in sub dependencies', () => {
        var deps = new Dependencies();
        deps.add('test', {});
        deps.add('a', { 'b':{} });
        expect(deps.getOrder()).to.deep.equal(['b', 'a', 'test']);
    });
    
    it('should handle dependencies used multiple times', () => {
        var deps = new Dependencies();
        deps.add('test3', { test2:{}, test:{} });
        deps.add('test2', { test:{} });
        deps.add('test', {});
        expect(deps.getOrder()).to.deep.equal(['test', 'test2', 'test3']);
    });
    
    it('should catch a circular dependency', () => {
        var deps = new Dependencies();
        deps.add('test1', { test2:{} });
        deps.add('test2', { test1:{} });
        expect(() => {
            deps.getOrder();
        }).to.throw('Circular dependency! [test1]');
    });
    
    it('should catch a deep circular dependency', () => {
        var deps = new Dependencies();
        deps.add('test1', { test4:{} });
        deps.add('test2', { test1:{} });
        deps.add('test3', { test2:{} });
        deps.add('test4', { test3:{} });
        expect(() => {
            deps.getOrder();
        }).to.throw('Circular dependency! [test1]');
    });
});