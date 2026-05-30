# pi-ancestor-resources

A [pi](https://pi.dev) extension that exposes ancestor `.agents/skills` directories even when the current project is inside a nested git repository.

Pi normally discovers project skills up to the current git repository root. This package extends discovery one level further: it walks above that repository and contributes ancestor `.agents/skills` folders through Pi's `resources_discover` event.

## Install

This package is published on GitHub only.

```sh
pi install git:github.com/patlux/pi-ancestor-resources@v0.1.1
```

Then reload pi:

```txt
/reload
```

## Usage

No commands or configuration are required.

When pi starts or reloads inside a nested repository, the extension checks ancestors above the current git root for skill directories:

```txt
workspace/
├── .agents/skills/              # discovered
└── client-repo/
    ├── .git/
    └── app/
        └── package.json         # current cwd somewhere below here
```

It intentionally skips the global skill directory:

```txt
~/.agents/skills
```

Pi already loads that global directory, so adding it again would duplicate skills.

## Why this exists

This is useful for monorepos, client workspaces, and personal folder layouts where shared instructions live above a project-specific git repository.

Example:

```txt
~/dev/Personal/.agents/skills/    # shared personal skills
~/dev/Personal/project-a/.git/    # current git repo
```

Without this extension, Pi stops at `project-a`. With this extension, Pi can still discover the shared personal skills above it.

## Notes

- The extension only contributes existing `.agents/skills` directories.
- It does not read skill files itself; Pi handles normal skill loading.
- It does not cross into `~/.agents/skills`, because that path is already loaded globally.
- Extensions run with local user permissions. Review extensions before installing them.

## Development

```sh
npm ci
npm run ci
```

The package uses TypeScript source directly. Pi loads `.ts` extensions without a build step.

## Release

GitHub-only release flow:

```sh
npm version patch --no-git-tag-version
git commit -am "Release vX.Y.Z"
git tag -a vX.Y.Z -m "pi-ancestor-resources vX.Y.Z"
git push origin main vX.Y.Z
```

Install the pinned tag with:

```sh
pi install git:github.com/patlux/pi-ancestor-resources@vX.Y.Z
```

## License

MIT
