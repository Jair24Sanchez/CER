// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CER - Crypto Event Reports
 * @notice Contrato inteligente para gestionar reportajes de eventos con recompensas en ETH
 * @dev Soporta roles de Reportero y Organizador, solicitudes de reportajes con depósitos, y publicación como NFTs
 */
contract CER {
    // Roles de usuario
    enum Role {
        NONE,      // 0
        REPORTER,  // 1
        ORGANIZER, // 2
        BOTH       // 3
    }

    // Estados de solicitud de reportaje
    enum RequestStatus {
        PENDING,     // 0 - Pendiente
        IN_PROGRESS, // 1 - En progreso
        SUBMITTED,   // 2 - Enviado para revisión
        APPROVED,    // 3 - Aprobado
        PUBLISHED,   // 4 - Publicado como NFT
        REJECTED     // 5 - Rechazado
    }

    // Estructura de solicitud de reportaje
    struct ReportRequest {
        address organizer;
        string title;
        string description;
        uint256 reportersNeeded;
        bool hasReward;
        uint256 rewardAmount; // en Wei
        RequestStatus status;
        uint256 createdAt;
        address[] assignedReporters;
        mapping(address => string) submittedReports; // reporter => contentHash
    }

    // Estructura de token NFT publicado
    struct PublishedToken {
        uint256 requestId;
        string tokenURI;
        address reporter;
        uint256 publishedAt;
    }

    // Mapeos
    mapping(address => Role) public userRoles;
    mapping(uint256 => ReportRequest) public reportRequests;
    mapping(uint256 => PublishedToken) public publishedTokens;
    
    // Contadores
    uint256 public requestCounter;
    uint256 public tokenCounter;

    // Eventos
    event UserRegistered(address indexed user, Role role);
    event ReportRequestCreated(
        uint256 indexed requestId,
        address indexed organizer,
        string title,
        uint256 rewardAmount,
        bool hasReward
    );
    event ReportSubmitted(uint256 indexed requestId, address indexed reporter, string contentHash);
    event ReportApproved(uint256 indexed requestId, address indexed reporter, uint256 rewardAmount);
    event ReportPublished(uint256 indexed requestId, uint256 indexed tokenId, string tokenURI);

    // Modificadores
    modifier onlyReporter() {
        require(
            userRoles[msg.sender] == Role.REPORTER || userRoles[msg.sender] == Role.BOTH,
            "Debes ser reportero"
        );
        _;
    }

    modifier onlyOrganizer() {
        require(
            userRoles[msg.sender] == Role.ORGANIZER || userRoles[msg.sender] == Role.BOTH,
            "Debes ser organizador"
        );
        _;
    }

    /**
     * @notice Obtener el rol de un usuario
     * @param user Dirección del usuario
     * @return Rol del usuario (0=NONE, 1=REPORTER, 2=ORGANIZER, 3=BOTH)
     */
    function getUserRole(address user) external view returns (uint8) {
        return uint8(userRoles[user]);
    }

    /**
     * @notice Registrar un usuario como Reportero
     * @param user Dirección del usuario a registrar
     */
    function registerAsReporter(address user) external {
        require(user == msg.sender, "Solo puedes registrarte a ti mismo");
        
        if (userRoles[user] == Role.NONE) {
            userRoles[user] = Role.REPORTER;
        } else if (userRoles[user] == Role.ORGANIZER) {
            userRoles[user] = Role.BOTH;
        }
        // Si ya es REPORTER o BOTH, no hacer nada
        
        emit UserRegistered(user, userRoles[user]);
    }

    /**
     * @notice Registrar un usuario como Organizador
     * @param user Dirección del usuario a registrar
     */
    function registerAsOrganizer(address user) external {
        require(user == msg.sender, "Solo puedes registrarte a ti mismo");
        
        if (userRoles[user] == Role.NONE) {
            userRoles[user] = Role.ORGANIZER;
        } else if (userRoles[user] == Role.REPORTER) {
            userRoles[user] = Role.BOTH;
        }
        // Si ya es ORGANIZER o BOTH, no hacer nada
        
        emit UserRegistered(user, userRoles[user]);
    }

    /**
     * @notice Crear una solicitud de reportaje
     * @param title Título del evento
     * @param description Descripción del evento
     * @param reportersNeeded Número de reporteros necesarios
     * @param hasReward Si tiene recompensa en ETH
     * @return requestId ID de la solicitud creada
     */
    function createReportRequest(
        string memory title,
        string memory description,
        uint256 reportersNeeded,
        bool hasReward
    ) external payable onlyOrganizer returns (uint256) {
        require(reportersNeeded > 0, "Se necesita al menos un reportero");
        
        uint256 requestId = requestCounter++;
        ReportRequest storage request = reportRequests[requestId];
        
        request.organizer = msg.sender;
        request.title = title;
        request.description = description;
        request.reportersNeeded = reportersNeeded;
        request.hasReward = hasReward;
        request.rewardAmount = msg.value; // El ETH enviado se bloquea como recompensa
        request.status = RequestStatus.PENDING;
        request.createdAt = block.timestamp;
        
        emit ReportRequestCreated(requestId, msg.sender, title, msg.value, hasReward);
        
        return requestId;
    }

    /**
     * @notice Obtener detalles de una solicitud
     * @param requestId ID de la solicitud
     * @return organizer Dirección del organizador
     * @return title Título del evento
     * @return rewardAmount Monto de recompensa en Wei
     * @return hasReward Si tiene recompensa
     * @return status Estado de la solicitud
     */
    function getRequestDetails(uint256 requestId)
        external
        view
        returns (
            address organizer,
            string memory title,
            uint256 rewardAmount,
            bool hasReward,
            uint8 status
        )
    {
        ReportRequest storage request = reportRequests[requestId];
        require(request.organizer != address(0), "Solicitud no existe");
        
        return (
            request.organizer,
            request.title,
            request.rewardAmount,
            request.hasReward,
            uint8(request.status)
        );
    }

    /**
     * @notice Enviar un reportaje para aprobación
     * @param requestId ID de la solicitud
     * @param contentHash Hash del contenido del reportaje (en producción, usar IPFS)
     */
    function submitReport(uint256 requestId, string memory contentHash) external onlyReporter {
        ReportRequest storage request = reportRequests[requestId];
        require(request.organizer != address(0), "Solicitud no existe");
        require(
            request.status == RequestStatus.PENDING || request.status == RequestStatus.IN_PROGRESS,
            "Solicitud no disponible"
        );
        
        request.status = RequestStatus.SUBMITTED;
        request.submittedReports[msg.sender] = contentHash;
        request.assignedReporters.push(msg.sender);
        
        emit ReportSubmitted(requestId, msg.sender, contentHash);
    }

    /**
     * @notice Aprobar un reportaje y liberar recompensa
     * @param requestId ID de la solicitud
     * @param reporter Dirección del reportero a aprobar
     */
    function approveReport(uint256 requestId, address reporter) external {
        ReportRequest storage request = reportRequests[requestId];
        require(request.organizer == msg.sender, "Solo el organizador puede aprobar");
        require(request.status == RequestStatus.SUBMITTED, "Reportaje no enviado");
        require(
            bytes(request.submittedReports[reporter]).length > 0,
            "Reportero no ha enviado reportaje"
        );
        
        request.status = RequestStatus.APPROVED;
        
        // Liberar recompensa si existe
        if (request.hasReward && request.rewardAmount > 0) {
            uint256 rewardPerReporter = request.rewardAmount / request.assignedReporters.length;
            (bool success, ) = reporter.call{value: rewardPerReporter}("");
            require(success, "Transferencia de recompensa falló");
            
            emit ReportApproved(requestId, reporter, rewardPerReporter);
        }
    }

    /**
     * @notice Publicar un reportaje como token NFT
     * @param requestId ID de la solicitud
     * @param tokenURI URI del token (en producción, usar IPFS)
     * @return tokenId ID del token publicado
     */
    function publishReportAsToken(uint256 requestId, string memory tokenURI)
        external
        returns (uint256)
    {
        ReportRequest storage request = reportRequests[requestId];
        require(request.organizer == msg.sender, "Solo el organizador puede publicar");
        require(request.status == RequestStatus.APPROVED, "Reportaje debe estar aprobado");
        
        uint256 tokenId = tokenCounter++;
        
        PublishedToken storage token = publishedTokens[tokenId];
        token.requestId = requestId;
        token.tokenURI = tokenURI;
        token.reporter = request.assignedReporters[0]; // Primer reportero asignado
        token.publishedAt = block.timestamp;
        
        request.status = RequestStatus.PUBLISHED;
        
        emit ReportPublished(requestId, tokenId, tokenURI);
        
        return tokenId;
    }

    /**
     * @notice Obtener información de un token publicado
     * @param tokenId ID del token
     * @return requestId ID de la solicitud original
     * @return tokenURI URI del token
     * @return reporter Dirección del reportero
     * @return publishedAt Timestamp de publicación
     */
    function getTokenInfo(uint256 tokenId)
        external
        view
        returns (
            uint256 requestId,
            string memory tokenURI,
            address reporter,
            uint256 publishedAt
        )
    {
        PublishedToken storage token = publishedTokens[tokenId];
        require(token.requestId > 0, "Token no existe");
        
        return (token.requestId, token.tokenURI, token.reporter, token.publishedAt);
    }

    // Función para recibir ETH (necesaria para depósitos)
    receive() external payable {}
}

