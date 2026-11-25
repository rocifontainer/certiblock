"use client";

import { useEffect, useState } from "react";
import { bytesToHex } from "viem";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { certiBlockAbi } from "@/lib/abi";
import { CONTRACT_ADDRESS, SNOWTRACE, fuji } from "@/lib/config";

// Huella digital SHA-256 del archivo, calculada en el navegador: el PDF nunca sale del computador.
async function calcularHuella(file: File): Promise<`0x${string}`> {
  const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return bytesToHex(new Uint8Array(digest));
}

const corto = (s: string) => `${s.slice(0, 6)}…${s.slice(-4)}`;

export default function Home() {
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending: conectando, error: errorConexion } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: cambiando } = useSwitchChain();
  const enFuji = chainId === fuji.id;

  const [archivo, setArchivo] = useState<File | null>(null);
  const [huella, setHuella] = useState<`0x${string}` | null>(null);
  const [descripcion, setDescripcion] = useState("");

  const contrato = { address: CONTRACT_ADDRESS, abi: certiBlockAbi, chainId: fuji.id } as const;

  const total = useReadContract({
    ...contrato,
    functionName: "totalCertificados",
    query: { enabled: !!CONTRACT_ADDRESS },
  });

  const verificacion = useReadContract({
    ...contrato,
    functionName: "verificar",
    args: huella ? [huella] : undefined,
    query: { enabled: !!CONTRACT_ADDRESS && !!huella },
  });

  const miInstitucion = useReadContract({
    ...contrato,
    functionName: "institucion",
    args: address ? [address] : undefined,
    query: { enabled: !!CONTRACT_ADDRESS && !!address },
  });
  const puedoEmitir = !!miInstitucion.data;

  const { writeContract, data: txHash, isPending: firmando, error: errorEscritura, reset } =
    useWriteContract();
  const recibo = useWaitForTransactionReceipt({ hash: txHash, chainId: fuji.id });

  useEffect(() => {
    if (recibo.isSuccess) {
      verificacion.refetch();
      total.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recibo.isSuccess]);

  async function elegirArchivo(file: File | undefined) {
    reset();
    setArchivo(file ?? null);
    setHuella(file ? await calcularHuella(file) : null);
  }

  function emitir() {
    if (!huella || !CONTRACT_ADDRESS) return;
    writeContract({
      ...contrato,
      address: CONTRACT_ADDRESS,
      functionName: "emitir",
      args: [huella, descripcion.trim()],
    });
  }

  if (!montado) return null;

  const [existe, valido, emisor, nombreInstitucion, fecha, desc] = verificacion.data ?? [];

  return (
    <main>
      <header>
        <div>
          <h1>
            Certi<span>Block</span>
          </h1>
          <p className="sub">Certificados verificables en Avalanche Fuji</p>
        </div>
        {isConnected ? (
          <div className="row" style={{ marginTop: 0 }}>
            <span className="hash">{address && corto(address)}</span>
            <button className="secondary" onClick={() => disconnect()}>
              Desconectar
            </button>
          </div>
        ) : (
          <button
            disabled={conectando || connectors.length === 0}
            onClick={() => connect({ connector: connectors[0], chainId: fuji.id })}
          >
            {conectando ? "Conectando…" : "Conectar wallet"}
          </button>
        )}
      </header>

      {!CONTRACT_ADDRESS && (
        <div className="result warn">
          Falta configurar <code>NEXT_PUBLIC_CONTRACT_ADDRESS</code> con la dirección del contrato.
        </div>
      )}
      {errorConexion && (
        <div className="result bad">
          No se encontró una wallet. Instala Core o MetaMask en este navegador.
        </div>
      )}
      {isConnected && !enFuji && (
        <div className="result warn row">
          <span>Tu wallet está en otra red. CertiBlock funciona en Avalanche Fuji (43113).</span>
          <button disabled={cambiando} onClick={() => switchChain({ chainId: fuji.id })}>
            {cambiando ? "Cambiando…" : "Cambiar a Fuji"}
          </button>
        </div>
      )}

      <section className="card">
        <h2>1. Sube el certificado</h2>
        <p className="sub">
          Calculamos su huella digital (SHA-256) aquí mismo, en tu navegador. El archivo no se sube a
          ningún lado.
        </p>
        <label className="drop">
          <input type="file" onChange={(e) => elegirArchivo(e.target.files?.[0])} />
          {archivo ? archivo.name : "Haz clic para elegir un PDF (o cualquier archivo)"}
        </label>
        {huella && <p className="hash">Huella: {huella}</p>}

        {huella && verificacion.isLoading && <p className="sub">Consultando la blockchain…</p>}

        {huella && verificacion.data && (
          existe ? (
            <div className={`result ${valido ? "ok" : "bad"}`}>
              <strong>
                {valido ? "✔ Certificado auténtico" : "✖ Certificado revocado por la institución"}
              </strong>
              <dl>
                <dt>Emitido por</dt>
                <dd>{nombreInstitucion || "(institución ya no autorizada)"}</dd>
                <dt>Wallet emisora</dt>
                <dd>
                  <a href={`${SNOWTRACE}/address/${emisor}`} target="_blank" rel="noreferrer">
                    {emisor}
                  </a>
                </dd>
                <dt>Fecha</dt>
                <dd>{new Date(Number(fecha) * 1000).toLocaleString("es-CL")}</dd>
                <dt>Descripción</dt>
                <dd>{desc}</dd>
              </dl>
            </div>
          ) : (
            <div className="result bad">
              <strong>✖ No registrado</strong>
              Este documento nunca fue emitido en CertiBlock o fue modificado después de emitirse.
            </div>
          )
        )}
      </section>

      {huella && existe === false && (
        <section className="card">
          <h2>2. Emitir este certificado (solo instituciones)</h2>
          {!isConnected ? (
            <p className="sub">Conecta la wallet de la institución para emitir.</p>
          ) : !puedoEmitir ? (
            <p className="sub">Esta wallet no está autorizada como institución emisora.</p>
          ) : (
            <>
              <p className="sub">
                Emitiendo como <strong>{miInstitucion.data}</strong>. En la blockchain solo queda la
                huella y la descripción, sin datos personales.
              </p>
              <label htmlFor="desc">Descripción</label>
              <input
                id="desc"
                type="text"
                placeholder="Ej: Aprobación curso IN3863 · 2026-2"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
              <div className="row">
                <button
                  disabled={!enFuji || !descripcion.trim() || firmando || recibo.isLoading}
                  onClick={emitir}
                >
                  {firmando ? "Firma en tu wallet…" : recibo.isLoading ? "Confirmando…" : "Emitir certificado"}
                </button>
              </div>
            </>
          )}
        </section>
      )}

      {txHash && (
        <div className={`result ${recibo.isSuccess ? "ok" : "warn"}`}>
          <strong>{recibo.isSuccess ? "✔ Certificado emitido" : "Transacción enviada…"}</strong>
          <a href={`${SNOWTRACE}/tx/${txHash}`} target="_blank" rel="noreferrer">
            Ver transacción en Snowtrace
          </a>
          <p className="hash">{txHash}</p>
        </div>
      )}
      {errorEscritura && (
        <div className="result bad">
          {errorEscritura.message.split("\n")[0]}
        </div>
      )}

      <footer>
        {CONTRACT_ADDRESS && (
          <>
            Contrato{" "}
            <a href={`${SNOWTRACE}/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer">
              {corto(CONTRACT_ADDRESS)}
            </a>{" "}
            · {total.data?.toString() ?? "…"} certificados emitidos ·{" "}
          </>
        )}
        Red Avalanche Fuji (testnet)
      </footer>
    </main>
  );
}
