import { DockerImage } from '@/types/docker';

/**
 * Mock Docker Hub images for demonstration purposes
 *
 * TODO: Replace with real Docker Desktop API
 * Real API: window.dockerDesktopAPI.images.list()
 *
 * These fixtures provide diverse examples of common Docker images
 * that developers might use for local development.
 */

export const MOCK_IMAGES: DockerImage[] = [
  {
    id: 'sha256:abc123',
    name: 'nginx',
    tag: 'latest',
    repository: 'library/nginx',
    size: 142000000,
    created: new Date('2025-10-15'),
  },
  {
    id: 'sha256:def456',
    name: 'node',
    tag: '20-alpine',
    repository: 'library/node',
    size: 178000000,
    created: new Date('2025-10-20'),
  },
  {
    id: 'sha256:ghi789',
    name: 'postgres',
    tag: '16',
    repository: 'library/postgres',
    size: 432000000,
    created: new Date('2025-10-18'),
  },
  {
    id: 'sha256:jkl012',
    name: 'redis',
    tag: 'alpine',
    repository: 'library/redis',
    size: 32000000,
    created: new Date('2025-10-25'),
  },
  {
    id: 'sha256:mno345',
    name: 'mysql',
    tag: '8.0',
    repository: 'library/mysql',
    size: 580000000,
    created: new Date('2025-10-12'),
  },
  {
    id: 'sha256:pqr678',
    name: 'python',
    tag: '3.12-slim',
    repository: 'library/python',
    size: 125000000,
    created: new Date('2025-10-28'),
  },
  {
    id: 'sha256:stu901',
    name: 'mongo',
    tag: '7',
    repository: 'library/mongo',
    size: 680000000,
    created: new Date('2025-10-10'),
  },
  {
    id: 'sha256:vwx234',
    name: 'rabbitmq',
    tag: '3-management',
    repository: 'library/rabbitmq',
    size: 235000000,
    created: new Date('2025-10-22'),
  },
];

/**
 * Sample "hello-world" image for new users
 * Lightweight image perfect for testing the interface
 */
export const SAMPLE_IMAGE: DockerImage = {
  id: 'sha256:sample',
  name: 'hello-world',
  tag: 'latest',
  repository: 'library/hello-world',
  size: 13300000,
  created: new Date('2025-10-01'),
};

/**
 * Get a random subset of images for variety in demos
 */
export function getRandomImages(count: number = 4): DockerImage[] {
  const shuffled = [...MOCK_IMAGES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Find an image by name and tag
 */
export function findImage(name: string, tag: string = 'latest'): DockerImage | undefined {
  return MOCK_IMAGES.find(img => img.name === name && img.tag === tag);
}
