'use strict';

var Observable = require('./fpxObservable');

describe('Observable', function () {

	var ob;

	beforeEach(function() {
		ob = new Observable();
	});

	it('should function with no listeners', function() {
		var res = ob.emit('testEvent');
		expect(res).to.be.instanceof(Array);
		expect(res.length).to.equal(0);
	});

	it('should handle events with no arguments', function(done) {
		ob.on('testEvent', function() {
			done();
		});
		ob.emit('testEvent');
	});

	it('should handle events with arguments', function(done) {
		ob.on('testEvent', function(arg1, arg2) {
			expect(arg1).to.equal('param1');
			expect(arg2).to.equal('param2');
			done();
		});
		ob.emit('testEvent', 'param1', 'param2');
	});

	it('should handle events with responses', function() {
		ob.on('testEvent', function() {
			return 'testResponse';
		})
		var res = ob.emit('testEvent');
		expect(res).to.be.instanceof(Array);
		expect(res.length).to.equal(1);
		expect(res[0]).to.equal('testResponse');
	});

	it('should handle multiple listeners', function() {
		ob.on('testEvent', function() {
			return 'testResponse1';
		});
		ob.on('testEvent', function() {
			return 'testResponse2';
		});
		var res = ob.emit('testEvent');
		expect(res).to.be.instanceof(Array);
		expect(res.length).to.equal(2);
		expect(res[0]).to.equal('testResponse1');
		expect(res[1]).to.equal('testResponse2');
	});

});