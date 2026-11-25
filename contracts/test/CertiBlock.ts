import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";
import { sha256, toHex, zeroHash } from "viem";

describe("CertiBlock", async () => {
  const { viem } = await network.create();
  const [uni, otraInstitucion, empresa] = await viem.getWalletClients();

  const pdf = sha256(toHex("PDF del certificado de Ana Pérez"));
  const pdfAlterado = sha256(toHex("PDF del certificado de Ana Pérez (editado)"));

  const desplegar = () => viem.deployContract("CertiBlock", ["Universidad de Chile"]);

  it("quien despliega queda como institución emisora", async () => {
    const c = await desplegar();
    assert.equal(await c.read.institucion([uni.account.address]), "Universidad de Chile");
  });

  it("emite un certificado y cualquiera lo verifica", async () => {
    const c = await desplegar();
    await viem.assertions.emitWithArgs(
      c.write.emitir([pdf, "Aprobación IN3863"]),
      c,
      "CertificadoEmitido",
      [pdf, uni.account.address, "Aprobación IN3863"],
    );
    const [existe, valido, emisor, nombre, fecha, descripcion] = await c.read.verificar(
      [pdf],
      { account: empresa.account },
    );
    assert.equal(existe, true);
    assert.equal(valido, true);
    assert.equal(emisor.toLowerCase(), uni.account.address.toLowerCase());
    assert.equal(nombre, "Universidad de Chile");
    assert.ok(fecha > 0n);
    assert.equal(descripcion, "Aprobación IN3863");
    assert.equal(await c.read.totalCertificados(), 1n);
  });

  it("un documento alterado no aparece como emitido", async () => {
    const c = await desplegar();
    await c.write.emitir([pdf, "Aprobación IN3863"]);
    const [existe, valido] = await c.read.verificar([pdfAlterado]);
    assert.equal(existe, false);
    assert.equal(valido, false);
  });

  it("una wallet no autorizada no puede emitir", async () => {
    const c = await desplegar();
    await viem.assertions.revertWithCustomError(
      c.write.emitir([pdf, "Falso"], { account: empresa.account }),
      c,
      "NoAutorizado",
    );
  });

  it("solo el administrador autoriza instituciones", async () => {
    const c = await desplegar();
    await viem.assertions.revertWithCustomError(
      c.write.setInstitucion([empresa.account.address, "Falsa"], { account: empresa.account }),
      c,
      "NoAutorizado",
    );
    await c.write.setInstitucion([otraInstitucion.account.address, "PUC"]);
    await c.write.emitir([pdf, "Diploma"], { account: otraInstitucion.account });
    const [, , , nombre] = await c.read.verificar([pdf]);
    assert.equal(nombre, "PUC");
  });

  it("no se puede emitir dos veces la misma huella ni datos vacíos", async () => {
    const c = await desplegar();
    await c.write.emitir([pdf, "Aprobación"]);
    await viem.assertions.revertWithCustomError(c.write.emitir([pdf, "Otra"]), c, "YaEmitido");
    await viem.assertions.revertWithCustomError(c.write.emitir([zeroHash, "X"]), c, "DatosVacios");
    await viem.assertions.revertWithCustomError(c.write.emitir([pdfAlterado, ""]), c, "DatosVacios");
  });

  it("solo el emisor puede revocar, y queda inválido", async () => {
    const c = await desplegar();
    await c.write.emitir([pdf, "Aprobación"]);
    await viem.assertions.revertWithCustomError(
      c.write.revocar([pdf], { account: empresa.account }),
      c,
      "NoAutorizado",
    );
    await c.write.revocar([pdf]);
    const [existe, valido] = await c.read.verificar([pdf]);
    assert.equal(existe, true);
    assert.equal(valido, false);
    await viem.assertions.revertWithCustomError(c.write.revocar([pdf]), c, "YaRevocado");
    await viem.assertions.revertWithCustomError(c.write.revocar([pdfAlterado]), c, "NoExiste");
  });
});
