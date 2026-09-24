import { Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface DistrictSelectProps {
  label: string
  districts: string[]
  value: string
  onChange: (value: string) => void
  isLoading?: boolean
}

export function DistrictSelect({ label, districts, value, onChange, isLoading }: DistrictSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={`district-select-${label}`} className="flex items-center gap-1.5">
        {label}
        {isLoading && <Loader2 className="size-3.5 animate-spin text-muted-foreground" aria-label="Actualizando" />}
      </Label>
      <Select value={value} onValueChange={(next) => next && onChange(next)}>
        <SelectTrigger id={`district-select-${label}`} className="w-full">
          <SelectValue placeholder="Elegí un distrito" />
        </SelectTrigger>
        <SelectContent>
          {districts.map((district) => (
            <SelectItem key={district} value={district}>
              {district}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
