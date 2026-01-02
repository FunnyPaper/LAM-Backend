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
    action: 'read:own', 
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
    action: 'create:own',
    attributes: '*'
  },
  {
    role: Role.USER,
    resource: 'auth',
    action: 'create:own',
    attributes: '*'
  },
  // env
  {
    role: Role.ADMIN,
    resource: 'env',
    action: 'create:own',
    attributes: '*'
  },
  {
    role: Role.ADMIN,
    resource: 'env',
    action: 'read:own',
    attributes: '*'
  },
  {
    role: Role.ADMIN,
    resource: 'env',
    action: 'update:own',
    attributes: '*'
  },
  {
    role: Role.ADMIN,
    resource: 'env',
    action: 'delete:own',
    attributes: '*'
  },
  {
    role: Role.USER,
    resource: 'env',
    action: 'create:own',
    attributes: '*'
  },
  {
    role: Role.USER,
    resource: 'env',
    action: 'read:own',
    attributes: '*'
  },
  {
    role: Role.USER,
    resource: 'env',
    action: 'update:own',
    attributes: '*'
  },
  {
    role: Role.USER,
    resource: 'env',
    action: 'delete:own',
    attributes: '*'
  },
]);