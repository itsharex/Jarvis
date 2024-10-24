import fs from "fs"
import path from "path"

const res = await fetch("https://dance.kunkun.sh/api/data")
// const data: { fps: number; frames: string[] } = await res.json()
// get current file dir
// const __dirname = path.dirname(new URL(import.meta.url).pathname)
// const pkgPath = path.basename(path.dirname(__dirname))
// const pkgPath = path.dirname(__dirname)
// console.log(path.dirname(__dirname));
const pkgPath = path.dirname(__dirname)

const danceFilePath = path.join(pkgPath, "./assets/dance.json")
fs.writeFileSync(danceFilePath, await res.text())
