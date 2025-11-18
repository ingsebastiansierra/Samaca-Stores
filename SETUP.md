# 🚀 Guía de Configuración Rápida - Samacá Store

## Paso 1: Configurar Supabase

1. **Crear proyecto en Supabase**
   - Ve a [supabase.com](https://supabase.com)
   - Crea una cuenta y un nuevo proyecto
   - Espera a que se complete la configuración

2. **Ejecutar el Schema SQL**
   - Ve a SQL Editor en tu proyecto de Supabase
   - Copia todo el contenido de `supabase/schema.sql`
   - Pégalo y ejecuta el script
   - Verifica que se crearon las tablas: products, orders, promotions, inventory_logs

3. **Obtener las credenciales**
   - Ve a Settings > API
   - Copia:
     - Project URL
     - anon/public key
     - service_role key (¡mantén esto secreto!)

## Paso 2: Configurar Variables de Entorno

1. Edita el archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
NEXT_PUBLIC_WHATSAPP_NUMBER=573001234567
NEXT_PUBLIC_BUSINESS_NAME=Samacá Store
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Paso 3: Configurar Storage (Opcional)

Para subir imágenes de productos:

1. Ve a Storage en Supabase
2. Crea un bucket llamado `products`
3. Configura las políticas de acceso:
   - Public read
   - Authenticated write

## Paso 4: Agregar Productos de Prueba

Ejecuta este SQL en Supabase para agregar productos de ejemplo:

```sql
INSERT INTO products (name, description, price, category, images, sizes, colors, stock, tags)
VALUES 
  ('Zapatos Deportivos Nike', 'Zapatos deportivos cómodos y modernos', 150000, 'zapatos', 
   ARRAY['https://via.placeholder.com/400'], 
   ARRAY['36', '37', '38', '39', '40'], 
   ARRAY['Negro', 'Blanco', 'Azul'], 
   15, ARRAY['nuevo', 'deportivo']),
  
  ('Camiseta Casual Premium', 'Camiseta de algodón 100% premium', 45000, 'ropa',
   ARRAY['https://via.placeholder.com/400'],
   ARRAY['S', 'M', 'L', 'XL'],
   ARRAY['Negro', 'Blanco', 'Gris'],
   8, ARRAY['oferta']),
  
  ('Bolso de Cuero Elegante', 'Bolso de cuero genuino para toda ocasión', 85000, 'accesorios',
   ARRAY['https://via.placeholder.com/400'],
   NULL,
   ARRAY['Café', 'Negro'],
   5, ARRAY['nuevo']);
```

## Paso 5: Configurar WhatsApp

1. Obtén tu número de WhatsApp Business
2. Formato: código de país + número (sin espacios ni símbolos)
   - Ejemplo: `573001234567` para Colombia
3. Actualiza en `.env.local`:
   ```env
   NEXT_PUBLIC_WHATSAPP_NUMBER=573001234567
   ```

## Paso 6: Ejecutar el Proyecto

```bash
# Instalar dependencias (si no lo has hecho)
npm install

# Ejecutar en modo desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Paso 7: Crear Usuario Administrador

1. Ve a Authentication en Supabase
2. Crea un nuevo usuario:
   - Email: admin@samacastore.com
   - Password: (tu contraseña segura)
3. Usa estas credenciales en `/admin/login`

## 🎨 Personalización

### Cambiar Colores
Edita `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    500: '#TU_COLOR',
    600: '#TU_COLOR_OSCURO',
  }
}
```

### Cambiar Logo y Nombre
Edita `components/Navbar.tsx`:
```typescript
<div className="text-2xl font-bold">
  Tu Nombre de Tienda
</div>
```

### Agregar Imágenes Reales
1. Sube imágenes a Supabase Storage
2. Obtén las URLs públicas
3. Actualiza los productos con las URLs reales

## 🚀 Desplegar a Producción

### Opción 1: Vercel (Recomendado)

1. Push tu código a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Importa tu repositorio
4. Agrega las variables de entorno
5. Deploy

### Opción 2: Netlify

1. Push tu código a GitHub
2. Ve a [netlify.com](https://netlify.com)
3. Importa tu repositorio
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Agrega las variables de entorno

## ✅ Checklist de Configuración

- [ ] Proyecto de Supabase creado
- [ ] Schema SQL ejecutado
- [ ] Variables de entorno configuradas
- [ ] Productos de prueba agregados
- [ ] WhatsApp configurado
- [ ] Usuario admin creado
- [ ] Proyecto corriendo en localhost
- [ ] Probado el flujo completo de compra

## 🆘 Problemas Comunes

### Error: "Invalid API key"
- Verifica que las credenciales en `.env.local` sean correctas
- Reinicia el servidor de desarrollo

### Error: "Table does not exist"
- Asegúrate de haber ejecutado el schema SQL completo
- Verifica en Supabase que las tablas existan

### WhatsApp no abre
- Verifica el formato del número (sin espacios ni símbolos)
- Prueba con otro navegador

### Imágenes no cargan
- Usa URLs completas (https://)
- Verifica que las URLs sean accesibles públicamente

## 📞 Soporte

Si tienes problemas, revisa:
1. La consola del navegador (F12)
2. Los logs de Supabase
3. El README.md principal

---

¡Listo! Tu tienda está configurada y lista para vender 🎉
