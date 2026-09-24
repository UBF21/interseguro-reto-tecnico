import { Label } from '@/components/ui/label'

interface DepotsMultiSelectProps {
  districts: string[]
  value: string[]
  onChange: (value: string[]) => void
}

export function DepotsMultiSelect({ districts, value, onChange }: DepotsMultiSelectProps) {
  function toggle(district: string) {
    onChange(value.includes(district) ? value.filter((d) => d !== district) : [...value, district])
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>Bases de grúas</Label>
      <div className="flex flex-wrap gap-2 rounded-md border border-border p-2">
        {districts.map((district) => (
          <label
            key={district}
            className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-sm has-checked:border-primary has-checked:bg-primary/10 has-checked:text-primary"
          >
            <input
              type="checkbox"
              checked={value.includes(district)}
              onChange={() => toggle(district)}
              className="size-3.5 accent-primary"
            />
            {district}
          </label>
        ))}
      </div>
    </div>
  )
}
