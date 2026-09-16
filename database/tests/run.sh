#!/usr/bin/env bash
set -euo pipefail

mysql_cmd=(mysql -h "${DB_HOST:-127.0.0.1}" -P "${DB_PORT:-3307}" -u "${DB_USERNAME:-app}" -p"${DB_PASSWORD:-app}" "${DB_DATABASE:-shopee_mini}")

for attempt in {1..20}; do
  if "${mysql_cmd[@]}" -e 'SELECT 1' >/dev/null 2>&1; then break; fi
  [[ "$attempt" -eq 20 ]] && { echo 'MySQL did not become ready' >&2; exit 1; }
  sleep 2
done

"${mysql_cmd[@]}" -e 'SELECT 1 FROM users LIMIT 1'
"${mysql_cmd[@]}" -e 'SELECT 1 FROM categories WHERE id IN (1,2,3,4)'
"${mysql_cmd[@]}" -e 'SELECT 1 FROM products WHERE id = 101'
"${mysql_cmd[@]}" -e 'SELECT 1 FROM orders WHERE id = 5001'
echo 'Database checks passed'
