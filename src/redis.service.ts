import { createClient, RedisClientType, SetOptions } from "redis"
import { Context, Service } from "tydet-core"
import { RedisCoreError } from "./redis.error"

export interface RedisPairValues {
  [fields:string]: string | number
}

interface RedisParamsInterface {
  host?: string
  port?: number
  user?: string
  pass?: string
}

const DB_HOST = "DB_HOST";
const DB_PORT = "DB_PORT";
const DB_USER = "DB_USER";
const DB_PASS = "DB_PASS";

export type RedisConnectionCallback = (host: string, port: number, service: RedisConnector, context: Context) => void

export class RedisConnector extends Service {
  connection: RedisClientType

  onConnected: RedisConnectionCallback
  onDisconnected: RedisConnectionCallback

  constructor(params: RedisParamsInterface) {
    let map = new Map()
    map.set(DB_HOST, params.host || "localhost");
    map.set(DB_PORT, params.port || 6379);
    map.set(DB_USER, params.user || "");
    map.set(DB_PASS, params.pass || "");
    super(map);
  }

  async connect() {
    try {
      if (this.connection != null) {
        await this.connection.connect()
      }
    } catch(err) {
      throw new RedisCoreError(err instanceof Error ? err.toString() : `${err}`)
    }
  }

  async disconnect() {
    try {
      if (this.connection != null) {
        await this.connection.disconnect()
      }
    } catch(err) {
      throw new RedisCoreError(err instanceof Error ? err.toString() : `${err}`)
    }
  }

  override async beforeMount(context: Context) {
    let errors: any = {}
    if (!this.params.has(DB_HOST)) {
      errors.dbHost = "Not defined";
    }
    if (!this.params.has(DB_PORT)) {
      errors.dbPort = "Not defined";
    }

    if (Object.keys(errors).length > 0) {
      let msg = "Error with configuration parameters:\n";
      for (let key of Object.keys(errors)) {
        msg += `${key}: ${errors[key]}\n`;
      }
      throw new RedisCoreError(msg);
    }

    let user = this.params.get(DB_USER)
    let pass = this.params.get(DB_PASS)
    let cred = user != null || pass != null ? "" : `${user}:${pass}@`
    this.connection = await createClient({
      url: `redis://${cred}${this.params.get(DB_HOST)}:${this.params.get(DB_PORT)}`
    })

    await super.beforeMount(context)
  }

  override async onMount() {
    await this.connect()
    await super.onMount()
  }

  override async afterMount() {
    if (this.onConnected) this.onConnected(this.params.get(DB_HOST), this.params.get(DB_PORT) as number, this, this.context)
    await super.afterMount()
  }

  override async beforeReset() {
    await this.disconnect()
    if (this.onDisconnected) this.onDisconnected(this.params.get(DB_HOST), this.params.get(DB_PORT) as number, this, this.context)
    await super.beforeReset()
  }

  override async onReset() {
    let user = this.params.get(DB_USER)
    let pass = this.params.get(DB_PASS)
    let cred = user != null || pass != null ? "" : `${user}:${pass}@`
    this.connection = await createClient({
      url: `redis://${cred}${this.params.get(DB_HOST)}:${this.params.get(DB_PORT)}`
    })
    await this.connect()
    await super.onReset()
  }

  override async afterReset() {
    if (this.onConnected) this.onConnected(this.params.get(DB_HOST), this.params.get(DB_PORT) as number, this, this.context)
    await super.afterReset()
  }

  override async onEject() {
    await this.disconnect()
    await super.onEject()
  }

  override async afterEject() {
    if (this.onDisconnected) this.onDisconnected(this.params.get(DB_HOST), this.params.get(DB_PORT) as number, this, this.context)
    await super.afterEject()
  }

  async ping() {
    return await this.connection.ping()
  }

  async get(key: string): Promise<string> {
    return await this.connection.get(key)
  }

  async set(key: string, value: string | number, options: SetOptions = {}) {
    await this.connection.set(key, value, options)
  }

  async del(...keys: string[]) {
    await this.connection.del(keys)
  }

  async hSet(key: string, pairs: RedisPairValues) {
    let keys = Object.keys(pairs)
    for await (let k of keys) {
      await this.connection.hSet(key, k, pairs[k])
    }
  }

  async hGet(key: string, field?: string) {
    if (field != null) {
      let data = await this.connection.hGet(key, field)
      let toSend: any = {}
      toSend[field] = data
      return toSend
    } else {
      return await this.connection.hGetAll(key)
    }
  }

  async hDel(key: string, field?: string) {
    if (field != null) {
      await this.connection.hDel(key, field)
    } else {
      await this.connection.del(key)
    }
  }
}