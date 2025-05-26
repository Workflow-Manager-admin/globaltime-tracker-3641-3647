#!/bin/bash
cd /home/kavia/workspace/code-generation/globaltime-tracker-3641-3647/global_time_tracker
npx eslint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
 if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

