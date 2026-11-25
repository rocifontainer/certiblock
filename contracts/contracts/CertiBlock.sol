// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title CertiBlock: certificados verificables
/// @notice Una institución registra la "huella digital" (hash SHA-256) de cada
///         certificado que emite. Cualquiera puede comprobar después que un PDF
///         fue emitido por esa institución y que no ha sido alterado.
///         En la cadena NO se guardan datos personales: solo la huella y una descripción.
contract CertiBlock {
    struct Certificado {
        address emisor;       // wallet de la institución que lo emitió
        uint64 fechaEmision;  // timestamp del bloque
        bool revocado;        // la institución puede anularlo
        string descripcion;   // ej: "Aprobación curso IN3863 - 2026-2"
    }

    address public immutable administrador;
    uint256 public totalCertificados;

    /// @notice Nombre de cada institución autorizada. Vacío = no autorizada.
    mapping(address => string) public institucion;
    mapping(bytes32 => Certificado) private certificados;

    event InstitucionActualizada(address indexed emisor, string nombre);
    event CertificadoEmitido(bytes32 indexed huella, address indexed emisor, string descripcion);
    event CertificadoRevocado(bytes32 indexed huella, address indexed emisor);

    error NoAutorizado();
    error YaEmitido();
    error NoExiste();
    error YaRevocado();
    error DatosVacios();

    modifier soloInstitucion() {
        if (bytes(institucion[msg.sender]).length == 0) revert NoAutorizado();
        _;
    }

    constructor(string memory nombreInstitucion) {
        if (bytes(nombreInstitucion).length == 0) revert DatosVacios();
        administrador = msg.sender;
        institucion[msg.sender] = nombreInstitucion;
        emit InstitucionActualizada(msg.sender, nombreInstitucion);
    }

    /// @notice El administrador autoriza una institución (nombre) o la retira (nombre vacío).
    function setInstitucion(address emisor, string calldata nombre) external {
        if (msg.sender != administrador) revert NoAutorizado();
        institucion[emisor] = nombre;
        emit InstitucionActualizada(emisor, nombre);
    }

    /// @notice Registra la huella de un certificado. Una huella solo se puede emitir una vez.
    function emitir(bytes32 huella, string calldata descripcion) external soloInstitucion {
        if (huella == bytes32(0) || bytes(descripcion).length == 0) revert DatosVacios();
        if (certificados[huella].emisor != address(0)) revert YaEmitido();
        certificados[huella] = Certificado(msg.sender, uint64(block.timestamp), false, descripcion);
        totalCertificados++;
        emit CertificadoEmitido(huella, msg.sender, descripcion);
    }

    /// @notice Solo quien emitió el certificado puede revocarlo (por ejemplo, si hubo un error).
    function revocar(bytes32 huella) external {
        Certificado storage c = certificados[huella];
        if (c.emisor == address(0)) revert NoExiste();
        if (c.emisor != msg.sender) revert NoAutorizado();
        if (c.revocado) revert YaRevocado();
        c.revocado = true;
        emit CertificadoRevocado(huella, msg.sender);
    }

    /// @notice Verificación pública. Si existe = false, ese documento nunca fue registrado
    ///         (o fue modificado, porque cualquier cambio altera la huella).
    function verificar(bytes32 huella)
        external
        view
        returns (
            bool existe,
            bool valido,
            address emisor,
            string memory nombreInstitucion,
            uint64 fechaEmision,
            string memory descripcion
        )
    {
        Certificado storage c = certificados[huella];
        existe = c.emisor != address(0);
        valido = existe && !c.revocado;
        return (existe, valido, c.emisor, institucion[c.emisor], c.fechaEmision, c.descripcion);
    }
}
