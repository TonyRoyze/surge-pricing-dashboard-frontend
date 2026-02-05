import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { cn } from './utils';
import { Badge } from './components/ui/badge';
import { AlertCircle, TrendingUp, Zap } from 'lucide-react';

interface PredictionResultProps {
  prediction: { surge_multiplier: number; confidence: number } | null;
  loading: boolean;
  error: string | null;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ prediction, loading, error }) => {
  const getSurgeInfo = (multiplier: number) => {
    if (multiplier >= 2.5) return { color: 'text-destructive', label: 'High Surge', variant: 'destructive' as const };
    if (multiplier >= 1.5) return { color: 'text-amber-500', label: 'Moderate Surge', variant: 'secondary' as const };
    return { color: 'text-emerald-500', label: 'Normal Pricing', variant: 'default' as const };
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[300px]">
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
              <p className="text-lg font-semibold">Analyzing Markets</p>
              <p className="text-sm text-muted-foreground">Calculating optimal multiplier...</p>
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
            <div className="text-center space-y-2">
              <Badge variant={getSurgeInfo(prediction.surge_multiplier).variant} className="px-4 py-1 text-sm font-bold uppercase tracking-widest mb-4">
                {getSurgeInfo(prediction.surge_multiplier).label}
              </Badge>
              <div className="relative inline-block">
                <motion.h2
                  className={cn("text-8xl font-black tracking-tighter", getSurgeInfo(prediction.surge_multiplier).color)}
                >
                  <AnimatedNumber value={prediction.surge_multiplier} />
                  <span className="text-4xl ml-1">x</span>
                </motion.h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border bg-card/50 backdrop-blur-sm space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase">Confidence</p>
                <p className="text-2xl font-bold">{(prediction.confidence * 100).toFixed(0)}%</p>
              </div>
              <div className="p-4 rounded-xl border bg-card/50 backdrop-blur-sm space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase">Trend</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-emerald-500">Stable</p>
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground italic px-8">
              Based on real-time demand patterns and historical surge data for this zone.
            </p>
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
              <p className="text-sm max-w-[280px]">Adjust the parameters on the left and click predict to see the expected surge multiplier.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest: number) => latest.toFixed(2));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5, ease: [0.16, 1, 0.3, 1] });

    const unsubscribe = rounded.on("change", (latest) => {
      if (ref.current) ref.current.textContent = latest;
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, count, rounded]);

  return <span ref={ref}>0.00</span>;
};

export default PredictionResult;
