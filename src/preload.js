import { contextBridge } from "electron";
import fs from "fs";
import path from "path";
const deepReadDir = async (dirPath) => await Promise.all(
  (await  fs.readdir(dirPath, {withFileTypes: true})).map(async (dirent) => {
    const path = path.join(dirPath, dirent.name)
    return dirent.isDirectory() ? await deepReadDir(path) : path
  }) 
)


function read(root, filter, files, prefix) {
  prefix = prefix || ''
  files = files || []
  filter = filter || noDotFiles

  var dir = path.join(root, prefix)
  if (!fs.existsSync(dir)) return files
  if (fs.statSync(dir).isDirectory())
    fs.readdirSync(dir)
    .filter(function (name, index) {
      return filter(name, index, dir)
    })
    .forEach(function (name) {
      read(root, filter, files, path.join(prefix, name))
    })
  else
    files.push(prefix)

  return files
}

function noDotFiles(x) {
  return x[0] !== '.'
}

const settingsPath ='settings.json'
contextBridge.exposeInMainWorld("file", {
  setSetting: (setting, val) => {
    const dir = path.dirname( settingsPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    let settings = {}
    if(fs.statSync(settingsPath).size){
      let file = fs.readFileSync(settingsPath)
      try {
        JSON.parse((file))
      } catch (error) {
        settings = {}
      }
    }

    settings[setting] = val
    fs.writeFileSync(settingsPath, JSON.stringify(settings));
  },
  getSetting:(setting) =>{
    let settings = {}
    
      try {
        let file = fs.readFileSync(settingsPath)
        settings = JSON.parse((file))
      } catch (error) {
        return null
      }
    
    return settings[setting]
  },
  fs: fs,
  join: (arr) =>  path.join(arr),
  isFile: (path)=> !fs.lstatSync(path).isDirectory(),
  deepReadDir: read
});

// setSetting:(setting,val) => {