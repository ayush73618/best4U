/**
 * Pure, stateless financial math shared by every BM4U calculator
 * (EMI, SIP, PPF, SWP, RD, FD...). No UI, no signals — just numbers in,
 * numbers out, so every calculator gets the same tested math and the
 * same floating-point-safety fixes we already had to work out once.
 */

export function round(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

// ---------- Shared result shape for growth calculators ----------

export interface GrowthResult {
  investedAmount: number;
  maturityValue: number;
  estimatedReturns: number;
  investedPercent: number;
  returnsPercent: number;
}

// ---------- Lumpsum / FD ----------

/**
 * Compound interest on a one-time investment (also powers FD).
 * compoundingPerYear: 1 = annually, 4 = quarterly, 12 = monthly.
 */
export function futureValueLumpsum(
  principal: number,
  annualRatePercent: number,
  years: number,
  compoundingPerYear = 1
): GrowthResult {
  const r = annualRatePercent / 100 / compoundingPerYear;
  const n = years * compoundingPerYear;
  const maturityValue = principal * Math.pow(1 + r, n);
  const estimatedReturns = maturityValue - principal;

  return {
    investedAmount: round(principal),
    maturityValue: round(maturityValue),
    estimatedReturns: round(estimatedReturns),
    investedPercent: (principal / maturityValue) * 100,
    returnsPercent: (estimatedReturns / maturityValue) * 100,
  };
}

// ---------- SIP ----------

/**
 * Future value of a monthly SIP. Uses the annuity-due formula (deposit
 * at the START of each month) — this is how every Indian AMC/SIP
 * calculator actually computes it, not the plain ordinary-annuity formula.
 */
export function futureValueSIP(
  monthlyAmount: number,
  annualRatePercent: number,
  years: number
): GrowthResult {
  const i = annualRatePercent / 100 / 12;
  const n = years * 12;
  const investedAmount = monthlyAmount * n;

  // i === 0 needs its own branch, same reason as EMI's r === 0 case.
  const maturityValue =
    i === 0 ? investedAmount : monthlyAmount * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);

  const estimatedReturns = maturityValue - investedAmount;

  return {
    investedAmount: round(investedAmount),
    maturityValue: round(maturityValue),
    estimatedReturns: round(estimatedReturns),
    investedPercent: (investedAmount / maturityValue) * 100,
    returnsPercent: (estimatedReturns / maturityValue) * 100,
  };
}

/**
 * Step-up SIP: the monthly contribution increases by a fixed % every
 * 12 months. No closed-form formula once step-up is involved, so this
 * simulates month by month rather than using an algebraic shortcut.
 */
export function futureValueStepUpSIP(
  initialMonthlyAmount: number,
  annualRatePercent: number,
  years: number,
  annualStepUpPercent: number
): GrowthResult {
  const i = annualRatePercent / 100 / 12;
  const n = years * 12;

  let balance = 0;
  let invested = 0;
  let currentMonthly = initialMonthlyAmount;

  for (let month = 1; month <= n; month++) {
    // Step up at the start of each new year (month 13, 25, 37...), not month 1.
    if (month > 1 && (month - 1) % 12 === 0) {
      currentMonthly *= 1 + annualStepUpPercent / 100;
    }
    balance = (balance + currentMonthly) * (1 + i);
    invested += currentMonthly;
  }

  const estimatedReturns = balance - invested;

  return {
    investedAmount: round(invested),
    maturityValue: round(balance),
    estimatedReturns: round(estimatedReturns),
    investedPercent: (invested / balance) * 100,
    returnsPercent: (estimatedReturns / balance) * 100,
  };
}

// ---------- PPF ----------

/**
 * PPF: fixed annual deposit, compounded annually, deposit-at-start-of-year
 * (annuity due) — matches Post Office / bank PPF calculators. Rate is a
 * parameter, not hardcoded, since the government resets it every quarter.
 */
export function futureValuePPF(
  yearlyAmount: number,
  years: number,
  annualRatePercent: number
): GrowthResult {
  const r = annualRatePercent / 100;
  const investedAmount = yearlyAmount * years;

  const maturityValue =
    r === 0 ? investedAmount : yearlyAmount * ((Math.pow(1 + r, years) - 1) / r) * (1 + r);

  const estimatedReturns = maturityValue - investedAmount;

  return {
    investedAmount: round(investedAmount),
    maturityValue: round(maturityValue),
    estimatedReturns: round(estimatedReturns),
    investedPercent: (investedAmount / maturityValue) * 100,
    returnsPercent: (estimatedReturns / maturityValue) * 100,
  };
}

// ---------- SWP ----------

export interface SwpYearPoint {
  year: number;
  openingBalance: number;
  withdrawn: number;
  interestEarned: number;
  closingBalance: number;
}

export interface SwpResult {
  totalWithdrawn: number;
  totalInterestEarned: number;
  closingBalance: number;
  /** Month number (1-based) the corpus hit ₹0, or null if it survived the full duration. */
  depletedAtMonth: number | null;
  schedule: SwpYearPoint[];
}

/**
 * Systematic Withdrawal Plan: a fixed amount is withdrawn every month
 * from a corpus that keeps earning returns. Unlike SIP/PPF there's no
 * single "future value" here — the useful output is a depletion
 * schedule, because the real question a user is asking is "will my
 * money outlast my withdrawals?"
 */
export function swpProjection(
  corpus: number,
  monthlyWithdrawal: number,
  annualRatePercent: number,
  years: number
): SwpResult {
  const i = annualRatePercent / 100 / 12;
  const totalMonths = years * 12;

  let balance = corpus;
  let totalWithdrawn = 0;
  let totalInterestEarned = 0;
  let depletedAtMonth: number | null = null;

  const schedule: SwpYearPoint[] = [];
  let yearOpeningBalance = corpus;
  let yearWithdrawn = 0;
  let yearInterest = 0;

  for (let month = 1; month <= totalMonths; month++) {
    if (balance > 0) {
      const interest = balance * i;
      const withdrawal = Math.min(monthlyWithdrawal, balance + interest);
      balance = balance + interest - withdrawal;
      totalWithdrawn += withdrawal;
      totalInterestEarned += interest;
      yearInterest += interest;
      yearWithdrawn += withdrawal;

      if (balance <= 0.01) {
        balance = 0;
        depletedAtMonth = month;
      }
    }

    if (month % 12 === 0 || month === totalMonths) {
      schedule.push({
        year: Math.ceil(month / 12),
        openingBalance: round(yearOpeningBalance),
        withdrawn: round(yearWithdrawn),
        interestEarned: round(yearInterest),
        closingBalance: round(balance),
      });
      yearOpeningBalance = balance;
      yearWithdrawn = 0;
      yearInterest = 0;
    }
  }

  return {
    totalWithdrawn: round(totalWithdrawn),
    totalInterestEarned: round(totalInterestEarned),
    closingBalance: round(balance),
    depletedAtMonth,
    schedule,
  };
}

/**
 * Recurring Deposit: same math as SIP (monthly deposit, monthly
 * compounding, annuity due) but banks quote RD tenure in months, not
 * years — so this takes months directly instead of forcing the caller
 * to convert.
 */
export function futureValueRD(
  monthlyAmount: number,
  annualRatePercent: number,
  months: number
): GrowthResult {
  return futureValueSIP(monthlyAmount, annualRatePercent, months / 12);
}