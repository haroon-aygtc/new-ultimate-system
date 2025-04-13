#!/bin/bash

# Check if SUPABASE_PROJECT_ID is set
if [ -z "$SUPABASE_PROJECT_ID" ]; then
  echo "Error: SUPABASE_PROJECT_ID environment variable is not set."
  echo "Please set it in your .env file or export it in your shell."
  exit 1
 fi

# Generate types
echo "Generating Supabase types..."
npx supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > src/types/supabase.ts

echo "Types generated successfully!"
