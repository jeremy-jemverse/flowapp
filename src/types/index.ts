export interface BaseConnection {
  id: string;
  name: string;
  type: string;
  config: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}
