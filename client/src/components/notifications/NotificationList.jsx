import React, { useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { notificationAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const NotificationList = () => {
  const { loading, error, execute: fetchNotifications, data: notifications } = useApi();

  useEffect(() => {
    fetchNotifications(() => notificationAPI.getNotifications());
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      fetchNotifications(() => notificationAPI.getNotifications()); // Refresh
    } catch (err) {
      console.error('Mark as read failed:', err);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500">{error}</p>}
      {notifications && notifications.length === 0 && (
        <p className="text-gray-500">No notifications.</p>
      )}
      {notifications && notifications.length > 0 && (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification._id} className={`border p-4 rounded-lg ${notification.read ? 'bg-gray-100' : 'bg-blue-50'}`}>
              <p className="text-gray-900">{notification.message}</p>
              <p className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
              {!notification.read && (
                <button onClick={() => handleMarkAsRead(notification._id)} className="btn-secondary mt-2">
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationList;