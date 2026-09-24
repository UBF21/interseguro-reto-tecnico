import { DepotsMultiSelect } from './DepotsMultiSelect'
import { DistrictSelect } from './DistrictSelect'

interface RutaFormFieldsProps {
  districts: string[]
  accidentLocation: string
  onChangeAccidentLocation: (value: string) => void
  depots: string[]
  onChangeDepots: (value: string[]) => void
  isReconfiguring?: boolean
}

export function RutaFormFields({
  districts,
  accidentLocation,
  onChangeAccidentLocation,
  depots,
  onChangeDepots,
  isReconfiguring,
}: RutaFormFieldsProps) {
  return (
    <>
      <DistrictSelect
        label="Distrito del accidente"
        districts={districts}
        value={accidentLocation}
        onChange={onChangeAccidentLocation}
        isLoading={isReconfiguring}
      />
      {accidentLocation ? (
        <DepotsMultiSelect districts={districts} value={depots} onChange={onChangeDepots} />
      ) : (
        <p className="text-sm text-muted-foreground">Elegí el distrito del accidente para configurar las bases de grúas.</p>
      )}
    </>
  )
}
