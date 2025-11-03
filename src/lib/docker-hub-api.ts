/**
 * Docker Hub API client
 */

import {
  DockerHubUserInfo,
  DockerRegistryTokenResponse,
  AuthError,
} from '@/types/auth';

const DOCKER_HUB_API_URL = process.env.DOCKER_HUB_API_URL || 'https://hub.docker.com/v2';
const DOCKER_HUB_AUTH_URL = process.env.DOCKER_HUB_AUTH_URL || 'https://auth.docker.io/token';
const DOCKER_HUB_REGISTRY_URL = process.env.DOCKER_HUB_REGISTRY_URL || 'https://registry-1.docker.io/v2';

/**
 * Verify Docker Hub credentials by fetching user info
 * This works with both Personal Access Tokens and regular passwords
 */
export async function verifyDockerHubCredentials(
  username: string,
  token: string
): Promise<{ valid: boolean; userInfo?: DockerHubUserInfo; error?: AuthError }> {
  try {
    // Try to get user info to verify credentials
    const response = await fetch(`${DOCKER_HUB_API_URL}/users/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          valid: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'Username not found',
            details: 'Please check your Docker Hub username',
          },
        };
      }

      return {
        valid: false,
        error: {
          code: 'API_ERROR',
          message: 'Failed to verify credentials',
          details: `HTTP ${response.status}`,
        },
      };
    }

    const userInfo = await response.json() as DockerHubUserInfo;

    // Now verify the token by trying to get a registry token
    const tokenValid = await verifyRegistryToken(username, token);

    if (!tokenValid) {
      return {
        valid: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid token or password',
          details: 'The provided token or password is incorrect',
        },
      };
    }

    return {
      valid: true,
      userInfo,
    };
  } catch (error) {
    console.error('Docker Hub credential verification failed:', error);
    return {
      valid: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Network error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

/**
 * Verify token by attempting to get a registry token
 */
async function verifyRegistryToken(username: string, token: string): Promise<boolean> {
  try {
    // Try to get a token for a public repository (alpine is always available)
    const scope = 'repository:library/alpine:pull';
    const service = 'registry.docker.io';

    const authHeader = `Basic ${Buffer.from(`${username}:${token}`).toString('base64')}`;

    const response = await fetch(
      `${DOCKER_HUB_AUTH_URL}?service=${service}&scope=${scope}`,
      {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
        },
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Registry token verification failed:', error);
    return false;
  }
}

/**
 * Get a Docker registry token for pulling images
 * This token is used for actual image operations
 */
export async function getDockerRegistryToken(
  username: string,
  token: string,
  repository: string = 'library/alpine',
  scope: string = 'pull'
): Promise<{ token?: string; error?: AuthError }> {
  try {
    const authHeader = `Basic ${Buffer.from(`${username}:${token}`).toString('base64')}`;
    const scopeParam = `repository:${repository}:${scope}`;
    const service = 'registry.docker.io';

    const response = await fetch(
      `${DOCKER_HUB_AUTH_URL}?service=${service}&scope=${scopeParam}`,
      {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
        },
      }
    );

    if (!response.ok) {
      return {
        error: {
          code: 'TOKEN_FETCH_FAILED',
          message: 'Failed to get registry token',
          details: `HTTP ${response.status}`,
        },
      };
    }

    const data = await response.json() as DockerRegistryTokenResponse;

    return {
      token: data.token || data.access_token,
    };
  } catch (error) {
    console.error('Registry token fetch failed:', error);
    return {
      error: {
        code: 'NETWORK_ERROR',
        message: 'Network error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

/**
 * Get user information from Docker Hub
 */
export async function getDockerHubUserInfo(
  username: string
): Promise<{ userInfo?: DockerHubUserInfo; error?: AuthError }> {
  try {
    const response = await fetch(`${DOCKER_HUB_API_URL}/users/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return {
        error: {
          code: 'USER_FETCH_FAILED',
          message: 'Failed to fetch user info',
          details: `HTTP ${response.status}`,
        },
      };
    }

    const userInfo = await response.json() as DockerHubUserInfo;

    return { userInfo };
  } catch (error) {
    console.error('User info fetch failed:', error);
    return {
      error: {
        code: 'NETWORK_ERROR',
        message: 'Network error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

/**
 * Validate image manifest access with authentication
 */
export async function validateImageAccess(
  registryToken: string,
  repository: string = 'library/alpine',
  tag: string = 'latest'
): Promise<boolean> {
  try {
    const response = await fetch(
      `${DOCKER_HUB_REGISTRY_URL}/${repository}/manifests/${tag}`,
      {
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer ${registryToken}`,
          'Accept': 'application/vnd.docker.distribution.manifest.v2+json',
        },
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Image access validation failed:', error);
    return false;
  }
}
