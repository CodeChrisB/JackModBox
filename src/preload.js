import { contextBridge } from "electron";
import { request } from "https";
import { exec, spawn } from "child_process";
import fs from "fs";
import process from "process"; 
import fse from "fs-extra"
import https from "https"
import os from "os"
import path from "path";


const deepReadDir = async (dirPath) => await Promise.all(
  (await fs.readdir(dirPath, { withFileTypes: true })).map(async (dirent) => {
    const path = path.join(dirPath, dirent.name)
    return dirent.isDirectory() ? await deepReadDir(path) : path
  })
)

function deleteFolderRecursive(folderPath) {
  if(!folderPath) return 
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    // delete folder
    fs.rmdirSync(folderPath);
  }
  return true
}

const settingsPath = 'settings.json'
contextBridge.exposeInMainWorld("file", {
  spawn:spawn,
  copyFolder: async(srcDir, destDir, overwrite) => {
    try {
      await fse.copy(srcDir, destDir, { overwrite: true | false })
      return true
    } catch (err) {
      return false
    }
  },
  cwd: process.cwd(),
  deleteFolder:(imagePath) => deleteFolderRecursive(imagePath),

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
  exec:exec,
  fs: fs,
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
  isFile: (path) => !fs.lstatSync(path).isDirectory() ? 1 : -1,
  isFolder: (path) => fs.lstatSync(path).isDirectory() ? 1 : -1,
  loadAssetImage: (file)=>{
    const data = fs.readFileSync(path.join(__dirname,file));
    const base64 = Buffer.from(data).toString('base64');
    return base64;
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
  openFolder: async (path,folderOnly=false) => {
    const files = await fs.readdir(path, { withFileTypes: true });
    return files.map(x=>!folderOnly || x.isDirectory())
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
  overwriteFile: async (fileToReplacePath, replacerFilePath) => {
    try {
      let data = await fs.promises.readFile(replacerFilePath);
      await fs.promises.writeFile(fileToReplacePath, data);
      return true;
    } catch (error) {
      return false;
    }
  },
  path:path,
  playSound(path){
    var player = require('play-sound')({})
    fs.readFile(path,(err,data)=>{
      const audio = new Audio(`data:audio/ogg;base64,${data.toString('base64')}`);
      audio.play();
    })
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
  request:request,
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
  swf:{
    readSwf: async (path)=>{
      const buffer = await fs.readFile(path,(err,data)=>{
        return data
      })
      return buffer
    },
    save:(path,data)=>{

    }
  }
});

