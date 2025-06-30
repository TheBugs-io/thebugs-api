export default function validarEmailInstitucional(email) {
  const regex = /^[\w-]+(\.[\w-]+)*@(alu\.ufc\.br|virtual\.ufc\.br)$/;
  return regex.test(email);
}
