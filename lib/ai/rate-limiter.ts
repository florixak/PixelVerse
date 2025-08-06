class RateLimiter {
  private limits = new Map<string, { count: number; resetTime: number }>();

  check(userId: string, maxCalls = 5, windowMs = 60000): boolean {
    const now = Date.now();
    const userLimit = this.limits.get(userId);

    if (!userLimit || now > userLimit.resetTime) {
      this.limits.set(userId, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (userLimit.count >= maxCalls) return false;

    userLimit.count++;
    return true;
  }

  getRemainingCalls(userId: string, maxCalls = 5): number {
    const userLimit = this.limits.get(userId);
    if (!userLimit || Date.now() > userLimit.resetTime) return maxCalls;
    return Math.max(0, maxCalls - userLimit.count);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [userId, limit] of this.limits) {
      if (now > limit.resetTime) {
        this.limits.delete(userId);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

// Cleanup every 5 minutes
setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000);
