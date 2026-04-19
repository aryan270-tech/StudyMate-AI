// src/utils/aiRecommendations.js

const SUBJECT_COLORS = {
  Mathematics: '#b4ff4e',
  Physics: '#7dd3fc',
  Chemistry: '#f9a8d4',
  Biology: '#86efac',
  History: '#fcd34d',
  Literature: '#c4b5fd',
  'Computer Science': '#fb923c',
  Economics: '#67e8f9',
  Other: '#94a3b8',
}

export function getSubjectColor(subject) {
  return SUBJECT_COLORS[subject] || SUBJECT_COLORS.Other
}

export const SUBJECTS = Object.keys(SUBJECT_COLORS)

/**
 * Generates study sessions from a list of tasks with deadlines.
 * Distributes study blocks intelligently based on priority and days remaining.
 */
export function generateStudyPlan(tasks) {
  const sessions = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingTasks = tasks
    .filter((t) => !t.completed && t.deadline)
    .map((t) => {
      const deadline = new Date(t.deadline)
      const daysLeft = Math.max(
        1,
        Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
      )
      return { ...t, daysLeft }
    })
    .sort((a, b) => a.daysLeft - b.daysLeft)

  upcomingTasks.forEach((task) => {
    const effort = task.effort || 3 // hours total
    const sessions_count = Math.min(task.daysLeft, Math.ceil(effort / 1.5))
    const minutesPerSession = Math.round((effort * 60) / sessions_count)

    for (let i = 0; i < sessions_count; i++) {
      const sessionDate = new Date(today)
      sessionDate.setDate(today.getDate() + i)
      sessions.push({
        taskId: task.id,
        taskTitle: task.title,
        subject: task.subject,
        date: sessionDate.toISOString().split('T')[0],
        duration: minutesPerSession,
        color: getSubjectColor(task.subject),
        aiGenerated: true,
      })
    }
  })

  return sessions
}

/**
 * Generates AI tips based on the current state of tasks and sessions.
 */
export function getAITips(tasks, sessions) {
  const tips = []

  const overdue = tasks.filter((t) => {
    if (!t.deadline || t.completed) return false
    return new Date(t.deadline) < new Date()
  })

  if (overdue.length > 0) {
    tips.push({
      type: 'warning',
      icon: '⚠️',
      text: `You have ${overdue.length} overdue task${overdue.length > 1 ? 's' : ''}. Consider rescheduling or marking them complete.`,
    })
  }

  const dueThisWeek = tasks.filter((t) => {
    if (!t.deadline || t.completed) return false
    const d = new Date(t.deadline)
    const now = new Date()
    const diff = (d - now) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= 7
  })

  if (dueThisWeek.length > 2) {
    tips.push({
      type: 'info',
      icon: '📅',
      text: `${dueThisWeek.length} tasks due this week. Focus on high-priority items first and use the Pomodoro technique: 25 min work, 5 min break.`,
    })
  }

  const completedToday = sessions.filter(
    (s) => s.done && s.date === new Date().toISOString().split('T')[0]
  ).length

  if (completedToday === 0) {
    tips.push({
      type: 'motivation',
      icon: '🔥',
      text: "You haven't started any study sessions today. Even 25 minutes makes a difference — start with your hardest subject while your mind is fresh.",
    })
  } else {
    tips.push({
      type: 'success',
      icon: '✅',
      text: `Great momentum! You've completed ${completedToday} session${completedToday > 1 ? 's' : ''} today. Keep the streak going!`,
    })
  }

  const highPriority = tasks.filter(
    (t) => t.priority === 'high' && !t.completed
  )
  if (highPriority.length > 0) {
    const subjects = [...new Set(highPriority.map((t) => t.subject))]
    tips.push({
      type: 'tip',
      icon: '🎯',
      text: `Focus area: ${subjects.slice(0, 2).join(' and ')}. These subjects have the most high-priority work pending.`,
    })
  }

  // Always give at least one tip
  if (tips.length === 0) {
    tips.push({
      type: 'success',
      icon: '🌟',
      text: "You're on top of everything! Use this momentum to review previous material or explore advanced topics.",
    })
  }

  return tips.slice(0, 3)
}

/**
 * Calculates study streak based on session history.
 */
export function calculateStreak(sessions) {
  const completedDates = [
    ...new Set(
      sessions
        .filter((s) => s.done)
        .map((s) => s.date)
        .sort()
        .reverse()
    ),
  ]

  if (completedDates.length === 0) return 0

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  if (completedDates[0] !== today && completedDates[0] !== yesterday) return 0

  let streak = 0
  let checkDate = new Date(completedDates[0])

  for (const dateStr of completedDates) {
    const d = new Date(dateStr)
    const diff = Math.round((checkDate - d) / 86400000)
    if (diff <= 1) {
      streak++
      checkDate = d
    } else {
      break
    }
  }

  return streak
}

/**
 * Returns progress stats aggregated from tasks and sessions.
 */
export function computeStats(tasks, sessions) {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.completed).length
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

  const totalMinutes = sessions.filter((s) => s.done).reduce((acc, s) => acc + (s.duration || 0), 0)
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10

  const streak = calculateStreak(sessions)

  // Build weekly chart data (last 7 days)
  const weekly = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const dayName = d.toLocaleDateString('en', { weekday: 'short' })
    const mins = sessions
      .filter((s) => s.done && s.date === dateStr)
      .reduce((acc, s) => acc + (s.duration || 0), 0)
    weekly.push({ day: dayName, minutes: mins, hours: Math.round((mins / 60) * 10) / 10 })
  }

  // Subject breakdown
  const subjectMap = {}
  sessions.filter((s) => s.done).forEach((s) => {
    subjectMap[s.subject] = (subjectMap[s.subject] || 0) + (s.duration || 0)
  })
  const subjects = Object.entries(subjectMap).map(([name, minutes]) => ({
    name,
    minutes,
    hours: Math.round((minutes / 60) * 10) / 10,
    color: getSubjectColor(name),
  }))

  return { totalTasks, completedTasks, completionRate, totalHours, streak, weekly, subjects }
}
