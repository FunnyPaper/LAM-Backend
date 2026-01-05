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
  // scripts
  {
    role: Role.USER,
    resource: 'scripts',
    action: 'create:own',
    attributes: '*'
  },
  {
    role: Role.USER,
    resource: 'scripts',
    action: 'read:own',
    attributes: '*'
  },
  {
    role: Role.USER,
    resource: 'scripts',
    action: 'update:own',
    attributes: '*'
  },
  {
    role: Role.USER,
    resource: 'scripts',
    action: 'delete:own',
    attributes: '*'
  },
  {
    role: Role.ADMIN,
    resource: 'scripts',
    action: 'create:own',
    attributes: '*'
  },
  {
    role: Role.ADMIN,
    resource: 'scripts',
    action: 'read:own',
    attributes: '*'
  },
  {
    role: Role.ADMIN,
    resource: 'scripts',
    action: 'update:own',
    attributes: '*'
  },
  {
    role: Role.ADMIN,
    resource: 'scripts',
    action: 'delete:own',
    attributes: '*'
  },
  {
    role: Role.ADMIN,
    resource: 'scripts',
    action: 'create:any',
    attributes: '*'
  },
  {
    role: Role.ADMIN,
    resource: 'scripts',
    action: 'read:any',
    attributes: '*'
  },
  {
    role: Role.ADMIN,
    resource: 'scripts',
    action: 'update:any',
    attributes: '*'
  },
  {
    role: Role.ADMIN,
    resource: 'scripts',
    action: 'delete:any',
    attributes: '*'
  },
  // scripts-versions
  {
    role: Role.USER,
    resource: 'scripts-versions',
    action: 'create:own',
    attributes: '*'
  },
  {
    role: Role.USER,
    resource: 'scripts-versions',
    action: 'read:own',
    attributes: '*'
  },
  {
    role: Role.USER,
    resource: 'scripts-versions',
    action: 'update:own',
    attributes: '*'
  },
  {
    role: Role.USER,
    resource: 'scripts-versions',
    action: 'delete:own',
    attributes: '*'
  },
  {
    role: Role.ADMIN,
    resource: 'scripts-versions',
    action: 'create:own',
    attributes: '*'
  },
  {
    role: Role.ADMIN,
    resource: 'scripts-versions',
    action: 'read:own',
    attributes: '*'
  },
  {
    role: Role.ADMIN,
    resource: 'scripts-versions',
    action: 'update:own',
    attributes: '*'
  },
  {
    role: Role.ADMIN,
    resource: 'scripts-versions',
    action: 'delete:own',
    attributes: '*'
  },
  {
    role: Role.ADMIN,
    resource: 'scripts-versions',
    action: 'create:any',
    attributes: '*'
  },
  {
    role: Role.ADMIN,
    resource: 'scripts-versions',
    action: 'read:any',
    attributes: '*'
  },
  {
    role: Role.ADMIN,
    resource: 'scripts-versions',
    action: 'update:any',
    attributes: '*'
  },
  {
    role: Role.ADMIN,
    resource: 'scripts-versions',
    action: 'delete:any',
    attributes: '*'
  },
  // scripts-runs
  {
    role: Role.USER,
    resource: 'scripts-runs',
    action: 'create:own',
    attributes: '*'
  },
  {
    role: Role.USER,
    resource: 'scripts-runs',
    action: 'read:own',
    attributes: '*'
  },
  {
    role: Role.USER,
    resource: 'scripts-runs',
    action: 'update:own',
    attributes: '*'
  },
  {
    role: Role.USER,
    resource: 'scripts-runs',
    action: 'delete:own',
    attributes: '*'
  },
  {
    role: Role.ADMIN,
    resource: 'scripts-runs',
    action: 'create:own',
    attributes: '*'
  },
  {
    role: Role.ADMIN,
    resource: 'scripts-runs',
    action: 'read:own',
    attributes: '*'
  },
  {
    role: Role.ADMIN,
    resource: 'scripts-runs',
    action: 'update:own',
    attributes: '*'
  },
  {
    role: Role.ADMIN,
    resource: 'scripts-runs',
    action: 'delete:own',
    attributes: '*'
  },
  {
    role: Role.ADMIN,
    resource: 'scripts-runs',
    action: 'create:any',
    attributes: '*'
  },
  {
    role: Role.ADMIN,
    resource: 'scripts-runs',
    action: 'read:any',
    attributes: '*'
  },
  {
    role: Role.ADMIN,
    resource: 'scripts-runs',
    action: 'update:any',
    attributes: '*'
  },
  {
    role: Role.ADMIN,
    resource: 'scripts-runs',
    action: 'delete:any',
    attributes: '*'
  },
]);