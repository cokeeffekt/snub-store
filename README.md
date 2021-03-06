# snub-store

Snub simple synced key val storage

## Basics

Allow you to store strings, numbers, arrays and non complex object to a persistent store live and accessible on all instances.
Before anyone gets any brilliant ideas to use this for caching, know that all the values are kept in memory to maintain syncrhonous access.

`npm install snub`
`npm install snub-cron`

```javascript
const Snub = require('snub');
const SnubCron = require('snub-store');

const snub = new Snub();
const SnubCron = new SnubStore({
  namespace: 'string', //optional in case you have mutliple snub instances.
  onReady: fn(){}, // function that is called after first sync on instance boot
});

```

## Set a key store

```javascript
snub.store.someString = 'Thanks for all the fish';
snub.store.someNumber = 42;
snub.store.someObj = { hello: 'world' };
snub.store.someArray = [1, 2, 3, 4];
```

## Get a key store

```javascript
console.log(snub.store.someString);
// 'Thanks for all the fish'
```

## Delete a key store

```javascript
delete snub.store.someString;
```

## extra notes

you cant mutate nested structures on stores.
