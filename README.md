# NOM-035 | Herramienta de Seguimiento de Cumplimiento

Aplicación web para dar seguimiento al cumplimiento de la **NOM-035-STPS-2018** en centros de trabajo mexicanos.

Desarrollada por el **Consejo Latinoamericano de Calidad Humana y Responsabilidad Social, A.C. (CRESE)**.

---

## ¿Qué es esta app?

Permite a tres roles (Responsable, Director y Consultor) colaborar en el seguimiento de los 7 pasos de la NOM-035, con:

- Checklist de actividades por paso
- Estado automático: Pendiente / En proceso / Completado
- Notas del responsable por paso
- Recomendaciones del consultor por paso
- Dashboard con progreso general
- Multi-empresa vía parámetro `?empresa=` en la URL
- Datos guardados en `localStorage` del navegador

---

## Instalación local

```bash
npm install
npm run dev
```

La app abre en `http://localhost:5173`

---

## Cómo crear el enlace para un nuevo cliente

1. Ir a `fup-nom035.vercel.app`
2. Escribir el slug de la empresa (ej: `magma-automotive`)
3. Copiar el enlace generado con el botón "Copiar enlace"
4. Compartirlo con director, responsable y consultor

El enlace tendrá la forma:
```
https://fup-nom035.vercel.app?empresa=magma-automotive
```

> Cada slug es independiente: los datos de una empresa nunca se mezclan con otra.

---

## Los tres roles y cómo usarlos

| Rol | Quién es | Qué puede hacer |
|---|---|---|
| **Responsable** | Empleado designado para el proceso | Marcar actividades, escribir notas, ver formatos |
| **Director** | Dueño o director general | Solo lectura: ve avance, semáforo y notas |
| **Consultor** | Asesor externo de CRESE | Ve todo + escribe recomendaciones por paso |

El rol se selecciona con el toggle en el header. No hay login — todos comparten la misma URL.

---

## Cómo hacer cambios y publicarlos

Después de editar cualquier archivo:

```bash
git add .
git commit -m "descripción del cambio"
git push
```

Vercel detecta el push automáticamente y redesplega en 1-2 minutos.

---

## Configurar repositorio en GitHub

1. Crear un repositorio nuevo en github.com con el nombre `fup-nom035`
   - Sin inicializar (sin README, sin .gitignore)
2. Conectar el repositorio local:

```bash
git remote add origin https://github.com/TU_USUARIO/fup-nom035.git
git branch -M main
git push -u origin main
```

---

## Deploy en Vercel

1. Ir a vercel.com e iniciar sesión con GitHub
2. Clic en **Add New Project**
3. Seleccionar el repositorio `fup-nom035`
4. En el campo **Project Name** escribir exactamente: `fup-nom035`
5. Vercel detecta Vite automáticamente — no cambiar nada más
6. Clic en **Deploy**
7. En ~2 minutos la app estará disponible en: `https://fup-nom035.vercel.app`

---

## Configurar dominio personalizado (opcional)

Para usar `nom035.consentidohumano.com` en lugar de `fup-nom035.vercel.app`:

1. En Vercel: proyecto `fup-nom035` -> **Settings** -> **Domains**
2. Agregar: `nom035.consentidohumano.com`
3. Vercel mostrará un registro CNAME:
   - **Nombre:** `nom035`
   - **Valor:** `cname.vercel-dns.com`
4. Agregar ese CNAME en el panel DNS de `consentidohumano.com`
5. Esperar 5-10 minutos — quedará activo con HTTPS automático

---

## Contacto

**CRESE — Consejo Latinoamericano de Calidad Humana y Responsabilidad Social, A.C.**
info@crese.org
consentidohumano.com
