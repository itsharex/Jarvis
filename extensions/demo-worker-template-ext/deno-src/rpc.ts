import { DenoStdio, ProcessChannel } from "/Users/hacker/Dev/projects/comlink-stdio/mod.ts"

// import { DenoStdio, ProcessChannel } from "@hk/comlink-stdio"

export interface API {
	add(a: number, b: number): Promise<number>
	subtract(a: number, b: number): Promise<number>
}

// Define your API methods
export const apiMethods = {
	add: async (a: number, b: number) => a + b,
	subtract: async (a: number, b: number) => a - b
}

const stdio = new DenoStdio(Deno.stdin.readable, Deno.stdout.writable)
const child = new ProcessChannel(stdio, apiMethods)

// const writer = Deno.stdout.writable.getWriter()
//
// writer.write(new TextEncoder().encode("hello from deno\n"))
// console.error("in rpc deno")

// console.log("debug message stdout in deno rpc")
