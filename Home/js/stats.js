document.addEventListener('DOMContentLoaded', function() {
    // Calcular y mostrar todas las estadísticas
    updateAllStats();
    
    // Manejar el cambio en el selector de tiempo para Reports
    const timeSelect = document.getElementById('reportsTimeFilter');
    if (timeSelect) {
        timeSelect.addEventListener('change', function(e) {
            updateReportsCount(e.target.value);
        });
    }
});

function updateAllStats() {
    updateOrganizersCount();
    updateReportersCount();
    updateReportsCount('total');
    updatePaidAmount();
}

// 1. Organizers: usuarios que han organizado, solicitado y publicado un reportaje
function updateOrganizersCount() {
    const requestedEvents = JSON.parse(localStorage.getItem('requestedEvents') || '[]');
    
    // Obtener organizadores únicos que tienen eventos con status 'publicado'
    const organizersWithPublished = new Set();
    
    requestedEvents.forEach(event => {
        if (event.status === 'publicado' && event.organizer) {
            // Usar organizerId si existe, sino usar organizer como identificador
            const organizerId = event.organizerId || event.organizer;
            organizersWithPublished.add(organizerId);
        }
    });
    
    const count = organizersWithPublished.size;
    const element = document.getElementById('organizersCount');
    if (element) {
        element.textContent = count.toLocaleString();
    }
}

// 2. Reporters: personas que han publicado un reportaje (por iniciativa propia o por solicitud)
function updateReportersCount() {
    const reportajes = JSON.parse(localStorage.getItem('reportajes') || '[]');
    
    // Obtener reporters únicos
    const reporters = new Set();
    
    reportajes.forEach(reportaje => {
        // Si tiene authorId, usarlo; si no, usar author; si no tiene ninguno, usar 'anon'
        const reporterId = reportaje.authorId || reportaje.author || 'anon';
        reporters.add(reporterId);
    });
    
    const count = reporters.size;
    const element = document.getElementById('reportersCount');
    if (element) {
        element.textContent = count.toLocaleString();
    }
}

// 3. Reports: contabilidad de reportes con filtro de tiempo
function updateReportsCount(timeFilter) {
    const reportajes = JSON.parse(localStorage.getItem('reportajes') || '[]');
    
    let filteredReportajes = [];
    const now = new Date();
    
    switch(timeFilter) {
        case '24h':
            const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            filteredReportajes = reportajes.filter(r => {
                const reportDate = new Date(r.timestamp);
                return reportDate >= last24h;
            });
            break;
        case 'week':
            const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filteredReportajes = reportajes.filter(r => {
                const reportDate = new Date(r.timestamp);
                return reportDate >= lastWeek;
            });
            break;
        case 'month':
            const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            filteredReportajes = reportajes.filter(r => {
                const reportDate = new Date(r.timestamp);
                return reportDate >= lastMonth;
            });
            break;
        case '6months':
            const last6Months = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
            filteredReportajes = reportajes.filter(r => {
                const reportDate = new Date(r.timestamp);
                return reportDate >= last6Months;
            });
            break;
        case 'total':
        default:
            filteredReportajes = reportajes;
            break;
    }
    
    const count = filteredReportajes.length;
    const element = document.getElementById('reportsCount');
    if (element) {
        element.textContent = count.toLocaleString();
    }
}

// 4. Paid in reports: total pagado en recompensas (solo cuando está depositado)
function updatePaidAmount() {
    const reportajes = JSON.parse(localStorage.getItem('reportajes') || '[]');
    
    // Sumar solo los reportajes que tienen paid: true y rewardAmount > 0
    let totalPaid = 0;
    
    reportajes.forEach(reportaje => {
        if (reportaje.paid === true && reportaje.rewardAmount && reportaje.rewardAmount > 0) {
            totalPaid += reportaje.rewardAmount;
        }
    });
    
    const element = document.getElementById('paidAmount');
    if (element) {
        element.textContent = `$ ${totalPaid.toLocaleString()}`;
    }
}
