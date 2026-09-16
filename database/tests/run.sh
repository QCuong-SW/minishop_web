#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
TEST_DATABASE="shopee_mini_test"

cd "${PROJECT_ROOT}"

if [[ -f .env ]]; then
    set -a
    # shellcheck disable=SC1091
    source .env
    set +a
elif [[ -f .env.example ]]; then
    set -a
    # shellcheck disable=SC1091
    source .env.example
    set +a
fi

: "${MYSQL_ROOT_PASSWORD:?MYSQL_ROOT_PASSWORD must be defined in .env}"

mysql_cmd=(docker compose exec -T -e "MYSQL_PWD=${MYSQL_ROOT_PASSWORD}" mysql mysql -uroot --default-character-set=utf8mb4)

cleanup() {
    printf 'DROP DATABASE IF EXISTS `%s`;\n' "${TEST_DATABASE}" | "${mysql_cmd[@]}" >/dev/null 2>&1 || true
}
trap cleanup EXIT

ready=false
for _ in {1..30}; do
    if "${mysql_cmd[@]}" -N -e 'SELECT 1' >/dev/null 2>&1; then
        ready=true
        break
    fi
    sleep 1
done

if [[ "${ready}" != true ]]; then
    echo 'MySQL did not become ready within 30 seconds' >&2
    exit 1
fi

printf 'DROP DATABASE IF EXISTS `%s`; CREATE DATABASE `%s` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n' "${TEST_DATABASE}" "${TEST_DATABASE}" | "${mysql_cmd[@]}"
"${mysql_cmd[@]}" "${TEST_DATABASE}" < database/schema.sql
"${mysql_cmd[@]}" "${TEST_DATABASE}" < database/seed.sql
"${mysql_cmd[@]}" "${TEST_DATABASE}" < database/tests/assertions.sql
printf 'GRANT SELECT, INSERT, UPDATE, DELETE ON `%s`.* TO '\''%s'\''@'\''%%'\''; FLUSH PRIVILEGES;\n' "${TEST_DATABASE}" "${DB_USERNAME:-app}" | "${mysql_cmd[@]}"
docker compose exec -T -e "DB_DATABASE=${TEST_DATABASE}" backend php tests/database-integration.php

echo 'Database integration tests passed.'
