export interface File{
    title       :string,
    extension   :string
}
export interface Dir {
  dirname:      string;
  files:        File[];
  folders:      Dir[];
}
export interface signedtoken{
  date: string,
  signed: boolean
}