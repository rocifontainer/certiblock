import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CertiBlockModule", (m) => {
  // Nombre de la institución emisora: se puede cambiar al desplegar con --parameters
  const nombre = m.getParameter("nombreInstitucion", "Institución de Demostración CertiBlock");
  const certiblock = m.contract("CertiBlock", [nombre]);
  return { certiblock };
});
