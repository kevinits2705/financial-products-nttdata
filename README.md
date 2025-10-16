# Prueba Técnica Frontend - Angular (NTT DATA)

## 🎯 Introducción y Objetivo del Proyecto

Este repositorio contiene la solución a la Prueba Técnica de desarrollo Frontend con **Angular**. El proyecto implementa un módulo de **gestión de productos financieros**, cumpliendo con todas las funcionalidades requeridas (F1 a F6) y las indicaciones de calidad.

El foco principal fue la aplicación de **Arquitectura Hexagonal**, principios **SOLID** y **Clean Code** , asegurando la calidad mediante **pruebas unitarias** con alta cobertura.

---

## 🏗 Arquitectura: Hexagonal (Ports & Adapters)

El diseño del proyecto se basa en la **Arquitectura Hexagonal**, lo que garantiza que la lógica de negocio (`Domain` y `Application`) es independiente de la tecnología (la API REST en `Infrastructure` y Angular en `Presentation`).

| Carpeta Principal | Capa Hexagonal | Responsabilidad |
| :--- | :--- | :--- |
| **`domain`** | **Core/Domain** | Contiene las Entidades (`Product` ) y los *Ports* (Interfaces del `ProductRepository` ). |
| **`application`** | **Application** | Contiene la Lógica de Negocio y el Estado (NgRx Store, Effects, Reducers, Selectors). Define los *Use Cases*. |
| **`infrastructure`** | **Infrastructure (Adapter)** | Contiene los *Adapters* (Ej: `ProductHttpRepository`) que implementan los *Ports* (interfaces) para interactuar con la API |
| **`presentation`** | **Presentation (Adapter)** | Contiene la UI (Componentes, *templates*, rutas ) que muestran el estado y despachan acciones. |

### ⚙️ Pila Tecnológica

* **Framework:** Angular 20.
* **Gestión de Estado:** NgRx (Store, Effects, Selectors, Reducers).
* **Pruebas:** Jasmine & Karma.

---

## ✅ Pruebas Unitarias y Cobertura

Se realizaron pruebas unitarias exhaustivas en las capas críticas (NgRx, Componentes, Repositorio) para asegurar la funcionalidad y la robustez del código.

**Cobertura Reportada:**

| Métrica | Cobertura Final | Cumplimiento |
| :--- | :--- | :--- |
| **Sentencias (Statements)** | **78.69%** | ✅ Mínimo 70%  |
| **Ramas (Branches)** | **70.17%** | ✅ Mínimo 70%  |
| **Funciones (Functions)** | **71.73%** | ✅ Mínimo 70%  |
| **Líneas (Lines)** | **78.73%** | ✅ Mínimo 70%  |

---

## 🚀 Funcionalidades Implementadas (Senior Profile)

Se cumplen todas las funcionalidades indicadas, incluyendo las de perfil Senior.

### Funcionalidades y Validaciones

| ID | Funcionalidad | Detalle de Implementación |
| :--- | :--- | :--- |
| **F1-F3** | Listado y Paginación | Implementación de listado, búsqueda , y control de `pageSize` (5, 10, 20). |
| **F4/F5** | Agregar / Editar | Formulario Reactivo que mantiene las mismas validaciones. El ID está **deshabilitado** en edición. |
| **F6** | Eliminar | Menú contextual (`dropdown`) y **Modal de confirmación**. |

### 🔒 Detalle de Validaciones Clave

* **Validación Asíncrona:** Campo `Id` valida unicidad con el servicio de verificación (Solo activo en modo Agregar).
* **Fecha de Liberación:** Debe ser **igual o mayor a la fecha actual**. *(Corregido el problema de Zona Horaria para comparación precisa)*.
* **Fecha de Revisión:** Debe ser **exactamente un año posterior** a la Fecha de Liberación.

---

## 🛠 Instrucciones de Ejecución

Para iniciar el proyecto y evaluar la solución:

### Requisitos Previos
1. Tener instalado **Node.js** y **npm**.
2. El servicio *backend* local debe estar corriendo en `http://localhost:3002`.

### Pasos
```bash
# 1. Clonar el repositorio
git clone [https://github.com/kevinits2705/financial-products-nttdata.git](https://github.com/kevinits2705/financial-products-nttdata.git)

# 2. Instalar dependencias
npm install

# 3. Iniciar la aplicación Angular
npm start

# 4. (Opcional) Ejecutar Pruebas y Ver Reporte de Cobertura
npm test -- --coverage
