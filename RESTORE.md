# Fix for accidental PLACEHOLDER commit

An incomplete push briefly replaced `src/components/home-page.tsx` with the text PLACEHOLDER.

## Quick fix (run on your machine)

```bash
cd seek
git fetch origin

# 1) Restore the last good version of the home page
curl -sL "https://raw.githubusercontent.com/vijaaaayyyy/seek/68d4d5ee7671ab2b3222f7ee3cce5ef39dae3a65/src/components/home-page.tsx" -o src/components/home-page.tsx

# 2) Apply the redesign (centered footer + What you get section)
git apply home-footer.patch
# if git apply fails, try:
#   patch -p1 < home-footer.patch

# 3) Commit and push
git add src/components/home-page.tsx
git commit -m "Home: add What you get section; center footer content"
git push origin main
```

After that, run:

```bash
npm install
npm run dev
```
