import { RedisConnector } from "../src/redis.service";
import { Context } from "tydet-core";

const DB_HOST = "192.168.68.119"

describe("Redis Service", () => {
  let app = new Context()
  let redis = new RedisConnector({host: DB_HOST})

  beforeAll(async () => {
    // prepare
    await app.mountService("redis", redis)
  })

  it("should return a pong", async () => {
    let value = await redis.ping()
    expect(value).toBe("PONG")
  })

  it("should write and read a simple value", async () => {
    await redis.set("test", "this is a test")
    let value = await redis.get("test")
    expect(value).toBe("this is a test")
  })

  it("should delete a simple value", async () => {
    let value = await redis.get("test")
    expect(value).toBe("this is a test")

    await redis.del("test")

    value = await redis.get("test")
    expect(value).toBeNull()
  })

  it("should write and read a hash value", async () => {
    await redis.hSet("htest", {field1: "val1", field2: "val2"})

    let v1 = await redis.hGet("htest", "field1") as any
    expect(Object.keys(v1).length).toBe(1)
    expect(v1.field1).toBe("val1")

    let v2 = await redis.hGet("htest")
    expect(Object.keys(v2).length).toBe(2)
    expect(v2.field1).toBe("val1")
    expect(v2.field2).toBe("val2")
  })

  it("should delete a simple value", async () => {
    let v1 = await redis.hGet("htest")
    expect(Object.keys(v1).length).toBe(2)
    expect(v1.field1).toBe("val1")
    expect(v1.field2).toBe("val2")

    await redis.hDel("htest", "field1")

    let v2 = await redis.hGet("htest")
    expect(Object.keys(v2).length).toBe(1)
    expect(v2.field1).toBeUndefined()
    expect(v2.field2).toBe("val2")
    
    await redis.hDel("htest")
    let v3 = await redis.hGet("htest")
    expect(Object.keys(v3).length).toBe(0)
  })

  afterAll(async () => {
    // close service
    await app.unmountServices()
  })
})