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
  const auth = useAuth();
  const { user, logout, token } = auth || {};
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState('');

  // Handle user blocked - defined first
  const handleUserBlocked = useCallback((message) => {
    console.log('🚫 [UserStatusMonitor] User blocked:', message);
    setBlockedMessage(message);
    setShowBlockedModal(true);
    
    // También mostrar toast para notificación inmediata
    if (toast && toast.error) {
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
    }
  }, []);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setShowBlockedModal(false);
    if (logout) {
      logout();
    }
    if (navigate) {
      navigate('/login', { replace: true });
    }
  }, [logout, navigate]);

  // Check user status
  const checkUserStatus = useCallback(async () => {
    if (!user || !token) return;

    try {
      console.log('🔍 [UserStatusMonitor] Checking user status...');
      
      const response = await fetch(`${API_URL}/api/users/me/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 [UserStatusMonitor] Response status:', response.status);

      if (response.status === 401) {
        // Token inválido o expirado
        console.log('🔒 [UserStatusMonitor] Token expired or invalid');
        if (t) {
          handleUserBlocked(t('userStatus.sessionExpired', 'Your session has expired. Please log in again.'));
        } else {
          handleUserBlocked('Your session has expired. Please log in again.');
        }
        return;
      }

      if (response.status === 403) {
        // Could be a blocked user or CORS/auth issue
        console.log('🚫 [UserStatusMonitor] 403 Forbidden - possible blocking or auth issue');
        try {
          const errorData = await response.json();
          if (errorData.message && errorData.message.includes('blocked')) {
            handleUserBlocked(errorData.message);
          } else {
            console.log('⚠️ [UserStatusMonitor] 403 error but not user blocking:', errorData.message);
            // Silently fail - could be a temporary server issue
          }
        } catch (parseError) {
          console.log('⚠️ [UserStatusMonitor] Could not parse 403 response');
        }
        return;
      }

      if (!response.ok) {
        // Error del servidor, log but don't disrupt user experience
        console.log('⚠️ [UserStatusMonitor] Server error:', response.status);
        return;
      }

      const userData = await response.json();
      console.log('✅ [UserStatusMonitor] Status check result:', userData);
      
      // Verificar si el usuario ha sido bloqueado
      if (userData.isBlocked) {
        console.log('🚫 [UserStatusMonitor] User has been blocked');
        if (t) {
          handleUserBlocked(t('blocking.message', 'Your account has been blocked by an administrator.'));
        } else {
          handleUserBlocked('Your account has been blocked by an administrator.');
        }
      }

    } catch (error) {
      console.error('❌ [UserStatusMonitor] Network error checking user status:', error);
      // No hacer nada en caso de error de red para evitar desconexiones innecesarias
      // Solo loggear para debugging
    }
  }, [user, token, handleUserBlocked, t]);

  // Effects
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
    showBlockedModal: showBlockedModal || false,
    blockedMessage: blockedMessage || '',
    handleModalClose: handleModalClose
  };
};
