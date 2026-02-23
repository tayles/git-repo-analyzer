export const TOOL_CATEGORIES = [
  'AI Tools',
  'Package Managers',
  'Frameworks',
  'Testing',
  'Linting & Formatting',
  'Monorepo',
  'CI/CD & Deployment',
  'IDEs',
  'Documentation',
  'Community',
] as const;

export type ToolCategory = (typeof TOOL_CATEGORIES)[number];

export type ToolName = string;

export interface ToolMetaBasic {
  logo: string | null;
  url: string;
  /** Glob patterns to match against file paths. Patterns ending with / match directories. */
  globs: string[];
}

export interface ToolMeta extends ToolMetaBasic {
  name: string;
  category: ToolCategory;
}

export interface ToolMetaWithFileMatches extends Omit<ToolMeta, 'globs'> {
  paths: string[];
}

function flattenToolMeta(
  category: ToolCategory,
  tools: Record<ToolName, ToolMetaBasic>,
): Record<ToolName, ToolMeta> {
  return Object.fromEntries(
    Object.entries(tools).map(([name, meta]) => [name, { name, category, ...meta }]),
  );
}

const AI_TOOLS: Record<ToolName, ToolMetaBasic> = {
  'AGENTS.md': {
    logo: null,
    url: 'https://agents.md',
    globs: ['AGENTS.md'],
  },
  'Claude Code': {
    logo: 'anthropic',
    url: 'https://docs.anthropic.com/en/docs/claude-code',
    globs: ['.claude', '.claudeignore', 'CLAUDE.md'],
  },
  'GitHub Copilot': {
    logo: 'githubcopilot',
    url: 'https://github.com/features/copilot',
    globs: ['.github/copilot-instructions.md', '.copilot-instructions.md'],
  },
  'OpenAI Codex': {
    logo: 'openai',
    url: 'https://openai.com/blog/openai-codex',
    globs: ['.codex', '.codex/config.toml'],
  },
  'Google Gemini': {
    logo: 'google',
    url: 'https://geminicli.com/',
    globs: ['.gemini'],
  },
  Cursor: {
    logo: 'cursor',
    url: 'https://cursor.com',
    globs: ['.cursorrules', '.cursorignore', '.cursor'],
  },
  Aider: {
    logo: null,
    url: 'https://aider.chat',
    globs: ['.aider.conf.yml', '.aiderignore'],
  },
  Cline: {
    logo: null,
    url: 'https://cline.bot',
    globs: ['cline_docs'],
  },
  Kiro: {
    logo: null,
    url: 'https://kiro.dev/',
    globs: ['.kiro', 'product.md', 'tech.md', 'structure.md'],
  },
  Windsurf: {
    logo: null,
    url: 'https://windsurf.com',
    globs: ['.windsurfrules'],
  },
};

const PACKAGE_MANAGERS: Record<ToolName, ToolMetaBasic> = {
  Bun: {
    logo: 'bun',
    url: 'https://bun.sh',
    globs: ['bun.lockb', 'bun.lock', 'bunfig.toml'],
  },
  npm: {
    logo: 'npm',
    url: 'https://www.npmjs.com',
    globs: ['package-lock.json'],
  },
  Yarn: {
    logo: 'yarn',
    url: 'https://yarnpkg.com',
    globs: ['yarn.lock'],
  },
  pnpm: {
    logo: 'pnpm',
    url: 'https://pnpm.io',
    globs: ['pnpm-lock.yaml'],
  },
  Cargo: {
    logo: 'rust',
    url: 'https://doc.rust-lang.org/cargo/',
    globs: ['Cargo.toml'],
  },
  'Go Modules': {
    logo: 'go',
    url: 'https://go.dev',
    globs: ['go.mod'],
  },
  Bundler: {
    logo: 'rubygems',
    url: 'https://bundler.io',
    globs: ['Gemfile.lock'],
  },
  Poetry: {
    logo: 'poetry',
    url: 'https://python-poetry.org',
    globs: ['poetry.lock'],
  },
  Pipenv: {
    logo: 'python',
    url: 'https://pipenv.pypa.io',
    globs: ['Pipfile.lock'],
  },
  pip: {
    logo: 'pypi',
    url: 'https://pip.pypa.io',
    globs: ['requirements.txt'],
  },
  uv: {
    logo: 'uv',
    url: 'https://docs.astral.sh/uv',
    globs: ['uv.lock'],
  },
  Composer: {
    logo: 'composer',
    url: 'https://getcomposer.org',
    globs: ['composer.lock'],
  },
};

const FRAMEWORKS: Record<ToolName, ToolMetaBasic> = {
  'Next.js': {
    logo: 'nextdotjs',
    url: 'https://nextjs.org',
    globs: ['next.config.js', 'next.config.ts', 'next.config.mjs'],
  },
  Nuxt: {
    logo: 'nuxt',
    url: 'https://nuxt.com',
    globs: ['nuxt.config.ts', 'nuxt.config.js'],
  },
  SvelteKit: {
    logo: 'svelte',
    url: 'https://kit.svelte.dev',
    globs: ['svelte.config.js'],
  },
  Astro: {
    logo: 'astro',
    url: 'https://astro.build',
    globs: ['astro.config.mjs', 'astro.config.ts'],
  },
  Angular: {
    logo: 'angular',
    url: 'https://angular.dev',
    globs: ['angular.json'],
  },
  Remix: {
    logo: 'remix',
    url: 'https://remix.run',
    globs: ['remix.config.js'],
  },
  Vite: {
    logo: 'vite',
    url: 'https://vitejs.dev',
    globs: ['vite.config.ts', 'vite.config.js'],
  },
  Webpack: {
    logo: 'webpack',
    url: 'https://webpack.js.org',
    globs: ['webpack.config.js'],
  },
  'Tailwind CSS': {
    logo: 'tailwindcss',
    url: 'https://tailwindcss.com',
    globs: ['tailwind.config.(js|ts)'],
  },
  PostCSS: {
    logo: 'postcss',
    url: 'https://postcss.org',
    globs: ['postcss.config.js'],
  },
  Django: {
    logo: 'django',
    url: 'https://www.djangoproject.com',
    globs: ['django', 'manage.py'],
  },
  Rails: {
    logo: 'rubyonrails',
    url: 'https://rubyonrails.org',
    globs: ['Rakefile', 'config.ru'],
  },
  Rust: {
    logo: 'rust',
    url: 'https://www.rust-lang.org',
    globs: ['rust-toolchain', 'rust-toolchain.toml'],
  },
  Storybook: {
    logo: 'storybook',
    url: 'https://storybook.js.org',
    globs: ['.storybook'],
  },
  Ladle: {
    logo: null,
    url: 'https://ladle.dev',
    globs: ['.ladle'],
  },
};

const TESTING_TOOLS: Record<ToolName, ToolMetaBasic> = {
  Jest: {
    logo: 'jest',
    url: 'https://jestjs.io',
    globs: ['jest.config.js', 'jest.config.ts'],
  },
  Vitest: {
    logo: 'vitest',
    url: 'https://vitest.dev',
    globs: ['vitest.config.*'],
  },
  Cypress: {
    logo: 'cypress',
    url: 'https://www.cypress.io',
    globs: ['cypress.config.ts', 'cypress.config.js'],
  },
  Playwright: {
    logo: null,
    url: 'https://playwright.dev',
    globs: ['playwright.config.ts'],
  },
  Mocha: {
    logo: 'mocha',
    url: 'https://mochajs.org',
    globs: ['.mocharc.yml'],
  },
  pytest: {
    logo: 'pytest',
    url: 'https://pytest.org',
    globs: ['pytest.ini', 'setup.cfg'],
  },
  PHPUnit: {
    logo: null,
    url: 'https://phpunit.de',
    globs: ['phpunit.xml'],
  },
  Istanbul: {
    logo: 'istanbul',
    url: 'https://istanbul.js.org',
    globs: ['.nycrc', '.nycrc.*', 'nyc.config.js'],
  },
  Codecov: {
    logo: 'codecov',
    url: 'hhttps://about.codecov.io',
    globs: ['codecov.yml'],
  },
  'Coverage.py': {
    logo: 'coveragepy',
    url: 'https://coverage.readthedocs.io',
    globs: ['.coveragerc'],
  },
};

const LINTING_AND_FORMATTING_TOOLS: Record<ToolName, ToolMetaBasic> = {
  Clang: {
    logo: 'clang',
    url: 'https://clang.llvm.org',
    globs: ['.clang-format', '.clang-tidy'],
  },
  cpplint: {
    logo: null,
    url: 'https://github.com/cpplint/cpplint',
    globs: ['.cpplint'],
  },
  EditorConfig: {
    logo: null,
    url: 'https://editorconfig.org',
    globs: ['.editorconfig'],
  },
  ESLint: {
    logo: 'eslint',
    url: 'https://eslint.org',
    globs: [
      '.eslintignore',
      '.eslintrc',
      '.eslintrc.js',
      '.eslintrc.json',
      'eslint.config.js',
      'eslint.config.mjs',
    ],
  },
  oxlint: {
    logo: 'oxc',
    url: 'https://oxc.rs',
    globs: ['.oxlintrc.json'],
  },
  Biome: {
    logo: 'biome',
    url: 'https://biomejs.dev',
    globs: ['biome.json'],
  },
  Prettier: {
    logo: 'prettier',
    url: 'https://prettier.io',
    globs: [
      '.prettierrc',
      '.prettierrc.json',
      'prettier.config.js',
      '.prettierrc.js',
      '.prettierignore',
    ],
  },
  oxfmt: {
    logo: 'oxc',
    url: 'https://oxc.rs',
    globs: ['.oxfmtrc.json'],
  },
  rustfmt: {
    logo: 'rust',
    url: 'https://github.com/rust-lang/rustfmt',
    globs: ['rustfmt.toml'],
  },
  'golangci-lint': {
    logo: 'go',
    url: 'https://golangci-lint.run',
    globs: ['.golangci.yml'],
  },
  Ruff: {
    logo: 'ruff',
    url: 'https://docs.astral.sh/ruff/',
    globs: ['ruff.toml', '.ruff.toml'],
  },
  Black: {
    logo: 'black',
    url: 'https://black.readthedocs.io',
    globs: ['pyproject.toml'],
  },
  RuboCop: {
    logo: 'rubocop',
    url: 'https://rubocop.org',
    globs: ['.rubocop.yml'],
  },
  Commitizen: {
    logo: null,
    url: 'https://commitizen-tools.github.io/commitizen/',
    globs: ['.czrc', '.cz.toml', 'commitizen.yaml'],
  },
  Husky: {
    logo: null,
    url: 'https://typicode.github.io/husky',
    globs: ['.husky'],
  },
  LintStaged: {
    logo: null,
    url: 'https://github.com/lint-staged/lint-staged',
    globs: ['lint-staged.config.js', '.lintstagedrc', '.lintstagedrc.json'],
  },
  StyleLint: {
    logo: 'stylelint',
    url: 'https://stylelint.io',
    globs: ['stylelint.config.js'],
  },
  'YAML Lint': {
    logo: null,
    url: 'https://yamllint.readthedocs.io',
    globs: ['.yamllint', '.yamllint.yaml', '.yamllint.yml'],
  },
  'pre-commit': {
    logo: null,
    url: 'https://pre-commit.com',
    globs: ['.pre-commit-config.yaml'],
  },
};

const MONOREPO_TOOLS: Record<ToolName, ToolMetaBasic> = {
  Bazel: {
    logo: 'bazel',
    url: 'https://bazel.build',
    globs: ['WORKSPACE', 'BUILD', 'BUILD.bazel'],
  },
  Lerna: {
    logo: 'lerna',
    url: 'https://lerna.js.org',
    globs: ['lerna.json'],
  },
  Nx: {
    logo: 'nx',
    url: 'https://nx.dev',
    globs: ['nx.json'],
  },
  Turborepo: {
    logo: 'turborepo',
    url: 'https://turbo.build',
    globs: ['turbo.json'],
  },
  'pnpm Workspaces': {
    logo: 'pnpm',
    url: 'https://pnpm.io/workspaces',
    globs: ['pnpm-workspace.yaml'],
  },
  Rush: {
    logo: null,
    url: 'https://rushjs.io',
    globs: ['rush.json'],
  },
};

const CICD_TOOLS: Record<ToolName, ToolMetaBasic> = {
  'GitHub Actions': {
    logo: 'githubactions',
    url: 'https://github.com/features/actions',
    globs: ['.github/workflows'],
  },
  'GitLab CI': {
    logo: 'gitlab',
    url: 'https://docs.gitlab.com/ee/ci/',
    globs: ['.gitlab-ci.yml'],
  },
  Gulp: {
    logo: 'gulp',
    url: 'https://gulpjs.com',
    globs: ['gulpfile.*'],
  },
  Jenkins: {
    logo: 'jenkins',
    url: 'https://www.jenkins.io',
    globs: ['Jenkinsfile'],
  },
  CircleCI: {
    logo: 'circleci',
    url: 'https://circleci.com',
    globs: ['.circleci'],
  },
  'Travis CI': {
    logo: 'travisci',
    url: 'https://www.travis-ci.com',
    globs: ['.travis.yml'],
  },
  Docker: {
    logo: 'docker',
    url: 'https://www.docker.com',
    globs: ['Dockerfile', '.dockerignore', 'docker-compose.yml', 'docker-compose.yaml'],
  },
  DevContainer: {
    logo: 'developmentcontainers',
    url: 'https://containers.dev',
    globs: ['.devcontainer', '.devcontainer.json'],
  },
  gitpod: {
    logo: 'gitpod',
    url: 'https://ona.io',
    globs: ['.gitpod.yml'],
  },
  kubernetes: {
    logo: 'kubernetes',
    url: 'https://kubernetes.io',
    globs: ['.k8s', '.kubernetes', 'k8s.yaml', 'k8s.yml', 'kubernetes.*', 'kustomization.yaml'],
  },
  Make: {
    logo: null,
    url: 'https://www.gnu.org/software/make/',
    globs: ['Makefile'],
  },
  Just: {
    logo: 'just',
    url: 'https://just.systems',
    globs: ['justfile'],
  },
  Vercel: {
    logo: 'vercel',
    url: 'https://vercel.com',
    globs: ['vercel.json'],
  },
  Netlify: {
    logo: 'netlify',
    url: 'https://www.netlify.com',
    globs: ['netlify.toml'],
  },
  'Fly.io': {
    logo: 'flydotio',
    url: 'https://fly.io',
    globs: ['fly.toml'],
  },
  Render: {
    logo: 'render',
    url: 'https://render.com',
    globs: ['render.yaml'],
  },
  'AWS CodeBuild': {
    logo: 'aws',
    url: 'https://aws.amazon.com/codebuild/',
    globs: ['buildspec.yml'],
  },
  Ansible: {
    logo: 'ansible',
    url: 'https://www.ansible.com',
    globs: ['ansible', 'playbook.yml', 'playbook.yaml'],
  },
  Terraform: {
    logo: 'terraform',
    url: 'https://www.terraform.io',
    globs: ['.terraform', '*.tf', '*.tfvars'],
  },
  Tilt: {
    logo: null,
    url: 'https://tilt.dev',
    globs: ['Tiltfile'],
  },
  SOPS: {
    logo: null,
    url: 'https://getsops.io',
    globs: ['.sops.yaml'],
  },
};

const IDES: Record<ToolName, ToolMetaBasic> = {
  'VS Code': {
    logo: null,
    url: 'https://code.visualstudio.com',
    globs: ['.vscode'],
  },
  'JetBrains IDEs': {
    logo: 'jetbrains',
    url: 'https://www.jetbrains.com',
    globs: ['.idea'],
  },
  'Visual Studio': {
    logo: null,
    url: 'https://visualstudio.microsoft.com',
    globs: ['.vs'],
  },
  Fleet: {
    logo: null,
    url: 'https://www.jetbrains.com/fleet',
    globs: ['.fleet'],
  },
  'Sublime Text': {
    logo: 'sublimetext',
    url: 'https://www.sublimetext.com',
    globs: ['.sublime-project', '.sublime-workspace'],
  },
  Vim: {
    logo: 'vim',
    url: 'https://www.vim.org',
    globs: ['.vimrc', '.vim'],
  },
  Emacs: {
    logo: 'gnuemacs',
    url: 'https://www.gnu.org/software/emacs',
    globs: ['.emacs', '.emacs.d'],
  },
  Zed: {
    logo: 'zedindustries',
    url: 'https://zed.dev',
    globs: ['.zed'],
  },
};

const DOCUMENTATION_TOOLS: Record<ToolName, ToolMetaBasic> = {
  README: {
    logo: 'markdown',
    url: '',
    globs: ['README.md', 'README'],
  },
  'Read the Docs': {
    logo: 'readthedocs',
    url: 'https://readthedocs.org',
    globs: ['.readthedocs.yml'],
  },
};

const COMMUNITY_TOOLS: Record<ToolName, ToolMetaBasic> = {
  SECURITY: {
    logo: 'markdown',
    url: '',
    globs: ['SECURITY.md', 'SECURITY'],
  },
  CONTRIBUTING: {
    logo: 'markdown',
    url: '',
    globs: ['CONTRIBUTING.md', 'CONTRIBUTING'],
  },
  LICENSE: {
    logo: 'markdown',
    url: '',
    globs: ['LICENSE', 'LICENSE.md'],
  },
  CODE_OF_CONDUCT: {
    logo: 'markdown',
    url: '',
    globs: ['CODE_OF_CONDUCT.md', 'CODE_OF_CONDUCT'],
  },
};

/**
 * Static mapping of detected tool names to metadata.
 * Logos from cdn.simpleicons.org (SVG, no bundling needed).
 */
export const TOOL_REGISTRY: Record<ToolName, ToolMeta> = {
  ...flattenToolMeta('AI Tools', AI_TOOLS),
  ...flattenToolMeta('IDEs', IDES),
  ...flattenToolMeta('Monorepo', MONOREPO_TOOLS),
  ...flattenToolMeta('Package Managers', PACKAGE_MANAGERS),
  ...flattenToolMeta('Frameworks', FRAMEWORKS),
  ...flattenToolMeta('Linting & Formatting', LINTING_AND_FORMATTING_TOOLS),
  ...flattenToolMeta('CI/CD & Deployment', CICD_TOOLS),
  ...flattenToolMeta('Testing', TESTING_TOOLS),
  ...flattenToolMeta('Documentation', DOCUMENTATION_TOOLS),
  ...flattenToolMeta('Community', COMMUNITY_TOOLS),
};

export function getToolMeta(name: string): ToolMeta | null {
  const meta = TOOL_REGISTRY[name];
  if (meta) {
    return meta;
  }
  return null;
}
