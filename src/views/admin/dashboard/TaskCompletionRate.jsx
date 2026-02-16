import React, { useEffect, useState } from 'react'
import styles from './TaskCompletionRate.module.css'

const TaskCompletionRate = () => {
  const [percentage, setPercentage] = useState(0)
  const completed = 19
  const total = 29

  useEffect(() => {
    const calculatedPercentage = Math.round((completed / total) * 100)
    setPercentage(calculatedPercentage)
  }, [completed, total])

  useEffect(() => {
    const circle = document.getElementById('progressCircle')
    const text = document.getElementById('percentageText')
    const radius = 37
    const circumference = 2 * Math.PI * radius

    if (circle) {
      circle.style.strokeDasharray = `${circumference}`
      circle.style.strokeDashoffset = `${circumference - (percentage / 100) * circumference}`
    }

    if (text) {
      text.textContent = `${percentage}%`
    }
  }, [percentage])

  const goToAddTaskPage = () => {
    window.location.href = 'task-black-page.html'
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <p>Task Completion Rate</p>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardLeft}>
          <p className={styles.smallLabel}>Average submission</p>
          <h2 className={styles.taskStats}>{completed} / {total}</h2>
          <div className={styles.badge}>😊</div>
        </div>

        <div className={styles.cardRight}>
          <svg width="90" height="90">
            <circle className={styles.bg} r="37" cx="45" cy="45" />
            <circle className={styles.progress} r="37" cx="45" cy="45" id="progressCircle" />
            <text x="45" y="50" className={styles.progressText} id="percentageText">0%</text>
          </svg>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <select>
          <option>All Departments</option>
          <option>Engineering</option>
        </select>
        <button onClick={goToAddTaskPage}>
          Add task <span className={styles.plusIcon}>+</span>
        </button>
      </div>
    </div>
  )
}

export default TaskCompletionRate
