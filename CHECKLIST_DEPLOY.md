# ✅ Checklist Rápido: Deploy a Vercel

## 🎯 Antes de Empezar

### 1. Obtener Variables de Supabase (5 min)

Ve a Supabase Dashboard → Settings → API:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://bkzfuprwdntoegkuemkw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[copia el anon key]
SUPABASE_SERVICE_ROLE_KEY=[copia el service_role key] ⚠️ SECRETO
```

### 2. Variables Adicionales

```bash
NEXT_PUBLIC_WHATSAPP_NUMBER=573123106507
NEXT_PUBLIC_BUSINESS_NAME=Samacá Store
NEXT_PUBLIC_SITE_URL=https://tu-proyecto.vercel.app
```

---

## 🚀 Deploy en Vercel (10 min)

### Paso 1: Importar Proyecto
1. Ve a https://vercel.com
2. Clic en **"Add New..."** → **"Project"**
3. Selecciona tu repositorio de GitHub
4. Clic en **"Import"**

### Paso 2: Configurar Variables
⚠️ **ANTES de hacer clic en Deploy**

Expande **"Environment Variables"** y agrega:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://bkzfuprwdntoegkuemkw.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `[tu anon key]` |
| `SUPABASE_SERVICE_ROLE_KEY` | `[tu service role key]` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `573123106507` |
| `NEXT_PUBLIC_BUSINESS_NAME` | `Samacá Store` |
| `NEXT_PUBLIC_SITE_URL` | `https://tu-proyecto.vercel.app` |

### Paso 3: Deploy
1. Clic en **"Deploy"**
2. Espera 2-3 minutos
3. Copia la URL que te da Vercel (ej: `https://samaca-store.vercel.app`)

---

## 🔧 Configurar Supabase (5 min)

### Paso 1: Agregar URLs Permitidas

Ve a Supabase Dashboard → Authentication → URL Configuration:

**Site URL:**
```
https://samaca-store.vercel.app
```

**Redirect URLs:** (agregar todas)
```
https://samaca-store.vercel.app/**
https://samaca-store.vercel.app/auth/callback
https://samaca-store.vercel.app/admin/**
```

### Paso 2: Actualizar Variable en Vercel

1. Ve a Vercel → tu proyecto → Settings → Environment Variables
2. Edita `NEXT_PUBLIC_SITE_URL`
3. Cambia a tu URL real de Vercel
4. Save
5. Ve a Deployments → Redeploy el último

---

## ✅ Verificar que Todo Funciona (5 min)

Abre tu sitio en Vercel y prueba:

- [ ] Página principal carga
- [ ] Ver productos en catálogo
- [ ] Login funciona (`/auth/login`)
- [ ] Agregar producto al carrito
- [ ] Crear cotización
- [ ] Acceder al admin (`/admin/dashboard`)
- [ ] Ver cotizaciones en admin
- [ ] Botón de WhatsApp funciona
- [ ] Imágenes cargan correctamente

---

## 🎉 ¡Listo!

Tu sitio está en producción en: `https://tu-proyecto.vercel.app`

### Próximos Pasos (Opcional)

1. **Dominio personalizado:**
   - Vercel → Settings → Domains
   - Agregar tu dominio
   - Actualizar DNS

2. **Monitoreo:**
   - Vercel → Analytics (gratis)
   - Ver tráfico y performance

3. **Actualizaciones:**
   - Haz push a GitHub
   - Vercel redeploya automáticamente

---

## 🆘 Si Algo Falla

### Error: "Invalid API Key"
→ Verifica variables en Vercel → Settings → Environment Variables

### Error: "Redirect URL not allowed"
→ Agrega la URL en Supabase → Authentication → URL Configuration

### Build falla
→ Ejecuta `npm run build` localmente para ver el error

### Imágenes no cargan
→ Ya está configurado en `next.config.ts` ✅

---

## 📞 Comandos Útiles

```bash
# Ver logs en tiempo real
vercel logs

# Redeploy manualmente
vercel --prod

# Ver info del proyecto
vercel inspect
```

---

## 🔄 Para Futuras Actualizaciones

1. Haz cambios en tu código
2. `git add .`
3. `git commit -m "descripción"`
4. `git push`
5. Vercel redeploya automáticamente ✨

---

**Tiempo total estimado: 25 minutos** ⏱️
