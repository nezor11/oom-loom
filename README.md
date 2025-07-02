# 🍭 Oompa Loompa Directory App

Una aplicación React construida con Vite, Redux Toolkit y Tailwind CSS para mostrar y buscar Oompa Loompas.

![Screenshot](https://s3.eu-central-1.amazonaws.com/napptilus/level-test/imgs/logo-umpa-loompa.png)

## 🚀 Tech Stack

- ⚡️ Vite
- ⚛️ React
- 🧠 Redux Toolkit
- 💅 Tailwind CSS
- 🔄 Redux Persist
- 🔍 Filtros con debounce

## 📦 Instalación

```bash
git clone https://github.com/nezor11/oom-loom.git
cd oom-loom
npm install
npm run dev
```

## 🧪 Scripts disponibles

```bash
npm run dev       # Inicia servidor de desarrollo
npm run build     # Compila la aplicación para producción
npm run preview   # Previsualiza build local
```

## 🔎 Funcionalidades

- Ver lista de Oompa Loompas
- Filtrar por nombre o profesión
- Ver detalle con descripción extendida
- Caché de datos en Redux persistido durante 24h
- Diseño responsive con Tailwind

## 📁 Estructura del proyecto

```
src/
├── features/        # Redux slices
├── pages/           # Vistas principales (Home, Detail)
├── routes/          # React Router
├── store/           # Configuración de Redux y hooks
├── App.tsx
└── main.tsx
```

## 📄 Licencia

MIT © [nezor11](https://github.com/nezor11)
