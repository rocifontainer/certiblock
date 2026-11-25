# Guion del video de pitch (90 segundos)

Graba la pantalla, por ejemplo con OBS, Loom o QuickTime, con la demo abierta y la wallet conectada a Fuji. Ten `demo/certificado-ejemplo.pdf` y `demo/certificado-adulterado.pdf` a mano.

**1. Problema (0:00 a 0:12)**
"Cada año miles de empresas reciben títulos y certificados en PDF. Verificarlos significa escribirle a la universidad y esperar días. Y adulterar un PDF, por ejemplo subir una nota, toma dos minutos."

**2. Solución (0:12 a 0:27)**
"CertiBlock: la institución registra en Avalanche la huella digital de cada certificado. Cualquiera puede comprobar en segundos quién lo emitió y si fue alterado, sin llamar a nadie."

**3. Demo en vivo (0:27 a 1:07)**
- Subo un certificado nuevo y la pantalla dice *No registrado*. Escribo la descripción, presiono **Emitir** y firmo con la wallet.
- Clic en **Ver transacción en Snowtrace**: "Aquí está, pública y con estado *Success*".
- Vuelvo a subir el mismo PDF: **✔ Certificado auténtico**, con institución y fecha.
- Subo el adulterado, con la nota cambiada de 4,8 a 6,8: **✖ No registrado**. "Cambió un número y la huella ya no coincide."

**4. Por qué blockchain (1:07 a 1:17)**
"El registro no depende de un servidor de la universidad que se puede caer o editar. Nadie, ni siquiera la institución, puede cambiar la fecha ni borrar un certificado emitido; solo revocarlo, y eso también queda registrado."

**5. Siguientes pasos (1:17 a 1:30)**
"Agregar un código QR en cada certificado, emitir en lote cientos de títulos con una sola transacción y sumar más universidades como emisoras."

---

**Preguntas probables del jurado**

- *¿Por qué no guardan el PDF en la blockchain?* Sería caro y expondría datos personales. Con la huella basta para probar autenticidad.
- *¿Qué impide que cualquiera emita?* Solo las wallets autorizadas por el administrador pueden emitir, y el certificado muestra el nombre de la institución emisora.
- *¿Y si la universidad se equivoca?* Puede revocarlo; la verificación mostrará *revocado* y el historial queda público.
