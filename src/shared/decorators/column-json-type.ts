export function columnJsonType(type: string) {
  return type == "postgres" ? "jsonb" : "simple-json";
}