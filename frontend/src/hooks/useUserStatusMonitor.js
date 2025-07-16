import { useEffect, useCallback, useState } from 'react';
import { useAuth } from './useAuth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Hook para monitorear el estado del usuario en tiempo real
 * Verifica si el usuario ha sido bloqueado y lo desconecta automáticamente
 */
export const useUserStatusMonitor = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState('');

  const checkUserStatus = useCallback(async () => {
    if (!user || !token) return;

    try {
      const response = await fetch(`${API_URL}/api/users/me/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        // Token inválido o expirado
        console.log('🔒 [UserStatusMonitor] Token expired or invalid');
        handleUserBlocked(t('userStatus.sessionExpired', 'Your session has expired. Please log in again.'));
        return;
      }

      if (!response.ok) {
        // Error del servidor, no hacer nada por ahora
        return;
      }

      const userData = await response.json();
      
      // Verificar si el usuario ha sido bloqueado
      if (userData.isBlocked) {
        console.log('🚫 [UserStatusMonitor] User has been blocked');
        handleUserBlocked(t('userStatus.blocked', 'Your account has been blocked by an administrator.'));
      }

    } catch (error) {
      console.error('❌ [UserStatusMonitor] Error checking user status:', error);
      // No hacer nada en caso de error de red para evitar desconexiones innecesarias
    }
  }, [user, token, handleUserBlocked, t]);

  const handleUserBlocked = useCallback((message) => {
    // Mostrar modal de bloqueo
    setBlockedMessage(message);
    setShowBlockedModal(true);
    
    // También mostrar toast para notificación inmediata
    toast.error(message, {
      duration: 6000,
      style: {
        background: '#DC2626',
        color: '#ffffff',
        fontWeight: '600',
        padding: '16px 24px',
        borderRadius: '12px',
      },
      icon: '🚫',
    });
  }, []);

  const handleModalClose = useCallback(() => {
    setShowBlockedModal(false);
    logout();
    navigate('/login', { replace: true });
  }, [logout, navigate]);

  useEffect(() => {
    if (!user || !token) return;

    // Verificar estado inmediatamente
    checkUserStatus();

    // Configurar verificación periódica cada 30 segundos
    const interval = setInterval(checkUserStatus, 30000);

    // Verificar cuando la ventana recupera el foco
    const handleFocus = () => {
      checkUserStatus();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user, token, checkUserStatus]);

  // También verificar en navegación
  useEffect(() => {
    if (!user || !token) return;
    
    const handleBeforeUnload = () => {
      // Verificar una vez más antes de navegar
      checkUserStatus();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user, token, checkUserStatus]);

  return {
    showBlockedModal,
    blockedMessage,
    handleModalClose
  };
};
