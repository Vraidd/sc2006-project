interface RateLimitConfig {
    interval: number; // milliseconds
    limit: number;    // max requests per interval
}

class RateLimiter {
    private requests: Map<string, { count: number; resetTime: number }> = new Map();
    
    constructor(private config: RateLimitConfig) {}
    
    check(key: string): boolean {
        const now = Date.now();
        const record = this.requests.get(key);
        
        if (!record) {
        this.requests.set(key, { count: 1, resetTime: now + this.config.interval });
        return true;
        }
        
        if (now > record.resetTime) {
        // Reset window
        this.requests.set(key, { count: 1, resetTime: now + this.config.interval });
        return true;
        }
        
        if (record.count >= this.config.limit) {
        return false;
        }
        
        record.count++;
        return true;
    }

    getCount(key: string): number | null {
        const record = this.requests.get(key);
        return record?.count || null;
    }
    
    // NEW: Get time until reset
    getResetTime(key: string): number | null {
        const record = this.requests.get(key);
        return record ? record.resetTime - Date.now() : null;
    }
    
    // Clean up old entries periodically
    cleanup() {
        const now = Date.now();
        if (this.requests.size > 10000) {  // High memory usage
            this.requests.clear()  // Emergency reset
        }
        for (const [key, record] of this.requests.entries()) {
        if (now > record.resetTime) {
            this.requests.delete(key);
        }
        }
    }
}

// Create rate limiter for login attempts
export const loginRateLimiter = new RateLimiter({
    interval: 15 * 60 * 1000, // 15 minutes
    limit: 5, // 5 attempts per 15 minutes
});

// Start cleanup interval
if (process.env.NODE_ENV !== 'test') {
    setInterval(() => loginRateLimiter.cleanup(), 60 * 60 * 1000); // Clean up every hour
}