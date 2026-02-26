import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';
import { API_BASE_URL, type ProfitBatchPredictionResponse } from './api';
import { Button } from './components/ui/button';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';

interface RideRecord {
  rideId: string;
  city: string;
  country: string;
  status: 'Completed' | 'In Progress' | 'Cancelled';
  requestedAt: string;
  estimatedFareUsd: number;
  Number_of_Riders: number;
  Number_of_Drivers: number;
  predictedProfitPercentage: number | null;
}

const INITIAL_RIDES: Omit<RideRecord, 'predictedProfitPercentage'>[] = [
  {
    rideId: 'RID-90012',
    city: 'San Francisco',
    country: 'USA',
    status: 'Completed',
    requestedAt: '2026-02-26 08:10',
    estimatedFareUsd: 23.4,
    Number_of_Riders: 124,
    Number_of_Drivers: 48,
  },
  {
    rideId: 'RID-90013',
    city: 'San Francisco',
    country: 'USA',
    status: 'In Progress',
    requestedAt: '2026-02-26 08:15',
    estimatedFareUsd: 29.1,
    Number_of_Riders: 165,
    Number_of_Drivers: 51,
  },
  {
    rideId: 'RID-90014',
    city: 'Los Angeles',
    country: 'USA',
    status: 'Completed',
    requestedAt: '2026-02-26 08:21',
    estimatedFareUsd: 17.8,
    Number_of_Riders: 109,
    Number_of_Drivers: 66,
  },
  {
    rideId: 'RID-90015',
    city: 'New York',
    country: 'USA',
    status: 'Completed',
    requestedAt: '2026-02-26 08:33',
    estimatedFareUsd: 35.2,
    Number_of_Riders: 210,
    Number_of_Drivers: 75,
  },
  {
    rideId: 'RID-90016',
    city: 'Chicago',
    country: 'USA',
    status: 'Cancelled',
    requestedAt: '2026-02-26 08:40',
    estimatedFareUsd: 0,
    Number_of_Riders: 78,
    Number_of_Drivers: 53,
  },
  {
    rideId: 'RID-90017',
    city: 'Austin',
    country: 'USA',
    status: 'In Progress',
    requestedAt: '2026-02-26 08:47',
    estimatedFareUsd: 26.8,
    Number_of_Riders: 144,
    Number_of_Drivers: 59,
  },
  {
    rideId: 'RID-90018',
    city: 'Miami',
    country: 'USA',
    status: 'Completed',
    requestedAt: '2026-02-26 08:52',
    estimatedFareUsd: 20.6,
    Number_of_Riders: 98,
    Number_of_Drivers: 61,
  },
];

const LIVE_SIM_LOCATIONS: Array<{ city: string; country: string }> = [
  { city: 'Tokyo', country: 'Japan' },
  { city: 'Nairobi', country: 'Kenya' },
  { city: 'Sao Paulo', country: 'Brazil' },
  { city: 'Berlin', country: 'Germany' },
  { city: 'Cape Town', country: 'South Africa' },
  { city: 'Sydney', country: 'Australia' },
  { city: 'Dubai', country: 'UAE' },
  { city: 'Toronto', country: 'Canada' },
  { city: 'Mexico City', country: 'Mexico' },
  { city: 'Colombo', country: 'Sri Lanka' },
];

const CURRENCY_RATES: Record<string, number> = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
  AED: 0.044,
  LKR: 3.67,
};

const CURRENCIES = Object.keys(CURRENCY_RATES);

const statusBadgeVariant: Record<RideRecord['status'], 'secondary' | 'destructive' | 'default'> = {
  Completed: 'secondary',
  'In Progress': 'default',
  Cancelled: 'destructive',
};

const RidesDashboard: React.FC = () => {
  const [rides, setRides] = useState<RideRecord[]>(
    INITIAL_RIDES.map((ride) => ({ ...ride, predictedProfitPercentage: null }))
  );
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | RideRecord['status']>('All');
  const [cityFilter, setCityFilter] = useState<'All' | string>('All');
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextRideNumber, setNextRideNumber] = useState(90019);

  const formatCurrency = (amountInUsd: number, code: string) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(amountInUsd * CURRENCY_RATES[code]);

  useEffect(() => {
    const fetchProfitPredictions = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.post<ProfitBatchPredictionResponse>(
          `${API_BASE_URL}/predict-profit-percentages`,
          {
            rides: INITIAL_RIDES.map(({ Number_of_Riders, Number_of_Drivers }) => ({
              Number_of_Riders,
              Number_of_Drivers,
            })),
          }
        );

        setRides((currentRides) =>
          currentRides.map((ride, index) => ({
            ...ride,
            predictedProfitPercentage:
              response.data.predictions[index]?.predicted_profit_percentage ?? null,
          }))
        );
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.detail ?? 'Failed to predict profit percentages.');
        } else {
          setError('Network error while fetching predicted profit percentages.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfitPredictions();
  }, []);

  const cityOptions = useMemo(() => {
    const unique = Array.from(new Set(rides.map((ride) => `${ride.city}, ${ride.country}`)));
    return ['All', ...unique];
  }, [rides]);

  const filteredRides = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return rides.filter((ride) => {
      const matchesSearch =
        searchValue.length === 0 ||
        ride.rideId.toLowerCase().includes(searchValue) ||
        ride.city.toLowerCase().includes(searchValue) ||
        ride.country.toLowerCase().includes(searchValue);
      const matchesStatus = statusFilter === 'All' || ride.status === statusFilter;
      const matchesCity = cityFilter === 'All' || `${ride.city}, ${ride.country}` === cityFilter;

      return matchesSearch && matchesStatus && matchesCity;
    });
  }, [rides, search, statusFilter, cityFilter]);

  const averageProfit = useMemo(() => {
    const values = filteredRides
      .filter((ride) => ride.status === 'Completed')
      .map((ride) => Math.abs(ride.predictedProfitPercentage ?? 0))
      .filter((value): value is number => value !== null);

    if (values.length === 0) {
      return null;
    }

    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }, [filteredRides]);

  const simulateRideEntry = async () => {
    const location = LIVE_SIM_LOCATIONS[Math.floor(Math.random() * LIVE_SIM_LOCATIONS.length)];
    const statuses: RideRecord['status'][] = ['Completed', 'In Progress', 'Cancelled'];
    const newRide: RideRecord = {
      rideId: `RID-${nextRideNumber}`,
      city: location.city,
      country: location.country,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      requestedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      estimatedFareUsd: Math.round((8 + Math.random() * 55) * 100) / 100,
      Number_of_Riders: Math.floor(50 + Math.random() * 230),
      Number_of_Drivers: Math.floor(20 + Math.random() * 120),
      predictedProfitPercentage: null,
    };

    setNextRideNumber((value) => value + 1);
    setRides((current) => [newRide, ...current]);

    try {
      const response = await axios.post<ProfitBatchPredictionResponse>(
        `${API_BASE_URL}/predict-profit-percentages`,
        {
          rides: [
            {
              Number_of_Riders: newRide.Number_of_Riders,
              Number_of_Drivers: newRide.Number_of_Drivers,
            },
          ],
        }
      );

      const predicted = response.data.predictions[0]?.predicted_profit_percentage ?? null;
      setRides((current) =>
        current.map((ride) =>
          ride.rideId === newRide.rideId
            ? { ...ride, predictedProfitPercentage: predicted }
            : ride
        )
      );
    } catch {
      setError('Failed to predict profit percentage for the new simulated ride.');
    }
  };

  return (
    <Card className="border-border/50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Ride Tracking Dashboard</CardTitle>
        <CardDescription>
          Track rides, filter by city and status, and see predicted profit percentage using AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            placeholder="Search by ride ID or city"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as 'All' | RideRecord['status'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All statuses</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={cityFilter} onValueChange={(value) => setCityFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter city" />
            </SelectTrigger>
            <SelectContent>
              {cityOptions.map((city) => (
                <SelectItem key={city} value={city}>
                  {city === 'All' ? 'All places' : city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-md border bg-muted/40 p-4 md:col-span-2 min-h-[168px] flex flex-col justify-center">
            <p className="text-muted-foreground text-sm">Average Profit %</p>
            <motion.p className="mt-1 text-5xl font-black tracking-tight text-foreground">
              {averageProfit === null ? '--' : <AnimatedPercent value={averageProfit} />}
            </motion.p>
          </div>
          <div className="space-y-3">
            <div className="rounded-md border border-dashed border-primary/60 bg-primary/5 p-3">
              <p className="mb-2 text-xs font-medium text-primary">
                Preview-only: currency selection (customer configurable in commercial product)
              </p>
              <Select value={currency} onValueChange={(value) => setCurrency(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Table currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((code) => (
                    <SelectItem key={code} value={code}>
                      {code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md border border-dashed border-primary/60 bg-primary/5 p-3">
              <p className="mb-2 text-xs font-medium text-primary">
                Preview-only: live simulation (customer configurable in commercial product)
              </p>
              <Button onClick={simulateRideEntry} className="w-full">
                Simulate Live Ride Entry
              </Button>
            </div>
          </div>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {loading ? <p className="text-sm text-muted-foreground">Calculating profit percentages...</p> : null}

        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Ride ID</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Riders</th>
                <th className="px-4 py-3 font-semibold">Drivers</th>
                <th className="px-4 py-3 font-semibold">Estimated Fare ({currency})</th>
                <th className="px-4 py-3 font-semibold">Profit % (Predicted)</th>
                <th className="px-4 py-3 font-semibold">Requested At</th>
              </tr>
            </thead>
            <tbody>
              {filteredRides.map((ride) => (
                <tr key={ride.rideId} className="border-t">
                  <td className="px-4 py-3 font-medium">{ride.rideId}</td>
                  <td className="px-4 py-3">{ride.city}, {ride.country}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusBadgeVariant[ride.status]}>{ride.status}</Badge>
                  </td>
                  <td className="px-4 py-3">{ride.Number_of_Riders}</td>
                  <td className="px-4 py-3">{ride.Number_of_Drivers}</td>
                  <td className="px-4 py-3">{formatCurrency(ride.estimatedFareUsd, currency)}</td>
                  <td className="px-4 py-3 font-semibold">
                    {ride.predictedProfitPercentage === null
                      ? '--'
                      : `${Math.abs(ride.predictedProfitPercentage).toFixed(2)}%`}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{ride.requestedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RidesDashboard;

const AnimatedPercent: React.FC<{ value: number }> = ({ value }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest: number) => `${latest.toFixed(2)}%`);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.2, ease: [0.16, 1, 0.3, 1] });

    const unsubscribe = rounded.on('change', (latest) => {
      if (ref.current) ref.current.textContent = latest;
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [count, rounded, value]);

  return <span ref={ref}>0.00%</span>;
};
