/**
 * Optimized Leads API Cache Manager
 * Implements client-side caching and deduplication of API calls
 */

class LeadsCache {
  constructor() {
    this.cache = {
      normal: {},
      employee: {}
    };
    this.pendingRequests = {
      normal: null,
      employee: null
    };
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes cache
    this.lastFetch = {
      normal: null,
      employee: null
    };
  }

  /**
   * Generate cache key from params
   */
  generateKey(params) {
    const { page = 1, limit = 50, search = "", status = "" } = params;
    return `page_${page}_limit_${limit}_search_${search}_status_${status}`;
  }

  /**
   * Check if cache is still valid
   */
  isCacheValid(type, key) {
    if (!this.cache[type][key]) return false;
    const timeSinceCache = Date.now() - this.cache[type][key].timestamp;
    return timeSinceCache < this.cacheExpiry;
  }

  /**
   * Get leads from cache or fetch from API
   */
  async getLeads(type, params = {}) {
    const key = this.generateKey(params);

    // Return cached data if valid
    if (this.isCacheValid(type, key)) {
      console.log(`📦 Using cached ${type} leads for key:`, key);
      return this.cache[type][key].data;
    }

    // Return pending request if one is already in flight
    if (this.pendingRequests[type]) {
      console.log(`⏳ Waiting for pending ${type} request...`);
      return this.pendingRequests[type];
    }

    // Create new fetch request
    const endpoint = type === "normal" 
      ? "http://localhost:4000/leads" 
      : "http://localhost:4000/employeelead/all";

    const queryString = new URLSearchParams(params).toString();
    const url = `${endpoint}?${queryString}`;

    const requestPromise = fetch(url)
      .then(res => res.json())
      .then(data => {
        // Store in cache
        this.cache[type][key] = {
          data,
          timestamp: Date.now()
        };
        this.lastFetch[type] = Date.now();
        console.log(`✅ Fetched and cached ${type} leads`);
        return data;
      })
      .catch(error => {
        console.error(`❌ Error fetching ${type} leads:`, error);
        throw error;
      })
      .finally(() => {
        this.pendingRequests[type] = null;
      });

    this.pendingRequests[type] = requestPromise;
    return requestPromise;
  }

  /**
   * Clear specific cache
   */
  clearCache(type = null) {
    if (type) {
      this.cache[type] = {};
    } else {
      this.cache = { normal: {}, employee: {} };
    }
    console.log(`🗑️ Cache cleared for: ${type || "all"}`);
  }

  /**
   * Prefetch next page
   */
  prefetchPage(type, currentPage, params = {}) {
    const nextPageParams = { ...params, page: currentPage + 1 };
    // Silently prefetch without blocking
    this.getLeads(type, nextPageParams).catch(() => {
      // Ignore prefetch errors
    });
  }

  /**
   * Get cache stats
   */
  getStats() {
    const count = {
      normal: Object.keys(this.cache.normal).length,
      employee: Object.keys(this.cache.employee).length
    };
    return {
      cached_pages: count,
      total_cached: count.normal + count.employee,
      last_fetch: this.lastFetch
    };
  }
}

// Export singleton instance
export const leadsCache = new LeadsCache();

/**
 * Hook-style usage in React component:
 * 
 * const data = await leadsCache.getLeads('normal', { 
 *   page: 1, 
 *   limit: 50, 
 *   search: 'john', 
 *   status: 'Hot' 
 * });
 * 
 * // Prefetch next page
 * leadsCache.prefetchPage('normal', 1, { search: 'john' });
 */
