export default function dataBrasilia({ dia, mes, ano, string }) {
  try {
    if (typeof string == "string") {
      const TEM_FUSO = /[0-9]{2}:[0-9]{2}$/.test(string);

      return TEM_FUSO
        ? new Date(string.split("T")[0] + "T00:00:00")
        : new Date(string.split("T")[0] + "T00:00:00-03:00");
    }

    return new Date([dia, mes, ano].join("-") + "T00:00:00-03:00");
  } catch (error) {
    throw new Error("Geração de data inválida");
  }
}
