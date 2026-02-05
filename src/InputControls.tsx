import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './components/ui/button';
import { Label } from './components/ui/label';
import { Slider } from './components/ui/slider';
import { Switch } from './components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';

export interface InputFormData {
  time_of_day: number;
  day_of_week: number; // 0 for Monday, 6 for Sunday
  location: string;
  demand_level: number;
  supply_level: number;
  weather: string;
  is_event: boolean;
}

interface InputControlsProps {
  formData: InputFormData;
  onInputChange: (data: InputFormData) => void;
  onSubmit: () => void;
  loading: boolean;
}

const dayOfWeekOptions = [
  { value: '0', label: 'Monday' },
  { value: '1', label: 'Tuesday' },
  { value: '2', label: 'Wednesday' },
  { value: '3', label: 'Thursday' },
  { value: '4', label: 'Friday' },
  { value: '5', label: 'Saturday' },
  { value: '6', label: 'Sunday' },
];

const locationOptions = [
  { value: 'Zone A', label: 'Zone A' },
  { value: 'Zone B', label: 'Zone B' },
  { value: 'Zone C', label: 'Zone C' },
  { value: 'Zone D', label: 'Zone D' },
];

const weatherOptions = [
  { value: 'Clear', label: 'Clear' },
  { value: 'Rainy', label: 'Rainy' },
  { value: 'Cloudy', label: 'Cloudy' },
  { value: 'Snowy', label: 'Snowy' },
];

const InputControls: React.FC<InputControlsProps> = ({ formData, onInputChange, onSubmit, loading }) => {
  const handleChange = (field: keyof InputFormData, value: any) => {
    onInputChange({ ...formData, [field]: value });
  };

  const InputWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-3">
      <Label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground/80">{title}</Label>
      {children}
    </div>
  );

  return (
    <div className="space-y-8">
      <InputWrapper title="Time of Day">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between text-sm font-medium">
            <span>{formData.time_of_day}:00</span>
          </div>
          <Slider
            value={[formData.time_of_day]}
            onValueChange={([value]) => handleChange('time_of_day', value)}
            max={23}
            min={0}
            step={1}
            aria-label="Time of Day"
          />
        </div>
      </InputWrapper>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <InputWrapper title="Day of Week">
          <Select
            value={String(formData.day_of_week)}
            onValueChange={(value) => handleChange('day_of_week', Number(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              {dayOfWeekOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </InputWrapper>

        <InputWrapper title="Location">
          <Select
            value={formData.location}
            onValueChange={(value) => handleChange('location', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </InputWrapper>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <InputWrapper title="Demand Level">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between text-sm font-medium">
              <span>{formData.demand_level.toFixed(1)}</span>
            </div>
            <Slider
              value={[formData.demand_level]}
              onValueChange={([value]) => handleChange('demand_level', value)}
              max={10}
              min={1}
              step={0.1}
              aria-label="Demand Level"
            />
          </div>
        </InputWrapper>

        <InputWrapper title="Supply Level">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between text-sm font-medium">
              <span>{formData.supply_level.toFixed(1)}</span>
            </div>
            <Slider
              value={[formData.supply_level]}
              onValueChange={([value]) => handleChange('supply_level', value)}
              max={10}
              min={1}
              step={0.1}
              aria-label="Supply Level"
            />
          </div>
        </InputWrapper>
      </div>

      <InputWrapper title="Weather Condition">
        <Select
          value={formData.weather}
          onValueChange={(value) => handleChange('weather', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select weather" />
          </SelectTrigger>
          <SelectContent>
            {weatherOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </InputWrapper>

      <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
        <div className="space-y-0.5">
          <Label htmlFor="is-event" className="text-base">Special Event</Label>
          <p className="text-sm text-muted-foreground">Is there a major event happening?</p>
        </div>
        <Switch
          id="is-event"
          checked={formData.is_event}
          onCheckedChange={(checked) => handleChange('is_event', checked)}
        />
      </div>

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
          "Predict Surge Multiplier"
        )}
      </Button>
    </div>
  );
};

export default InputControls;
