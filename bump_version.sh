#! /bin/bash

cd "$(pnpm root)/../src" || exit;
echo "export const uuid = '$(uuidgen)';" > ./app.ts;
git add ./app.ts