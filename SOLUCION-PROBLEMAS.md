# 🔧 Solución de Problemas Comunes

## ✅ Problemas Resueltos

### 1. ✅ Estilos no cargan / Página sin diseño
**Problema**: La página se ve sin estilos, solo texto plano.

**Solución**: Ya está resuelto. Se cambió de Tailwind CSS v4 a v3.

**Si vuelve a pasar**:
```bash
npm install -D tailwindcss@3.4.1 postcss@8.4.35 autoprefixer@10.4.17
```

---

### 2. ✅ Error de imágenes de Unsplash
**Problema**: `hostname "images.unsplash.com" is not configured`

**Solución**: Ya está configurado en `next.config.ts`.

**Dominios permitidos**:
- `images.unsplash.com` (imágenes de ejemplo)
- `bkzfuprwdntoegkuemkw.supabase.co` (tu Supabase Storage)

---

## 🚨 Otros Problemas Comunes

### 3. Error: "relation does not exist"
**Causa**: No se ejecutó el schema SQL en Supabase.

**Solución**:
1. Ve a Supabase SQL Editor
2. Ejecuta `supabase/schema.sql`
3. Verifica en Table Editor que las tablas existan

---

### 4. No aparecen productos en /catalogo
**Causa**: No hay productos en la base de datos.

**Solución**:
1. Ve a Supabase SQL Editor
2. Ejecuta `scripts/seed-simple.sql`
3. Verifica en Table Editor > products (deberías ver 17 productos)

**Verificar en el navegador**:
1. Presiona F12
2. Ve a Console
3. Busca errores en rojo

---

### 5. Error: "Invalid API key"
**Causa**: Credenciales incorrectas en `.env.local`

**Solución**:
1. Verifica que `.env.local` tenga:
```env
NEXT_PUBLIC_SUPABASE_URL=https://bkzfuprwdntoegkuemkw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```
2. Reinicia el servidor:
```bash
# Presiona Ctrl+C
npm run dev
```

---

### 6. Puerto 3000 ocupado
**Error**: `Port 3000 is already in use`

**Solución**:
```bash
# Opción 1: Usar otro puerto
npm run dev -- -p 3001

# Opción 2: Matar el proceso
# Windows:
netstat -ano | findstr :3000
taskkill /PID [número] /F
```

---

### 7. Cambios no se reflejan
**Causa**: Caché del navegador o Next.js

**Solución**:
1. Limpia caché del navegador: `Ctrl + Shift + R`
2. Reinicia el servidor: `Ctrl + C` y `npm run dev`
3. Borra `.next`:
```bash
rm -rf .next
npm run dev
```

---

### 8. Error al hacer build
**Error**: `Failed to compile`

**Solución**:
```bash
# Limpia todo y reinstala
rm -rf node_modules .next
npm install
npm run build
```

---

### 9. WhatsApp no abre
**Causa**: Número mal configurado

**Solución**:
1. Verifica en `.env.local`:
```env
NEXT_PUBLIC_WHATSAPP_NUMBER=573001234567
```
2. Formato: código país + número (sin espacios, sin +, sin guiones)
3. Ejemplo Colombia: `573001234567`
4. Ejemplo México: `525512345678`

---

### 10. Error: "Cannot find module"
**Causa**: Dependencias no instaladas

**Solución**:
```bash
npm install
```

---

### 11. Imágenes no cargan desde Supabase
**Causa**: Bucket no es público o URL incorrecta

**Solución**:
1. Ve a Supabase > Storage
2. Selecciona el bucket `products`
3. Asegúrate que sea público
4. Verifica las políticas de acceso

**URL correcta**:
```
https://bkzfuprwdntoegkuemkw.supabase.co/storage/v1/object/public/products/imagen.jpg
```

---

### 12. Error 500 en producción (Vercel)
**Causa**: Variables de entorno no configuradas

**Solución**:
1. Ve a Vercel Dashboard
2. Settings > Environment Variables
3. Agrega todas las variables de `.env.local`
4. Redeploy

---

### 13. Modo oscuro no funciona
**Causa**: JavaScript no está ejecutándose

**Solución**:
1. Verifica que el componente sea `'use client'`
2. Revisa la consola del navegador (F12)
3. Limpia caché: `Ctrl + Shift + R`

---

### 14. Error de TypeScript
**Error**: Type errors durante build

**Solución**:
```bash
# Opción 1: Ignorar temporalmente
npm run build -- --no-lint

# Opción 2: Arreglar los tipos
# Revisa el error específico y corrige
```

---

### 15. Supabase Realtime no funciona
**Causa**: Realtime no está habilitado

**Solución**:
1. Ve a Supabase > Database > Replication
2. Habilita Realtime para las tablas necesarias
3. Reinicia la app

---

## 🔍 Debugging Tips

### Ver logs en tiempo real:
```bash
# En el terminal donde corre npm run dev
# Los errores aparecerán aquí
```

### Ver errores del navegador:
1. Presiona `F12`
2. Ve a la pestaña `Console`
3. Busca mensajes en rojo

### Ver requests a Supabase:
1. F12 > Network
2. Filtra por "supabase"
3. Revisa las respuestas

### Ver estado de Supabase:
1. Ve a Supabase Dashboard
2. Logs > Postgres Logs
3. Revisa errores recientes

---

## 📞 Comandos Útiles

```bash
# Reiniciar servidor
Ctrl + C
npm run dev

# Limpiar todo
rm -rf node_modules .next
npm install

# Ver versiones
node --version
npm --version

# Ver procesos en puerto 3000
netstat -ano | findstr :3000

# Build de producción
npm run build
npm start
```

---

## ✅ Checklist de Verificación

Antes de reportar un problema, verifica:

- [ ] Node.js 18+ instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] `.env.local` configurado correctamente
- [ ] Schema SQL ejecutado en Supabase
- [ ] Productos agregados (seed-simple.sql)
- [ ] Puerto 3000 disponible
- [ ] Navegador actualizado
- [ ] Caché limpiado

---

## 🆘 Si Nada Funciona

### Opción Nuclear (Empezar de cero):

```bash
# 1. Detener servidor
Ctrl + C

# 2. Limpiar todo
rm -rf node_modules .next

# 3. Reinstalar
npm install

# 4. Verificar .env.local
# Asegúrate que tenga las credenciales correctas

# 5. Iniciar
npm run dev
```

---

## 📧 Información para Soporte

Si necesitas ayuda, proporciona:

1. **Error exacto**: Copia el mensaje completo
2. **Consola del navegador**: F12 > Console (screenshot)
3. **Terminal**: Copia el output completo
4. **Versiones**:
```bash
node --version
npm --version
```
5. **Sistema operativo**: Windows/Mac/Linux
6. **Navegador**: Chrome/Firefox/Safari + versión

---

**¡La mayoría de problemas se resuelven reiniciando el servidor! 🔄**
