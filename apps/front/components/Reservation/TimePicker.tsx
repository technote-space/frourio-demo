import type { FC } from 'react';
import { memo, useCallback } from 'react';
import { Select } from '@chakra-ui/react';

type Props = {
  value?: string;
  step: number;
  minHour?: number;
  minMinute?: number;
  maxHour?: number;
  maxMinute?: number;
  disabled?: boolean;
  onChange: (value: string) => void;
}

const TimePicker: FC<Props> = memo(({
  value, step, minHour, minMinute, maxHour, maxMinute, disabled, onChange,
}: Props) => {
  const handleChange = useCallback(event => {
    onChange(event.target.value);
  }, [onChange]);
  const getOptions = (): string[] => {
    const min = (minHour ?? 0) * 60 + (minMinute ?? 0);
    const max = (maxHour ?? 0) * 60 + (maxMinute ?? 0);
    const minutes: number[] = [];
    for (let val = min; val <= max; val += step) {
      minutes.push(val);
    }

    return minutes.map(val => {
      const hour = Math.floor(val / 60);
      const min = val - hour * 60;
      return `${`0${hour}`.slice(-2)}:${`0${min}`.slice(-2)}`;
    });
  };

  return <Select value={value} onChange={handleChange} disabled={disabled}>
    {getOptions().map(value => <option key={value} value={value}>{value}</option>)}
  </Select>;
});

TimePicker.displayName = 'TimePicker';
export default TimePicker;
