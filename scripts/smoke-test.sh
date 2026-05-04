#!/usr/bin/env bash
# scripts/smoke-test.sh — Local integration smoke tests for ListForge.
# Usage: bash scripts/smoke-test.sh
# Assumes dev server is running on http://localhost:3000.

set -u
BASE="${BASE:-http://localhost:3000}"
PASS=0
FAIL=0
FAILURES=()

check() {
  local name="$1" expected="$2" actual="$3"
  if [[ "$actual" == "$expected" ]]; then
    printf "  \033[32m✓\033[0m %-60s %s\n" "$name" "$actual"
    PASS=$((PASS + 1))
  else
    printf "  \033[31m✗\033[0m %-60s expected=%s got=%s\n" "$name" "$expected" "$actual"
    FAIL=$((FAIL + 1))
    FAILURES+=("$name (expected $expected, got $actual)")
  fi
}

http_code() {
  curl -s -o /dev/null -w '%{http_code}' --max-time 30 "$@"
}

http_post_code() {
  local body="$1"; shift
  curl -s -o /dev/null -w '%{http_code}' --max-time 60 \
    -X POST "$BASE/api/optimize" \
    -H 'Content-Type: application/json' \
    -d "$body"
}

# --- 1. Public static routes ----------------------------------------
echo
echo "[1/5] Static routes"
for path in "/" "/tools/amazon-listing-optimizer" "/tools/tiktok-shop-optimizer" \
            "/tools/shopify-product-optimizer" "/guides" "/privacy" "/terms" \
            "/sitemap.xml" "/robots.txt"; do
  check "GET $path" "200" "$(http_code "$BASE$path")"
done

# --- 2. Editorial guides (4) ----------------------------------------
echo
echo "[2/5] Editorial guides"
for slug in amazon-title-best-practices backend-keywords-explained \
            tiktok-shop-product-title-formula shopify-product-description-template; do
  check "GET /guides/$slug" "200" "$(http_code "$BASE/guides/$slug")"
done

# --- 3. pSEO sample (category-level + sub-niche-level) --------------
echo
echo "[3/5] pSEO sample (category + sub-niche)"
# category-level (original 36)
for slug in amazon-kitchen-gadgets-listing-optimizer \
            tiktok-shop-pet-supplies-listing-optimizer \
            shopify-jewelry-listing-optimizer; do
  check "GET /guides/$slug" "200" "$(http_code "$BASE/guides/$slug")"
done
# sub-niche-level (new 144)
for slug in amazon-kitchen-gadgets-garlic-tools-listing-optimizer \
            tiktok-shop-skincare-beauty-vitamin-c-serums-listing-optimizer \
            shopify-phone-accessories-wireless-chargers-listing-optimizer; do
  check "GET /guides/$slug" "200" "$(http_code "$BASE/guides/$slug")"
done

# --- 4. Not-found path ----------------------------------------------
echo
echo "[4/5] 404 handling"
check "GET /guides/this-slug-does-not-exist" "404" \
  "$(http_code "$BASE/guides/this-slug-does-not-exist")"
# Unknown sub-niche under a real category must 404, not fall through.
check "GET /guides/amazon-kitchen-gadgets-nonexistent-listing-optimizer" "404" \
  "$(http_code "$BASE/guides/amazon-kitchen-gadgets-nonexistent-listing-optimizer")"

# --- 5. /api/optimize -----------------------------------------------
echo
echo "[5/5] /api/optimize"

# Note: rate-limit is checked BEFORE input validation (by design, to prevent
# malformed-payload DoS). When the bucket is exhausted (e.g. running this
# script back-to-back), validation tests will return 429 instead of 400. To
# stay deterministic, we detect that case and skip with a clear note rather
# than fail.
check_400_or_skip_if_rate_limited() {
  local label="$1" got="$2"
  if [[ "$got" == "429" ]]; then
    printf "  ~ %-60s SKIPPED (bucket exhausted)\n" "$label"
  else
    check "$label" "400" "$got"
  fi
}

# 5a. Valid input → 200 streaming NDJSON (real DeepSeek if key present, else mock)
VALID='{"platform":"amazon","productName":"Stainless garlic press","category":"Kitchen Gadgets","features":"304 stainless steel\nremovable insert\ncomfortable grip"}'
RESPONSE=$(curl -s --max-time 90 -X POST "$BASE/api/optimize" \
  -H 'Content-Type: application/json' -d "$VALID")
# First line should be the meta header; subsequent lines are partials/done.
FIRST_LINE=$(echo "$RESPONSE" | head -n 1)
if echo "$FIRST_LINE" | grep -q '"meta"'; then
  check "POST /api/optimize (valid, ndjson)" "200" "200"
elif echo "$FIRST_LINE" | grep -q '"error".*[Rr]ate'; then
  printf "  ~ %-60s SKIPPED (bucket exhausted)\n" "POST /api/optimize (valid, ndjson)"
else
  check "POST /api/optimize (valid, ndjson)" "200" "no-meta-line"
fi

# Count "done" lines — should be 3 (one per variant) on a healthy response.
DONE_COUNT=$(echo "$RESPONSE" | grep -c '"done":true' || true)
echo "    stream: $(echo "$RESPONSE" | wc -l | tr -d ' ') lines, $DONE_COUNT variants completed"

# 5b. Invalid GET method → 405
check "GET /api/optimize (wrong method)" "405" "$(http_code "$BASE/api/optimize")"

# 5c. Bad JSON body → 400 (or 429 if rate-limited)
check_400_or_skip_if_rate_limited "POST /api/optimize (bad json)" \
  "$(http_post_code 'not-json-at-all')"

# 5d. Missing required field → 400
check_400_or_skip_if_rate_limited "POST /api/optimize (missing fields)" \
  "$(http_post_code '{"platform":"amazon"}')"

# 5e. Invalid platform → 400 (zod enum)
check_400_or_skip_if_rate_limited "POST /api/optimize (bad platform)" \
  "$(http_post_code '{"platform":"ebay","productName":"x","category":"y","features":"feature one\nfeature two"}')"

# 5f. Rate limit — fire until 429 appears
echo
echo "    rate-limit: firing 10 rapid invalid POSTs to exhaust bucket..."
saw_429=0
for i in $(seq 1 10); do
  code=$(http_post_code '{"platform":"amazon"}')
  printf "      req %2d → %s\n" "$i" "$code"
  if [[ "$code" == "429" ]]; then saw_429=1; fi
done
check "rate-limit returns 429 within 10 requests" "1" "$saw_429"

# --- summary --------------------------------------------------------
echo
echo "================================================================"
printf "Total: %d passed, %d failed\n" "$PASS" "$FAIL"
if [[ $FAIL -gt 0 ]]; then
  echo
  echo "Failures:"
  for f in "${FAILURES[@]}"; do echo "  - $f"; done
  exit 1
fi
exit 0
