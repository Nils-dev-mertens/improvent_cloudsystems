import fs from "fs";
import path from 'path';
import { marked } from 'marked';

export let titles:string[] = [];

export function updatefiles(){
fs.readdir("./notes", (err, files) => {
  try{
  titles = [];
  files.forEach(file => {
    titles.push(file.split(".")[0]);
  });
  } catch(e){
    console.error("shutting down server, file error");
    process.exit(1);
  }
  });
}
updatefiles();
export async function Createhtmlmd(title: string): Promise<string | null> {
  try {
    const markdownText = fs.readFileSync(path.join(__dirname, `./notes/${title}.md`), "utf8");
    return await marked(markdownText);
  } catch (error) {
    return null;
  }
}