import type { ToolCategory, ToolName, ToolMetaBasic, ToolMeta } from './types';

function flattenToolMeta(
  category: ToolCategory,
  tools: Record<ToolName, ToolMetaBasic>,
): Record<ToolName, ToolMeta> {
  return Object.fromEntries(
    Object.entries(tools).map(([name, meta]) => [name, { name, category, ...meta }]),
  );
}

const AI_TOOLS: Record<ToolName, ToolMetaBasic> = {
  'Claude Code': {
    logo: 'anthropic',
    url: 'https://docs.anthropic.com/en/docs/claude-code',
    files: ['.claude/settings.json'],
  },
  'Claude Code (AGENTS.md)': {
    logo: 'anthropic',
    url: 'https://docs.anthropic.com/en/docs/claude-code',
    files: ['AGENTS.md'],
  },
  'Claude Code (CLAUDE.md)': {
    logo: 'anthropic',
    url: 'https://docs.anthropic.com/en/docs/claude-code',
    files: ['CLAUDE.md'],
  },
  'GitHub Copilot': {
    logo: 'githubcopilot',
    url: 'https://github.com/features/copilot',
    files: ['.github/copilot-instructions.md', '.copilot-instructions.md'],
  },
  Cursor: {
    logo: 'cursor',
    url: 'https://cursor.com',
    files: ['.cursorrules', '.cursorignore', '.cursor/'],
  },
  Aider: {
    logo: null,
    url: 'https://aider.chat',
    files: ['.aider.conf.yml', '.aiderignore'],
  },
  Cline: {
    logo: null,
    url: 'https://cline.bot',
    files: ['cline_docs/'],
  },
  Windsurf: {
    logo: null,
    url: 'https://windsurf.com',
    files: ['.windsurfrules'],
  },
};

const PACKAGE_MANAGERS: Record<ToolName, ToolMetaBasic> = {
  Bun: {
    logo: 'bun',
    url: 'https://bun.sh',
    files: ['bun.lockb', 'bunfig.toml'],
  },
  npm: {
    logo: 'npm',
    url: 'https://www.npmjs.com',
    files: ['package-lock.json'],
  },
  Yarn: {
    logo: 'yarn',
    url: 'https://yarnpkg.com',
    files: ['yarn.lock'],
  },
  pnpm: {
    logo: 'pnpm',
    url: 'https://pnpm.io',
    files: ['pnpm-lock.yaml'],
  },
  Cargo: {
    logo: 'rust',
    url: 'https://doc.rust-lang.org/cargo/',
    files: ['Cargo.toml'],
  },
  'Go Modules': {
    logo: 'go',
    url: 'https://go.dev',
    files: ['go.mod'],
  },
  Bundler: {
    logo: 'rubygems',
    url: 'https://bundler.io',
    files: ['Gemfile.lock'],
  },
  Poetry: {
    logo: 'poetry',
    url: 'https://python-poetry.org',
    files: ['poetry.lock'],
  },
  Pipenv: {
    logo: 'python',
    url: 'https://pipenv.pypa.io',
    files: ['Pipfile.lock'],
  },
  pip: {
    logo: 'pypi',
    url: 'https://pip.pypa.io',
    files: ['requirements.txt'],
  },
  uv: {
    logo: 'uv',
    url: 'https://docs.astral.sh/uv',
    files: ['uv.lock'],
  },
  Composer: {
    logo: 'composer',
    url: 'https://getcomposer.org',
    files: ['composer.lock'],
  },
};

const FRAMEWORKS: Record<ToolName, ToolMetaBasic> = {
  'Next.js': {
    logo: 'nextdotjs',
    url: 'https://nextjs.org',
    files: ['next.config.js', 'next.config.ts', 'next.config.mjs'],
  },
  Nuxt: {
    logo: 'nuxtdotjs',
    url: 'https://nuxt.com',
    files: ['nuxt.config.ts', 'nuxt.config.js'],
  },
  SvelteKit: {
    logo: 'svelte',
    url: 'https://kit.svelte.dev',
    files: ['svelte.config.js'],
  },
  Astro: {
    logo: 'astro',
    url: 'https://astro.build',
    files: ['astro.config.mjs', 'astro.config.ts'],
  },
  Angular: {
    logo: 'angular',
    url: 'https://angular.dev',
    files: ['angular.json'],
  },
  Remix: {
    logo: 'remix',
    url: 'https://remix.run',
    files: ['remix.config.js'],
  },
  Vite: {
    logo: 'vite',
    url: 'https://vitejs.dev',
    files: ['vite.config.ts', 'vite.config.js'],
  },
  Webpack: {
    logo: 'webpack',
    url: 'https://webpack.js.org',
    files: ['webpack.config.js'],
  },
  'Tailwind CSS': {
    logo: 'tailwindcss',
    url: 'https://tailwindcss.com',
    files: ['tailwind.config.js', 'tailwind.config.ts'],
  },
  PostCSS: {
    logo: 'postcss',
    url: 'https://postcss.org',
    files: ['postcss.config.js'],
  },
  Django: {
    logo: 'django',
    url: 'https://www.djangoproject.com',
    files: ['django/', 'manage.py'],
  },
  Rails: {
    logo: 'rubyonrails',
    url: 'https://rubyonrails.org',
    files: ['Rakefile', 'config.ru'],
  },
};

const TESTING_TOOLS: Record<ToolName, ToolMetaBasic> = {
  Jest: {
    logo: 'jest',
    url: 'https://jestjs.io',
    files: ['jest.config.js', 'jest.config.ts'],
  },
  Vitest: {
    logo: 'vitest',
    url: 'https://vitest.dev',
    files: ['vitest.config.ts', 'vitest.config.js'],
  },
  Cypress: {
    logo: 'cypress',
    url: 'https://www.cypress.io',
    files: ['cypress.config.ts', 'cypress.config.js'],
  },
  Playwright: {
    logo: 'playwright',
    url: 'https://playwright.dev',
    files: ['playwright.config.ts'],
  },
  Mocha: {
    logo: 'mocha',
    url: 'https://mochajs.org',
    files: ['.mocharc.yml'],
  },
  pytest: {
    logo: 'pytest',
    url: 'https://pytest.org',
    files: ['pytest.ini', 'setup.cfg'],
  },
  PHPUnit: {
    logo: null,
    url: 'https://phpunit.de',
    files: ['phpunit.xml'],
  },
};

const LINTING_AND_FORMATTING_TOOLS: Record<ToolName, ToolMetaBasic> = {
  ESLint: {
    logo: 'eslint',
    url: 'https://eslint.org',
    files: ['.eslintrc', '.eslintrc.js', '.eslintrc.json', 'eslint.config.js', 'eslint.config.mjs'],
  },
  oxlint: {
    logo: null,
    url: 'https://oxc.rs',
    files: ['.oxlintrc.json'],
  },
  Biome: {
    logo: 'biome',
    url: 'https://biomejs.dev',
    files: ['biome.json'],
  },
  Prettier: {
    logo: 'prettier',
    url: 'https://prettier.io',
    files: ['.prettierrc', '.prettierrc.json', 'prettier.config.js'],
  },
  oxfmt: {
    logo: null,
    url: 'https://oxc.rs',
    files: ['.oxfmtrc.json'],
  },
  rustfmt: {
    logo: 'rust',
    url: 'https://github.com/rust-lang/rustfmt',
    files: ['rustfmt.toml'],
  },
  'golangci-lint': {
    logo: 'go',
    url: 'https://golangci-lint.run',
    files: ['.golangci.yml'],
  },
  'Ruff/Black': {
    logo: 'ruff',
    url: 'https://docs.astral.sh/ruff/',
    files: ['pyproject.toml'],
  },
  RuboCop: {
    logo: 'rubocop',
    url: 'https://rubocop.org',
    files: ['.rubocop.yml'],
  },
  Commitizen: {
    logo: 'commitizen',
    url: 'https://commitizen-tools.github.io/commitizen/',
    files: ['.czrc', '.cz.toml', 'commitizen.yaml'],
  },
};

const MONOREPO_TOOLS: Record<ToolName, ToolMetaBasic> = {
  Lerna: {
    logo: 'lerna',
    url: 'https://lerna.js.org',
    files: ['lerna.json'],
  },
  Nx: {
    logo: 'nx',
    url: 'https://nx.dev',
    files: ['nx.json'],
  },
  Turborepo: {
    logo: 'turborepo',
    url: 'https://turbo.build',
    files: ['turbo.json'],
  },
  'pnpm Workspaces': {
    logo: 'pnpm',
    url: 'https://pnpm.io/workspaces',
    files: ['pnpm-workspace.yaml'],
  },
  Rush: {
    logo: null,
    url: 'https://rushjs.io',
    files: ['rush.json'],
  },
};

const CICD_TOOLS: Record<ToolName, ToolMetaBasic> = {
  'GitHub Actions': {
    logo: 'githubactions',
    url: 'https://github.com/features/actions',
    files: ['.github/workflows/'],
  },
  'GitLab CI': {
    logo: 'gitlab',
    url: 'https://docs.gitlab.com/ee/ci/',
    files: ['.gitlab-ci.yml'],
  },
  Jenkins: {
    logo: 'jenkins',
    url: 'https://www.jenkins.io',
    files: ['Jenkinsfile'],
  },
  CircleCI: {
    logo: 'circleci',
    url: 'https://circleci.com',
    files: ['.circleci/'],
  },
  'Travis CI': {
    logo: 'travisci',
    url: 'https://www.travis-ci.com',
    files: ['.travis.yml'],
  },
  Docker: {
    logo: 'docker',
    url: 'https://www.docker.com',
    files: ['Dockerfile', '.dockerignore'],
  },
  'Docker Compose': {
    logo: 'docker',
    url: 'https://docs.docker.com/compose/',
    files: ['docker-compose.yml', 'docker-compose.yaml'],
  },
  Make: {
    logo: null,
    url: 'https://www.gnu.org/software/make/',
    files: ['Makefile'],
  },
  Vercel: {
    logo: 'vercel',
    url: 'https://vercel.com',
    files: ['vercel.json'],
  },
  Netlify: {
    logo: 'netlify',
    url: 'https://www.netlify.com',
    files: ['netlify.toml'],
  },
  'Fly.io': {
    logo: 'flydotio',
    url: 'https://fly.io',
    files: ['fly.toml'],
  },
  Render: {
    logo: 'render',
    url: 'https://render.com',
    files: ['render.yaml'],
  },
};

const IDES: Record<ToolName, ToolMetaBasic> = {
  'VS Code': {
    logo: 'visualstudiocode',
    url: 'https://code.visualstudio.com',
    files: ['.vscode/'],
  },
  'JetBrains IDEs': {
    logo: 'jetbrains',
    url: 'https://www.jetbrains.com',
    files: ['.idea/'],
  },
  'Visual Studio': {
    logo: 'visualstudio',
    url: 'https://visualstudio.microsoft.com',
    files: ['.vs/'],
  },
  Fleet: {
    logo: 'fleet',
    url: 'https://www.jetbrains.com/fleet',
    files: ['.fleet/'],
  },
  'Sublime Text': {
    logo: 'sublimetext',
    url: 'https://www.sublimetext.com',
    files: ['.sublime-project', '.sublime-workspace'],
  },
  Vim: {
    logo: 'vim',
    url: 'https://www.vim.org',
    files: ['.vimrc', '.vim/'],
  },
  Emacs: {
    logo: 'gnuemacs',
    url: 'https://www.gnu.org/software/emacs',
    files: ['.emacs', '.emacs.d/'],
  },
  Zed: {
    logo: 'zedindustries',
    url: 'https://zed.dev',
    files: ['.zed/'],
  },
};

/**
 * Static mapping of detected tool names to metadata.
 * Logos from cdn.simpleicons.org (SVG, no bundling needed).
 */
export const TOOL_REGISTRY: Record<ToolName, ToolMeta> = {
  ...flattenToolMeta('AI Tools', AI_TOOLS),
  ...flattenToolMeta('Package Managers', PACKAGE_MANAGERS),
  ...flattenToolMeta('Frameworks', FRAMEWORKS),
  ...flattenToolMeta('Testing', TESTING_TOOLS),
  ...flattenToolMeta('Linting & Formatting', LINTING_AND_FORMATTING_TOOLS),
  ...flattenToolMeta('Monorepo', MONOREPO_TOOLS),
  ...flattenToolMeta('CI/CD & Deployment', CICD_TOOLS),
  ...flattenToolMeta('IDEs', IDES),
};

export function getToolMeta(name: string): ToolMeta | null {
  const meta = TOOL_REGISTRY[name];
  if (meta) {
    return meta;
  }
  return null;
}
