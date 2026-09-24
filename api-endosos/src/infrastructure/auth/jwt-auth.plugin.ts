import Hapi from '@hapi/hapi';
import HapiJwt from '@hapi/jwt';

export interface JwtAuthConfig {
  secret: string;
  issuer: string;
  audience: string;
}

// api-auth firma el claim de rol con System.Security.Claims.ClaimTypes.Role -- ese enum se
// serializa como esta URI larga en el JWT, no como "role"/"roles". Mismo contrato en api-rutas.
export const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
export const REQUIRED_ROLE = 'operator';

// Verifica los mismos JWT que emite api-auth (HS256, secreto compartido vía Vault/env) y exige
// el rol "operator" -- autenticación (¿token válido?) + autorización (¿el usuario puede usar esto?).
export async function registerJwtAuth(server: Hapi.Server, config: JwtAuthConfig): Promise<void> {
  await server.register(HapiJwt);

  server.auth.strategy('jwt', 'jwt', {
    keys: config.secret,
    verify: {
      aud: config.audience,
      iss: config.issuer,
      sub: false,
      nbf: true,
      exp: true,
    },
    validate: (artifacts: { decoded: { payload: Record<string, unknown> } }) => {
      if (artifacts.decoded.payload[ROLE_CLAIM] !== REQUIRED_ROLE) {
        return { isValid: false };
      }
      return { isValid: true, credentials: artifacts.decoded.payload };
    },
  });

  server.auth.default('jwt');
}
