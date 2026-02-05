import React, { useState, useCallback } from 'react';
import axios from 'axios';
import InputControls from './InputControls';
import type { InputFormData } from './InputControls';
import PredictionResult from './PredictionResult';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './components/ui/card';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8001'; // FastAPI backend URL

interface PredictionResponse {
  surge_multiplier: number;
  confidence: number;
}

const Dashboard: React.FC = () => {
  const [formData, setFormData] = useState<InputFormData>({
    time_of_day: 12,
    day_of_week: 0, // Monday
    location: 'Zone A',
    demand_level: 5,
    supply_level: 5,
    weather: 'Clear',
    is_event: false,
  });

  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = useCallback((newFormData: InputFormData) => {
    setFormData(newFormData);
  }, []);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPrediction(null); // Clear previous prediction
    try {
      const response = await axios.post<PredictionResponse>(`${API_BASE_URL}/predict`, formData);
      setPrediction(response.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.detail || 'An unexpected error occurred.');
      } else {
        setError('Network error or unexpected issue.');
      }
      console.error('Prediction API error:', err);
    } finally {
      setLoading(false);
    }
  }, [formData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <Card className="border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle>Configure Inputs</CardTitle>
          <CardDescription>Adjust the parameters to predict the surge multiplier.</CardDescription>
        </CardHeader>
        <CardContent>
          <InputControls formData={formData} onInputChange={handleInputChange} onSubmit={handleSubmit} loading={loading} />
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-lg h-full min-h-[400px]">
        <CardHeader>
          <CardTitle>Prediction Result</CardTitle>
          <CardDescription>Real-time forecast based on your inputs.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center flex-1 py-12">
          <PredictionResult prediction={prediction} loading={loading} error={error} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
