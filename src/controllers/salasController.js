import * as salaModel from "../models/salasModel.js";

//  /mapa?data=xx-xx-xx&hora=xx:xx
export const mapaNaData = (req, res) => {
  const { data, hora } = req.query;
  const FORMATO_VALIDO =
    typeof data == "string" &&
    typeof hora == "string" &&
    /^[0-9]{2}-[0-9]{2}-[0-9]{4}$/.test(data) &&
    /^[0-9]{2}:[0-9]{2}$/.test(hora);
  if (!FORMATO_VALIDO) return res.sendStatus(400);

  const mapa = salaModel.mapaNaData(data, hora);
  return res.send(mapa);
};

//pega oq ta acontecendo naquela sala naquele horario (util pra favoritos, pra ver oq ta aconteceno ou vai acontecer)
export const salaNaData = (req, res) => {
  const { sala_id, data, hora } = req.query;
  const FORMATO_VALIDO =
    /^[0-9]{2}-[0-9]{2}-[0-9]{4}$/.test(data) && /^[0-9]{2}:[0-9]{2}$/.test(hora) && /[0-9]{1,6}/.test(sala_id);
  if (!FORMATO_VALIDO) return res.sendStatus(400);

  const reserva = salaModel.salaNaData(sala_id, data, hora);
  console.log(reserva);
  return res.send(reserva);
};

export const reservasDaSala = (req, res) => {
  const { sala_id } = req.query;
  if (!/[0-9]{1,6}/.test(sala_id)) return res.sendStatus(400);

  const reservas = salaModel.reservasDaSala(sala_id);
  return res.send(reservas);
};

export const getSala = (req, res) => {
  const { sala_id } = req.query;
  if (!/[0-9]{1,6}/.test(sala_id)) return res.sendStatus(400);

  const sala = salaModel.getSala(sala_id);
  return res.send(sala);
};
