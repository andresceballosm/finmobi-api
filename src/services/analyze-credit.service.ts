async function time(applicant: any) {}

async function analyzeCreditRisk(applicant: any) {
  let risk = 0;

  // Verificar estabilidad laboral
  if (applicant.tiempoEmpleo < 1) {
    risk += 3;
  } else if (applicant.tiempoEmpleo < 3) {
    risk += 2;
  }

  // Verificar ingresos
  if (applicant.ingresosAnuales < 30000) {
    risk += 3;
  } else if (applicant.ingresosAnuales < 50000) {
    risk += 2;
  }

  return risk;
}