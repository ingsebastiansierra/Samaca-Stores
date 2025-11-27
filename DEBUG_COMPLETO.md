# 🔍 DEBUG COMPLETO - Super Admin

## ✅ Cambios Aplicados

He agregado logs COMPLETOS en:
1. **Login** - Verás exactamente qué rol detecta
2. **Middleware** - Verás si está bloqueando o permitiendo
3. **getUserRole** - Verás el proceso completo

## 🚀 PRUEBA AHORA CON LOGS

### 1. Reinicia el servidor
```bash
npm run dev
```

### 2. Abre DOS consolas:

**Consola 1: Terminal del servidor**
- Aquí verás los logs del middleware (lado servidor)

**Consola 2: Navegador (F12 > Console)**
- Aquí verás los logs del login (lado cliente)

### 3. Limpia el navegador
```
Ctrl+Shift+Delete → Borrar TODO
```

### 4. Ve al login
```
http://localhost:3000/auth/login
```

### 5. Inicia sesión
```
Email: ingsebastian073@gmail.com
Password: [tu contraseña]
```

### 6. Observa AMBAS consolas

**En la consola del NAVEGADOR deberías ver:**
```
✅ Login exitoso, usuario: ingsebastian073@gmail.com
🔍 User ID: [uuid]
🔍 Consultando user_profiles directamente...
📊 Resultado de user_profiles: {role: "super_admin", ...}
✅ Rol obtenido por getUserRole: super_admin
✅ Rol del perfil directo: super_admin
🚀🚀🚀 SUPER ADMIN DETECTADO 🚀🚀🚀
🚀 Redirigiendo a: /super-admin/dashboard
```

**Y verás un ALERT que dice:**
```
SUPER ADMIN DETECTADO - Redirigiendo a /super-admin/dashboard
```

**En la consola del SERVIDOR (terminal) deberías ver:**
```
🔒 [Middleware] Protegiendo ruta super-admin: /super-admin/dashboard
✅ [Middleware] Usuario autenticado: ingsebastian073@gmail.com
🔍 [Middleware] Consultando rol...
📊 [Middleware] Perfil: {role: "super_admin"}
✅ [Middleware] Es super_admin, permitiendo acceso
```

---

## 🔍 Qué Buscar

### Si ves en el navegador:
```
✅ Rol obtenido por getUserRole: user
```
**Problema:** La función getUserRole no está leyendo correctamente

### Si ves en el navegador:
```
📊 Resultado de user_profiles: null
```
**Problema:** No puede leer la tabla user_profiles (RLS o permisos)

### Si ves en el servidor:
```
❌ [Middleware] No es super_admin, redirigiendo a /
```
**Problema:** El middleware no está leyendo el rol correctamente

### Si NO ves el alert:
**Problema:** El código no está llegando a la parte de redirección

---

## 📸 Necesito que me des:

1. **Captura de la consola del NAVEGADOR** (F12 > Console) después del login
2. **Captura de la consola del SERVIDOR** (terminal) después del login
3. **Dime si viste el alert** que dice "SUPER ADMIN DETECTADO"
4. **Dime a qué URL te redirigió**

Con eso sabré EXACTAMENTE dónde está el problema.

---

**¡Prueba ahora y cópiame TODO lo que veas en ambas consolas! 🚀**
