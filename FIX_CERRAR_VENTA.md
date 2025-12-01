# 🔧 Fix: Error al Cerrar Venta

## ❌ Problema
Al intentar cerrar una venta desde Admin > Cotizaciones, aparece el error:
```
Error al crear el pedido: new row violates row-level security policy for table "store_stats"
```

## 🔍 Causa
El trigger `update_store_stats()` se ejecuta automáticamente cuando se crea una orden, pero:
1. Se ejecuta con los permisos del usuario que hace el INSERT
2. Las políticas RLS de `store_stats` no permiten que usuarios normales inserten/actualicen
3. Esto causa un error de seguridad

## ✅ Solución
Modificar la función `update_store_stats()` para que use `SECURITY DEFINER`, lo que hace que se ejecute con permisos elevados (del dueño de la función, no del usuario).

## 📋 Pasos para Aplicar el Fix

### 1. Ejecutar la Migración SQL

Ve a Supabase Dashboard > SQL Editor y ejecuta:

```sql
-- Recrear la función con SECURITY DEFINER
CREATE OR REPLACE FUNCTION update_store_stats()
RETURNS TRIGGER 
SECURITY DEFINER -- Ejecutar con permisos del dueño de la función
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    INSERT INTO store_stats (store_id, total_orders, total_revenue, last_order_date, updated_at)
    SELECT 
      NEW.store_id,
      COUNT(*) as total_orders,
      COALESCE(SUM(total), 0) as total_revenue,
      MAX(created_at) as last_order_date,
      NOW() as updated_at
    FROM orders
    WHERE store_id = NEW.store_id
      AND status IN ('confirmed', 'preparing', 'ready', 'shipped', 'delivered')
    GROUP BY store_id
    ON CONFLICT (store_id) 
    DO UPDATE SET
      total_orders = EXCLUDED.total_orders,
      total_revenue = EXCLUDED.total_revenue,
      last_order_date = EXCLUDED.last_order_date,
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recrear el trigger
DROP TRIGGER IF EXISTS trigger_update_store_stats ON orders;
DROP TRIGGER IF EXISTS update_store_orders_stats ON orders;

CREATE TRIGGER trigger_update_store_stats
AFTER INSERT OR UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_store_stats();
```

### 2. Verificar que Funcionó

Después de ejecutar la migración:

1. Ve a Admin > Cotizaciones
2. Abre cualquier cotización pendiente
3. Haz clic en "Cerrar Venta"
4. Debería funcionar sin errores ✅

## 🔐 Seguridad

**¿Es seguro usar SECURITY DEFINER?**

Sí, en este caso es seguro porque:
- La función solo actualiza estadísticas agregadas
- No expone datos sensibles
- Solo se ejecuta en el contexto de un trigger controlado
- El `SET search_path = public` previene ataques de inyección de schema

## 📊 Qué Hace la Función

La función `update_store_stats()`:
1. Se ejecuta automáticamente cuando se crea o actualiza una orden
2. Calcula estadísticas agregadas de la tienda:
   - Total de órdenes
   - Ingresos totales
   - Fecha de última orden
3. Actualiza la tabla `store_stats` con estos datos
4. Usa `ON CONFLICT` para actualizar si ya existe un registro

## 🧪 Prueba Completa

1. **Crear una cotización:**
   - Agregar productos al carrito
   - Ir a checkout
   - Completar datos
   - Enviar cotización

2. **Responder la cotización:**
   - Admin > Cotizaciones
   - Abrir la cotización
   - "Responder Cotización"
   - Ajustar precios si es necesario
   - "Enviar por WhatsApp"

3. **Cerrar la venta:**
   - En la misma cotización
   - Clic en "Cerrar Venta"
   - Confirmar
   - Debería mostrar: "¡Venta cerrada exitosamente! 🎉"

4. **Verificar:**
   - La cotización cambia a estado "Venta Cerrada"
   - Se crea una orden en Admin > Pedidos
   - Las estadísticas de la tienda se actualizan

## 📝 Archivo de Migración

El archivo completo está en:
`supabase/migrations/20241201_fix_store_stats_rls.sql`

## ⚠️ Nota Importante

Si ya ejecutaste la migración anterior (`20241201_fix_store_stats_rls.sql`) y aún tienes el error, asegúrate de:

1. Refrescar la página del admin
2. Cerrar sesión y volver a iniciar
3. Verificar que el trigger se recreó correctamente:

```sql
SELECT tgname, tgrelid::regclass, proname 
FROM pg_trigger 
JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid
WHERE tgrelid = 'orders'::regclass;
```

Deberías ver `trigger_update_store_stats` apuntando a `update_store_stats`.
