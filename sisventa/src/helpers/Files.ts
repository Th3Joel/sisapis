import fs from "node:fs";
class archivos {
    #path:string;
  constructor(path: string) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
    this.#path = path;
  }

  get(name:string){
    //COmprobar si existe, y si no da error
    fs.statSync(this.#path+name);

    let file = Bun.file(this.#path+name)
    //Por que el name por default da todo el path y solo el name se requiere
    const nam:string[] = file.name?.split("/") ?? [];
    return {
      size:file.size,
      type:file.type,
      names:nam[nam?.length -1],
      file
    }
  }
   save(path: string, file:File) {
    Bun.write(this.#path+path,file)  
  }

  move(filePath:string,newLocation:string){
    fs.renameSync(filePath,newLocation)
  }

  copy(filePath:string,newLocation:string){
    const content = fs.readFileSync(filePath)
    fs.writeFileSync(newLocation,content)
  }

  remove(file:string){
    fs.unlinkSync(this.#path+file);
  }
}

export default archivos;
