# 🔧 Arreglar Error "Cerrar Venta"

## ❌ Error Actual
```
Error al crear el pedido: new row violates row-level security policy for table "store_stats"
```

## ✅ Solución

El problema es que el trigger `update_store_stats()` se ejecuta con los permisos del usuario que crea la orden, pero ese usuario no tiene permisos para insertar en `store_stats`.

La solución es hacer que la función use `SECURITY DEFINER` para ejecutarse con permisos elevados.

## 📋 Pasos para Ejecutar la Migración

### 1. Ve a Supabase Dashboard
- Abre tu proyecto en https://supabase.com/dashboard
- Ve a "SQL Editor" en el menú lateral

### 2. Ejecuta la Migración
- Haz clic en "New Query"
- Copia y pega el contenido del archivo: `supabase/migrations/20241201_fix_store_stats_rls.sql`
- Haz clic en "Run" (o presiona Ctrl+Enter)

### 3. Verifica el Resultado
Deberías ver en los resultados:
- La función `update_store_stats()` recreada con `SECURITY DEFINER`
- Las políticas RLS actualizadas
- El trigger recreado
- Una tabla con las políticas actuales

## 🧪 Probar el Fix

1. Ve a Admin > Cotizaciones
2. Abre cualquier cotización pendiente
3. Haz clic en "Cerrar Venta"
4. Debería funcionar sin errores ✅

## 📝 Qué Hace la Migración

1. **Recrea la función `update_store_stats()`** con `SECURITY DEFINER`
   - Esto hace que la función se ejecute con permisos del dueño (postgres)
   - Bypasea las políticas RLS de forma segura

2. **Actualiza las políticas RLS** de `store_stats`
   - SELECT: Dueños y staff pueden ver sus estadísticas
   - INSERT: Dueños y staff pueden insertar (aunque el trigger lo hace automáticamente)
   - UPDATE: Dueños y staff pueden actualizar

3. **Recrea el trigger** para asegurarse de que use la nueva función

## ⚠️ Importante

- Esta migración es segura de ejecutar múltiples veces
- No afecta datos existentes
- Solo modifica permisos y la función del trigger
- Es necesaria para que "Cerrar Venta" funcione correctamente

## 🔍 Verificar que Funcionó

Después de ejecutar la migración, verifica:

```sql
-- Ver la función (debe tener SECURITY DEFINER)
SELECT proname, prosecdef 
FROM pg_proc 
WHERE proname = 'update_store_stats';

-- Ver el trigger
SELECT tgname, tgfoid::regproc 
FROM pg_trigger 
WHERE tgname = 'trigger_update_store_stats';
```

Si `prosecdef` es `true`, la función tiene `SECURITY DEFINER` ✅
