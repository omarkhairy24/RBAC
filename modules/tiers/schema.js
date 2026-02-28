const TIER_LIMITS = {
  free: {
    maxApiKeys: 1,
    monthlyRequests: 1000
  },
  advanced: {
    maxApiKeys: 5,
    monthlyRequests: 10000
  },
  pro: {
    maxApiKeys: 20,
    monthlyRequests: 100000
  }
};

module.exports = TIER_LIMITS;