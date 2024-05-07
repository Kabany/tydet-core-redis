# Documentation

TyDeT (Typescript Developer Tools) Core MySQL is a module to handle a connection with a Redis Database.

## Basic usage

```js
import { Context } from 'tydet-core';
import { RedisConnector } from 'tydet-core-redis';

// Add connector as Service
let app = new Context()
let redis = new RedisConnector({host: "myredis.com"})
await app.mountService("redis", redis)

// Execute queries
await redis.set("user1", "Luis")
let val1 = await redis.get("user1") // Luis

await redis.del("user1")

await redis.hSet("usr1", {name: "Luis", status: 1})
let val2 = await redis.hGet("usr1", "name") // {name: "Luis"}
let val3 = await redis.hGet("usr1") // {name: "Luis", status: 1}
```

## Configuration

The input arguments are required and will define the connection to the database:

```js
let redis = new RedisConnector({host: "myredis.com", user: "user", pass: "pass", port: 3306})
```

The only argument (`RedisParamsInterface`) required define the server `host`, `user` (optional), `pass` (optional) and `port` (optional) required to establish a connection with a Redis Database.

## Use

The only available methods in this module are:

### `set(key: string, value: string, options?: SetOptions): Promise<void>`

Store a simple value identified by the key.

* **key**: The identifier
* **value**: The value to store. It can only by a string or a number
* **options**: The Set Options for a redis query like the `EX` for expiration time as number in seconds, `NX` as a boolean flag to only set the value if it does not exist, etc.

### `get(key: string): Promise<string | number>`

Returns a simple value identified by the key.

* **key**: The identifier

### `del(key: string): Promise<void>`

Deletes a record in the instance

* **key**: The identifier

### `hSet(key: string, pairs: RedisPairValues): Promise<void>`

Store a set of values in a Redis hash identified by the key.

* **key**: The identifier
* **pairs**: An object with parmeters where the keys are the fields.

### `hGet(key: string, field: sting): Promise<any>`

It's a combination between HGET and HGETALL methods. It returns an object

* **key**: The identifier
* **field**: The field to gather. If it's is defined the return object will only include that field. If it's null, then the HGETALL method will be called.

### `hDel(key: string, field: sting): Promise<any>`

It's a combination between DEL and HDEL methods.

* **key**: The identifier
* **field**: The field to delete. If it's defined then only the field will be deleted. If it's null, then the DEL method will be called and all the fields and the key will be deleted.