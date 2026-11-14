import type { GithubActivity } from 'types';

export interface IGithubActivityProvider {
  fetchActivity(username: string): Promise<GithubActivity>;
}
