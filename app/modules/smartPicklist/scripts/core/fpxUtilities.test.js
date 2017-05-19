'use strict';

var utilities = require('./fpxUtilities');

describe('fpxUtilities', function () {

	describe('formatMessage', function() {
		it('should format with no params', function () {
			var result = utilities.formatMessage('my test string');
			expect(result).to.equal('my test string');
		});

		it('should format with 1 param', function () {
			var result = utilities.formatMessage('my {0} string', 'cool');
			expect(result).to.equal('my cool string');
		});

		it('should format with multiple params', function () {
			var result = utilities.formatMessage('{0} test {1}', 'my', '1');
			expect(result).to.equal('my test 1');
		});
	});

	describe('extend', function() {
		it('should extend single level object', function() {
			var object1 = {
				key1: 'value1',
				key2: 'value2'
			};
			var object2 = {
				key2: 'newValue',
				key3: 'value3'
			};
			var result = utilities.extend(object1, object2);
			expect(result === object1).to.be.true;
			expect(result.key1).to.equal('value1');
			expect(result.key2).to.equal('newValue');
			expect(result.key3).to.equal('value3');
		});

		it('should extend nested object', function() {
			var object1 = {
				key1: 'value1',
				key2: {
					key3: 'value3'
				},
				key4: {
					key5: 'value5'
				}
			};
			var object2 = {
				key2: {
					key3: 'newValue3',
					key6: 'value6'
				},
				key7: {
					key8: 'value8'
				}
			};
			var result = utilities.extend(object1, object2);
			expect(result === object1).to.be.true;
			expect(result.key1).to.equal('value1');
			expect(result.key2.key3).to.equal('newValue3');
			expect(result.key2.key6).to.equal('value6');
			expect(result.key7.key8).to.equal('value8');
		});

		it('should extend more than 1 object', function() {
			var object1 = {
				key1: 'value1',
				key2: 'value2'
			};
			var object2 = {
				key2: 'newValue',
				key3: 'value3'
			};
			var object3 = {
				key2: 'newNewValue',
				key4: 'value4'
			};
			var result = utilities.extend(object1, object2, object3);
			expect(result === object1).to.be.true;
			expect(result.key1).to.equal('value1');
			expect(result.key2).to.equal('newNewValue');
			expect(result.key3).to.equal('value3');
			expect(result.key4).to.equal('value4');
		});

		it('should replace arrays', function() {
			var object1 = {
				key1: [1, 2, 3]
			};
			var object2 = {
				key1: [4, 5, 6]
			};
			var result = utilities.extend(object1, object2);
			expect(result === object1).to.be.true;
			expect(result.key1).to.eql([4, 5, 6]);
		});
	});
});