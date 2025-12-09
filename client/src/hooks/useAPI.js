import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * Custom hook for API calls with loading, error, and data states
 * @param {string} url - API endpoint URL
 * @param {object} options - Additional options
 * @returns {object} Hook state and methods
 */
export const useAPI = (apiFunction, options = {}) => {
  const {
    immediate = false,
    initialData = null,
    manual = false,
    onSuccess = null,
    onError = null,
    transformData = null, // Optional data transformer
  } = options;
  
  const [state, setState] = useState({
    data: initialData,
    loading: !manual && immediate,
    error: null,
    success: null,
  });

  // Execute API call
  const execute = useCallback(async (...args) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiFunction(...args);
      
      // Handle backend response structure
      const success = result.success === true;
      const data = transformData 
        ? transformData(result.data || result) 
        : (result.data || result);
      
      setState({
        data,
        loading: false,
        error: null,
        success,
      });

      if (onSuccess) {
        onSuccess(data, result);
      }

      return { 
        success, 
        data, 
        rawResponse: result,
        message: result.message 
      };
    } catch (error) {
      // Handle error from backend or axios
      const errorData = error.data || error;
      const errorMessage = errorData.message || error.message || 'An error occurred';
      const backendSuccess = errorData.success === false ? false : null;
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
        success: backendSuccess,
      });

      if (onError) {
        onError(error);
      }

      return { 
        success: false, 
        error: errorMessage,
        rawError: error 
      };
    }
  }, [apiFunction, onSuccess, onError, transformData]);

  // Refetch data
  const refetch = useCallback(() => {
    return execute();
  }, [execute]);

  // Reset state
  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
      success: null,
    });
  }, [initialData]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (immediate && !manual) {
      execute();
    }
  }, [execute, immediate, manual]);

  return {
    ...state,
    execute,
    refetch,
    reset,
    setData: (data) => setState(prev => ({ ...prev, data })),
    setError: (error) => setState(prev => ({ ...prev, error })),
  };
};

// Project-related hooks
export const useProjects = (options = {}) => {
  const transformData = (data) => {
    // Handle both array and object responses
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    if (data && data.projects) return data.projects;
    return data || [];
  };
  
  return useAPI(api.projects.getAll, { 
    transformData,
    ...options 
  });
};

export const useFeaturedProjects = (options = {}) => {
  return useAPI(api.projects.getFeatured, {
    transformData: (data) => data?.data || data || [],
    ...options
  });
};

export const useAIProjects = (options = {}) => {
  return useAPI(api.projects.getAIProjects, {
    transformData: (data) => data?.data || data || [],
    ...options
  });
};

export const useProject = (id, options = {}) => {
  const fetchProject = useCallback(() => api.projects.getById(id), [id]);
  return useAPI(fetchProject, { 
    immediate: !!id,
    transformData: (data) => data?.data || data,
    ...options 
  });
};

export const useProjectStats = (options = {}) => {
  return useAPI(api.projects.getStats, {
    transformData: (data) => data?.data || data,
    ...options
  });
};

// News-related hooks
export const useNews = (options = {}) => {
  return useAPI(api.news.getAll, {
    transformData: (data) => data?.data || data || [],
    ...options
  });
};

export const useFeaturedNews = (options = {}) => {
  return useAPI(api.news.getFeatured, {
    transformData: (data) => data?.data || data || [],
    ...options
  });
};

export const useLatestNews = (options = {}) => {
  return useAPI(api.news.getLatest, {
    transformData: (data) => data?.data || data || [],
    ...options
  });
};

export const useNewsArticle = (id, options = {}) => {
  const fetchArticle = useCallback(() => api.news.getById(id), [id]);
  return useAPI(fetchArticle, { 
    immediate: !!id,
    transformData: (data) => data?.data || data,
    ...options 
  });
};

export const useNewsStats = (options = {}) => {
  return useAPI(api.news.getStats, {
    transformData: (data) => data?.data || data,
    ...options
  });
};

// Partners-related hooks
export const usePartners = (options = {}) => {
  return useAPI(api.partners.getAll, {
    transformData: (data) => data?.data || data || [],
    ...options
  });
};

export const useFeaturedPartners = (options = {}) => {
  return useAPI(api.partners.getFeatured, {
    transformData: (data) => data?.data || data || [],
    ...options
  });
};

export const usePartnerStats = (options = {}) => {
  return useAPI(api.partners.getStats, {
    transformData: (data) => data?.data || data,
    ...options
  });
};

// Contact hook
export const useContact = (options = {}) => {
  const submitContact = useCallback((data) => api.contact.submit(data), []);
  return useAPI(submitContact, { 
    manual: true,
    ...options 
  });
};

// Gallery hooks
export const useGallery = (options = {}) => {
  return useAPI(api.gallery.getAll, {
    transformData: (data) => data?.data || data || [],
    ...options
  });
};

export const useGalleryAlbums = (options = {}) => {
  return useAPI(api.gallery.getAlbums, {
    transformData: (data) => data?.data || data || [],
    ...options
  });
};

// Auth hook for login/register
export const useAuthAPI = (options = {}) => {
  const login = useCallback((credentials) => api.auth.login(credentials), []);
  const register = useCallback((userData) => api.auth.register(userData), []);
  
  return {
    login: (credentials) => useAPI(() => login(credentials), { manual: true, ...options }),
    register: (userData) => useAPI(() => register(userData), { manual: true, ...options }),
  };
};