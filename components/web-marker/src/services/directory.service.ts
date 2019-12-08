import uuidv4 from 'uuid/v4';
import { Directory } from './../models/directory';
import { JwtService } from './jwt.service';
import { HttpClient } from './http-client';
import { environment } from '../environments/environment.dev';
import { v4 as uuid } from 'uuid';
import { initDirectories, addDirectory, removeDirectory, updateDirectory, addTag } from '../store/actions';


export class DirectoryService {
  httpClient!: HttpClient;
  jwtService = new JwtService();
  BASE_URL = '/directory';

  constructor() {
    this.httpClient = new HttpClient({ baseURL: environment.BACKEND_URL });
  }

  async getDirectories(): Promise<Directory[]> {
    const response = await this.httpClient.get(this.BASE_URL);
    const directories = (await response.json() as Directory[]);
    initDirectories(directories);
    return directories;
  }

  async createDirectory(directory: Partial<Directory>): Promise<Directory | undefined> {
    const newDirectory = { ...directory, id: uuidv4() } as Directory;
    const response = await this.httpClient.post(this.BASE_URL, newDirectory);
    const createdDirectory: Directory = (await response.json() as Directory);

    // Update redux
    addDirectory(createdDirectory);

    // Create tag for directory
    addTag(createdDirectory.name, createdDirectory._id);

    return createdDirectory;
  }

  async deleteDirectory(directoryId: string): Promise<void> {
    // Update redux
    removeDirectory(directoryId)
    await this.httpClient.delete(this.BASE_URL + '/' + directoryId);
  }

  async updateDirectory(directory: Directory): Promise<void> {
    // Update redux
    updateDirectory(directory);

    await this.httpClient.put(this.BASE_URL, directory);

    // Update directories for store
    await this.getDirectories();
  }

  async getDirectoryById(id: string): Promise<Directory> {
    try {
      const response = await this.httpClient.get(this.BASE_URL + '/' + id);
      const directory = (await response.json() as Directory);
      return directory;
    } catch (error) {
      //
    }
  }

}
