# ⚡ INSTRUCCIONES RÁPIDAS - 3 Pasos

## 📋 Paso 1: Ejecutar Schema (Crear Tablas)

1. Ve a tu Supabase: https://supabase.com/dashboard/project/bkzfuprwdntoegkuemkw
2. Click en **SQL Editor** (menú izquierdo)
3. Click en **New Query**
4. Abre el archivo: `samaca-store/supabase/schema.sql`
5. Copia TODO el contenido (Ctrl+A, Ctrl+C)
6. Pégalo en Supabase (Ctrl+V)
7. Click en **RUN** (botón verde abajo a la derecha)

✅ Deberías ver: "Success. No rows returned"

---

## 🛍️ Paso 2: Agregar Productos

1. En el mismo **SQL Editor**, click en **New Query**
2. Abre el archivo: `samaca-store/scripts/seed-simple.sql`
3. Copia TODO el contenido
4. Pégalo en Supabase
5. Click en **RUN**

✅ Deberías ver: "Success. No rows returned"

---

## 👤 Paso 3: Crear Usuario Admin

1. En Supabase, click en **Authentication** (menú izquierdo)
2. Click en **Users**
3. Click en **Add user** > **Create new user**
4. Email: `admin@samacastore.com`
5. Password: `Admin123!` (o la que prefieras)
6. Click en **Create user**

✅ Usuario creado

---

## 🚀 Paso 4: Probar el Sistema

1. En tu terminal, ejecuta:
```bash
cd samaca-store
npm run dev
```

2. Abre tu navegador en: http://localhost:3000

3. Prueba estas páginas:
   - `/` - Inicio
   - `/catalogo` - Ver los 17 productos
   - `/promociones` - Girar el dado de la suerte
   - `/admin/login` - Entrar con admin@samacastore.com

---

## ✅ Verificar que Todo Funciona

### Ver productos en Supabase:
1. Click en **Table Editor**
2. Click en tabla **products**
3. Deberías ver 17 productos

### Ver productos en la web:
1. Ve a http://localhost:3000/catalogo
2. Deberías ver los productos con imágenes

---

## 🆘 Si Algo Sale Mal

### Error: "relation does not exist"
- Ejecuta de nuevo el `schema.sql`

### No veo productos en /catalogo
- Verifica en Table Editor que haya productos
- Presiona F12 en el navegador y revisa la consola

### Error al ejecutar seed-simple.sql
- Asegúrate de haber ejecutado primero el `schema.sql`
- Verifica que no haya errores de sintaxis

---

## 📱 Configurar WhatsApp (Opcional)

Edita el archivo `.env.local`:
```env
NEXT_PUBLIC_WHATSAPP_NUMBER=573001234567
```

Cambia el número por el tuyo (código país + número, sin espacios)

---

## 🎨 Personalizar (Opcional)

### Cambiar nombre de la tienda:
Archivo: `samaca-store/components/Navbar.tsx` (línea 35)
```typescript
Samacá Store → Tu Nombre
```

### Cambiar colores:
Archivo: `samaca-store/tailwind.config.ts`

---

## ✨ ¡Listo!

Tu tienda está funcionando con:
- ✅ 17 productos de ejemplo
- ✅ Base de datos conectada
- ✅ Usuario admin creado
- ✅ Sistema completo funcionando

**Ahora puedes:**
1. Agregar tus propios productos
2. Personalizar el diseño
3. Configurar WhatsApp
4. Desplegar a producción

---

**¿Necesitas ayuda?** Revisa los otros archivos:
- `README.md` - Documentación completa
- `QUICKSTART.md` - Guía de inicio
- `FEATURES.md` - Lista de características
