import { useSyncExternalStore } from 'react'
import { getToken } from '@/lib/auth-token'

export interface AdminSessionSnapshot {
  isAdmin: boolean
  checked: boolean
}

const SERVER_SNAPSHOT: AdminSessionSnapshot = {
  isAdmin: false,
  checked: false,
}

let snapshot: AdminSessionSnapshot = { ...SERVER_SNAPSHOT }
const listeners = new Set<() => void>()

function notify(): void {
  listeners.forEach((listener) => {
    listener()
  })
}

function getSnapshot(): AdminSessionSnapshot {
  return snapshot
}

function getServerSnapshot(): AdminSessionSnapshot {
  return SERVER_SNAPSHOT
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function hydrateAdminSessionStore(): void {
  snapshot = {
    isAdmin: !!getToken(),
    checked: true,
  }
  notify()
}

export function setAdminSessionStore(isAdmin: boolean): void {
  snapshot = {
    ...snapshot,
    isAdmin,
  }
  notify()
}

export function useAdminSessionStore(): AdminSessionSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
