export interface TransactionInput {
  purchase_value: number;
  age: number;
  time_since_signup: number; // hours
  hour_of_day: number;
  day_of_week: number;
  device_type: "mobile" | "desktop" | "tablet";
  source: "SEO" | "Ads" | "Direct";
  browser: "Chrome" | "Firefox" | "Safari" | "IE" | "Opera";
  sex: "M" | "F";
}

export interface ShapValue {
  feature: string;
  impact: number; // positive = pushes toward fraud, negative = pushes toward legit
  value: string;
}

export interface PredictionResult {
  fraud_probability: number;
  is_fraud: boolean;
  risk_level: "High" | "Medium" | "Low";
  shap_values: ShapValue[];
}

// Sigmoid function: converts a raw score into a 0-1 probability
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

// Normalise a value to 0-1 range
function normalise(val: number, min: number, max: number): number {
  return Math.max(0, Math.min(1, (val - min) / (max - min)));
}

export function predict(input: TransactionInput): PredictionResult {
  // --- Feature contributions (raw scores before sigmoid) ---
  // Each contribution is: weight * engineered_feature_value
  // Positive contribution = more fraudulent, negative = more legitimate

  const contributions: { feature: string; raw: number; value: string }[] = [];

  // 1. Purchase value — higher value = more fraud risk
  const normValue = normalise(input.purchase_value, 10, 2000);
  const valueCont = 1.2 * (normValue - 0.3); // baseline is $300, higher = riskier
  contributions.push({
    feature: "Purchase Value",
    raw: valueCont,
    value: `$${input.purchase_value.toFixed(2)}`,
  });

  // 2. Account age — very new accounts (< 24h) are highly suspicious
  const normAge = normalise(input.time_since_signup, 0, 720); // 0 to 30 days
  const ageCont = 1.5 * (0.8 - normAge); // new accounts score high fraud
  contributions.push({
    feature: "Account Age",
    raw: ageCont,
    value:
      input.time_since_signup < 24
        ? `${input.time_since_signup.toFixed(0)}h (new)`
        : `${(input.time_since_signup / 24).toFixed(1)} days`,
  });

  // 3. User age — very young users slightly more risky
  const userAgeCont = input.age < 25 ? 0.4 : input.age > 50 ? -0.3 : 0.0;
  contributions.push({
    feature: "User Age",
    raw: userAgeCont,
    value: `${input.age} yrs`,
  });

  // 4. Hour of day — 1am–5am is peak fraud time
  const isNightTime = input.hour_of_day >= 1 && input.hour_of_day <= 5;
  const isBusinessHours = input.hour_of_day >= 9 && input.hour_of_day <= 18;
  const hourCont = isNightTime ? 0.8 : isBusinessHours ? -0.5 : 0.1;
  contributions.push({
    feature: "Hour of Day",
    raw: hourCont,
    value: `${input.hour_of_day}:00`,
  });

  // 5. Day of week — weekends slightly riskier
  const isWeekend = input.day_of_week === 0 || input.day_of_week === 6;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayCont = isWeekend ? 0.3 : -0.1;
  contributions.push({
    feature: "Day of Week",
    raw: dayCont,
    value: days[input.day_of_week],
  });

  // 6. Device type — mobile transactions have higher fraud rate
  const deviceCont =
    input.device_type === "mobile"
      ? 0.6
      : input.device_type === "tablet"
      ? 0.2
      : -0.3;
  contributions.push({
    feature: "Device Type",
    raw: deviceCont,
    value: input.device_type,
  });

  // 7. Traffic source — direct traffic is safer, ads can be risky
  const sourceCont =
    input.source === "Direct" ? -0.4 : input.source === "Ads" ? 0.3 : 0.0;
  contributions.push({
    feature: "Traffic Source",
    raw: sourceCont,
    value: input.source,
  });

  // 8. Browser — IE/Opera associated with higher fraud rates
  const browserCont =
    input.browser === "IE"
      ? 0.7
      : input.browser === "Opera"
      ? 0.4
      : input.browser === "Firefox"
      ? 0.1
      : input.browser === "Chrome"
      ? -0.2
      : 0.0;
  contributions.push({
    feature: "Browser",
    raw: browserCont,
    value: input.browser,
  });

  // 9. Sex — minimal but documented difference in fraud datasets
  const sexCont = input.sex === "M" ? 0.1 : -0.1;
  contributions.push({ feature: "Sex", raw: sexCont, value: input.sex });

  // --- Interaction term: new account on mobile at night (high-risk combo) ---
  const interactionBoost =
    normAge < 0.1 && input.device_type === "mobile" && isNightTime ? 0.8 : 0;

  // --- Final score ---
  const rawScore =
    contributions.reduce((sum, c) => sum + c.raw, 0) + interactionBoost - 0.5;
  const fraud_probability = Math.round(sigmoid(rawScore) * 100) / 100;
  const is_fraud = fraud_probability >= 0.5;
  const risk_level: "High" | "Medium" | "Low" =
    fraud_probability >= 0.7
      ? "High"
      : fraud_probability >= 0.4
      ? "Medium"
      : "Low";

  // --- SHAP values: normalise contributions relative to each other ---
  const maxAbs = Math.max(...contributions.map((c) => Math.abs(c.raw)), 0.001);
  const shap_values: ShapValue[] = contributions
    .map((c) => ({
      feature: c.feature,
      impact: Math.round((c.raw / maxAbs) * 100) / 100,
      value: c.value,
    }))
    .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

  return { fraud_probability, is_fraud, risk_level, shap_values };
}

// Generate mock transaction history for the overview page
export function generateMockHistory(count = 12) {
  const browsers: TransactionInput["browser"][] = [
    "Chrome", "Firefox", "Safari", "IE", "Opera",
  ];
  const devices: TransactionInput["device_type"][] = [
    "mobile", "desktop", "tablet",
  ];
  const sources: TransactionInput["source"][] = ["SEO", "Ads", "Direct"];

  return Array.from({ length: count }, (_, i) => {
    const input: TransactionInput = {
      purchase_value: Math.round(Math.random() * 1800 + 20),
      age: Math.round(Math.random() * 50 + 18),
      time_since_signup: Math.round(Math.random() * 700),
      hour_of_day: Math.round(Math.random() * 23),
      day_of_week: Math.round(Math.random() * 6),
      device_type: devices[Math.floor(Math.random() * devices.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      sex: Math.random() > 0.5 ? "M" : "F",
    };
    const result = predict(input);
    return {
      id: `TXN-${String(1000 + i).padStart(4, "0")}`,
      ...input,
      ...result,
      timestamp: new Date(Date.now() - i * 3_600_000).toISOString(),
    };
  });
}
