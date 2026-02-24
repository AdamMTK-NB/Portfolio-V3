import { memo, useCallback, useEffect, useState } from 'react'
import { ActivityCalendar } from 'react-activity-calendar'
import { GitHubCalendar } from 'react-github-calendar'
import 'react-activity-calendar/tooltips.css'

const GITHUB_USERNAME = 'AdamMTK-NB'

const GITHUB_THEME = {
  light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
}

function formatTooltipText(activity: { date: string; count: number }): string {
  const d = new Date(activity.date + 'Z')
  const month = d.toLocaleString('en-US', { month: 'long' })
  const day = d.getUTCDate()
  const year = d.getUTCFullYear()
  if (activity.count === 0) {
    return `No contributions on ${month} ${day}, ${year}`
  }
  const word = activity.count === 1 ? 'contribution' : 'contributions'
  return `${activity.count} ${word} on ${month} ${day}, ${year}`
}

type Activity = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }

async function fetchPrivateContributions(
  username: string
): Promise<{ contributions: Activity[] } | null> {
  try {
    const url = `/api/github-contributions?username=${encodeURIComponent(username)}`
    const res = await fetch(url)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

function GitHubCalendarSectionInner({ darkMode }: { darkMode: boolean }) {
  const [privateData, setPrivateData] = useState<{ contributions: Activity[] } | null>(null)
  const [usePrivate, setUsePrivate] = useState<boolean | null>(null)

  const loadPrivate = useCallback(async () => {
    const data = await fetchPrivateContributions(GITHUB_USERNAME)
    setPrivateData(data)
    setUsePrivate(data !== null && Array.isArray(data.contributions))
  }, [])

  useEffect(() => {
    loadPrivate()
  }, [loadPrivate])

  if (usePrivate === true && privateData?.contributions) {
    const year = 'last'
    return (
      <section className="github" aria-label="GitHub contributions">
        <h2 className="github__subtitle">Contributions</h2>
        <h2 className="github__title">Github</h2>
        <div className="github__chart-wrap">
          <ActivityCalendar
            data={privateData.contributions}
            colorScheme={darkMode ? 'dark' : 'light'}
            theme={GITHUB_THEME}
            blockSize={11}
            blockMargin={2.4}
            blockRadius={3}
            fontSize={15}
            maxLevel={4}
            labels={{
              totalCount: `{{count}} contributions in ${year === 'last' ? 'the last year' : '{{year}}'}`,
            }}
            tooltips={{
              activity: {
                hoverRestMs: 0,
                text: formatTooltipText,
              },
            }}
          />
        </div>
      </section>
    )
  }

  return (
    <section className="github" aria-label="GitHub contributions">
      <h2 className="github__subtitle">Contributions</h2>
      <h2 className="github__title">Github</h2>
      <div className="github__chart-wrap">
        <GitHubCalendar
          username={GITHUB_USERNAME}
          colorScheme={darkMode ? 'dark' : 'light'}
          blockSize={11}
          blockMargin={2.4}
          blockRadius={3}
          fontSize={15}
          tooltips={{
            activity: {
              hoverRestMs: 0,
              text: formatTooltipText,
            },
          }}
        />
      </div>
    </section>
  )
}

export default memo(GitHubCalendarSectionInner)
