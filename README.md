# React Frontend – Športová diagnostika

Tento projekt predstavuje frontendovú časť systému pre správu športových testov a profilov športovcov. Je vytvorený pomocou Reactu, Vite a Tailwind CSS.

## 🔧 Technológie

- **React 18**
- **Vite 6**
- **TypeScript**
- **Tailwind CSS**
- **MUI (Material UI)**
- **Shadcn UI**
- **Radix UI**
- **React Router v7**
- **TanStack Query (React Query)**
- **Zod + React Hook Form** – validácia a formuláre
- **Toolpad Core** – layout a dashboard komponenty

## 🚀 Spustenie projektu

### 1. Klonovanie repozitára

    git clone https://github.com/tvoj-username/SportWeb-react.git
    cd frontend-repo

### 2. Inštalovanie závislostí
Použi Yarn:
    yarn install

### 3. Spustenie vývojového servera
    yarn dev

### 4. Build (produkcia)
    yarn build



## 🌐 Prepojenie s backendom
Táto aplikácia je napojená na backend vytvorený pomocou PayloadCMS a databázy MongoDB. Endpoints sú volané cez axios a react-query. Backend je samostatný projekt...


## 📁 Štruktúra projektu
 ```tree
SportWeb-react/
├── public/
├── src/
│ ├──api/
│ ├──components/
│ ├──data/
│ ├──utils/
│ └── ...
├──.gitignore
├──.prettierrc.js
├──README.md
├──components.json 
├──index.html
├──package.json
├──postcss.config.mjs
├──tailwind.config.js
├──tsconfig.json
├──vite.config.ts
└──yarn.lock
