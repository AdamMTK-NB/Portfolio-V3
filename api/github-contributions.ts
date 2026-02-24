/* Vercel serverless function - deploy to show private contributions */
/* Set GITHUB_TOKEN in Vercel project env (PAT with no scopes needed for public data; read:user for private) */

const GITHUB_GRAPHQL = 'https://api.github.com/graphql'

const CONTRIBUTIONS_QUERY = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`

type ContributionDay = { date: string; contributionCount: number }
type Activity = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }

function computeLevel(count: number, maxCount: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0
  if (maxCount === 0) return 0
  const ratio = count / maxCount
  if (ratio <= 0.25) return 1
  if (ratio <= 0.5) return 2
  if (ratio <= 0.75) return 3
  return 4
}

export default async function handler(
  req: { query?: Record<string, string | string[] | undefined> },
  res: {
    setHeader: (name: string, value: string) => void
    status: (code: number) => { json: (body: unknown) => void }
  }
): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')

  const token = process.env.GITHUB_TOKEN
  const username =
  (typeof req.query?.username === 'string' ? req.query.username : null) ??
  'AdamMTK-NB'

  if (!token) {
    res.status(501).json({
      error: 'GITHUB_TOKEN not configured. Add it in your hosting environment to show private contributions.',
    })
    return
  }

  const to = new Date()
  const from = new Date(to)
  from.setFullYear(from.getFullYear() - 1)

  try {
    const response = await fetch(GITHUB_GRAPHQL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: {
          login: username,
          from: from.toISOString(),
          to: to.toISOString(),
        },
      }),
    })

    const json = await response.json()

    if (!response.ok) {
      res.status(response.status).json({
        error: json.message || 'GitHub API error',
      })
      return
    }

    if (json.errors) {
      res.status(400).json({ error: json.errors[0]?.message || 'GraphQL error' })
      return
    }

    const weeks =
      json.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? []
    const flat: ContributionDay[] = weeks.flatMap(
      (w: { contributionDays: ContributionDay[] }) => w.contributionDays
    )

    const maxCount = Math.max(0, ...flat.map((d) => d.contributionCount))
    const contributions: Activity[] = flat.map((d) => ({
      date: d.date,
      count: d.contributionCount,
      level: computeLevel(d.contributionCount, maxCount),
    }))

    res.status(200).json({ contributions })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Failed to fetch contributions',
    })
  }
}
