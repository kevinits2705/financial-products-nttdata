# Prueba Técnica Frontend - Angular (NTT DATA)

## 🎯 Introducción y Objetivo del Proyecto

Este repositorio contiene la solución a la Prueba Técnica de desarrollo Frontend con **Angular**. [cite_start]El proyecto implementa un módulo de **gestión de productos financieros**, cumpliendo con todas las funcionalidades requeridas (F1 a F6) y las indicaciones de calidad[cite: 19].

[cite_start]El foco principal fue la aplicación de **Arquitectura Hexagonal**, principios **SOLID** y **Clean Code** [cite: 4][cite_start], asegurando la calidad mediante **pruebas unitarias** con alta cobertura[cite: 7].

---

## 🏗 Arquitectura: Hexagonal (Ports & Adapters)

El diseño del proyecto se basa en la **Arquitectura Hexagonal**, lo que garantiza que la lógica de negocio (`Domain` y `Application`) es independiente de la tecnología (la API REST en `Infrastructure` y Angular en `Presentation`).

| Carpeta Principal | Capa Hexagonal | Responsabilidad |
| :--- | :--- | :--- |
| **`domain`** | **Core/Domain** | [cite_start]Contiene las Entidades (`Product` [cite: 114, 115][cite_start]) y los *Ports* (Interfaces del `ProductRepository` [cite: 114, 115]). |
| **`application`** | **Application** | Contiene la Lógica de Negocio y el Estado (NgRx Store, Effects, Reducers, Selectors). Define los *Use Cases*. |
| **`infrastructure`** | **Infrastructure (Adapter)** | [cite_start]Contiene los *Adapters* (Ej: `ProductHttpRepository`) que implementan los *Ports* (interfaces) para interactuar con la API[cite: 116]. |
| **`presentation`** | **Presentation (Adapter)** | [cite_start]Contiene la UI (Componentes, *templates*, rutas [cite: 18]) que muestran el estado y despachan acciones. |

### ⚙️ Pila Tecnológica

* [cite_start]**Framework:** Angular 20[cite: 11].
* **Gestión de Estado:** NgRx (Store, Effects, Selectors, Reducers).
* **Pruebas:** Jasmine & Karma.

---

## ✅ Pruebas Unitarias y Cobertura

[cite_start]Se realizaron pruebas unitarias exhaustivas en las capas críticas (NgRx, Componentes, Repositorio) para asegurar la funcionalidad y la robustez del código[cite: 7].

**Cobertura Reportada:**

| Métrica | Cobertura Final | Cumplimiento |
| :--- | :--- | :--- |
| **Sentencias (Statements)** | **78.69%** | [cite_start]✅ Mínimo 70% [cite: 7] |
| **Ramas (Branches)** | **70.17%** | [cite_start]✅ Mínimo 70% [cite: 7] |
| **Funciones (Functions)** | **71.73%** | [cite_start]✅ Mínimo 70% [cite: 7] |
| **Líneas (Lines)** | **78.73%** | [cite_start]✅ Mínimo 70% [cite: 7] |

---

## 🚀 Funcionalidades Implementadas (Senior Profile)

[cite_start]Se cumplen todas las funcionalidades indicadas, incluyendo las de perfil Senior[cite: 19].

### Funcionalidades y Validaciones

| ID | Funcionalidad | Detalle de Implementación |
| :--- | :--- | :--- |
| **F1-F3** | Listado y Paginación | [cite_start]Implementación de listado, búsqueda [cite: 25][cite_start], y control de `pageSize` (5, 10, 20)[cite: 29]. |
| **F4/F5** | Agregar / Editar | Formulario Reactivo que mantiene las mismas validaciones. [cite_start]El ID está **deshabilitado** en edición[cite: 39]. |
| **F6** | Eliminar | [cite_start]Menú contextual (`dropdown`) [cite: 40] [cite_start]y **Modal de confirmación**[cite: 42, 43]. |

### 🔒 Detalle de Validaciones Clave

* [cite_start]**Validación Asíncrona:** Campo `Id` valida unicidad con el servicio de verificación [cite: 34, 137] (Solo activo en modo Agregar).
* [cite_start]**Fecha de Liberación:** Debe ser **igual o mayor a la fecha actual**[cite: 34]. *(Corregido el problema de Zona Horaria para comparación precisa)*.
* [cite_start]**Fecha de Revisión:** Debe ser **exactamente un año posterior** a la Fecha de Liberación[cite: 34].

---

## 🛠 Instrucciones de Ejecución

Para iniciar el proyecto y evaluar la solución:

### Requisitos Previos
1. Tener instalado **Node.js** y **npm**.
2. [cite_start]El servicio *backend* local debe estar corriendo en `http://localhost:3002`[cite: 123, 125].

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