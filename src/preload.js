import { contextBridge } from "electron";
import fs from "fs";
import fse from "fs-extra"
import path from "path";
import os from "os"
import { request } from "https";
import https from "https"
import { spawn } from "child_process";
const deepReadDir = async (dirPath) => await Promise.all(
  (await fs.readdir(dirPath, { withFileTypes: true })).map(async (dirent) => {
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

const settingsPath = 'settings.json'
contextBridge.exposeInMainWorld("file", {
  setSetting: async (setting, val) => {
    const dir = path.dirname(settingsPath);
    if (!fs.existsSync(settingsPath)) {
      // Create the file with empty content
      await fs.writeFileSync(settingsPath, '');
    }
    let settings = {}
    if (fs.statSync(settingsPath).size) {
      let file = fs.readFileSync(settingsPath)
      try {
        settings = JSON.parse((file))
      } catch (error) {
        settings = {}
      }
    }

    settings[setting] = val
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  },
  getSetting: (setting) => {
    let settings = {}

    try {
      let file = fs.readFileSync(settingsPath)
      settings = JSON.parse((file))
    } catch (error) {
      return null
    }

    return setting ? settings[setting] : settings
  },
  fs: fs,
  request:request,
  downloadImageAsBase64: async (url)=> {
    const response = await https.get(url);
    if (response.statusCode !== 200) throw new Error(`Failed to download image: ${response.statusMessage}`);
    const chunks = [];
    response.on('data', (chunk) => chunks.push(chunk));
    await new Promise((resolve) => response.on('end', resolve));
    const data = Buffer.concat(chunks);
    const base64 = data.toString('base64');
    return `data:${response.headers['content-type']};base64,${base64}`;
  },
  copyFolder: (srcDir, destDir, overwrite) => {
    try {
      fse.copySync(srcDir, destDir, { overwrite: true | false })
      return true
    } catch (err) {
      return false
    }
  },
  openInFileExplorer(e) {
    let explorer;
    switch (os.platform()) {
      case "win32": explorer = "explorer"; break;
      case "linux": explorer = "xdg-open"; break;
      case "darwin": explorer = "open"; break;
    }
    spawn(explorer, [e], { detached: true }).unref();
  },
  openFolder: async (path,folderOnly=false) => {
    const files = await fs.readdir(path, { withFileTypes: true });
    return files.map(x=>!folderOnly || x.isDirectory())
  },
  openExpandFolder: async(pathname) =>{
    const result = [];

    try {
      const files = await fs.promises.readdir(pathname, { withFileTypes: true });
      for (const file of files) {
        if (file.isDirectory()) {
          const subPath = path.join(pathname, file.name);
          const subFiles = await fs.promises.readdir(subPath, { withFileTypes: true });
          result.push(...subFiles.map(subFile => path.join(subPath, subFile.name)))
        }
      }
    } catch (err) {
      console.error(err);
    }
  
    return result;
  
  },

  replaceFileWithBase64:(pathToFile, base64Image, callback) => {
    // Convert the base64 image to a Buffer
    const imageBuffer = Buffer.from(base64Image, 'base64');
  
    // Read the file at the given path
    fs.readFile(pathToFile, (err, data) => {
      if (err) {
        // Call the callback with the error
        callback(err);
        return;
      }
  
      // Replace the file's contents with the base64 image
      const newData = imageBuffer.toString('utf8');
      fs.writeFile(pathToFile, newData, (err) => {
        if (err) {
          // Call the callback with the error
          callback(err);
          return;
        }
  
        // Call the callback with no arguments to indicate success
        callback();
      });
    });
  },
  
  
  overwriteFile: async (fileToReplacePath, replacerFilePath) => {
    try {
      let data = await fs.promises.readFile(replacerFilePath);
      await fs.promises.writeFile(fileToReplacePath, data);
      return true;
    } catch (error) {
      return false;
    }
  },
  loadImage: async(imagePath)=>{
    try {
      // Read the file as a buffer
      const buffer = await fs.promises.readFile(imagePath);
  
      // Convert the buffer to a base64 string
      const base64Image = buffer.toString('base64');
  
      return base64Image;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  join: (arr) => path.join(arr),
  isFile: (path) => !fs.lstatSync(path).isDirectory() ? 1 : -1,
  isFolder: (path) => fs.lstatSync(path).isDirectory() ? 1 : -1,
  deepReadDir: read,
  dirname: __dirname
});

// setSetting:(setting,val) => {
