/**
 * Checks if a value is serializable for structured clone
 */
export function isSerializable(value: any): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  const type = typeof value;

  // Handle primitive types
  if (type === 'number' || type === 'string' || type === 'boolean') {
    return true;
  }

  // Handle special cases
  if (type === 'symbol' || type === 'function') {
    return false;
  }

  // Handle dates
  if (value instanceof Date) {
    return true;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.every(isSerializable);
  }

  // Handle objects
  if (type === 'object') {
    // Handle special objects
    if (value instanceof RegExp || value instanceof Error) {
      return false;
    }

    // Handle plain objects recursively
    try {
      for (const key in value) {
        if (!isSerializable(value[key])) {
          return false;
        }
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  return false;
}

/**
 * Safely serializes data by removing non-serializable values
 */
export function safeSerialize<T>(data: T): T {
  try {
    return JSON.parse(JSON.stringify(data, (key, value) => {
      // Handle special cases
      if (value instanceof Set) {
        return Array.from(value);
      }
      if (value instanceof Map) {
        return Object.fromEntries(value);
      }
      if (value instanceof Date) {
        return value.toISOString();
      }
      if (typeof value === 'symbol') {
        return value.toString();
      }
      if (value instanceof RegExp) {
        return value.toString();
      }
      if (typeof value === 'function') {
        return undefined;
      }
      return value;
    }));
  } catch (error) {
    console.error('Failed to serialize data:', error);
    throw new Error('Failed to serialize data');
  }
}