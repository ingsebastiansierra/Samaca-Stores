# Limpiar Números de Teléfono

## Problema
Los números de teléfono guardados con espacios, guiones o caracteres especiales causan errores en WhatsApp.

Ejemplo: `"32 19 35 91 70"` → Error: "El número no existe en WhatsApp"

## Solución Implementada

### 1. Frontend - Prevención
✅ El formulario de checkout ahora limpia automáticamente los números mientras el usuario escribe
✅ Solo permite dígitos (0-9)

### 2. Backend - Validación
✅ La API valida y limpia los números antes de guardarlos
✅ Todos los enlaces de WhatsApp limpian el número antes de usarlo

### 3. Base de Datos - Limpieza de datos existentes

**Ejecuta esta migración en Supabase para limpiar números viejos:**

```sql
-- Ir a: Supabase Dashboard > SQL Editor > New Query
-- Copiar y pegar este código:

UPDATE quotations
SET customer_phone = regexp_replace(customer_phone, '[^0-9]', '', 'g')
WHERE customer_phone ~ '[^0-9]';

-- Verificar los cambios
SELECT 
    id,
    ticket,
    customer_name,
    customer_phone,
    created_at
FROM quotations
ORDER BY created_at DESC
LIMIT 20;
```

## Pasos para ejecutar:

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a "SQL Editor" en el menú lateral
4. Haz clic en "New Query"
5. Copia y pega el código SQL de arriba
6. Haz clic en "Run" (o presiona Ctrl+Enter)
7. Verifica que los números ahora están limpios en la tabla de resultados

## Resultado Esperado

**Antes:**
- `"32 19 35 91 70"` ❌
- `"312-310-6507"` ❌
- `"(312) 310 6507"` ❌

**Después:**
- `"3219359170"` ✅
- `"3123106507"` ✅
- `"3123106507"` ✅

## Verificación

Después de ejecutar la migración:
1. Ve a Admin > Cotizaciones
2. Abre cualquier cotización
3. Haz clic en "WhatsApp Simple"
4. Debería abrir WhatsApp correctamente sin errores

## Edición Manual

Si necesitas corregir un número específico:
1. Ve a la cotización en Admin > Cotizaciones > [Cotización]
2. En la sección "Datos del Cliente", pasa el mouse sobre el teléfono
3. Haz clic en el ícono de editar que aparece
4. Corrige el número (solo dígitos)
5. Guarda

## Notas Técnicas

- La limpieza se hace con regex: `regexp_replace(customer_phone, '[^0-9]', '', 'g')`
- Solo afecta números que tienen caracteres no numéricos
- Los números ya limpios no se modifican
- Es seguro ejecutar múltiples veces
