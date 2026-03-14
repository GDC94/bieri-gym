# Code Review de Rama

Realiza un code review exhaustivo de la rama: `$ARGUMENTS`

## Instrucciones

1. **Fetch de la rama remota**:
   - Ejecuta `git fetch origin $ARGUMENTS` para obtener los últimos cambios

2. **Obtener archivos modificados**:
   - Compara la rama con `dev` usando `git diff`
   - Filtra solo archivos `.ts`, `.tsx`, `.js`, `.jsx`
   - Excluye archivos de test (`*.test.ts`, `*.spec.ts`, etc.)

3. **Leer las reglas de code review**:
   - Lee el archivo `AGENTS.md` que contiene todas las reglas del proyecto

4. **Analizar cada archivo modificado**:
   - Lee el contenido completo de cada archivo cambiado
   - Evalúa contra las reglas de `AGENTS.md`
   - Identifica violaciones, mejoras y buenas prácticas

5. **Generar reporte estructurado**:

## Formato del Reporte

```
## Code Review: [nombre-rama]

### Resumen
- Total de archivos revisados: X
- Issues críticos: X
- Warnings: X
- Sugerencias: X

### Issues Críticos (bloquean aprobación)
| Archivo | Línea | Regla | Descripción |
|---------|-------|-------|-------------|
| ...     | ...   | ...   | ...         |

### Warnings (deberían corregirse)
| Archivo | Línea | Regla | Descripción |
|---------|-------|-------|-------------|
| ...     | ...   | ...   | ...         |

### Sugerencias (opcionales)
| Archivo | Línea | Sugerencia |
|---------|-------|------------|
| ...     | ...   | ...        |

### Buenas Prácticas Detectadas
- ...

### Veredicto
[ ] APROBADO - Listo para merge
[ ] APROBADO CON COMENTARIOS - Merge después de cambios menores
[ ] CAMBIOS REQUERIDOS - No hacer merge hasta resolver issues críticos
```

## Notas
- Sé específico con las líneas y el contexto del problema
- Proporciona ejemplos de cómo corregir cada issue
- Prioriza issues de seguridad y bugs sobre estilo
- Reconoce el buen código, no solo los problemas
