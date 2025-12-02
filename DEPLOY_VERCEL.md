# 🚀 Guía Completa: Deploy a Vercel

## ✅ Pre-requisitos

- [x] Proyecto subido a GitHub
- [ ] Cuenta en Vercel (https://vercel.com)
- [ ] Variables de entorno de Supabase listas

## 📋 Paso 1: Preparar Variables de Entorno

### 1.1 Obtener las Variables de Supabase

Ve a tu proyecto en Supabase Dashboard:

1. **Settings** → **API**
2. Copia estos valores:
   - `Project URL` → será tu `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → será tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → será tu `SUPABASE_SERVICE_ROLE_KEY` ⚠️ (mantener secreta)

### 1.2 Lista de Variables Necesarias

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=573123106507
NEXT_PUBLIC_BUSINESS_NAME=Samacá Store

# Site URL (cambiar después del deploy)
NEXT_PUBLIC_SITE_URL=https://tu-dominio.vercel.app
```

## 📋 Paso 2: Deploy en Vercel

### 2.1 Conectar GitHub a Vercel

1. Ve a https://vercel.com
2. Haz clic en **"Add New..."** → **"Project"**
3. Selecciona **"Import Git Repository"**
4. Busca tu repositorio de GitHub
5. Haz clic en **"Import"**

### 2.2 Configurar el Proyecto

En la pantalla de configuración:

1. **Framework Preset**: Next.js (se detecta automáticamente)
2. **Root Directory**: `.` (dejar por defecto)
3. **Build Command**: `npm run build` (por defecto)
4. **Output Directory**: `.next` (por defecto)

### 2.3 Agregar Variables de Entorno

⚠️ **IMPORTANTE**: Antes de hacer clic en "Deploy"

1. Expande la sección **"Environment Variables"**
2. Agrega TODAS las variables una por una:

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://tu-proyecto.supabase.co

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: tu_anon_key_aqui

Name: SUPABASE_SERVICE_ROLE_KEY
Value: tu_service_role_key_aqui

Name: NEXT_PUBLIC_WHATSAPP_NUMBER
Value: 573123106507

Name: NEXT_PUBLIC_BUSINESS_NAME
Value: Samacá Store

Name: NEXT_PUBLIC_SITE_URL
Value: https://tu-proyecto.vercel.app
```

3. Haz clic en **"Deploy"**

## 📋 Paso 3: Configurar Supabase

### 3.1 Agregar URL de Vercel a Supabase

Una vez que Vercel termine el deploy, obtendrás una URL como:
`https://samaca-store.vercel.app`

Ve a Supabase Dashboard:

1. **Authentication** → **URL Configuration**
2. Agrega tu URL de Vercel en:
   - **Site URL**: `https://samaca-store.vercel.app`
   - **Redirect URLs**: Agrega estas URLs:
     ```
     https://samaca-store.vercel.app/**
     https://samaca-store.vercel.app/auth/callback
     https://samaca-store.vercel.app/admin/**
     ```

### 3.2 Actualizar Variable NEXT_PUBLIC_SITE_URL

1. Ve a tu proyecto en Vercel
2. **Settings** → **Environment Variables**
3. Edita `NEXT_PUBLIC_SITE_URL`
4. Cambia de `https://tu-proyecto.vercel.app` a tu URL real
5. Haz clic en **"Save"**
6. Ve a **"Deployments"** → Redeploy el último deployment

## 📋 Paso 4: Verificar el Deploy

### 4.1 Checklist de Verificación

- [ ] La página principal carga correctamente
- [ ] Puedes ver productos en el catálogo
- [ ] El login funciona
- [ ] Puedes agregar productos al carrito
- [ ] El checkout funciona
- [ ] Los enlaces de WhatsApp funcionan
- [ ] El admin es accesible

### 4.2 Probar Funcionalidades Críticas

1. **Autenticación:**
   - Ir a `/auth/login`
   - Iniciar sesión con tu cuenta
   - Verificar que redirija correctamente

2. **Catálogo:**
   - Ver productos
   - Agregar al carrito
   - Ver carrito

3. **Cotizaciones:**
   - Crear una cotización
   - Verificar que llegue al admin

4. **Admin:**
   - Acceder al dashboard
   - Ver cotizaciones
   - Responder cotización
   - Cerrar venta

## ⚠️ Problemas Comunes y Soluciones

### Error: "Invalid API Key"
**Solución:** Verifica que las variables de Supabase estén correctas en Vercel

### Error: "Redirect URL not allowed"
**Solución:** Agrega la URL de Vercel en Supabase → Authentication → URL Configuration

### Error: "Module not found"
**Solución:** Asegúrate de que todas las dependencias estén en `package.json`

### Error: Build falla
**Solución:** 
1. Ejecuta `npm run build` localmente para ver errores
2. Corrige los errores
3. Haz commit y push
4. Vercel rebuildeará automáticamente

### Imágenes no cargan
**Solución:** Verifica que las URLs de Supabase Storage estén en `next.config.js`:
```js
images: {
  domains: ['bkzfuprwdntoegkuemkw.supabase.co'],
}
```

## 📋 Paso 5: Configuración Adicional (Opcional)

### 5.1 Dominio Personalizado

1. Ve a tu proyecto en Vercel
2. **Settings** → **Domains**
3. Agrega tu dominio personalizado
4. Sigue las instrucciones para configurar DNS
5. Actualiza `NEXT_PUBLIC_SITE_URL` con tu nuevo dominio
6. Actualiza las URLs en Supabase

### 5.2 Configurar Regiones

Por defecto, Vercel despliega en múltiples regiones. Para Colombia:

1. **Settings** → **Functions**
2. **Function Region**: `iad1` (Washington DC - más cercano a Colombia)

### 5.3 Analytics (Opcional)

1. **Analytics** → **Enable**
2. Vercel Analytics es gratis para proyectos personales

## 🎉 Deploy Exitoso

Si todo funciona correctamente:

1. ✅ Tu sitio está en línea
2. ✅ Las variables de entorno están configuradas
3. ✅ Supabase está conectado
4. ✅ La autenticación funciona
5. ✅ Las cotizaciones funcionan
6. ✅ WhatsApp funciona

## 📝 Comandos Útiles

### Redeploy desde CLI (opcional)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

### Ver logs en tiempo real

```bash
vercel logs
```

## 🔄 Actualizaciones Futuras

Cada vez que hagas cambios:

1. Haz commit y push a GitHub
2. Vercel detectará los cambios automáticamente
3. Rebuildeará y desplegará automáticamente
4. Recibirás un email cuando termine

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs en Vercel Dashboard → Deployments → [tu deploy] → Build Logs
2. Revisa los Runtime Logs para errores en producción
3. Verifica las variables de entorno
4. Asegúrate de que Supabase esté configurado correctamente

## ✅ Checklist Final

Antes de considerar el deploy completo:

- [ ] Sitio accesible públicamente
- [ ] Variables de entorno configuradas
- [ ] Supabase conectado
- [ ] URLs de redirect configuradas
- [ ] Login funciona
- [ ] Catálogo carga
- [ ] Carrito funciona
- [ ] Cotizaciones funcionan
- [ ] Admin accesible
- [ ] WhatsApp funciona
- [ ] Imágenes cargan
- [ ] No hay errores en consola
- [ ] Responsive en móvil
- [ ] Performance aceptable

¡Listo para producción! 🚀
