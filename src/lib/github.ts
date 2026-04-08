export interface GitHubStats {
  totalContributions: number
  totalCommits: number
  totalPRs: number
  totalIssues: number
  totalStars: number
  contributedRepos: number
  currentStreak: number
  longestStreak: number
}

interface ContributionDay {
  contributionCount: number
  date: string
}

interface ContributionWeek {
  contributionDays: ContributionDay[]
}

interface GitHubResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number
          weeks: ContributionWeek[]
        }
        totalCommitContributions: number
        contributionYears: number[]
      }
      pullRequests: {
        totalCount: number
      }
      issues: {
        totalCount: number
      }
      repositoriesContributedTo: {
        totalCount: number
      }
      repositories: {
        nodes: Array<{
          stargazers: {
            totalCount: number
          }
        }>
      }
    }
  }
}

interface YearContributionResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number
        }
      }
    }
  }
}

function calculateStreaks(weeks: ContributionWeek[]): { current: number; longest: number } {
  const days = weeks.flatMap(week => week.contributionDays)
  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = days.length - 1; i >= 0; i--) {
    const day = days[i]
    const dayDate = new Date(day.date)
    dayDate.setHours(0, 0, 0, 0)

    if (day.contributionCount > 0) {
      tempStreak++
      if (i === days.length - 1 || dayDate.getTime() >= today.getTime() - 86400000) {
        currentStreak = tempStreak
      }
      longestStreak = Math.max(longestStreak, tempStreak)
    } else {
      if (i < days.length - 1) {
        tempStreak = 0
      }
    }
  }

  return { current: currentStreak, longest: longestStreak }
}

async function fetchGraphQL(token: string, query: string, variables: Record<string, unknown>) {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function fetchGitHubStats(username: string): Promise<GitHubStats | null> {
  const token = process.env.GITHUB_TOKEN

  console.log('[GitHub API] Attempting to fetch stats for:', username)
  console.log('[GitHub API] Token configured:', !!token)

  if (!token) {
    console.warn('[GitHub API] GITHUB_TOKEN not configured, skipping GitHub stats fetch')
    return null
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
          totalCommitContributions
          contributionYears
        }
        pullRequests(first: 1) {
          totalCount
        }
        issues(first: 1) {
          totalCount
        }
        repositoriesContributedTo(first: 1, includeUserRepositories: true, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
          totalCount
        }
        repositories(first: 100, privacy: PUBLIC, isFork: false, ownerAffiliations: OWNER, orderBy: {direction: DESC, field: STARGAZERS}) {
          nodes {
            stargazers {
              totalCount
            }
          }
        }
      }
    }
  `

  try {
    console.log('[GitHub API] Making GraphQL request...')
    const json = await fetchGraphQL(token, query, { username }) as GitHubResponse

    if (!json.data?.user) {
      console.error('[GitHub API] Invalid response structure:', json)
      return null
    }

    console.log('[GitHub API] ✓ Successfully fetched user data')

    const { contributionsCollection, pullRequests, issues, repositoriesContributedTo, repositories } = json.data.user
    const { contributionYears } = contributionsCollection
    const { weeks } = contributionsCollection.contributionCalendar
    const streaks = calculateStreaks(weeks)

    // Fetch all-time contributions by querying each year
    let totalContributions = 0
    for (const year of contributionYears) {
      const yearQuery = `
        query($username: String!, $from: DateTime!, $to: DateTime!) {
          user(login: $username) {
            contributionsCollection(from: $from, to: $to) {
              contributionCalendar {
                totalContributions
              }
            }
          }
        }
      `
      const from = `${year}-01-01T00:00:00Z`
      const to = `${year}-12-31T23:59:59Z`
      
      const yearData = await fetchGraphQL(token, yearQuery, { username, from, to }) as YearContributionResponse
      totalContributions += yearData.data.user.contributionsCollection.contributionCalendar.totalContributions
    }

    const totalStars = repositories.nodes.reduce(
      (sum, repo) => sum + repo.stargazers.totalCount,
      0
    )

    const stats = {
      totalContributions,
      totalCommits: contributionsCollection.totalCommitContributions,
      totalPRs: pullRequests.totalCount,
      totalIssues: issues.totalCount,
      totalStars,
      contributedRepos: repositoriesContributedTo.totalCount,
      currentStreak: streaks.current,
      longestStreak: streaks.longest,
    }

    console.log('[GitHub API] ✓ Stats compiled:', stats)
    return stats
  } catch (error) {
    console.error('[GitHub API] ✗ Failed to fetch GitHub stats:', error)
    return null
  }
}
