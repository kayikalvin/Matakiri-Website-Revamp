import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

/**
 * Custom hook for API calls with loading, error, and data states
 * @param {string} url - API endpoint URL
 * @param {object} options - Additional options
 * @returns {object} Hook state and methods
 */
export const useAPI = (url, options = {}) => {
  const {
    method = 'GET',
    params = {},
    data = null,
    autoFetch = false,
    onSuccess = null,
    onError = null,
  } = options;

  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
  });

  // Execute API call
  const execute = useCallback(async (overrideOptions = {}) => {
    const {
      method: overrideMethod = method,
      params: overrideParams = params,
      data: overrideData = data,
    } = overrideOptions;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      let result;

      switch (overrideMethod.toUpperCase()) {
        case 'GET':
          result = await apiService.get(url, overrideParams);
          break;
        case 'POST':
          result = await apiService.post(url, overrideData);
          break;
        case 'PUT':
          result = await apiService.put(url, overrideData);
          break;
        case 'PATCH':
          result = await apiService.patch(url, overrideData);
          break;
        case 'DELETE':
          result = await apiService.delete(url);
          break;
        default:
          throw new Error(`Unsupported method: ${overrideMethod}`);
      }

      setState({
        data: result,
        loading: false,
        error: null,
      });

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (error) {
      const errorMessage = error.message || 'An error occurred';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });

      if (onError) {
        onError(error);
      }

      throw error;
    }
  }, [url, method, params, data, onSuccess, onError]);

  // Refetch data
  const refetch = useCallback(() => {
    return execute();
  }, [execute]);

  // Reset state
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      execute();
    }
  }, [autoFetch, execute]);

  return {
    ...state,
    execute,
    refetch,
    reset,
  };
};

/**
 * Hook for GET requests
 * @param {string} url - API endpoint URL
 * @param {object} options - Additional options
 * @returns {object} Hook state and methods
 */
export const useGet = (url, options = {}) => {
  return useAPI(url, { ...options, method: 'GET' });
};

/**
 * Hook for POST requests
 * @param {string} url - API endpoint URL
 * @param {object} options - Additional options
 * @returns {object} Hook state and methods
 */
export const usePost = (url, options = {}) => {
  return useAPI(url, { ...options, method: 'POST' });
};

/**
 * Hook for PUT requests
 * @param {string} url - API endpoint URL
 * @param {object} options - Additional options
 * @returns {object} Hook state and methods
 */
export const usePut = (url, options = {}) => {
  return useAPI(url, { ...options, method: 'PUT' });
};

/**
 * Hook for DELETE requests
 * @param {string} url - API endpoint URL
 * @param {object} options - Additional options
 * @returns {object} Hook state and methods
 */
export const useDelete = (url, options = {}) => {
  return useAPI(url, { ...options, method: 'DELETE' });
};
