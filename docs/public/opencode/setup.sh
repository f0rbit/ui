#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up @f0rbit/ui...${NC}"

# Detect package manager
if command -v bun &> /dev/null; then
    PKG_MGR="bun"
    ADD_CMD="bun add"
elif command -v pnpm &> /dev/null; then
    PKG_MGR="pnpm"
    ADD_CMD="pnpm add"
elif command -v npm &> /dev/null; then
    PKG_MGR="npm"
    ADD_CMD="npm install"
else
    echo -e "${RED}Error: No package manager found (bun, pnpm, or npm required)${NC}"
    exit 1
fi

echo -e "Using ${GREEN}$PKG_MGR${NC} as package manager"

# Detect if we're in a monorepo
if [ -d "packages" ] && [ -f "package.json" ]; then
    echo -e "${BLUE}Detected monorepo structure${NC}"
    echo "Which package should @f0rbit/ui be added to?"
    echo "Enter path (e.g., 'packages/web') or '.' for root:"
    read -r TARGET_DIR
    TARGET_DIR=${TARGET_DIR:-.}
else
    TARGET_DIR="."
fi

# Install package
echo -e "${BLUE}Installing @f0rbit/ui...${NC}"
cd "$TARGET_DIR"
$ADD_CMD @f0rbit/ui
cd - > /dev/null

# Create OpenCode skill directory
echo -e "${BLUE}Setting up OpenCode skill...${NC}"
mkdir -p .opencode/skill/f0rbit-ui

# Download SKILL.md
curl -sL https://f0rbit.github.io/ui/opencode/skill.md -o .opencode/skill/f0rbit-ui/SKILL.md

echo -e "${GREEN}✓ @f0rbit/ui setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Import styles: import \"@f0rbit/ui/styles\";"
echo "  2. Import components: import { Button } from \"@f0rbit/ui\";"
echo ""
echo "The OpenCode skill is now available for AI assistance."
