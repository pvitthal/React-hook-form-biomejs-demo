import type { ReactNode } from 'react'
import { useState } from "react"

const unusedValue = 42
const logDemo = (name:string) => { console.log("Hello, " + name); return name }

export function Greeting({ name }: { name: string }): ReactNode {
 const [count, setCount] = useState(0)
 return <button onClick={() => setCount(count + 1)}>{logDemo(name)} {count}</button>
}

void unusedValue
