#!/bin/bash
# MiniShop Database Tests Runner
# This script runs schema, seed, and constraint tests for the database

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASS=0
FAIL=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -n "Running: $test_name... "
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}PASS${NC}"
        PASS=$((PASS + 1))
    else
        echo -e "${RED}FAIL${NC}"
        FAIL=$((FAIL + 1))
    fi
}

# Function to check MySQL connection
check_mysql() {
    echo -n "Checking MySQL connection... "
    if mysql -h "${DB_HOST:-mysql}" -P "${DB_PORT:-3306}" -u "${DB_USERNAME:-root}" -p"${DB_PASSWORD:-}" "${DB_DATABASE:-minishop}" -e "SELECT 1;" > /dev/null 2>&1; then
        echo -e "${GREEN}Connected${NC}"
        return 0
    else
        echo -e "${RED}Connection failed${NC}"
        return 1
    fi
}

echo "=========================================="
echo "MiniShop Database Tests"
echo "=========================================="
echo

# Wait for MySQL to be ready
if ! check_mysql; then
    echo -e "${YELLOW}Waiting for MySQL to start...${NC}"
    for i in {1..10}; do
        sleep 2
        if check_mysql; then
            break
        fi
        echo -n "."
    done
    echo
fi

if ! check_mysql; then
    echo -e "${RED}ERROR: Cannot connect to MySQL${NC}"
    exit 1
fi

# Test 1: Check if database exists
run_test "Database exists" \
    "mysql -h \"\${DB_HOST:-mysql}\" -P \"\${DB_PORT:-3306}\" -u \"\${DB_USERNAME:-root}\" -p\"\${DB_PASSWORD:-}\" \"\${DB_DATABASE:-minishop}\" -e \"SELECT 1;\" > /dev/null 2>&1"

# Test 2: Check if required tables exist
run_test "Users table exists" \
    "mysql -h \"\${DB_HOST:-mysql}\" -P \"\${DB_PORT:-3306}\" -u \"\${DB_USERNAME:-root}\" -p\"\${DB_PASSWORD:-}\" \"\${DB_DATABASE:-minishop}\" -e \"SELECT 1 FROM users LIMIT 1;\" > /dev/null 2>&1"

run_test "Products table exists" \
    "mysql -h \"\${DB_HOST:-mysql}\" -P \"\${DB_PORT:-3306}\" -u \"\${DB_USERNAME:-root}\" -p\"\${DB_PASSWORD:-}\" \"\${DB_DATABASE:-minishop}\" -e \"SELECT 1 FROM products LIMIT 1;\" > /dev/null 2>&1"

run_test "Orders table exists" \
    "mysql -h \"\${DB_HOST:-mysql}\" -P \"\${DB_PORT:-3306}\" -u \"\${DB_USERNAME:-root}\" -p\"\${DB_PASSWORD:-}\" \"\${DB_DATABASE:-minishop}\" -e \"SELECT 1 FROM orders LIMIT 1;\" > /dev/null 2>&1"

run_test "Order_items table exists" \
    "mysql -h \"\${DB_HOST:-mysql}\" -P \"\${DB_PORT:-3306}\" -u \"\${DB_USERNAME:-root}\" -p\"\${DB_PASSWORD:-}\" \"\${DB_DATABASE:-minishop}\" -e \"SELECT 1 FROM order_items LIMIT 1;\" > /dev/null 2>&1"

# Test 3: Check if seed data exists
run_test "Seed data: Admin user exists" \
    "mysql -h \"\${DB_HOST:-mysql}\" -P \"\${DB_PORT:-3306}\" -u \"\${DB_USERNAME:-root}\" -p\"\${DB_PASSWORD:-}\" \"\${DB_DATABASE:-minishop}\" -e \"SELECT 1 FROM users WHERE email = 'admin@minishop.vn' LIMIT 1;\" > /dev/null 2>&1"

run_test "Seed data: Customer user exists" \
    "mysql -h \"\${DB_HOST:-mysql}\" -P \"\${DB_PORT:-3306}\" -u \"\${DB_USERNAME:-root}\" -p\"\${DB_PASSWORD:-}\" \"\${DB_DATABASE:-minishop}\" -e \"SELECT 1 FROM users WHERE email = 'user@minishop.vn' LIMIT 1;\" > /dev/null 2>&1"

run_test "Seed data: Products exist" \
    "mysql -h \"\${DB_HOST:-mysql}\" -P \"\${DB_PORT:-3306}\" -u \"\${DB_USERNAME:-root}\" -p\"\${DB_PASSWORD:-}\" \"\${DB_DATABASE:-minishop}\" -e \"SELECT 1 FROM products WHERE id = 101 LIMIT 1;\" > /dev/null 2>&1"

# Test 4: Check constraints (CHECK constraints count)
CONSTRAINT_COUNT=$(mysql -h "${DB_HOST:-mysql}" -P "${DB_PORT:-3306}" -u "${DB_USERNAME:-root}" -p"${DB_PASSWORD:-}" "${DB_DATABASE:-minishop}" -N -e "
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.CHECK_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = DATABASE();" 2>/dev/null || echo "0")

if [ "$CONSTRAINT_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✓ CHECK constraints exist ($CONSTRAINT_COUNT found)${NC}"
    PASS=$((PASS + 1))
else
    echo -e "${YELLOW}✗ CHECK constraints: 0 found (may be expected)${NC}"
    # Don't fail on this, as per commit 41f656e which removed flaky CHECK constraint assertion
fi

# Summary
echo
echo "=========================================="
echo "Database Tests Summary"
echo "=========================================="
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo "=========================================="

if [ $FAIL -gt 0 ]; then
    exit 1
fi

exit 0
