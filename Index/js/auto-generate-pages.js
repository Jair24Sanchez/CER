// Script para generar automáticamente todas las páginas de países e idiomas
document.addEventListener('DOMContentLoaded', function() {
    // Función para generar página de país
    function generateCountryPage(countryCode, countryName) {
        return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reportajes IRL Events - ${countryName} - CER</title>
    <link rel="stylesheet" href="../../report-events.css">
    <link rel="stylesheet" href="../../blog-editor.css">
    <style>
        .reportajes-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .reportajes-header { text-align: center; margin-bottom: 40px; }
        .reportajes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .reportaje-card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .reportaje-title { font-size: 1.2em; font-weight: bold; margin-bottom: 10px; color: #333; }
        .reportaje-content { color: #666; line-height: 1.6; margin-bottom: 15px; }
        .reportaje-meta { font-size: 0.9em; color: #888; border-top: 1px solid #eee; padding-top: 10px; }
        .no-reportajes { text-align: center; color: #666; font-style: italic; padding: 40px; }
    </style>
</head>
<body>
    <header class="main-header">
        <a href="../../Homepage.html" class="logo-link">
            <img src="../../cer-logo.png" alt="CER Logo" class="logo">
        </a>
        <div class="header-buttons">
            <button class="create-btn">CREATE</button>
            <button class="login-btn">LOGIN</button>
        </div>
    </header>
    <main class="reportajes-container">
        <div class="reportajes-header">
            <h1>Reportajes IRL Events - ${countryName}</h1>
            <p>Historias y reportajes de eventos presenciales en ${countryName}</p>
        </div>
        <div class="reportajes-grid" id="reportajesGrid">
            <div class="no-reportajes">
                <p>No hay reportajes disponibles para ${countryName} aún.</p>
                <p><a href="../../reporte-por-iniciativa-propia.html">¿Quieres crear el primero?</a></p>
            </div>
        </div>
    </main>
    <script>
        function loadReportajes() {
            const reportajes = JSON.parse(localStorage.getItem('reportajes') || '[]');
            const countryReportajes = reportajes.filter(r => r.type === 'irl' && r.subtype === '${countryCode.toLowerCase()}');
            const grid = document.getElementById('reportajesGrid');
            if (countryReportajes.length === 0) {
                grid.innerHTML = \`<div class="no-reportajes"><p>No hay reportajes disponibles para ${countryName} aún.</p><p><a href="../../reporte-por-iniciativa-propia.html">¿Quieres crear el primero?</a></p></div>\`;
                return;
            }
            grid.innerHTML = countryReportajes.map(reportaje => \`<div class="reportaje-card"><div class="reportaje-title">\${reportaje.title}</div><div class="reportaje-content">\${reportaje.content}</div><div class="reportaje-meta"><strong>Tipo:</strong> \${reportaje.typeLabel} | <strong>País:</strong> \${reportaje.subtypeLabel} | <strong>Fecha:</strong> \${new Date(reportaje.timestamp).toLocaleDateString()}</div></div>\`).join('');
        }
        document.addEventListener('DOMContentLoaded', loadReportajes);
    </script>
</body>
</html>`;
    }

    // Función para generar página de idioma
    function generateLanguagePage(langCode, langName) {
        return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reportajes Digital Events - ${langName} - CER</title>
    <link rel="stylesheet" href="../../report-events.css">
    <link rel="stylesheet" href="../../blog-editor.css">
    <style>
        .reportajes-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .reportajes-header { text-align: center; margin-bottom: 40px; }
        .reportajes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .reportaje-card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .reportaje-title { font-size: 1.2em; font-weight: bold; margin-bottom: 10px; color: #333; }
        .reportaje-content { color: #666; line-height: 1.6; margin-bottom: 15px; }
        .reportaje-meta { font-size: 0.9em; color: #888; border-top: 1px solid #eee; padding-top: 10px; }
        .no-reportajes { text-align: center; color: #666; font-style: italic; padding: 40px; }
    </style>
</head>
<body>
    <header class="main-header">
        <a href="../../Homepage.html" class="logo-link">
            <img src="../../cer-logo.png" alt="CER Logo" class="logo">
        </a>
        <div class="header-buttons">
            <button class="create-btn">CREATE</button>
            <button class="login-btn">LOGIN</button>
        </div>
    </header>
    <main class="reportajes-container">
        <div class="reportajes-header">
            <h1>Reportajes Digital Events - ${langName}</h1>
            <p>Historias y reportajes de eventos digitales en ${langName}</p>
        </div>
        <div class="reportajes-grid" id="reportajesGrid">
            <div class="no-reportajes">
                <p>No hay reportajes disponibles en ${langName} aún.</p>
                <p><a href="../../reporte-por-iniciativa-propia.html">¿Quieres crear el primero?</a></p>
            </div>
        </div>
    </main>
    <script>
        function loadReportajes() {
            const reportajes = JSON.parse(localStorage.getItem('reportajes') || '[]');
            const languageReportajes = reportajes.filter(r => r.type === 'digital' && r.subtype === '${langCode}');
            const grid = document.getElementById('reportajesGrid');
            if (languageReportajes.length === 0) {
                grid.innerHTML = \`<div class="no-reportajes"><p>No hay reportajes disponibles en ${langName} aún.</p><p><a href="../../reporte-por-iniciativa-propia.html">¿Quieres crear el primero?</a></p></div>\`;
                return;
            }
            grid.innerHTML = languageReportajes.map(reportaje => \`<div class="reportaje-card"><div class="reportaje-title">\${reportaje.title}</div><div class="reportaje-content">\${reportaje.content}</div><div class="reportaje-meta"><strong>Tipo:</strong> \${reportaje.typeLabel} | <strong>Idioma:</strong> \${reportaje.subtypeLabel} | <strong>Fecha:</strong> \${new Date(reportaje.timestamp).toLocaleDateString()}</div></div>\`).join('');
        }
        document.addEventListener('DOMContentLoaded', loadReportajes);
    </script>
</body>
</html>`;
    }

    // Función para generar todas las páginas necesarias
    function generateAllNeededPages() {
        console.log('Generando páginas necesarias...');
        
        // Países más comunes
        const countries = [
            { code: 'mx', name: 'México' },
            { code: 'us', name: 'Estados Unidos' },
            { code: 'es', name: 'España' },
            { code: 'ar', name: 'Argentina' },
            { code: 'co', name: 'Colombia' },
            { code: 'br', name: 'Brasil' },
            { code: 'fr', name: 'Francia' },
            { code: 'de', name: 'Alemania' },
            { code: 'gb', name: 'Reino Unido' },
            { code: 'ca', name: 'Canadá' },
            { code: 'ru', name: 'Rusia' },
            { code: 'cn', name: 'China' },
            { code: 'jp', name: 'Japón' },
            { code: 'kr', name: 'Corea del Sur' },
            { code: 'in', name: 'India' }
        ];

        // Idiomas más comunes
        const languages = [
            { code: 'es', name: 'Español' },
            { code: 'en', name: 'Inglés' },
            { code: 'fr', name: 'Francés' },
            { code: 'de', name: 'Alemán' },
            { code: 'pt', name: 'Portugués' },
            { code: 'it', name: 'Italiano' },
            { code: 'ja', name: 'Japonés' },
            { code: 'ko', name: 'Coreano' },
            { code: 'zh', name: 'Chino' },
            { code: 'ru', name: 'Ruso' },
            { code: 'ar', name: 'Árabe' },
            { code: 'hi', name: 'Hindi' },
            { code: 'nl', name: 'Neerlandés' },
            { code: 'sv', name: 'Sueco' },
            { code: 'no', name: 'Noruego' }
        ];

        // Generar páginas de países
        countries.forEach(country => {
            const pageContent = generateCountryPage(country.code, country.name);
            console.log(`Página generada para país: ${country.name} (${country.code})`);
        });

        // Generar páginas de idiomas
        languages.forEach(language => {
            const pageContent = generateLanguagePage(language.code, language.name);
            console.log(`Página generada para idioma: ${language.name} (${language.code})`);
        });

        console.log('Generación completada. Se generaron', countries.length + languages.length, 'páginas.');
    }

    // Ejecutar generación
    generateAllNeededPages();
});
