document.addEventListener('DOMContentLoaded', function() {
    const data = JSON.parse(localStorage.getItem('eventSummary'));
    if (!data) return;
    document.getElementById('summary-title').textContent = data.title;
    document.getElementById('summary-organizer').textContent = data.organizer;
    document.getElementById('summary-subtype').textContent = data.subtype || 'Sin subtipo';
    document.getElementById('summary-reporters').textContent = `Reporteros: ${data.reporters}`;
    document.getElementById('summary-reward').textContent = data.rewardType === 'recompensa' && data.rewardAmount ? `$${data.rewardAmount}` : 'Volunteer';
    document.getElementById('summary-description').textContent = data.description;
    document.getElementById('summary-datetime').textContent = `De ${data.startDate} ${data.startTime} a ${data.endDate} ${data.endTime}`;
    document.getElementById('summary-location').innerHTML = data.location ? `<a href='${data.location}' target='_blank'>Ubicación</a>` : 'Sin ubicación';
}); 