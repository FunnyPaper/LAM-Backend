import { ColumnOptions } from 'typeorm';

export default (type: string): ColumnOptions['transformer'] => ({
  to: (value: Date) => type === 'postgres' 
    ? value 
    : value && value.toISOString(),
  from: (value: string) => type === 'postgres' 
    ? value 
    : value && new Date(value)
});