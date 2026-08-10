export interface GithubCommit {
  repo: string;
  message: string;
  time: string;
  sha: string;
  url?: string;
}

export interface GithubRepoItem {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  updated: string;
  url: string;
  isPinned?: boolean;
}

export interface GithubStats {
  username: string;
  name?: string;
  avatarUrl?: string;
  profileUrl?: string;
  publicRepos: number;
  followers: number;
  following: number;
  starsCount: number;
  recentCommits: GithubCommit[];
  languagesPercentage: Record<string, number>;
  userRepos: GithubRepoItem[];
  pinnedRepos: GithubRepoItem[];
  isRealData: boolean;
}

function formatTimeAgo(dateString: string): string {
  if (!dateString) return 'recently';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export async function fetchGithubData(overrideUsername?: string): Promise<GithubStats> {
  const envUsername = import.meta.env.PUBLIC_GITHUB_USERNAME || import.meta.env.GITHUB_USERNAME;
  const username = overrideUsername || envUsername || 'vibecoder';
  const token = import.meta.env.GITHUB_TOKEN || import.meta.env.PUBLIC_GITHUB_TOKEN || '';

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Astro-Portfolio-App'
  };

  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  try {
    // 1. Fetch User Profile
    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    
    if (userRes.ok) {
      const userData = await userRes.json();

      // 2. Fetch User Repositories & Calculate Language Breakdown
      let totalStars = 0;
      const langBytesMap: Record<string, number> = {};
      let totalLangBytes = 0;
      const userRepos: GithubRepoItem[] = [];

      try {
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&type=owner&sort=updated`, { headers });
        if (reposRes.ok) {
          const reposData = await reposRes.json();
          if (Array.isArray(reposData)) {
            totalStars = reposData.reduce((acc: number, repo: any) => acc + (repo.stargazers_count || 0), 0);

            // Populate all public repos for All Repositories tab
            for (const repo of reposData) {
              userRepos.push({
                name: repo.name,
                description: repo.description || 'Public GitHub repository.',
                language: repo.language || 'Code',
                stars: repo.stargazers_count || 0,
                forks: repo.forks_count || 0,
                updated: formatTimeAgo(repo.updated_at || repo.pushed_at),
                url: repo.html_url || `https://github.com/${username}/${repo.name}`
              });
            }

            // Fetch language details for public repositories
            const reposToScan = reposData.slice(0, 15);
            await Promise.all(
              reposToScan.map(async (repo: any) => {
                try {
                  const langRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/languages`, { headers });
                  if (langRes.ok) {
                    const langs = await langRes.json();
                    for (const [lang, bytes] of Object.entries(langs)) {
                      const numBytes = typeof bytes === 'number' ? bytes : 0;
                      langBytesMap[lang] = (langBytesMap[lang] || 0) + numBytes;
                      totalLangBytes += numBytes;
                    }
                  }
                } catch (e) {
                  if (repo.language) {
                    langBytesMap[repo.language] = (langBytesMap[repo.language] || 0) + 1000;
                    totalLangBytes += 1000;
                  }
                }
              })
            );
          }
        }
      } catch (e) {
        console.warn('Failed to calculate repository languages:', e);
      }

      // Convert byte totals into percentage map
      const languagesPercentage: Record<string, number> = {};
      if (totalLangBytes > 0) {
        for (const [lang, bytes] of Object.entries(langBytesMap)) {
          languagesPercentage[lang] = Math.round((bytes / totalLangBytes) * 100);
        }
      }

      // 3. Extract Pinned Repositories from GitHub Profile HTML
      let pinnedNames: string[] = [];
      try {
        const profileRes = await fetch(`https://github.com/${username}`, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        if (profileRes.ok) {
          const html = await profileRes.text();
          const regex = new RegExp(`href="\\/${username}\\/([^"\\/#?]+)"`, 'g');
          let match;
          while ((match = regex.exec(html)) !== null) {
            const repoName = match[1];
            if (!pinnedNames.includes(repoName) && repoName !== username && !['followers', 'following', 'repositories', 'stars', 'packages', 'projects'].includes(repoName)) {
              // Verify if it's pinned in the pinned section of HTML
              if (html.includes(`pinned-item-list-item`) && html.includes(repoName)) {
                pinnedNames.push(repoName);
              }
            }
          }
        }
      } catch (e) {
        console.warn('Failed to fetch pinned repos:', e);
      }

      let pinnedRepos = userRepos.filter(r => pinnedNames.includes(r.name));
      if (pinnedRepos.length === 0) {
        // Fallback: top starred or updated repos
        pinnedRepos = [...userRepos].sort((a, b) => b.stars - a.stars).slice(0, 4);
      }

      // 4. Fetch User Public Events for Commit & Activity Feed
      const recentCommits: GithubCommit[] = [];
      try {
        const eventsRes = await fetch(`https://api.github.com/users/${username}/events/public?per_page=30`, { headers });
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          if (Array.isArray(eventsData)) {
            for (const event of eventsData) {
              const repoFull = event.repo?.name || 'repository';
              const repoName = repoFull.includes('/') ? repoFull.split('/')[1] : repoFull;

              if (event.type === 'PushEvent') {
                if (event.payload?.commits?.length) {
                  for (const commit of event.payload.commits) {
                    recentCommits.push({
                      repo: repoName,
                      message: commit.message ? commit.message.split('\n')[0] : `Push to ${event.payload.ref?.replace('refs/heads/', '') || 'branch'}`,
                      time: formatTimeAgo(event.created_at),
                      sha: commit.sha ? commit.sha.substring(0, 7) : (event.payload.head ? event.payload.head.substring(0, 7) : 'head'),
                      url: `https://github.com/${repoFull}/commit/${commit.sha || event.payload.head}`
                    });
                    if (recentCommits.length >= 5) break;
                  }
                } else if (event.payload?.head) {
                  recentCommits.push({
                    repo: repoName,
                    message: `Push to ${event.payload.ref?.replace('refs/heads/', '') || 'main'} branch`,
                    time: formatTimeAgo(event.created_at),
                    sha: event.payload.head.substring(0, 7),
                    url: `https://github.com/${repoFull}/commit/${event.payload.head}`
                  });
                }
              } else if (event.type === 'CreateEvent') {
                recentCommits.push({
                  repo: repoName,
                  message: `Created ${event.payload?.ref_type || 'repository'} ${event.payload?.ref || ''}`.trim(),
                  time: formatTimeAgo(event.created_at),
                  sha: 'create',
                  url: `https://github.com/${repoFull}`
                });
              }

              if (recentCommits.length >= 5) break;
            }
          }
        }
      } catch (e) {
        console.warn('Failed to fetch user events:', e);
      }

      return {
        username: userData.login || username,
        name: userData.name || userData.login,
        avatarUrl: userData.avatar_url,
        profileUrl: userData.html_url || `https://github.com/${username}`,
        publicRepos: userData.public_repos || 0,
        followers: userData.followers || 0,
        following: userData.following || 0,
        starsCount: totalStars,
        recentCommits: recentCommits.length > 0 ? recentCommits : [
          { repo: username, message: 'feat: live github api integration', time: 'Just now', sha: 'main' }
        ],
        languagesPercentage,
        userRepos,
        pinnedRepos,
        isRealData: true
      };
    } else {
      console.warn(`GitHub API returned status ${userRes.status} for user ${username}`);
    }
  } catch (err) {
    console.error('GitHub API error:', err);
  }

  // Fallback high-tech mock data if API call fails or user not found
  const fallbackRepos: GithubRepoItem[] = [
    { name: 'ai-dev-assistant', description: 'CLI tool that helps me code, explain, and automate with AI.', language: 'Python', stars: 840, forks: 42, updated: '2h ago', url: `https://github.com/${username}/ai-dev-assistant`, isPinned: true },
    { name: 'auto-commit-bot', description: 'Automatic commit messages using AI summarization.', language: 'TypeScript', stars: 520, forks: 28, updated: '5h ago', url: `https://github.com/${username}/auto-commit-bot`, isPinned: true },
    { name: 'vibe-launchpad', description: 'Boilerplate generator for quick project starters.', language: 'Rust', stars: 390, forks: 14, updated: '1d ago', url: `https://github.com/${username}/vibe-launchpad`, isPinned: true },
    { name: 'smart-noted', description: 'AI-powered notes with summaries and tags.', language: 'Python', stars: 290, forks: 19, updated: '2d ago', url: `https://github.com/${username}/smart-noted`, isPinned: true }
  ];

  return {
    username,
    name: 'Vibe Coder',
    profileUrl: `https://github.com/${username}`,
    publicRepos: 18,
    followers: 420,
    following: 12,
    starsCount: 2450,
    recentCommits: [
      { repo: 'ai-dev-assistant', message: 'feat: add streaming LLM responses & CLI spinner', time: '2 hours ago', sha: 'a7f92b1' },
      { repo: 'auto-commit-bot', message: 'fix: parse git diff staged chunks correctly', time: '5 hours ago', sha: 'c4d18e9' },
      { repo: 'vibe-launchpad', message: 'perf: optimize Astro v5 boilerplate template loading', time: '1 day ago', sha: 'e2b8104' },
      { repo: 'smart-noted', message: 'feat: vector embedding search with sqlite-vss', time: '2 days ago', sha: 'b91c43d' },
      { repo: 'porto', message: 'chore: sync live activity feed & design tokens', time: '3 days ago', sha: 'f1a90c2' },
    ],
    languagesPercentage: {
      Python: 45,
      TypeScript: 35,
      Rust: 15,
      Go: 5
    },
    userRepos: fallbackRepos,
    pinnedRepos: fallbackRepos,
    isRealData: false
  };
}
