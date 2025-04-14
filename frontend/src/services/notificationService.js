import { toast } from 'react-toastify';
import api from './api';

class NotificationService {
  constructor() {
    this.checkInterval = 5 * 60 * 1000; // 5 minutes
    this.intervalId = null;
  }

  start() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return;
    }

    this.checkNotifications();
    this.intervalId = setInterval(() => this.checkNotifications(), this.checkInterval);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async checkNotifications() {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return;
      }

      // Check budget alerts
      const alertsResponse = await api.get('/budgets/alerts');
      
      if (alertsResponse.data.success && alertsResponse.data.data.length > 0) {
        alertsResponse.data.data.forEach(alert => {
          this.showAlert(alert);
        });
      }

      // Check notifications
      const notificationsResponse = await api.get('/budgets/notifications');
      
      if (notificationsResponse.data.success && notificationsResponse.data.data.length > 0) {
        notificationsResponse.data.data.forEach(notification => {
          if (!notification.isRead) {
            this.showNotification(notification);
          }
        });
      }
    } catch (error) {
      // Error handling silently fails to avoid disrupting the user experience
    }
  }

  showAlert(alert) {
    if (alert.isExceeded) {
      toast.error(alert.message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.warning(alert.message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

  showNotification(notification) {
    if (notification.type === 'budget_exceeded') {
      toast.error(notification.message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.warning(notification.message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }
}

const notificationService = new NotificationService();
export default notificationService; 