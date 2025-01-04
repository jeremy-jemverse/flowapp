import { DatabaseService } from '@/lib/services/database.service';

export class MigrationService {
  static async addDatabaseTypeColumn(): Promise<void> {
    try {
      console.log('MigrationService: Adding database type column...');

      const alterTableQuery = `
        DO $$ 
        BEGIN
          -- Add db_type column if it doesn't exist
          IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'connection_details' 
            AND column_name = 'db_type'
          ) THEN
            ALTER TABLE public.connection_details 
            ADD COLUMN db_type VARCHAR(50);
          END IF;

          -- Add account column if it doesn't exist
          IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'connection_details' 
            AND column_name = 'account'
          ) THEN
            ALTER TABLE public.connection_details 
            ADD COLUMN account VARCHAR(255);
          END IF;

          -- Add warehouse column if it doesn't exist
          IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'connection_details' 
            AND column_name = 'warehouse'
          ) THEN
            ALTER TABLE public.connection_details 
            ADD COLUMN warehouse VARCHAR(255);
          END IF;

          -- Add role column if it doesn't exist
          IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'connection_details' 
            AND column_name = 'role'
          ) THEN
            ALTER TABLE public.connection_details 
            ADD COLUMN role VARCHAR(255);
          END IF;

          -- Add schema column if it doesn't exist
          IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'connection_details' 
            AND column_name = 'schema'
          ) THEN
            ALTER TABLE public.connection_details 
            ADD COLUMN schema VARCHAR(255);
          END IF;

          -- Update existing database connections to postgres
          UPDATE public.connection_details 
          SET db_type = 'postgres' 
          WHERE connection_category = 'database' 
          AND db_type IS NULL;
        END $$;
      `;

      await DatabaseService.executeQuery(alterTableQuery);
      console.log('MigrationService: Database schema updated successfully');
    } catch (error) {
      console.error('MigrationService: Failed to update database schema:', error);
      throw error;
    }
  }
}