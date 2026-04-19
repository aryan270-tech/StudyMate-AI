// src/hooks/useTasks.js
import { useCallback } from 'react'
import { useApp } from '../context/AppContext'
import {
  addTask as addTaskSvc,
  updateTask as updateTaskSvc,
  deleteTask as deleteTaskSvc,
} from '../services/taskService'

export function useTasks() {
  const { user, tasks, tasksLoading, setError } = useApp()

  const addTask = useCallback(
    async (task) => {
      try {
        await addTaskSvc(user.uid, task)
      } catch (e) {
        setError(e.message)
      }
    },
    [user, setError]
  )

  const updateTask = useCallback(
    async (taskId, updates) => {
      try {
        await updateTaskSvc(user.uid, taskId, updates)
      } catch (e) {
        setError(e.message)
      }
    },
    [user, setError]
  )

  const deleteTask = useCallback(
    async (taskId) => {
      try {
        await deleteTaskSvc(user.uid, taskId)
      } catch (e) {
        setError(e.message)
      }
    },
    [user, setError]
  )

  const toggleTask = useCallback(
    (task) => updateTask(task.id, { completed: !task.completed }),
    [updateTask]
  )

  return { tasks, tasksLoading, addTask, updateTask, deleteTask, toggleTask }
}
