/**
 * Toast Notification System
 */

const Toast = (() => {
  let container = null;

  /**
   * Shows a toast notification
   * @param {string} message
   * @param {string} type - 'success', 'error', 'warning', 'info'
   * @param {number} duration - milliseconds
   */
  function show(message, type = 'info', duration = 3000) {
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="toast-icon">${getIcon(type)}</span>
        <span class="toast-message">${message}</span>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  function getIcon(type) {
    switch (type) {
      case 'success': return '&#10003;';
      case 'error': return '&#10007;';
      case 'warning': return '&#9888;';
      default: return '&#8505;';
    }
  }

  function success(message, duration) { show(message, 'success', duration); }
  function error(message, duration) { show(message, 'error', duration); }
  function warning(message, duration) { show(message, 'warning', duration); }
  function info(message, duration) { show(message, 'info', duration); }

  return { show, success, error, warning, info };
})();

if (typeof window !== 'undefined') {
  window.Toast = Toast;
}
