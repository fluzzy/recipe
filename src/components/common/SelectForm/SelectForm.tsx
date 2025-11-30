import { ReactNode } from 'react';
import { FormControl } from '~/components/ui/form';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

interface SelectFormProps {
  children: ReactNode;
  value: string;
  placeholder: string;
  onChange: () => void;
}

export default function SelectForm({
  children,
  value,
  placeholder,
  onChange,
}: SelectFormProps) {
  return (
    <Select onValueChange={onChange} defaultValue={value}>
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
}
