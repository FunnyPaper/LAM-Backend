import { RolesBuilder } from "nest-access-control";

export enum Role {
  USER = 'USER', 
  ADMIN = 'ADMIN'
}

export default new RolesBuilder([
  // users
  { 
    role: Role.ADMIN, 
    resource: 'users', 
    action: 'read:any', 
    attributes: '*' 
  },
  {
    role: Role.ADMIN,
    resource: 'users',
    action: 'create:any',
    attributes: '*'
  },
  {
    role: Role.USER,
    resource: 'users',
    action: 'read:own',
    attributes: '*'
  },
  // auth
  { 
    role: Role.ADMIN, 
    resource: 'auth', 
    action: 'create:any', 
    attributes: '*' 
  },
  {
    role: Role.ADMIN,
    resource: 'users',
    action: 'create:own',
    attributes: '*'
  },
  { 
    role: Role.USER, 
    resource: 'auth', 
    action: 'create:any', 
    attributes: '*' 
  },
  {
    role: Role.USER,
    resource: 'users',
    action: 'create:own',
    attributes: '*'
  },
]);