import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLoginMutation } from '../hooks/use-login'
import { loginSchema, type LoginFormValues } from '../schemas/login.schema'
import { DemoCredentialsHint } from './DemoCredentialsHint'
import { EmailField } from './EmailField'
import { LoginFormHeader } from './LoginFormHeader'
import { PasswordField } from './PasswordField'

export function LoginForm() {
  const { mutate, isPending, error } = useLoginMutation()
  // 'onChange' -- con 'onBlur' el botón podía quedar deshabilitado si el usuario clickeaba
  // "Ingresar" sin salir del campo password (nunca se disparaba su validación individual).
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema), mode: 'onChange' })

  return (
    <Card className="w-full max-w-sm border-border border-t-2 border-t-accent shadow-sm ring-0 [--card-spacing:--spacing(6)]">
      <LoginFormHeader />
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit((data) => mutate(data))}>
          <EmailField register={register('email')} error={errors.email?.message} disabled={isPending} />
          <PasswordField register={register('password')} error={errors.password?.message} disabled={isPending} />
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error.message}
            </p>
          )}
          <Button type="submit" disabled={isPending || !isValid} size="lg" className="mt-2 w-full">
            {isPending ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>
        <DemoCredentialsHint />
      </CardContent>
    </Card>
  )
}
