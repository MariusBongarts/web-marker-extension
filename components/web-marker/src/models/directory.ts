import { Entity } from './../models/entity';

export interface Directory extends Entity {
  _user?: string;
  _directory?: string;
  _parentDirectory?: string;
  name: string;
}
