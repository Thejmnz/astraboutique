#!/bin/sh

# Reemplazar variables de entorno en los archivos JS compilados
for file in /usr/share/nginx/html/assets/*.js; do
  if [ -f "$file" ]; then
    sed -i "s|__VITE_SUPABASE_URL__|${VITE_SUPABASE_URL}|g" "$file"
    sed -i "s|__VITE_SUPABASE_ANON_KEY__|${VITE_SUPABASE_ANON_KEY}|g" "$file"
  fi
done

exec nginx -g "daemon off;"
