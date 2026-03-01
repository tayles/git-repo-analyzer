import { AnalyzerLogo } from '../AnalyzerLogo';
import { CodeBlock } from '../CodeBlock';
import { Button } from '../ui/button';

interface AppHeaderProps {
  onClick?: () => void;
}

export function AppHeader({ onClick }: AppHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-2">
      <h1
        className="flex cursor-pointer items-center gap-2 text-xl font-bold select-text"
        onClick={onClick}
      >
        <AnalyzerLogo className="size-12" />
        Git Repo Analyzer
      </h1>

      <nav className="flex items-center gap-4">
        <CodeBlock code="npm install -g git-repo-analyzer" className="mr-2 hidden lg:flex" />

        <Button variant="ghost" size="icon-lg" asChild title="View on GitHub">
          <a
            href="https://github.com/tayles/git-repo-analyzer"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-6">
              <path
                fill="currentColor"
                d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              ></path>
            </svg>
          </a>
        </Button>

        <Button variant="ghost" size="icon-lg" asChild title="View on NPM">
          <a
            href="https://www.npmjs.com/package/git-repo-analyzer"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="size-6">
              <path fill="#c12127" d="M0 256V0h256v256z"></path>
              <path fill="#fff" d="M48 48h160v160h-32V80h-48v128H48z"></path>
            </svg>
          </a>
        </Button>

        <Button variant="ghost" size="lg" asChild title="View on Chrome Web Store">
          <a
            href="https://chromewebstore.google.com/detail/git-repo-analyzer/alijgbeigmpnmhbbnemaololhfdlcbdj"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 223" className="size-6">
              <defs>
                <linearGradient id="SVGHPFpg7JP" x1="0%" x2="100%" y1="50%" y2="50%">
                  <stop offset="0%" stopColor="#d93025"></stop>
                  <stop offset="100%" stopColor="#ea4335"></stop>
                </linearGradient>
                <linearGradient
                  id="SVGOMJglc4y"
                  x1="74.943%"
                  x2="19.813%"
                  y1="95.826%"
                  y2="-4.161%"
                >
                  <stop offset="0%" stopColor="#1e8e3e"></stop>
                  <stop offset="100%" stopColor="#34a853"></stop>
                </linearGradient>
                <linearGradient id="SVG7xeYgbFl" x1="59.898%" x2="21.416%" y1="-.134%" y2="99.86%">
                  <stop offset="0%" stopColor="#fbbc04"></stop>
                  <stop offset="100%" stopColor="#fcc934"></stop>
                </linearGradient>
                <path
                  id="SVGxfiKEebH"
                  d="M255.983 0H0v204.837c0 9.633 7.814 17.464 17.464 17.464h221.072c9.633 0 17.464-7.814 17.464-17.464z"
                ></path>
              </defs>
              <path
                fill="#f1f3f4"
                d="M255.983 0H0v204.837c0 9.633 7.814 17.464 17.464 17.464h221.072c9.633 0 17.464-7.814 17.464-17.464z"
              ></path>
              <path fill="#e8eaed" d="M0 0h255.983v111.74H0z"></path>
              <path
                fill="#fff"
                d="M157.076 47.727H98.907A11.63 11.63 0 0 1 87.27 36.09a11.63 11.63 0 0 1 11.637-11.637h58.169a11.63 11.63 0 0 1 11.637 11.637c0 6.417-5.204 11.637-11.637 11.637"
              ></path>
              <mask id="SVGzv8eNeik" fill="#fff">
                <use href="#SVGxfiKEebH"></use>
              </mask>
              <g mask="url(#SVGzv8eNeik)">
                <g transform="translate(17.455 94.293)">
                  <path
                    fill="url(#SVGHPFpg7JP)"
                    d="m14.812 55.255l15.241 46.498l32.638 36.427l47.845-82.908l95.724-.017C187.146 22.213 151.443 0 110.536 0s-76.61 22.213-95.724 55.255"
                  ></path>
                  <path
                    fill="url(#SVGOMJglc4y)"
                    d="m110.52 221.105l32.637-36.443l15.224-46.482H62.674L14.812 55.255c-19.047 33.076-20.445 75.128.017 110.561c20.445 35.434 57.545 55.256 95.69 55.29"
                  ></path>
                  <path
                    fill="url(#SVG7xeYgbFl)"
                    d="M206.26 55.272h-95.724l47.862 82.908l-47.862 82.925c38.162-.033 75.263-19.855 95.708-55.289c20.461-35.433 19.064-77.468.016-110.544"
                  ></path>
                  <ellipse
                    cx={110.536}
                    cy={110.544}
                    fill="#f1f3f4"
                    rx={55.255}
                    ry={55.272}
                  ></ellipse>
                  <ellipse
                    cx={110.536}
                    cy={110.544}
                    fill="#1a73e8"
                    rx={44.898}
                    ry={44.915}
                  ></ellipse>
                </g>
              </g>
              <path
                fill="#bdc1c6"
                d="M0 111.74h255.983v1.448H0zm0-1.465h255.983v1.448H0z"
                opacity={0.1}
              ></path>
            </svg>
            <span className="hidden md:block">Get the Chrome Extension</span>
          </a>
        </Button>
      </nav>
    </header>
  );
}
