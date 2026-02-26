export const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8001';

export const API_BASE_URL = RAW_API_BASE_URL
  .replace(/^http:\/\/([^/]+\.vercel\.app)(\/?.*)$/, 'https://$1$2')
  .replace(/\/+$/, '');

export interface ProfitFeatures {
  Number_of_Riders: number;
  Number_of_Drivers: number;
}

export interface ProfitPredictionResponse {
  predicted_profit_percentage: number;
}

export interface ProfitBatchPredictionResponse {
  predictions: ProfitPredictionResponse[];
}
