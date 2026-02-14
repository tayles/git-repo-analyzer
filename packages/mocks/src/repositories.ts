/**
 * Mock repository data for testing
 */
export const mockRepositories = {
  /**
   * Small repository with minimal data
   */
  small: {
    owner: 'test-org',
    name: 'small-repo',
    fullName: 'test-org/small-repo',
    description: 'A small test repository',
    stars: 42,
    forks: 5,
    language: 'TypeScript',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-06-20'),
  },

  /**
   * Large repository with extensive data
   */
  large: {
    owner: 'facebook',
    name: 'react',
    fullName: 'facebook/react',
    description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
    stars: 220000,
    forks: 45000,
    language: 'JavaScript',
    createdAt: new Date('2013-05-24'),
    updatedAt: new Date('2024-12-01'),
  },

  /**
   * Private repository for testing authenticated requests
   */
  private: {
    owner: 'private-org',
    name: 'internal-tools',
    fullName: 'private-org/internal-tools',
    description: 'Internal tools repository',
    stars: 0,
    forks: 0,
    language: 'Python',
    createdAt: new Date('2022-03-10'),
    updatedAt: new Date('2024-11-15'),
    isPrivate: true,
  },
} as const;

/**
 * Get a mock repository by name
 */
export function getMockRepository(name: keyof typeof mockRepositories) {
  return mockRepositories[name];
}
