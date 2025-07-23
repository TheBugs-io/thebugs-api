export const autorizacaoSecretario = (req, res, next) => {
  if (!req.usuario || req.usuario.tipo !== "SECRETARIO") {
    return res.status(403).json({ error: "Acesso restrito a secretários." });
  }

  next();
};
