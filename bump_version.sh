#! /bin/bash

cd $(pnpm root)/../src;
echo "export const uuid = '$(uuidgen)';" > ./app.ts;
git add ./app.ts