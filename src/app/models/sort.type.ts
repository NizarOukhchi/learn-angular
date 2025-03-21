import { Home } from './home.type';

export type SortOption = {
  label: string;
  value: keyof Home;
};

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: keyof Home;
  direction: SortDirection;
} 