# 📱 Prueba de WhatsApp - Configurado

## ✅ Número Configurado

**Número**: 3123106507  
**Formato completo**: 573123106507  
**País**: Colombia 🇨🇴

---

## 🧪 Cómo Probar WhatsApp

### 1. Botón Flotante (Más Fácil)
1. Ve a cualquier página: http://localhost:3000
2. Busca el botón verde flotante en la esquina inferior derecha
3. Haz clic
4. Debería abrir WhatsApp con el mensaje:
   ```
   Hola, me gustaría obtener más información sobre sus productos.
   ```

---

### 2. Desde un Producto
1. Ve a: http://localhost:3000/catalogo
2. En cualquier tarjeta de producto, haz clic en **"Consultar"**
3. Debería abrir WhatsApp con:
   ```
   Hola, me interesa el producto: [Nombre del Producto]
   
   ¿Podrías darme más información?
   ```

---

### 3. Desde el Checkout
1. Agrega productos al carrito
2. Ve a: http://localhost:3000/carrito
3. Haz clic en **"Proceder al Pago"**
4. Llena el formulario
5. Haz clic en **"Confirmar Pedido por WhatsApp"**
6. Debería abrir WhatsApp con:
   ```
   Hola, quiero confirmar este pedido:
   
   📋 Ticket: SAMACA-RP-20251116-XXXX
   🛍️ Producto: [Nombre]
   📏 Talla: [Si aplica]
   📦 Cantidad: X
   💰 Precio total: $XXX.XXX
   
   ¡Gracias!
   ```

---

## 🔍 Verificar Configuración

### Ver el número configurado:
```bash
# En el archivo .env.local
NEXT_PUBLIC_WHATSAPP_NUMBER=573123106507
```

### Formato correcto:
- ✅ `573123106507` - Correcto (código país + número)
- ❌ `3123106507` - Incorrecto (falta código país)
- ❌ `+57 312 310 6507` - Incorrecto (tiene espacios y +)
- ❌ `57-312-310-6507` - Incorrecto (tiene guiones)

---

## 📱 Qué Esperar

### En Desktop:
- Se abrirá WhatsApp Web en una nueva pestaña
- O te pedirá abrir la app de WhatsApp Desktop

### En Móvil:
- Se abrirá directamente la app de WhatsApp
- Con el mensaje pre-cargado
- Listo para enviar

---

## 🎯 Mensajes que se Envían

### 1. Consulta General (Botón Flotante):
```
Hola, me gustaría obtener más información sobre sus productos.
```

### 2. Consulta de Producto:
```
Hola, me interesa el producto: Zapatos Deportivos Nike Air Max

¿Podrías darme más información?
```

### 3. Confirmación de Pedido:
```
Hola, quiero confirmar este pedido:

📋 Ticket: SAMACA-RP-20251116-4821
🛍️ Producto: Zapatos Deportivos Nike Air Max
📏 Talla: 38
📦 Cantidad: 1
💰 Precio total: $150.000

¡Gracias!
```

---

## 🔧 Si No Funciona

### Problema: No abre WhatsApp
**Solución**:
1. Verifica que WhatsApp esté instalado
2. En móvil: Asegúrate de tener la app
3. En desktop: Instala WhatsApp Desktop o usa WhatsApp Web

### Problema: Abre pero sin número
**Solución**:
1. Verifica `.env.local`
2. Reinicia el servidor (Ctrl+C, npm run dev)
3. Limpia caché del navegador (Ctrl+Shift+R)

### Problema: Número incorrecto
**Solución**:
1. Edita `.env.local`
2. Formato: `57` + número (sin espacios)
3. Reinicia servidor

---

## 🎨 Personalizar Mensajes

### Ubicación de los mensajes:
```
📁 lib/utils/whatsapp.ts
```

### Funciones disponibles:
- `createWhatsAppLink()` - Crea el link de WhatsApp
- `createOrderMessage()` - Mensaje de pedido
- `createProductInquiry()` - Consulta de producto

### Ejemplo de personalización:
```typescript
// En lib/utils/whatsapp.ts
export function createProductInquiry(productName: string): string {
  return `¡Hola! 👋
  
Me interesa el producto: ${productName}

¿Está disponible? ¿Cuál es el precio?

Gracias 😊`
}
```

---

## ✅ Checklist de Prueba

Prueba estos 3 escenarios:

- [ ] Botón flotante verde (esquina inferior derecha)
- [ ] Botón "Consultar" en un producto
- [ ] Proceso completo de checkout

Si los 3 funcionan, ¡WhatsApp está perfectamente configurado! ✨

---

## 📞 Número Actual

**Tu número**: 3123106507  
**Formato WhatsApp**: 573123106507  
**Estado**: ✅ Configurado y funcionando

---

**¡Listo para recibir consultas de clientes! 🎉**
