interface FraudCheckResult {
  isFraudulent: boolean;
  score: number; // 0-100
  reasons: string[];
}

export async function checkFraud(data: {
  ip: string;
  userAgent: string;
  email: string;
  amount?: number;
  userId?: string;
}): Promise<FraudCheckResult> {
  const reasons: string[] = [];
  let score = 0;

  // Basic rules (expand with ML later)
  
  // High-value transaction
  if (data.amount && data.amount > 100000) { // > £1000
    score += 20;
    reasons.push('High-value transaction');
  }

  // New account with high value
  if (data.amount && data.amount > 50000 && !data.userId) {
    score += 30;
    reasons.push('New account with high-value transaction');
  }

  // Suspicious email patterns
  if (data.email.includes('tempmail') || data.email.includes('throwaway')) {
    score += 40;
    reasons.push('Disposable email detected');
  }

  // Multiple rapid requests (implement rate limiting here)
  // TODO: Check Redis/D1 for request frequency

  return {
    isFraudulent: score > 70,
    score,
    reasons,
  };
}

export const FRAUD_THRESHOLDS = {
  low: 30,
  medium: 50,
  high: 70,
  critical: 90,
};
