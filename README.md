# @johanblumenberg/ts-mockito

Fork of [ts-mockito](https://github.com/NagRock/ts-mockito), which will be kept until the following PRs are accepted, or similar functionality is added to ts-mockito:
 - [Adding support for mocking interfaces](https://github.com/NagRock/ts-mockito/pull/76)
 - [Adding support for verify(...).timeout(ms)](https://github.com/NagRock/ts-mockito/pull/97)
 - [Matcher types](https://github.com/NagRock/ts-mockito/pull/139)
 - [Mock free functions](https://github.com/NagRock/ts-mockito/pull/140)
 - [Add defer() for testing deferred promise resolution](https://github.com/NagRock/ts-mockito/pull/141)
 - [Add warning when forgetting to call instance()](https://github.com/johanblumenberg/ts-mockito/commit/e2b52a77324136d8b6a8aabf51eec8babaca221b)
 - [Support enumerating properties on mocks](https://github.com/johanblumenberg/ts-mockito/commit/67195b7317014b6da27b97869efaeb6305d739da)
 - [Adding `nextTick()`](https://github.com/johanblumenberg/ts-mockito/pull/2)
 - [Better types on `anyFunction()` and `thenCall()`](https://github.com/johanblumenberg/ts-mockito/pull/3)
 - [Better call verification error messages](https://github.com/johanblumenberg/ts-mockito/pull/4)
 - Mocking of constructors
 - Make `.thenResolve()` work for `PromiseLike<T>`
 - [Make spying on an object prototype work](https://github.com/johanblumenberg/ts-mockito/commit/5171b536ba52d3e5d34479965fb95880bff0df4b)
 - Type safe `objectContaining()`
 - [Date matchers](https://github.com/johanblumenberg/ts-mockito/commit/15d35ac7490469d529ccc3665bf09606660c918d)
 - [Numberic matchers](https://github.com/johanblumenberg/ts-mockito/commit/32f4f7acab81be7912f676b8cfc8efca26a06937)

### 1.0.36
 - [Recursive matching](https://github.com/johanblumenberg/ts-mockito#recursive-matching) ([commit](https://github.com/johanblumenberg/ts-mockito/commit/0dc7eccd0f1c8216a3cceeb4061958d76aa3ce4b))
 - [_ as an alias for `anything()`](https://github.com/johanblumenberg/ts-mockito#_-as-an-alias-for-anything) ([commit](https://github.com/johanblumenberg/ts-mockito/commit/b858e72b5c9dc19709497aae635edc3bae3421ae))

### 1.0.37
 - [Reset stubs](https://github.com/johanblumenberg/ts-mockito#resetting-mock-stubs) ([commit](https://github.com/johanblumenberg/ts-mockito/commit/430e566d901f6627a740baa3224fa77a97fd403c))

## Installation

`npm install @johanblumenberg/ts-mockito --save-dev`

## Added functionality in this fork

### Verify with timeout

This feature is useful when testing asynchronous functionality.
You do some action and expect the result to arrive as an asynchronous
function call to one of your mocks.

```typescript
let mockedFoo:Foo = mock(Foo);
await verify(mockedFoo.getBar(3)).timeout(1000);
```

### Mocking interfaces

Mocking interfaxces works just the same as mocking classes, except you
must use the `imock()` function to create the mock.

```typescript
let mockedFoo:Foo = imock(); // Foo is a typescript interface
when(mockedFoo.getBar(5)).thenReturn('five');
```

It also works for properties.

```typescript
let mockedFoo:Foo = imock(MockPropertyPolicy.StubAsProperty);
when(mockedFoo.bar).thenReturn('five');
```

For interface mocks, you can set the defauklt behviour for mocked properties that
have no expectations set. They can behave eiter as a property, returning null, or
as a function, returning a function that returns null, or throw an exception.

```typescript
let mockedFoo1:Foo = imock(MockPropertyPolicy.Throw);
instance(mockedFoo1).bar; // This throws an exception, because there is no expectation set on the bar property

let mockedFoo2:Foo = imock(MockPropertyPolicy.Throw);
when(mockedFoo2.bar).thenReturn('five');
instance(mockedFoo2).bar; // Now this returns 'five', and no exception is thrown, because there is an expectation set on the bar property

let mockedFoo3:Foo = imock(MockPropertyPolicy.StubAsProperty);
instance(mockedFoo3).bar; // This returns null, because no expectation is set

let mockedFoo4:Foo = imock(MockPropertyPolicy.StubAsMethod);
instance(mockedFoo4).getBar(5); // This returns null, because no expectation is set
```

### Mocking free functions

Sometimes you need to mock a function, not an object, for example to pass as a callback somewhere. This can be done using `fnmock()`. It works just like any other mock, except it's a function, not an object.

```typescript
let fn: (a: number, b: string) => number = fnmock();
when(fn(10, 'hello')).thenReturn(5);

instance(fn)(10, 'hello'); // returns 5
verify(fn(10, 'hello')).called();
```

### Mocking constructors

Sometimes you need to mock a constructor, and control creation of new objects.

```typescript
let mockedFooCtor: new () => Foo = cmock();
let mockedFoo:Foo = imock();
when(new mockedFooCtor()).thenReturn(instance(mockedFoo));

const result = new (instance(mockedFooCtor))();

verify(new mockedFooCtor()).called();
expect(result).toBe(instance(mockedFoo));
```

### Defer resolving promises

The actions `.thenResolve()` and `.thenReject()` are returning promises that are already resolved or rejected. Sometimes you want to control the order or timing of when promises are resolved. In that case it is useful to return a deferred promise, and resolve it from the test code, when appropriate.

```typescript
let d = defer<number>();
when(obj.method()).thenReturn(d); // Return a promise that is not resolved yet

d.resolve(1); // Later, the promise is resolved or rejected
```


### Mock `React` props with `enzyme`

It's possible to mock props for react components when testing using enzyme.

```typescript
let props: Props = imock(MockPropertyPolicy.StubAsProperty);
when(props.text).thenReturn('OK');
when(props.onClick()).thenReturn();

let c = mount(<MyButton {...instance(props)}>);
```

### Recursive matching

``` typescript
// Creating mock
let mockedFoo:Foo = mock(Foo);

// Getting instance from mock
let foo:Foo = instance(mockedFoo);

// Using instance in source code
foo.getBar({name: "John Doe"});
foo.getBar({name: "John Smith"});

// Explicit, readable verification
verify(mockedFoo.getBar(objectContaining({name: startsWith("John")}))).twice();
```

### `_` as an alias for `anything()`

``` typescript
// Creating mock
let mockedFoo:Foo = mock(Foo);

// Getting instance from mock
let foo:Foo = instance(mockedFoo);

// Using instance in source code
foo.getBar(3);

// Using anything() is identical to using _
verify(mockedFoo.getBar(anything())).called();
verify(mockedFoo.getBar(_)).called();
```

## Usage

### Basics
``` typescript
// Creating mock
let mockedFoo:Foo = mock(Foo);

// Getting instance from mock
let foo:Foo = instance(mockedFoo);

// Using instance in source code
foo.getBar(3);
foo.getBar(5);

// Explicit, readable verification
verify(mockedFoo.getBar(3)).called();
verify(mockedFoo.getBar(5)).called();
```

### Stubbing method calls

``` typescript
// Creating mock
let mockedFoo:Foo = mock(Foo);

// stub method before execution
when(mockedFoo.getBar(3)).thenReturn('three');

// Getting instance
let foo:Foo = instance(mockedFoo);

// prints three
console.log(foo.getBar(3));

// prints null, because "getBar(999)" was not stubbed
console.log(foo.getBar(999));
```

### Stubbing getter value

``` typescript
// Creating mock
let mockedFoo:Foo = mock(Foo);

// stub getter before execution
when(mockedFoo.sampleGetter).thenReturn('three');

// Getting instance
let foo:Foo = instance(mockedFoo);

// prints three
console.log(foo.sampleGetter);
```

### Stubbing property values that have no getters

Syntax is the same as with getter values.

Please note, that stubbing properties that don't have getters only works if [Proxy](http://www.ecma-international.org/ecma-262/6.0/#sec-proxy-objects) object is available (ES6).

### Call count verification

``` typescript
// Creating mock
let mockedFoo:Foo = mock(Foo);

// Getting instance
let foo:Foo = instance(mockedFoo);

// Some calls
foo.getBar(1);
foo.getBar(2);
foo.getBar(2);
foo.getBar(3);

// Call count verification
verify(mockedFoo.getBar(1)).once();               // was called with arg === 1 only once
verify(mockedFoo.getBar(2)).twice();              // was called with arg === 2 exactly two times
verify(mockedFoo.getBar(between(2, 3))).thrice(); // was called with arg beween 2-3 exactly three times
verify(mockedFoo.getBar(anyNumber()).times(4);     // was called with any number arg exactly four times
verify(mockedFoo.getBar(2)).atLeast(2);           // was called with arg === 2 min two times
verify(mockedFoo.getBar(1)).atMost(1);           // was called with arg === 1 max one time
verify(mockedFoo.getBar(4)).never();              // was never called with arg === 4
```

### Call order verification

``` typescript
// Creating mock
let mockedFoo:Foo = mock(Foo);
let mockedBar:Bar = mock(Bar);

// Getting instance
let foo:Foo = instance(mockedFoo);
let bar:Bar = instance(mockedBar);

// Some calls
foo.getBar(1);
bar.getFoo(2);

// Call order verification
verify(mockedFoo.getBar(1)).calledBefore(mockedBar.getFoo(2));    // foo.getBar(1) has been called before bar.getFoo(2)
verify(mockedBar.getFoo(2)).calledAfter(mockedFoo.getBar(1));    // bar.getFoo(2) has been called before foo.getBar(1)
verify(mockedFoo.getBar(1)).calledBefore(mockedBar.getFoo(999999));    // throws error (mockedBar.getFoo(999999) has never been called)
```

### Throwing errors

``` typescript
let mockedFoo:Foo = mock(Foo);

when(mockedFoo.getBar(10)).thenThrow(new Error('fatal error'));

let foo:Foo = instance(mockedFoo);
try {
    foo.getBar(10);
} catch (error:Error) {
    console.log(error.message); // 'fatal error'
}
```

### Custom function

You can also stub method with your own implementation

``` typescript
let mockedFoo:Foo = mock(Foo);
let foo:Foo = instance(mockedFoo);

when(mockedFoo.sumTwoNumbers(anyNumber(), anyNumber())).thenCall((arg1:number, arg2:number) => {
    return arg1 * arg2; 
});

// prints '50' because we've changed sum method implementation to multiply!
console.log(foo.sumTwoNumbers(5, 10));
```

### Resolving / rejecting promises

You can also stub method to resolve / reject promise

``` typescript
let mockedFoo:Foo = mock(Foo);

when(mockedFoo.fetchData("a")).thenResolve({id: "a", value: "Hello world"});
when(mockedFoo.fetchData("b")).thenReject(new Error("b does not exist"));
```

### Resetting mock calls

You can reset just mock call counter

``` typescript
// Creating mock
let mockedFoo:Foo = mock(Foo);

// Getting instance
let foo:Foo = instance(mockedFoo);

// Some calls
foo.getBar(1);
foo.getBar(1);
verify(mockedFoo.getBar(1)).twice();      // getBar with arg "1" has been called twice

// Reset mock
resetCalls(mockedFoo);

// Call count verification
verify(mockedFoo.getBar(1)).never();      // has never been called after reset
```

### Resetting mock stubs

Or reset mock call counter with all stubs

``` typescript
// Creating mock
let mockedFoo:Foo = mock(Foo);
when(mockedFoo.getBar(1)).thenReturn("one").

// Getting instance
let foo:Foo = instance(mockedFoo);

// Some calls
console.log(foo.getBar(1));               // "one" - as defined in stub
console.log(foo.getBar(1));               // "one" - as defined in stub
verify(mockedFoo.getBar(1)).twice();      // getBar with arg "1" has been called twice

// Reset mock
resetStubs(mockedFoo);

console.log(foo.getBar(1));               // null - previously added stub has been removed
```

### Resetting mocks

Resetting a mock will reset both call count and stub calls. For a spy it will also reset the original object, removing the spy.

``` typescript
// Creating mock
let mockedFoo:Foo = mock(Foo);
when(mockedFoo.getBar(1)).thenReturn("one").

// Getting instance
let foo:Foo = instance(mockedFoo);

// Some calls
console.log(foo.getBar(1));               // "one" - as defined in stub
console.log(foo.getBar(1));               // "one" - as defined in stub
verify(mockedFoo.getBar(1)).twice();      // getBar with arg "1" has been called twice

// Reset mock
resetStubs(mockedFoo);

// Call count verification
verify(mockedFoo.getBar(1)).never();      // has never been called after reset
console.log(foo.getBar(1));               // null - previously added stub has been removed
```

### Capturing method arguments

``` typescript
let mockedFoo:Foo = mock(Foo);
let foo:Foo = instance(mockedFoo);

// Call method
foo.sumTwoNumbers(1, 2);

// Check first arg captor values
const [firstArg, secondArg] = capture(mockedFoo.sumTwoNumbers).last();
console.log(firstArg);    // prints 1
console.log(secondArg);    // prints 2
```

You can also get other calls using `first()`, `second()`, `byCallIndex(3)` and more...

### Recording multiple behaviors

You can set multiple returning values for same matching values

``` typescript
const mockedFoo:Foo = mock(Foo);

when(mockedFoo.getBar(anyNumber())).thenReturn('one').thenReturn('two').thenReturn('three');

const foo:Foo = instance(mockedFoo);

console.log(foo.getBar(1));	// one
console.log(foo.getBar(1));	// two
console.log(foo.getBar(1));	// three
console.log(foo.getBar(1));	// three - last defined behavior will be repeated infinitely
```

Another example with specific values

``` typescript
let mockedFoo:Foo = mock(Foo);

when(mockedFoo.getBar(1)).thenReturn('one').thenReturn('another one');
when(mockedFoo.getBar(2)).thenReturn('two');

let foo:Foo = instance(mockedFoo);

console.log(foo.getBar(1));	// one
console.log(foo.getBar(2));	// two
console.log(foo.getBar(1));	// another one
console.log(foo.getBar(1));	// another one - this is last defined behavior for arg '1' so it will be repeated
console.log(foo.getBar(2));	// two
console.log(foo.getBar(2));	// two - this is last defined behavior for arg '2' so it will be repeated
```

Short notation:

``` typescript
const mockedFoo:Foo = mock(Foo);

// You can specify return values as multiple thenReturn args
when(mockedFoo.getBar(anyNumber())).thenReturn('one', 'two', 'three');

const foo:Foo = instance(mockedFoo);

console.log(foo.getBar(1));	// one
console.log(foo.getBar(1));	// two
console.log(foo.getBar(1));	// three
console.log(foo.getBar(1));	// three - last defined behavior will be repeated infinity
```

Possible errors:

``` typescript
const mockedFoo:Foo = mock(Foo);

// When multiple matchers, matches same result:
when(mockedFoo.getBar(anyNumber())).thenReturn('one');
when(mockedFoo.getBar(3)).thenReturn('one');

const foo:Foo = instance(mockedFoo);
foo.getBar(3); // MultipleMatchersMatchSameStubError will be thrown, two matchers match same method call

```

### Mocking types

You can mock abstract classes

``` typescript
const mockedFoo: SampleAbstractClass = mock(SampleAbstractClass);
const foo: SampleAbstractClass = instance(mockedFoo);
```

You can also mock generic classes, but note that generic type is just needed by mock type definition

``` typescript
const mockedFoo: SampleGeneric<SampleInterface> = mock(SampleGeneric);
const foo: SampleGeneric<SampleInterface> = instance(mockedFoo);

```

### Spying on real objects

You can partially mock an existing instance:

``` typescript
const foo: Foo = new Foo();
const spiedFoo = spy(foo);

when(spiedFoo.getBar(3)).thenReturn('one');

console.log(foo.getBar(3)); // 'one'
console.log(foo.getBaz()); // call to a real method
```

You can spy on plain objects too:

``` typescript
const foo = { bar: () => 42 };
const spiedFoo = spy(foo);

foo.bar();

console.log(capture(spiedFoo.bar).last()); // [42] 
```

### Thanks

* Szczepan Faber (https://www.linkedin.com/in/szczepiq) 
* Sebastian Konkol (https://www.linkedin.com/in/sebastiankonkol) 
* Clickmeeting (http://clickmeeting.com)
* Michał Stocki (https://github.com/michalstocki)
* Łukasz Bendykowski (https://github.com/viman)
* Andrey Ermakov (https://github.com/dreef3)
* Markus Ende (https://github.com/Markus-Ende)
* Thomas Hilzendegen (https://github.com/thomashilzendegen)
* Johan Blumenberg (https://github.com/johanblumenberg)
* Lorens León (https://github.com/leon19)
