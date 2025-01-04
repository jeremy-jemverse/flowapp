import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createConnection, updateConnection } from '../connectionSlice';
import { ConnectionFormData, FormMode } from '../types';
import { useToast } from '@/hooks/use-toast';

export function useConnectionForm(mode: FormMode = 'insert', connectionId?: string) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ConnectionFormData) => {
    try {
      setIsSubmitting(true);
      console.log(`useConnectionForm: Submitting form in ${mode} mode:`, data);
      
      if (mode === 'insert') {
        await dispatch(createConnection(data)).unwrap();
        toast({
          title: 'Success',
          description: 'Connection created successfully',
        });
      } else if (mode === 'edit' && connectionId) {
        await dispatch(updateConnection({ id: connectionId, data })).unwrap();
        toast({
          title: 'Success',
          description: 'Connection updated successfully',
        });
      } else {
        throw new Error('Invalid form mode or missing connection ID');
      }
      
      return true;
    } catch (error) {
      console.error('useConnectionForm: Submit error:', error);
      
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save connection',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    mode,
    isSubmitting,
    handleSubmit
  };
}