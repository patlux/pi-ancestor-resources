# pi-ancestor-resources

Expose ancestor .agents/skills directories to Pi across git repository boundaries.

## Install

```bash
pi install git:github.com/patlux/pi-ancestor-resources@v0.1.0
```

Then reload Pi:

```text
/reload
```

## Pi manifest

```json
{
  "extensions": ["./index.ts"]
}
```

This extension listens to `resources_discover`, walks above the current git repository root, and contributes ancestor `.agents/skills` directories while avoiding duplicate global `~/.agents/skills`.
