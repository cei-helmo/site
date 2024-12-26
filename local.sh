#!/bin/bash

echo "Lancement des linters"

npm run lint
npm run format

echo "Lancement du server de dev"
npm run dev