# SmartQueueMobileReactNative

Al bajarlo, instalar y actualizar módulos y dependencias
yarn install

El proyecto usa esLint y flow (tipado estático)
Para desactivar en Visual Code errores de TypeScript mientras se programa seguir estos pasos:
En la solapa de extensiones buscar e instalar Flow Language Support.
En la misma solapa buscar y deshabilitar @builtin TypeScript and JavaScript Language Features

Correr esLint: yarn lint
Correr flow: yarn flow

Para correr los tests
yarn test

Para crear el bundle
./gradlew bundleRelease
Para crear el apk
./gradlew assembleRelease