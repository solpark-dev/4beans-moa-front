import { useState, useEffect, useCallback } from "react"
import pushApi from "@/api/pushApi"

export const usePushNotification = () => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [expandedId, setExpandedId] = useState('')
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await pushApi.getUnreadCount()
      setUnreadCount(response.count || 0)
    } catch (error) {
      console.error("Failed to fetch unread count:", error)
    }
  }, [])

  const fetchNotifications = useCallback(async (pageNum = 0, append = false) => {
    setIsLoading(true)
    try {
      const response = await pushApi.getMyPushList(pageNum, 10)
      const newData = response.content || []
      
      setNotifications(prev => append ? [...prev, ...newData] : newData)
      setHasMore(newData.length === 10)
      setPage(pageNum)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleToggleExpand = useCallback(async (pushId) => {
    if (expandedId === pushId) {
      setExpandedId('')
      return
    }

    setExpandedId(pushId)

    const notification = notifications.find(n => n.pushId === pushId)
    if (notification && notification.isRead === "N") {
      try {
        await pushApi.updateRead(pushId)
        setNotifications(prev =>
          prev.map(n => n.pushId === pushId ? { ...n, isRead: "Y" } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      } catch (error) {
        console.error("Failed to mark as read:", error)
      }
    }
  }, [expandedId, notifications])

  const handleReadAll = useCallback(async () => {
    try {
      await pushApi.updateAllRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: "Y" })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Failed to mark all as read:", error)
    }
  }, [])

  const handleDelete = useCallback(async (pushId, e) => {
    e?.stopPropagation()
    try {
      await pushApi.deletePush(pushId)
      setNotifications(prev => prev.filter(n => n.pushId !== pushId))
      const notification = notifications.find(n => n.pushId === pushId)
      if (notification?.isRead === "N") {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Failed to delete notification:", error)
    }
  }, [notifications])

  const handleDeleteAll = useCallback(async () => {
    try {
      await pushApi.deleteAllPushs()
      setNotifications([])
      setUnreadCount(0)
    } catch (error) {
      console.error("Failed to delete all notifications:", error)
    }
  }, [])

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchNotifications(page + 1, true)
    }
  }, [isLoading, hasMore, page, fetchNotifications])

  const handleOpenChange = useCallback((open) => {
    setIsOpen(open)
    if (open) {
      fetchNotifications(0, false)
    } else {
      setExpandedId('')
    }
  }, [fetchNotifications])

  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 60000)
    return () => clearInterval(interval)
  }, [fetchUnreadCount])

  return {
    notifications,
    unreadCount,
    isLoading,
    isOpen,
    expandedId,
    hasMore,
    handleToggleExpand,
    handleReadAll,
    handleDelete,
    handleDeleteAll,
    handleLoadMore,
    handleOpenChange,
  }
}

export default usePushNotification