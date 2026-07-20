#!/usr/bin/env bash
# Publish v2.2.0 GitHub release — requires origin remote and gh CLI.
# Usage: ./scripts/release/publish-github-release.sh [remote-url]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

TAG="v2.2.0"
MERGE_COMMIT="c409f75"
NOTES="docs/operations/releases/V2_2_RELEASE_NOTES.md"
EVIDENCE="docs/architecture/V2_2_CERTIFICATION_EVIDENCE_PACKAGE.json"
SUMMARY="docs/architecture/V2_2_RELEASE_CANDIDATE_SUMMARY.md"

echo "Alpha DFS AI — GitHub Release Publisher (OP-1)"
echo ""

# Optional: configure remote from argument
if [[ "${1:-}" != "" ]]; then
  if git remote get-url origin &>/dev/null; then
    echo "Remote 'origin' already exists: $(git remote get-url origin)"
  else
    git remote add origin "$1"
    echo "Added origin: $1"
  fi
fi

if ! git remote get-url origin &>/dev/null; then
  echo "ERROR: No git remote 'origin'. Pass URL as first argument or run:"
  echo "  git remote add origin <repository-url>"
  exit 1
fi

if ! command -v gh &>/dev/null; then
  echo "ERROR: GitHub CLI (gh) not installed."
  echo "  brew install gh && gh auth login"
  exit 1
fi

# Verify branch and tag
CURRENT="$(git branch --show-current)"
if [[ "$CURRENT" != "main" ]]; then
  echo "ERROR: Must be on main (currently: $CURRENT)"
  exit 1
fi

TAG_COMMIT="$(git rev-parse "${TAG}^{commit}")"
MERGE_FULL="$(git rev-parse "$MERGE_COMMIT")"
if [[ "$TAG_COMMIT" != "$MERGE_FULL" ]]; then
  echo "ERROR: Tag $TAG points to $TAG_COMMIT, expected merge $MERGE_FULL"
  exit 1
fi
echo "✓ Tag $TAG → merge commit $MERGE_COMMIT"

for f in "$NOTES" "$EVIDENCE" "$SUMMARY"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: Missing artifact: $f"
    exit 1
  fi
done
echo "✓ Release artifacts present"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "WARNING: Working tree has uncommitted changes"
  git status --short
fi

echo ""
echo "Pushing main and tag..."
git push origin main
git push origin "$TAG"

echo ""
echo "Creating GitHub release..."
gh release create "$TAG" \
  --title "Alpha DFS AI v2.2.0 — ADI Platform (Release Candidate)" \
  --notes-file "$NOTES" \
  --attach "$EVIDENCE" \
  --attach "$SUMMARY"

echo ""
echo "✓ GitHub release published: $TAG"
gh release view "$TAG" --web 2>/dev/null || gh release view "$TAG"
