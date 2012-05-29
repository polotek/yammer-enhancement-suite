window.addEventListener('beforeunload', clearLocalStorage);

var clearLocalStorage = function() {
  Object.keys(localStorage).forEach(function(key) {
    delete localStorage[key];
  });
};

var testOne = function(name, s) {
  assert.strictEqual(undefined, s.get(name));
  assert.ok(s.set(name, 'foo'));
  assert.strictEqual(localStorage.length, 1);
  assert.ok(s.has(name));
  assert.strictEqual(s.get(name), 'foo');
  assert.strictEqual(localStorage.length, 1);
  assert.strictEqual(s.del(name), 'foo');
  assert.strictEqual(s.has(name), false);
  assert.strictEqual(localStorage.length, 0);
  assert.strictEqual(localStorage.hasOwnProperty(name), false);
  assert.strictEqual(undefined, s.get(name));
};

var testFalsyVals = function(val, s) {
  assert.ok(val !== undefined && !(typeof val === 'number' && isNaN(val)));

  var len = localStorage.length;
  assert.strictEqual(localStorage.length, len);
  assert.strictEqual(s.get('baz'), undefined);
  s.set('baz', val);
  assert.strictEqual(s.get('baz'), val);
  assert.notStrictEqual(s.get('baz'), undefined);
  assert.strictEqual(localStorage.length, len + 1);
  s.del('baz');
  assert.strictEqual(s.get('baz'), undefined);
  assert.strictEqual(localStorage.length, len);

  s.set('baz', undefined);
  assert.strictEqual(s.get('baz'), undefined);
  assert.strictEqual(localStorage.length, len);

  s.set('baz', NaN);
  assert.strictEqual(s.get('baz'), undefined);
  assert.strictEqual(localStorage.length, len);
};

// Note, does not clear values
var testPrefix = function(prefix) {
  var s = new Storage(prefix);
  testOne('bar', s);
  s.set('bar', 'bar');
  assert.ok(s.has('bar'));

  var key = s.getKey('bar');
  if(prefix) {
    assert.ok(key.indexOf(prefix) === 0);
    assert.strictEqual(key, prefix + '::bar');
  }
  assert.strictEqual(localStorage[key], '"bar"');
  assert.strictEqual(s.get('bar'), 'bar');
  assert.strictEqual(s.del('bar'), 'bar');
  assert.strictEqual(s.get('bar'), undefined);

  testFalsyVals(null, s);
  testFalsyVals(0, s);
  testFalsyVals('', s);
};

var testCompoundKeys = function(s) {
  s.set('fizz', 'fizz');
  s.set(['fizz', 'buzz'], 'fizzbuzz');
  var obj = {
    data: 'test_name'
    , toString: function() { return this.data; }
  }
  s.set(['obj', obj, 'compound'], 'test object');

  assert.strictEqual(s.get('fizz'), 'fizz');
  assert.strictEqual(s.get('fizz', 'buzz'), 'fizzbuzz');
  assert.strictEqual(s.get('obj', obj, 'compound'), 'test object');
  assert.strictEqual(s.get(['obj', obj, 'compound']), 'test object');
  assert.strictEqual(s.get(['obj', obj, 'compound'].join('::')), 'test object');
};

var s, s2, obj, arr;

clearLocalStorage();
assert.equal(0, localStorage.length);
assert.deepEqual(Object.keys(localStorage), []);

s = new Storage();
testOne('foo', s);
testFalsyVals(null, s);
testFalsyVals(0, s);
testFalsyVals('', s);

testPrefix('prefix');
testPrefix(123);
testPrefix({});
testPrefix(null);
testPrefix();
testPrefix(NaN);

clearLocalStorage();

s = new Storage();
assert.throws(function() {
  testFalsyVals(undefined, s);
});
assert.throws(function() {
  testFalsyVals(NaN, s);
});

s = new Storage('prefix2');
assert.throws(function() {
  testFalsyVals(undefined, s);
});
assert.throws(function() {
  testFalsyVals(NaN, s);
});

s = new Storage('test');
s.set('val', 1);
s2 = new Storage('test');
s2.set('val', 'one');
assert.strictEqual(s.get('val'), 'one');

s2.set('val2', 2);
assert.ok(s.has('val2'));

clearLocalStorage();

s = new Storage();
s.set('one', 1);
s.set('two', 2);
s.set('three', 3);

assert.strictEqual(s.get('two', 2));
assert.strictEqual(localStorage.length, 3);

s2 = new Storage('test');
obj = { test: 'test' };
s2.set('obj', obj);
assert.strictEqual(s.get('two', 2));
assert.deepEqual(s2.get('obj'), obj);
assert.strictEqual(s2.get('obj').test, 'test');
assert.notStrictEqual(s2.get('obj'), obj);

arr = [1, 'two', { three: 3 }];
s2.set('arr', arr);
assert.strictEqual(s.get('two', 2));
assert.deepEqual(s2.get('obj'), obj);
assert.deepEqual(s2.get('arr'), arr);
assert.strictEqual(s2.get('arr')[2].three, 3);
assert.notStrictEqual(s2.get('arr'), arr);

assert.strictEqual(localStorage.length, 5);
testFalsyVals(null, s);
testFalsyVals(0, s);
testFalsyVals('', s);
testFalsyVals(null, s2);
testFalsyVals(0, s2);
testFalsyVals('', s2);

assert.strictEqual(s.get('two', 2));
assert.deepEqual(s2.get('obj'), obj);
assert.strictEqual(s2.get('obj').test, 'test');
assert.deepEqual(s2.get('arr'), arr);
assert.strictEqual(s2.get('arr')[2].three, 3);
assert.notStrictEqual(s2.get('arr'), arr);
assert.strictEqual(localStorage.length, 5);

clearLocalStorage();

s = new Storage();
s2 = new Storage('compound');
testCompoundKeys(s);
testCompoundKeys(s2);
