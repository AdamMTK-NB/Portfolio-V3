import { memo, useMemo } from 'react'
import { GitHubCalendar } from 'react-github-calendar'

const GITHUB_USERNAME = 'AdamMTK-NB'

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

const tooltipText = formatTooltipText

function GitHubCalendarSectionInner({ darkMode }: { darkMode: boolean }) {
  const tooltips = useMemo(
    () => ({
      activity: {
        hoverRestMs: 0,
        text: tooltipText,
      },
    }),
    []
  )

  return (
    <section className="github" aria-label="GitHub contributions">
      <h2 className="github__subtitle">Contributions</h2>
      <h2 className="github__title">Github</h2>
      <div className="github__chart-wrap">
        <GitHubCalendar
          username={GITHUB_USERNAME}
          year={2026}
          colorScheme={darkMode ? 'dark' : 'light'}
          blockSize={11}
          blockMargin={2.4}
          blockRadius={3}
          fontSize={15}
          tooltips={tooltips}
        />
      </div>
    </section>
  )
}

export default memo(GitHubCalendarSectionInner)
