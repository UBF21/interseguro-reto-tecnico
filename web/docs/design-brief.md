# Design Brief — Interseguro Reto Técnico (Technical Lead)

> Fuente: paleta corporativa de seguros/banca profesional, ajustada a partir de una
> inspección superficial de interseguro.pe (no expone sus tokens de marca en el HTML
> público). **Si el usuario tiene acceso al manual de marca real de Interseguro,
> reemplazar los hex de la sección Paleta antes de tocar componentes** — el resto del
> brief (tipografía, radios, tono) no depende de eso.

## Paleta (HARD CONSTRAINT)

| Token | Hex | Uso |
|---|---|---|
| `--primary` | `#0B3D91` | Azul corporativo profundo — headers, CTAs primarios, links activos |
| `--primary-foreground` | `#FFFFFF` | Texto sobre `--primary` |
| `--accent` | `#00A99D` | Turquesa — estados de éxito, highlights, iconografía de "endoso"/"ruta" |
| `--accent-foreground` | `#0B3D91` | Texto sobre `--accent` claro |
| `--background` | `#F7F9FC` | Fondo general (gris azulado muy claro, no blanco puro) |
| `--surface` | `#FFFFFF` | Cards, modales |
| `--foreground` | `#1C2733` | Texto principal (gris oscuro azulado, no negro puro) |
| `--muted-foreground` | `#5B6472` | Texto secundario, labels |
| `--border` | `#E2E8F0` | Bordes de card/input |
| `--destructive` | `#D64545` | Errores de validación, campos faltantes |
| `--warning` | `#E8A33D` | Estados intermedios (ej. "procesando en INARI") |

No usar azul Bootstrap (`#0d6efd`), ni morado/gradientes tipo SaaS genérico, ni sombras difusas grandes — el tono es corporativo de seguros, no startup.

## Tipografía

- **Inter** (variable, ya viene con shadcn por defecto) — cubre bien números tabulares para los JSON viewers.
- Escala: `text-sm` (14px) para labels/tablas, `text-base` (16px) body, `text-xl`/`text-2xl` para headers de sección. Nada por debajo de 14px.

## Border radius / sombras / densidad

- `radius: 8px` (`rounded-lg` de Tailwind) en cards e inputs — ni muy cuadrado (banca legacy) ni muy redondeado (consumer app).
- Sombras sutiles: `shadow-sm` en cards, nunca `shadow-xl`/glow.
- Densidad media: padding `p-6` en cards, `gap-4` en forms — no comprimido, no espacioso tipo landing marketing.

## Tono

Profesional, confiable, sobrio. Sin ilustraciones, sin emojis en la UI, sin copy "cute". Los dos ejercicios (traductor de endosos, rutas óptimas) son herramientas internas de operación — se diseñan como *tooling*, no como producto de consumo: prioridad a la legibilidad del JSON de salida y la claridad del formulario sobre cualquier efecto visual.

## Restricciones

- No se puede cambiar la paleta sin aprobación — si un componente "necesita" otro azul, se ajusta con tint/shade de `--primary`, no un color nuevo.
- El JSON de salida (traductor de endosos, ruta óptima) se muestra en un viewer con syntax highlighting monoespaciado — nunca como texto plano sin formato.

## Anti-referencias

- Nada de gradientes morado→rosado (cliché de landing IA/SaaS).
- Nada de glassmorphism / blur de fondo.
- Nada de iconos 3D o ilustraciones flat estilo Notion.
