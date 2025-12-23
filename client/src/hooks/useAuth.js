import { useState, useEffect } from 'react'
import axios from 'axios'

// Use configured env var if present; otherwise use relative paths so same-origin applies in production
const API_BASE_URL = process.env.REACT_APP_API_URL || process.env.VITE_API_URL || ''

const useFetch = (endpoint, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const url = `${API_BASE_URL}${endpoint}`
        const response = await axios.get(url, options)
        setData(response.data)
        setError(null)
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [endpoint])

  return { data, loading, error }
}

export default useFetch