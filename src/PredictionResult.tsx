import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { AlertCircle, TrendingUp, Zap } from 'lucide-react';

interface PredictionResultProps {
  prediction: { predicted_price: number } | null;
  loading: boolean;
  error: string | null;
}

const CURRENCY_RATES: Record<string, number> = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
  AED: 0.044,
  LKR: 3.67,
};

const CURRENCIES = Object.keys(CURRENCY_RATES);

const PredictionResult: React.FC<PredictionResultProps> = ({ prediction, loading, error }) => {
  const [currency, setCurrency] = useState('INR');

  const formatCurrency = (value: number, code: string) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const convertedPrice = useMemo(
    () => (prediction ? prediction.predicted_price * CURRENCY_RATES[currency] : 0),
    [prediction, currency]
  );

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[150px]">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="relative">
              <motion.div
                className="h-20 w-20 rounded-full border-4 border-primary/20 border-t-primary"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              />
              <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary animate-pulse" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">Analyzing Trip Inputs</p>
              <p className="text-sm text-muted-foreground">Calculating predicted price...</p>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center space-y-4 text-destructive p-6 rounded-xl bg-destructive/5 border border-destructive/20"
          >
            <AlertCircle className="h-12 w-12" />
            <div className="text-center">
              <h3 className="font-bold text-xl">Prediction Failed</h3>
              <p className="max-w-[250px] text-sm opacity-90">{error}</p>
            </div>
          </motion.div>
        ) : prediction ? (
          <motion.div
            key="result"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="w-full space-y-8"
          >
            <div className="text-center space-y-3">
              <div className="mb-2 flex items-center justify-center gap-3">
                {/* <Badge variant={getPriceBand(prediction.predicted_price).variant} className="px-4 py-1 text-sm font-bold uppercase tracking-widest">
                  {getPriceBand(prediction.predicted_price).label}
                </Badge> */}
                <select
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value)}
                  className="h-8 w-20 rounded-md border border-border bg-background px-2 text-sm font-semibold"
                  aria-label="Select output currency"
                >
                  {CURRENCIES.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative inline-block">
                <motion.p className="text-5xl sm:text-6xl font-black tracking-tight text-foreground">
                  <AnimatedNumber value={convertedPrice} formatter={(num) => formatCurrency(num, currency)} />
                </motion.p>
              </div>

              <p className="text-xs text-muted-foreground">
                Base model output: {formatCurrency(prediction.predicted_price, 'INR')} (INR)
              </p>
              <p className="text-xs text-muted-foreground">
                Conversion rates are static for UI preview.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="initial"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center space-y-6 text-center text-muted-foreground"
          >
            <div className="h-24 w-24 rounded-full bg-muted/50 flex items-center justify-center">
              <TrendingUp className="h-12 w-12 opacity-20" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Ready to Forecast</h3>
              <p className="text-sm max-w-[280px]">Adjust the inputs on the left and click predict to see the estimated trip price.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AnimatedNumber: React.FC<{ value: number; formatter?: (value: number) => string }> = ({ value, formatter }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest: number) => (formatter ? formatter(latest) : latest.toFixed(2)));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5, ease: [0.16, 1, 0.3, 1] });

    const unsubscribe = rounded.on('change', (latest) => {
      if (ref.current) ref.current.textContent = latest;
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, count, rounded]);

  return <span ref={ref}>{formatter ? formatter(0) : '0.00'}</span>;
};

export default PredictionResult;
