// Configuration data
const CONFIG = {
  services: {
    'cloud-storage': {
      name: 'Cloud Speicher',
      software: 'Nextcloud',
      icon: 'fas fa-cloud',
      description: 'Nextcloud bietet eine sichere, lokal gehostete Lösung für Datenspeicherung und Kollaboration mit umfassenden B2B-Features wie Versionierung, Freigabeoptionen und Echtzeit-Bearbeitung.',
      repo: 'https://github.com/nextcloud/server',
      features: ['Datei-Synchronisation', 'Kollaborative Bearbeitung', 'Kalender & Kontakte', 'Mobile Apps']
    },
    'password-manager': {
      name: 'Passwort-Manager',
      software: 'Bitwarden',
      icon: 'fas fa-lock',
      description: 'Bitwarden bietet eine zentrale Zugangsverwaltung mit Unternehmensfunktionen wie SSO, Gruppenrichtlinien, Notfallzugriff und erweiterten Berechtigungen.',
      repo: 'https://github.com/bitwarden/server',
      features: ['Passwort-Sharing', 'Zwei-Faktor-Authentifizierung', 'Audit-Logs', 'API-Zugriff']
    },
    'document-management': {
      name: 'Dokumenten-Management',
      software: 'Paperless-ngx',
      icon: 'fas fa-file-alt',
      description: 'Paperless-ngx ist ein modernes Dokumentenmanagementsystem mit automatischer OCR-Erkennung, Tagging und leistungsstarker Suchfunktion für die effiziente Verwaltung von Geschäftsdokumenten.',
      repo: 'https://github.com/paperless-ngx/paperless-ngx',
      features: ['Automatische OCR', 'Metadaten-Extraktion', 'Volltextsuche', 'Workflow-Automatisierung']
    },
    'vpn-services': {
      name: 'Sichere Kommunikation',
      software: 'Matrix + Element',
      icon: 'fas fa-comments',
      description: 'Matrix bietet eine sichere, dezentrale Kommunikationsplattform für Unternehmen mit Ende-zu-Ende-Verschlüsselung, Videokonferenzen und nahtloser Integration in bestehende Systeme.',
      repo: 'https://github.com/matrix-org',
      features: ['Verschlüsselte Chats', 'Videokonferenzen', 'Datei-Sharing', 'API-Integration']
    },
    'backup-solution': {
      name: 'Backup-Lösung',
      software: 'Restic',
      icon: 'fas fa-database',
      description: 'Restic ermöglicht inkrementelle, verschlüsselte Backups mit einfacher Wiederherstellung und Cloud- sowie Offsite-Zielen.',
      repo: 'https://github.com/restic/restic',
      features: ['Deduplizierung', 'Verschlüsselung', 'Zeitpläne', 'Unterstützung für viele Speicherziele']
    },
    'monitoring-tools': {
      name: 'Monitoring & Analyse',
      software: 'Prometheus + Grafana',
      icon: 'fas fa-chart-area',
      description: 'Umfassendes Monitoring mit Metriken, Alarmierung und anpassbaren Dashboards zur Visualisierung der Infrastruktur.',
      repo: 'https://github.com/prometheus/prometheus',
      features: ['Metriken sammeln', 'Alertmanager', 'Grafische Dashboards', 'Exporters für viele Dienste']
    }
  },
  hardware: {
    starter: {
      name: "Starter",
      target: "5-20 Nutzer",
      price: 899,
      description: "Kompakter Mini-Server mit 1TB NVMe SSD, 16GB RAM, Intel i5 Prozessor",
      maintenance: 29,
      maxUsers: 20,
      maxStorage: 1000,
      features: ['Automatische Backups', 'Remote-Management', 'Basis-Monitoring']
    },
    pro: {
      name: "Business",
      target: "20-100 Nutzer",
      price: 1799,
      description: "Leistungsstarker Tower-Server mit 4TB NVMe SSD, 32GB RAM, Intel i7 Prozessor",
      maintenance: 49,
      maxUsers: 100,
      maxStorage: 4000,
      features: ['Redundante Speicherung', 'Erweiterte Sicherheit', 'Performance-Monitoring', 'Automatische Updates']
    },
    enterprise: {
      name: "Enterprise",
      target: "100+ Nutzer",
      price: 3499,
      description: "Hochleistungs-Rack-Server mit RAID-System, 8TB SSD, 64GB RAM, redundante Netzteile",
      maintenance: 99,
      maxUsers: 500,
      maxStorage: 8000,
      features: ['Hochverfügbarkeit', 'Load-Balancing', 'Disaster Recovery', 'SLA mit 99,9% Uptime']
    },
    ultimate: {
      name: "Ultimate",
      target: "500+ Nutzer",
      price: 6999,
      description: "Clusterfähiger Rack-Server mit 16TB NVMe, 128GB RAM und redundantem Netzwerk",
      maintenance: 199,
      maxUsers: 2000,
      maxStorage: 16000,
      features: ['Cluster-Unterstützung', 'Hochverfügbare Storage-Pools', 'Erweiterte Service-SLAs']
    }
  },
  addOns: {
    backup: { name: "Backup & Recovery-Lösung", price: 599, monthly: 0 },
    storage: { name: "Zusätzlicher Speicher (2TB)", price: 449, monthly: 0 },
    monitoring: { name: "24/7 Monitoring & Support", price: 0, monthly: 15 },
    setup: { name: "Professionelle Einrichtung", price: 349, monthly: 0 },
    security: { name: "Erweiterte Sicherheitsanalyse", price: 0, monthly: 25 },
    training: { name: "Mitarbeiterschulung", price: 499, monthly: 0 }
  }
};

// Main Application Class
class StackyApp {
  constructor() {
    this.selectedServices = new Set();
    this.currentScreen = 'welcome';
    this.config = {};
    this.costChart = null;
    this.init();
  }

  init() {
    this.updateProgress();
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        themeToggle.innerHTML = next === 'dark'
          ? '<i class="fas fa-sun" aria-hidden="true"></i>'
          : '<i class="fas fa-moon" aria-hidden="true"></i>';
      });
      themeToggle.innerHTML = savedTheme === 'dark'
        ? '<i class="fas fa-sun" aria-hidden="true"></i>'
        : '<i class="fas fa-moon" aria-hidden="true"></i>';
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.currentScreen !== 'welcome') {
        this.goBack();
      }
    });
  }

  showScreen(screenName) {
    const currentScreenEl = document.getElementById(`${this.currentScreen}-screen`);
    const newScreenEl = document.getElementById(`${screenName}-screen`);
    
    if (!newScreenEl) return;

    // Validation before proceeding
    if (!this.validateScreenTransition(this.currentScreen, screenName)) {
      return;
    }

    // Hide current screen
    currentScreenEl.classList.remove('active');
    
    setTimeout(() => {
      currentScreenEl.style.display = 'none';
      newScreenEl.style.display = 'block';
      newScreenEl.classList.add('active', 'entering');
      
      setTimeout(() => {
        newScreenEl.classList.remove('entering');
      }, 600);
      
      this.currentScreen = screenName;
      this.updateProgress();
      
      // Focus management
      this.manageFocus(screenName);
      
      // Screen-specific actions
      if (screenName === 'suggestions') {
        this.generateSuggestions();
      } else if (screenName === 'config') {
        // Update data type field visibility based on selected services
        this.updateDataTypeVisibility();
      }
    }, 300);
  }

  validateScreenTransition(from, to) {
    if (from === 'selection' && to === 'config') {
      if (this.selectedServices.size === 0) {
        this.showError('selection-error', 'Bitte wählen Sie mindestens eine Option aus.');
        return false;
      }
      this.hideError('selection-error');
    }
    return true;
  }

  manageFocus(screenName) {
    setTimeout(() => {
      const focusTarget = document.querySelector(`#${screenName}-screen .title`);
      if (focusTarget) {
        focusTarget.setAttribute('tabindex', '-1');
        focusTarget.focus();
      }
    }, 100);
  }

  toggleService(element) {
    const service = element.dataset.service;
    const isSelected = element.classList.contains('selected');
    
    if (isSelected) {
      element.classList.remove('selected');
      element.setAttribute('aria-pressed', 'false');
      this.selectedServices.delete(service);
    } else {
      element.classList.add('selected');
      element.setAttribute('aria-pressed', 'true');
      this.selectedServices.add(service);
    }

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    // Update data type field visibility if we're on the config screen
    if (this.currentScreen === 'config') {
      this.updateDataTypeVisibility();
    }
  }
  
  updateDataTypeVisibility() {
    // This will be called when services are toggled or when entering the config screen
    const needsDataType = this.selectedServices.has('cloud-storage') ||
                          this.selectedServices.has('document-management');
    
    const dataTypeGroup = document.getElementById('data-type-group');
    if (dataTypeGroup) {
      dataTypeGroup.style.display = needsDataType ? 'block' : 'none';
      
      // Update required attribute
      const dataTypeSelect = document.getElementById('data-type');
      if (dataTypeSelect) {
        dataTypeSelect.required = needsDataType;
      }
    }
  }

  handleKeyDown(event, element) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleService(element);
    }
  }

  handleConfigSubmit(event) {
    event.preventDefault();
    
    const config = {
      userCount: parseInt(document.getElementById('user-count').value),
      accessType: document.getElementById('access-type').value,
      securityLevel: document.getElementById('security-level').value
    };
    
    // Only include dataType if relevant services are selected
    const needsDataType = this.selectedServices.has('cloud-storage') ||
                          this.selectedServices.has('document-management');
    
    if (needsDataType) {
      config.dataType = document.getElementById('data-type').value;
    } else {
      config.dataType = 'mixed'; // Default value if not applicable
    }

    if (this.validateConfig(config)) {
      this.config = config;
      this.showScreen('suggestions');
    }
  }

  validateConfig(config) {
    const errors = [];

    if (!config.userCount || config.userCount < 5 || config.userCount > 1000) {
      errors.push('Nutzeranzahl muss zwischen 5 und 1000 liegen');
    }

    // Only validate dataType if relevant services are selected
    const needsDataType = this.selectedServices.has('cloud-storage') ||
                          this.selectedServices.has('document-management');
    
    if (needsDataType && !config.dataType) {
      errors.push('Bitte wählen Sie einen Datentyp aus');
    }

    if (!config.accessType) {
      errors.push('Bitte wählen Sie einen Zugriffstyp aus');
    }

    if (!config.securityLevel) {
      errors.push('Bitte wählen Sie ein Sicherheitslevel aus');
    }

    if (errors.length > 0) {
      alert('Bitte korrigieren Sie folgende Eingaben:\n\n' + errors.join('\n'));
      return false;
    }

    return true;
  }

  generateSuggestions() {
    const container = document.getElementById('suggestions-container');
    container.innerHTML = '';

    // Generate software suggestions
    this.selectedServices.forEach(service => {
      const serviceConfig = CONFIG.services[service];
      if (serviceConfig) {
        container.appendChild(this.createSoftwareSuggestion(serviceConfig));
      }
    });

    // Generate hardware recommendation
    container.appendChild(this.createHardwareRecommendation());

    // Generate cost calculator
    container.appendChild(this.createCostCalculator());

    // Generate CTA buttons
    container.appendChild(this.createCTAButtons());
  }

  createSoftwareSuggestion(serviceConfig) {
    const template = document.getElementById('software-suggestion-template');
    const element = template.content.cloneNode(true);
    
    element.querySelector('.icon').className = serviceConfig.icon;
    element.querySelector('.title').textContent = `${serviceConfig.name}: ${serviceConfig.software}`;
    element.querySelector('.description').textContent = serviceConfig.description;
    element.querySelector('.repo-link').href = serviceConfig.repo;
    
    // Add features list
    if (serviceConfig.features && serviceConfig.features.length > 0) {
      const featuresDiv = document.createElement('div');
      featuresDiv.className = 'features-list';
      featuresDiv.innerHTML = `
        <p><strong>Hauptfunktionen:</strong></p>
        <ul style="margin-top: 8px; padding-left: 20px;">
          ${serviceConfig.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
      `;
      element.querySelector('.description').after(featuresDiv);
    }
    
    return element;
  }

  createHardwareRecommendation() {
    const { userCount, dataType } = this.config;
    
    // Calculate storage requirements
    const storageMultipliers = {
      documents: 5,
      databases: 20,
      development: 10,
      mixed: 15
    };
    
    const requiredStorage = userCount * (storageMultipliers[dataType] || 15);
    
    // Select appropriate hardware package
    let selectedPackage = CONFIG.hardware.starter;
    if (userCount > 15 || requiredStorage > 1000) {
      selectedPackage = CONFIG.hardware.pro;
    }
    if (userCount > 75 || requiredStorage > 4000) {
      selectedPackage = CONFIG.hardware.enterprise;
    }
    if (userCount > 500 || requiredStorage > 8000) {
      selectedPackage = CONFIG.hardware.ultimate;
    }

    const div = document.createElement('div');
    div.className = 'hardware-recommendation';
    div.innerHTML = `
      <h3><i class="fas fa-server" aria-hidden="true"></i> Empfohlene Hardware</h3>
      <div class="result-highlight">
        <p><strong>Paket:</strong> ${selectedPackage.name}</p>
        <p><strong>Zielgruppe:</strong> ${selectedPackage.target}</p>
        <p><strong>Beschreibung:</strong> ${selectedPackage.description}</p>
        <p><strong>Benötigter Speicher:</strong> ca. ${requiredStorage} GB</p>
        <p><strong>Features:</strong></p>
        <ul style="margin-top: 8px; padding-left: 20px;">
          ${selectedPackage.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
      </div>
      <div style="margin-top: 20px;">
        <p><strong>Kosten:</strong></p>
        <ul style="list-style: none; padding: 0;">
          <li>📦 Hardware: €${selectedPackage.price.toLocaleString()}</li>
          <li>🔧 Einrichtung: €${CONFIG.addOns.setup.price}</li>
          <li>🛠️ Wartung: €${selectedPackage.maintenance}/Monat</li>
        </ul>
      </div>
      <div class="addon-options">
        <h4>Zusätzliche Optionen:</h4>
        <label>
          <input type="checkbox" data-addon="backup" onchange="app.updateCosts()">
          ${CONFIG.addOns.backup.name} (+€${CONFIG.addOns.backup.price})
        </label>
        <label>
          <input type="checkbox" data-addon="storage" onchange="app.updateCosts()">
          ${CONFIG.addOns.storage.name} (+€${CONFIG.addOns.storage.price})
        </label>
        <label>
          <input type="checkbox" data-addon="monitoring" onchange="app.updateCosts()">
          ${CONFIG.addOns.monitoring.name} (+€${CONFIG.addOns.monitoring.monthly}/Monat)
        </label>
        <label>
          <input type="checkbox" data-addon="security" onchange="app.updateCosts()">
          ${CONFIG.addOns.security.name} (+€${CONFIG.addOns.security.monthly}/Monat)
        </label>
        <label>
          <input type="checkbox" data-addon="training" onchange="app.updateCosts()">
          ${CONFIG.addOns.training.name} (+€${CONFIG.addOns.training.price})
        </label>
      </div>
      <div id="cost-summary" class="result-highlight" style="margin-top: 20px;">
        <p><strong>Gesamtkosten:</strong></p>
        <p>Einmalig: €${(selectedPackage.price + CONFIG.addOns.setup.price).toLocaleString()}</p>
        <p>Monatlich: €${selectedPackage.maintenance}</p>
      </div>
    `;

    this.selectedPackage = selectedPackage;
    return div;
  }

  createCostCalculator() {
    const div = document.createElement('div');
    div.className = 'amortization-calculator';
    div.innerHTML = `
      <h3><i class="fas fa-calculator" aria-hidden="true"></i> Amortisationsrechner</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px;">
        <div class="form-group">
          <label for="current-cloud-cost">Aktuelle Cloud-Kosten/Monat (€):</label>
          <input type="number" id="current-cloud-cost" min="0" step="0.01" placeholder="z.B. 150">
        </div>
        <div class="form-group">
          <label for="calculation-period">Berechnungszeitraum:</label>
          <select id="calculation-period">
            <option value="1">1 Jahr</option>
            <option value="2">2 Jahre</option>
            <option value="3" selected>3 Jahre</option>
            <option value="5">5 Jahre</option>
          </select>
        </div>
      </div>
      <button type="button" class="button" onclick="app.calculateAmortization()">
        <i class="fas fa-chart-line" aria-hidden="true"></i> Berechnen
      </button>
      <canvas id="cost-chart" style="max-width:400px;margin:20px auto;display:block;"></canvas>
      <div id="amortization-result"></div>
    `;
    return div;
  }

  createCTAButtons() {
    const div = document.createElement('div');
    div.innerHTML = `
      <div style="text-align: center; margin-top: 40px; padding: 32px; background: rgba(255, 255, 255, 0.05); border-radius: var(--radius);">
        <h3 style="font-size: 1.2rem;">Bereit für den nächsten Schritt?</h3>
        <p>Unsere Experten helfen Ihnen bei der Umsetzung Ihrer Self-Hosting-Lösung.</p>
        <div class="cta-buttons">
          <button class="button" onclick="app.requestQuote()">
            <i class="fas fa-file-alt" aria-hidden="true"></i><span>Angebot anfordern</span>
          </button>
          <button class="button" onclick="app.bookConsultation()">
            <i class="fas fa-calendar" aria-hidden="true"></i><span>Beratung buchen</span>
          </button>
          <button class="button" onclick="app.downloadConfig()">
            <i class="fas fa-download" aria-hidden="true"></i><span>Konfiguration herunterladen</span>
          </button>
          <button class="button" onclick="app.downloadPDF()">
            <i class="fas fa-file-pdf" aria-hidden="true"></i><span>PDF speichern</span>
          </button>
        </div>
      </div>
    `;
    return div;
  }

  updateCosts() {
    const selectedAddons = Array.from(document.querySelectorAll('[data-addon]:checked'));
    let additionalCost = 0;
    let additionalMonthly = 0;

    selectedAddons.forEach(addon => {
      const addonKey = addon.dataset.addon;
      const addonConfig = CONFIG.addOns[addonKey];
      if (addonConfig) {
        additionalCost += addonConfig.price;
        additionalMonthly += addonConfig.monthly;
      }
    });

    const totalOneTime = this.selectedPackage.price + CONFIG.addOns.setup.price + additionalCost;
    const totalMonthly = this.selectedPackage.maintenance + additionalMonthly;

    const costSummary = document.getElementById('cost-summary');
    if (costSummary) {
      costSummary.innerHTML = `
        <p><strong>Gesamtkosten:</strong></p>
        <p>Einmalig: €${totalOneTime.toLocaleString()}</p>
        <p>Monatlich: €${totalMonthly}</p>
      `;
    }
  }

  calculateAmortization() {
    const cloudCost = parseFloat(document.getElementById('current-cloud-cost').value) || 0;
    const periodYears = parseInt(document.getElementById('calculation-period').value);
    
    if (cloudCost <= 0) {
      alert('Bitte geben Sie Ihre aktuellen Cloud-Kosten ein.');
      return;
    }

    const selectedAddons = Array.from(document.querySelectorAll('[data-addon]:checked'));
    let additionalCost = 0;
    let additionalMonthly = 0;

    selectedAddons.forEach(addon => {
      const addonKey = addon.dataset.addon;
      const addonConfig = CONFIG.addOns[addonKey];
      if (addonConfig) {
        additionalCost += addonConfig.price;
        additionalMonthly += addonConfig.monthly;
      }
    });

    const totalOneTime = this.selectedPackage.price + CONFIG.addOns.setup.price + additionalCost;
    const totalMonthly = this.selectedPackage.maintenance + additionalMonthly;
    const periodMonths = periodYears * 12;

    const selfHostingCost = totalOneTime + (totalMonthly * periodMonths);
    const cloudCostTotal = cloudCost * periodMonths;
    const savings = cloudCostTotal - selfHostingCost;
    
    let breakEvenMonths = 'Nie';
    if (cloudCost > totalMonthly) {
      breakEvenMonths = Math.ceil(totalOneTime / (cloudCost - totalMonthly));
    }

    const resultDiv = document.getElementById('amortization-result');
    const savingsPercentage = ((savings / cloudCostTotal) * 100).toFixed(1);
    
    resultDiv.innerHTML = `
      <div class="result-highlight" style="margin-top: 20px;">
        <h4>Kostenvergleich über ${periodYears} Jahr${periodYears > 1 ? 'e' : ''}:</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 16px 0;">
          <div>
            <p><strong>Self-Hosting:</strong></p>
            <p style="font-size: 1.2em; color: var(--accent);">€${selfHostingCost.toLocaleString()}</p>
          </div>
          <div>
            <p><strong>Cloud-Kosten:</strong></p>
            <p style="font-size: 1.2em;">€${cloudCostTotal.toLocaleString()}</p>
          </div>
          <div>
            <p><strong>Ersparnis:</strong></p>
            <p style="font-size: 1.2em; color: var(--success);">€${savings.toLocaleString()} (${savingsPercentage}%)</p>
          </div>
        </div>
        <p><strong>Break-Even:</strong> ${breakEvenMonths === 'Nie' ? 'Nicht erreicht' : `${breakEvenMonths} Monate`}</p>
        ${savings > 0 ? `
          <div style="background: rgba(76, 175, 80, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid var(--success); margin-top: 16px;">
            <p><strong>💰 Glückwunsch!</strong> Sie sparen ${savingsPercentage}% Ihrer IT-Kosten durch Self-Hosting!</p>
          </div>
        ` : `
          <div style="background: rgba(255, 152, 0, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid #ff9800; margin-top: 16px;">
            <p><strong>💡 Hinweis:</strong> Bei Ihren aktuellen Cloud-Kosten amortisiert sich die Investition erst nach längerer Zeit. Sprechen Sie mit unseren Beratern über optimierte Lösungen.</p>
          </div>
        `}
      </div>
    `;

    const ctx = document.getElementById('cost-chart');
    if (ctx) {
      const data = {
        labels: ['Self-Hosting', 'Cloud'],
        datasets: [{
          label: 'Kosten €',
          data: [selfHostingCost, cloudCostTotal],
          backgroundColor: ['var(--accent)', 'var(--secondary)']
        }]
      };
      if (this.costChart) {
        this.costChart.data = data;
        this.costChart.update();
      } else {
        this.costChart = new Chart(ctx, { type: 'bar', data });
      }
    }
  }

  updateProgress() {
    const screens = ['welcome', 'selection', 'config', 'suggestions'];
    const currentIndex = screens.indexOf(this.currentScreen);
    const progress = ((currentIndex + 1) / screens.length) * 100;
    
    document.getElementById('progress-fill').style.width = `${progress}%`;
  }

  showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
      errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  hideError(elementId) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
      errorEl.style.display = 'none';
    }
  }

  goBack() {
    const backMap = {
      selection: 'welcome',
      config: 'selection',
      suggestions: 'config'
    };
    
    const previousScreen = backMap[this.currentScreen];
    if (previousScreen) {
      this.showScreen(previousScreen);
    }
  }

  // CTA Actions
  requestQuote() {
    const config = {
      services: Array.from(this.selectedServices),
      userCount: this.config.userCount,
      dataType: this.config.dataType,
      accessType: this.config.accessType,
      securityLevel: this.config.securityLevel,
      hardware: this.selectedPackage.name,
      addons: Array.from(document.querySelectorAll('[data-addon]:checked')).map(el => el.dataset.addon)
    };

    alert('Ihre Anfrage wird verarbeitet. Wir melden uns innerhalb von 24 Stunden bei Ihnen!');
    console.log('Quote Request:', config);
  }

  bookConsultation() {
    window.open('https://calendly.com/stacky-consulting', '_blank');
  }

  downloadConfig() {
    const config = {
      services: Array.from(this.selectedServices),
      userCount: this.config.userCount,
      dataType: this.config.dataType,
      accessType: this.config.accessType,
      securityLevel: this.config.securityLevel,
      hardware: this.selectedPackage,
      addons: Array.from(document.querySelectorAll('[data-addon]:checked')).map(el => el.dataset.addon),
      timestamp: new Date().toISOString()
    };

    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `stacky-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;
    doc.setFontSize(16);
    doc.text('Stacky Konfiguration', 10, y);
    y += 10;
    doc.setFontSize(12);
    const lines = [
      `Dienste: ${Array.from(this.selectedServices).join(', ')}`,
      `Nutzer: ${this.config.userCount}`,
      `Datenart: ${this.config.dataType}`,
      `Zugriff: ${this.config.accessType}`,
      `Sicherheit: ${this.config.securityLevel}`,
      `Hardware: ${this.selectedPackage.name}`
    ];
    lines.forEach(line => {
      doc.text(line, 10, y);
      y += 7;
    });
    doc.save(`stacky-config-${new Date().toISOString().split('T')[0]}.pdf`);
  }
}

// Initialize application
const app = new StackyApp();

// Konami Code Easter Egg
let konamiCode = [];
const konamiSequence = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a'
]; // Up Up Down Down Left Right Left Right B A

document.addEventListener('keydown', (e) => {
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  konamiCode.push(key);
  if (konamiCode.length > konamiSequence.length) {
    konamiCode.shift();
  }

  if (
    konamiCode.length === konamiSequence.length &&
    konamiCode.every((code, index) => code === konamiSequence[index])
  ) {
    // Easter egg activated!
    document.body.style.filter = 'hue-rotate(180deg)';
    setTimeout(() => {
      document.body.style.filter = '';
    }, 3000);
    
    // Show special offer
    alert('🎉 Konami Code aktiviert! Sonderrabatt: 15% auf alle Stacky-Lösungen!');
  }
});

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('SW registered'))
      .catch(error => console.log('SW registration failed'));
  });
}
