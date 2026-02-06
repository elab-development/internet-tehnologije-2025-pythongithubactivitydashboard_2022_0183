import { GitCommit, GitPullRequest, CircleDot } from 'lucide-react';

export function typeIcon(type) {
  if (type === 'commit') return GitCommit;
  if (type === 'pull_request') return GitPullRequest;
  return CircleDot;
}

export function typeBadge(type) {
  const base = 'text-xs px-2 py-1 rounded-full';
  if (type === 'commit') return `${base} bg-blue-50 text-blue-700`;
  if (type === 'pull_request') return `${base} bg-purple-50 text-purple-700`;
  return `${base} bg-amber-50 text-amber-700`;
}
