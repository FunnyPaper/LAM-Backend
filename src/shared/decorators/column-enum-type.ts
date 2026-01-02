export function columnEnumType(type: string) {
  return type == 'postgres' ? 'enum' : 'text';
}