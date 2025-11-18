# 🗄️ Configuración de Supabase - Guía Paso a Paso

## ✅ Paso 1: Ejecutar el Schema SQL

1. Ve a tu proyecto de Supabase: https://bkzfuprwdntoegkuemkw.supabase.co
2. En el menú lateral, haz clic en **SQL Editor**
3. Haz clic en **New Query**
4. Copia TODO el contenido del archivo `supabase/schema.sql`
5. Pégalo en el editor
6. Haz clic en **Run** (o presiona Ctrl+Enter)

Deberías ver un mensaje de éxito. Esto creará:
- ✅ 4 tablas: products, orders, promotions, inventory_logs
- ✅ Triggers automáticos
- ✅ Políticas de seguridad (RLS)
- ✅ Índices para mejor rendimiento

## ✅ Paso 2: Agregar Productos de Prueba

1. En el mismo **SQL Editor**, crea una nueva query
2. Copia TODO el contenido del archivo `scripts/seed-products.sql`
3. Pégalo y haz clic en **Run**

Esto agregará 17 productos de ejemplo:
- 4 Zapatos
- 7 Ropa
- 6 Accesorios

## ✅ Paso 3: Verificar las Tablas

1. Ve a **Table Editor** en el menú lateral
2. Deberías ver las tablas:
   - products (con 17 productos)
   - orders (vacía)
   - promotions (vacía)
   - inventory_logs (vacía)

## ✅ Paso 4: Configurar Storage (Opcional)

Para subir imágenes de productos:

1. Ve a **Storage** en el menú lateral
2. Haz clic en **Create a new bucket**
3. Nombre: `products`
4. Public bucket: **Sí** (activado)
5. Haz clic en **Create bucket**

### Configurar políticas de Storage:

1. Haz clic en el bucket `products`
2. Ve a **Policies**
3. Agrega estas políticas:

**Política de lectura pública:**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'products' );
```

**Política de escritura para usuarios autenticados:**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'products' 
  AND auth.role() = 'authenticated'
);
```

## ✅ Paso 5: Crear Usuario Administrador

1. Ve a **Authentication** > **Users**
2. Haz clic en **Add user**
3. Selecciona **Create new user**
4. Email: `admin@samacastore.com` (o el que prefieras)
5. Password: (crea una contraseña segura)
6. Haz clic en **Create user**

Usa estas credenciales para entrar en `/admin/login`

## ✅ Paso 6: Verificar la Conexión

1. Asegúrate de que el servidor esté corriendo:
```bash
npm run dev
```

2. Ve a http://localhost:3000/catalogo

3. Deberías ver los 17 productos cargados desde Supabase

## 🔍 Verificación de Datos

Puedes ejecutar estas queries en SQL Editor para verificar:

```sql
-- Ver todos los productos
SELECT name, category, price, stock, status 
FROM products 
ORDER BY category, name;

-- Contar productos por categoría
SELECT category, COUNT(*) as total
FROM products
GROUP BY category;

-- Ver productos con stock bajo
SELECT name, stock, status
FROM products
WHERE status = 'low_stock'
ORDER BY stock;
```

## 🎨 Subir Imágenes Reales

1. Ve a **Storage** > **products**
2. Haz clic en **Upload file**
3. Sube tus imágenes de productos
4. Copia la URL pública de cada imagen
5. Actualiza los productos:

```sql
UPDATE products 
SET images = ARRAY['https://bkzfuprwdntoegkuemkw.supabase.co/storage/v1/object/public/products/tu-imagen.jpg']
WHERE id = 'id-del-producto';
```

## 🔐 Seguridad

### Obtener Service Role Key (para operaciones admin):

1. Ve a **Settings** > **API**
2. Copia el **service_role key** (¡NO lo compartas!)
3. Agrégalo a `.env.local`:
```env
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
```

## 📊 Monitoreo

### Ver logs en tiempo real:

1. Ve a **Logs** en el menú lateral
2. Selecciona **Postgres Logs** para ver queries
3. Selecciona **API Logs** para ver requests

### Ver métricas:

1. Ve a **Reports**
2. Verás:
   - Requests por día
   - Usuarios activos
   - Storage usado
   - Database size

## 🚨 Solución de Problemas

### Error: "relation does not exist"
- Asegúrate de haber ejecutado `schema.sql` completo
- Verifica en Table Editor que las tablas existan

### Error: "permission denied"
- Revisa las políticas RLS
- Verifica que el usuario esté autenticado

### Productos no aparecen
- Ejecuta `seed-products.sql`
- Verifica en Table Editor que haya datos
- Revisa la consola del navegador (F12)

### Imágenes no cargan
- Verifica que el bucket sea público
- Revisa las URLs de las imágenes
- Comprueba las políticas de Storage

## 📝 Próximos Pasos

1. ✅ Personaliza los productos con tus datos reales
2. ✅ Sube imágenes de tus productos
3. ✅ Crea promociones en la tabla `promotions`
4. ✅ Prueba el flujo completo de compra
5. ✅ Configura tu número de WhatsApp en `.env.local`

## 🎯 Estado Actual

- ✅ Base de datos configurada
- ✅ Credenciales conectadas
- ✅ Productos de prueba listos
- ⏳ Pendiente: Ejecutar scripts SQL
- ⏳ Pendiente: Crear usuario admin

---

**¡Tu base de datos está lista! Ahora ejecuta los scripts SQL y empieza a vender 🚀**
