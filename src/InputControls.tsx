import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './components/ui/button';
import { Label } from './components/ui/label';
import { Minus, Plus } from 'lucide-react';

export interface InputFormData {
  Number_of_Riders: number;
  Number_of_Drivers: number;
  Expected_Ride_Duration: number;
}

interface InputControlsProps {
  formData: InputFormData;
  onInputChange: (data: InputFormData) => void;
  onSubmit: () => void;
  loading: boolean;
}

const InputControls: React.FC<InputControlsProps> = ({ formData, onInputChange, onSubmit, loading }) => {
  const handleChange = (field: keyof InputFormData, value: number) => {
    onInputChange({ ...formData, [field]: value });
  };

  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
  const normalizeStep = (value: number, step: number) => Number((Math.round(value / step) * step).toFixed(2));
  const formatDuration = (hours: number) => {
    const totalMinutes = Math.round(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${m}m`;
  };

  const NumberStepper: React.FC<{
    id: keyof InputFormData;
    label: string;
    min: number;
    max: number;
    step: number;
    value: number;
  }> = ({ id, label, min, max, step, value }) => {
    const decrement = () => handleChange(id, clamp(normalizeStep(value - step, step), min, max));
    const increment = () => handleChange(id, clamp(normalizeStep(value + step, step), min, max));

    return (
      <div className="space-y-3">
        <Label htmlFor={id} className="text-sm font-semibold tracking-wide uppercase text-muted-foreground/80">
          {label}
        </Label>
        <div className="relative flex items-center max-w-[14rem] rounded-lg shadow-sm">
          <button
            type="button"
            onClick={decrement}
            className="h-10 rounded-l-lg border border-border bg-muted px-3 text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label={`Decrease ${label}`}
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            id={id}
            type="text"
            value={value}
            readOnly
            className="h-10 w-full border-y border-border bg-muted px-2 text-center text-sm font-semibold text-foreground focus:outline-none"
          />
          <button
            type="button"
            onClick={increment}
            className="h-10 rounded-r-lg border border-border bg-muted px-3 text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label={`Increase ${label}`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  const InputWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-3">
      <Label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground/80">{title}</Label>
      {children}
    </div>
  );

  return (
    <div className="space-y-8">
      <InputWrapper title="">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <NumberStepper
            id="Number_of_Riders"
            label="Number of Riders"
            min={1}
            max={300}
            step={1}
            value={formData.Number_of_Riders}
          />
          <NumberStepper
            id="Number_of_Drivers"
            label="Number of Drivers"
            min={1}
            max={300}
            step={1}
            value={formData.Number_of_Drivers}
          />
          <div className="space-y-3 sm:col-span-2">
            <Label htmlFor="Expected_Ride_Duration" className="text-sm font-semibold tracking-wide uppercase text-muted-foreground/80">
              Expected Ride Duration
            </Label>
            <div className="relative flex items-center max-w-[18rem] rounded-lg shadow-sm">
              <button
                type="button"
                onClick={() => handleChange("Expected_Ride_Duration", clamp(normalizeStep(formData.Expected_Ride_Duration - 0.25, 0.25), 0.25, 6))}
                className="h-10 min-w-[4.5rem] rounded-l-lg border border-border bg-muted px-3 text-sm font-semibold text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Decrease duration by 15 minutes"
              >
                -15m
              </button>
              <input
                id="Expected_Ride_Duration"
                type="text"
                value={formatDuration(formData.Expected_Ride_Duration)}
                readOnly
                className="h-10 w-full border-y border-border bg-muted px-2 text-center text-sm font-semibold text-foreground focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleChange("Expected_Ride_Duration", clamp(normalizeStep(formData.Expected_Ride_Duration + 0.25, 0.25), 0.25, 6))}
                className="h-10 min-w-[4.5rem] rounded-r-lg border border-border bg-muted px-3 text-sm font-semibold text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Increase duration by 15 minutes"
              >
                +15m
              </button>
            </div>
            {/* <p className="text-xs text-muted-foreground">
              Duration shown in hours and minutes. Each click adjusts by 15 minutes.
            </p> */}
          </div>
        </div>
      </InputWrapper>

      <Button
        size="lg"
        className="w-full text-lg font-bold shadow-indigo-500/20 shadow-lg"
        onClick={onSubmit}
        disabled={loading}
      >
        {loading ? (
          <>
            <motion.div
              className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            Predicting...
          </>
        ) : (
          "Predict Price"
        )}
      </Button>
    </div>
  );
};

export default InputControls;
