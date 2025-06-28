export const autorizacaoSecretario = (req, res, next) => {
  const usuario = req.usuario;

  if (!usuario || usuario.tipoUsuario !== 'SECRETARIO') {
    return res.status(403).json({ error: 'Acesso restrito a secretários.' });
  }

  next();
};