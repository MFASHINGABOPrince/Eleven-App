import { getObjValue } from "../lib/funcs.js";
import useSWR from "swr";
import { apiAuth } from "../lib/axios";
import { useSelector } from "react-redux"; // Import useSelector to access Redux

/**
 * A hook to fetch data from an API using SWR
 * @param {string} url
 * @param {Object} opts
 * @param {boolean} [opts.onMount=true]
 * @param {function} [opts.fetcher]
 * @param {string} [opts.dataKey]
 * @param {*} [opts.defaultData]
 * @param {number} [opts.refreshInterval]
 * @param {boolean} [opts.revalidateOnFocus]
 */
export default function useGet(url, opts = {}) {
  const {
    fetcher,
    dataKey,
    defaultData,
    onMount = true,
    refreshInterval,
    revalidateOnFocus,
  } = opts;

  // Always retrieve the token from Redux (adjust the path based on your Redux structure)
  const token = useSelector((state) => state.reducer.auth.user?.payload?.tokens?.accessToken);

  const { isLoading, data, mutate, error, isValidating } = useSWR(
    url,
    async (url) => {
      try {
        let responseData = null;

        if (fetcher) {
          responseData = await fetcher(url);
        } else {
          // Set up request config with Authorization header if token is available
          const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

          // Make the API request using apiAuth
          const response = await apiAuth.get(url, config);

          // Process response based on dataKey if provided
          responseData = dataKey
            ? getObjValue(dataKey, response.data)
            : response.data?.data?.data || response.data?.data || response.data;
        }
        
        return responseData;
      } catch (error) {
        console.error("API Error:", error);
        return defaultData;
      }
    },
    {
      revalidateOnFocus,
      revalidateOnMount: onMount,
      refreshInterval: refreshInterval ?? 30000,
    }
  );

  return { data, isLoading, error, refetch: mutate, isValidating };
}
