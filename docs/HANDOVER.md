# Handover

Everything needed to run this site without its original builder is in the
game master playbook, tab **Systems**:

`docs/playbook/Savor-and-Stories-Treasure-Hunt-Playbook.html`

Open that file in a browser. The Systems tab lists every account, which file
to edit for which change, the five commands that take a change live, what to
do when something breaks, and what to hand a freelancer.

Short version:

```
git clone https://github.com/savornstories-dev/savornstories.git
cd savornstories && git checkout claude/astro-rebuild
npm install
npm run build          # fails if a translation is missing
git add -A && git commit -m "Describe the change" && git push
npx wrangler deploy    # never "wrangler versions upload"
```

Read `CLAUDE.md` before changing anything: it holds the copy, language,
scheduling, image and deploy rules.
