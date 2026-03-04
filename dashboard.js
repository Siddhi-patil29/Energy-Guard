// ===== DASHBOARD JAVASCRIPT =====

// ===== DATETIME =====
function updateDateTime() {
    const el = document.getElementById('dashDateTime');
    if (!el) return;
    const now = new Date();
    el.textContent = now.toLocaleString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
}
updateDateTime();
setInterval(updateDateTime, 1000);

// ===== CHART.JS DEFAULT STYLING =====
Chart.defaults.color = '#8ab5c8';
Chart.defaults.borderColor = 'rgba(0,212,170,0.1)';
Chart.defaults.font.family = "'Inter', 'Segoe UI', sans-serif";

// ===== POWER CONSUMPTION LINE CHART (REAL-TIME) =====
const powerCtx = document.getElementById('powerChart').getContext('2d');
const POINTS = 40;

function generateInitialData(base, variance) {
    return Array.from({ length: POINTS }, () => base + (Math.random() - 0.5) * variance);
}

const powerLabels = Array.from({ length: POINTS }, (_, i) => {
    const now = new Date();
    now.setSeconds(now.getSeconds() - (POINTS - i));
    return now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
});

const activeData = generateInitialData(3.8, 1.2);
const idleData = generateInitialData(0.9, 0.4);

const powerChart = new Chart(powerCtx, {
    type: 'line',
    data: {
        labels: powerLabels,
        datasets: [
            {
                label: 'Active Load (kW)',
                data: activeData,
                borderColor: '#00d4aa',
                backgroundColor: 'rgba(0,212,170,0.08)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 4,
            },
            {
                label: 'Idle Load (kW)',
                data: idleData,
                borderColor: '#0a84ff',
                backgroundColor: 'rgba(10,132,255,0.06)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 4,
            }
        ]
    },
    options: {
        responsive: true,
        animation: { duration: 300 },
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#0a1929',
                borderColor: 'rgba(0,212,170,0.3)',
                borderWidth: 1,
                callbacks: {
                    label: ctx => ` ${ctx.dataset.label}: ${ctx.raw.toFixed(2)} kW`
                }
            }
        },
        scales: {
            x: {
                ticks: { maxTicksLimit: 8, font: { size: 10 } },
                grid: { color: 'rgba(0,212,170,0.05)' }
            },
            y: {
                min: 0,
                suggestedMax: 6,
                ticks: { callback: v => v + ' kW', font: { size: 10 } },
                grid: { color: 'rgba(0,212,170,0.05)' }
            }
        }
    }
});

// Live update power chart every 1.5s
setInterval(() => {
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    powerChart.data.labels.shift();
    powerChart.data.labels.push(now);

    const newActive = Math.max(0.5, activeData[activeData.length - 1] + (Math.random() - 0.5) * 0.5);
    const newIdle = Math.max(0, idleData[idleData.length - 1] + (Math.random() - 0.5) * 0.2);

    powerChart.data.datasets[0].data.shift();
    powerChart.data.datasets[0].data.push(newActive);
    powerChart.data.datasets[1].data.shift();
    powerChart.data.datasets[1].data.push(newIdle);

    powerChart.update('none');

    // Update KPI
    document.getElementById('kpiPower').textContent = (newActive + newIdle).toFixed(2) + ' kW';
}, 1500);

// ===== DONUT CHART =====
const donutCtx = document.getElementById('donutChart').getContext('2d');
const donutChart = new Chart(donutCtx, {
    type: 'doughnut',
    data: {
        labels: ['Active', 'Idle', 'Off'],
        datasets: [{
            data: [8, 3, 4],
            backgroundColor: ['rgba(0,212,170,0.8)', 'rgba(255,165,0,0.8)', 'rgba(100,100,120,0.6)'],
            borderColor: ['#00d4aa', '#ffa500', '#555'],
            borderWidth: 2,
            hoverOffset: 6
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '72%',
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#0a1929',
                borderColor: 'rgba(0,212,170,0.3)',
                borderWidth: 1,
                callbacks: {
                    label: ctx => ` ${ctx.label}: ${ctx.raw} devices`
                }
            }
        }
    }
});

// Animate donut data every 8s
setInterval(() => {
    const idle = Math.floor(Math.random() * 5) + 1;
    const active = 15 - idle - Math.floor(Math.random() * 3);
    const off = 15 - idle - active;
    donutChart.data.datasets[0].data = [active, idle, off];
    donutChart.update();
    document.getElementById('kpiIdle').textContent = idle;
    document.getElementById('kpiAlerts').textContent = Math.ceil(idle * 1.2);
    document.getElementById('alertCount').textContent = Math.ceil(idle * 1.2);
}, 8000);

// ===== WEEKLY BAR CHART =====
const weeklyCtx = document.getElementById('weeklyChart').getContext('2d');
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const weeklyChart = new Chart(weeklyCtx, {
    type: 'bar',
    data: {
        labels: days,
        datasets: [
            {
                label: 'Active (kWh)',
                data: [42, 38, 45, 50, 47, 30, 28],
                backgroundColor: 'rgba(0,212,170,0.7)',
                borderColor: '#00d4aa',
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false,
            },
            {
                label: 'Idle (kWh)',
                data: [12, 9, 15, 11, 8, 5, 4],
                backgroundColor: 'rgba(255,165,0,0.7)',
                borderColor: '#ffa500',
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false,
            }
        ]
    },
    options: {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#0a1929',
                borderColor: 'rgba(0,212,170,0.3)',
                borderWidth: 1,
                callbacks: {
                    label: ctx => ` ${ctx.dataset.label}: ${ctx.raw} kWh`
                }
            }
        },
        scales: {
            x: {
                grid: { color: 'rgba(0,212,170,0.05)' },
                ticks: { font: { size: 11 } }
            },
            y: {
                grid: { color: 'rgba(0,212,170,0.05)' },
                ticks: { callback: v => v + ' kWh', font: { size: 10 } }
            }
        }
    }
});

// ===== KPI LIVE UPDATES =====
const savingsList = [105, 112, 120, 134, 118, 142, 128];
let savIdx = 0;
setInterval(() => {
    savIdx = (savIdx + 1) % savingsList.length;
    document.getElementById('kpiSavings').textContent = '₹ ' + savingsList[savIdx];
}, 5000);

// ===== UTILITY ACTIONS =====
function exportData() {
    const rows = [
        ['Timestamp', 'Active kW', 'Idle kW', 'Total kW'],
        ...powerChart.data.labels.map((l, i) => [
            l,
            powerChart.data.datasets[0].data[i].toFixed(2),
            powerChart.data.datasets[1].data[i].toFixed(2),
            (powerChart.data.datasets[0].data[i] + powerChart.data.datasets[1].data[i]).toFixed(2)
        ])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'energyguard_data.csv';
    a.click();
    URL.revokeObjectURL(url);
}

function runDetection() {
    const btn = event.target;
    btn.textContent = '⏳ Detecting...';
    btn.disabled = true;
    setTimeout(() => {
        // Add new alert
        const alertList = document.getElementById('alertList');
        const newAlert = document.createElement('div');
        newAlert.className = 'alert-item warning';
        newAlert.innerHTML = `
      <div class="alert-icon-wrap">⚠️</div>
      <div class="alert-content">
        <div class="alert-title">ML Detection Complete — 2 New Idle Patterns Found</div>
        <div class="alert-time">AI Engine · Just now · Recommend turning off AC in Room 2</div>
      </div>`;
        alertList.prepend(newAlert);
        btn.textContent = '✅ Detection Done';
        setTimeout(() => {
            btn.textContent = '🤖 Run Detection';
            btn.disabled = false;
        }, 3000);
    }, 2000);
}

function clearAlerts() {
    const list = document.getElementById('alertList');
    list.innerHTML = '<div style="text-align:center; padding:24px; color:var(--text-muted); font-size:0.85rem;">✅ All alerts cleared</div>';
    document.getElementById('kpiAlerts').textContent = '0';
    document.getElementById('alertCount').textContent = '0';
}

// ===== SMART ENERGY WASTE DETECTION =====
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const EXAMPLE_INPUT = '210,195,225,240,260,275,290,285,250,230,220,200';

function calcWaste(kwh) {
    // Step 1: ÷ 10
    const step1 = kwh / 10;
    // Step 2: ÷ 30
    const step2 = step1 / 30;
    // Step 3: + 15 kWh
    const step3 = step2 + 15;
    // Step 4: ÷ 5
    const result = step3 / 5;
    return { step1, step2, step3, result };
}

function wasteLevel(result) {
    if (result < 3.02) return { label: 'Low Waste', color: '#00d4aa', emoji: '✅' };
    if (result < 3.05) return { label: 'Moderate Waste', color: '#ffa500', emoji: '⚠️' };
    return { label: 'High Waste', color: '#ff4f5b', emoji: '🚨' };
}

function runWasteDetection() {
    const raw = document.getElementById('sewdInput').value.trim();
    const errEl = document.getElementById('sewdError');
    const resultsEl = document.getElementById('sewdResults');
    const btn = document.getElementById('sewdCalcBtn');

    errEl.style.display = 'none';
    resultsEl.style.display = 'none';

    // Validate
    const parts = raw.split(',').map(v => v.trim()).filter(v => v !== '');
    if (parts.length !== 12) {
        errEl.textContent = `❌ Please enter exactly 12 values. You entered ${parts.length}.`;
        errEl.style.display = 'block';
        return;
    }
    const values = parts.map(Number);
    if (values.some(v => isNaN(v) || v < 0)) {
        errEl.textContent = '❌ All values must be positive numbers in kWh.';
        errEl.style.display = 'block';
        return;
    }

    // Animate button
    btn.textContent = '⏳ Analysing...';
    btn.disabled = true;

    setTimeout(() => {
        // Build month cards
        const grid = document.getElementById('sewdGrid');
        grid.innerHTML = '';
        let totalResult = 0;

        values.forEach((kwh, i) => {
            const c = calcWaste(kwh);
            const lvl = wasteLevel(c.result);
            totalResult += c.result;

            const card = document.createElement('div');
            card.className = 'sewd-month-card';
            card.style.animationDelay = `${i * 55}ms`;
            card.innerHTML = `
                <div class="sewd-month-name">${MONTHS[i]}</div>
                <div class="sewd-month-kwh">${kwh} kWh</div>
                <div class="sewd-month-steps">
                    <span>÷10 = <b>${c.step1.toFixed(4)}</b></span>
                    <span>÷30 = <b>${c.step2.toFixed(6)}</b></span>
                    <span>+15 = <b>${c.step3.toFixed(4)}</b></span>
                </div>
                <div class="sewd-waste-result" style="color:${lvl.color};">
                    ${lvl.emoji} ${c.result.toFixed(4)} kWh
                </div>
                <div class="sewd-waste-level" style="color:${lvl.color}; border-color:${lvl.color}22; background:${lvl.color}11">
                    ${lvl.label}
                </div>`;
            grid.appendChild(card);
        });

        // Summary
        const avg = totalResult / 12;
        const maxMonth = values.indexOf(Math.max(...values));
        const minMonth = values.indexOf(Math.min(...values));
        const summaryLvl = wasteLevel(avg);

        document.getElementById('sewdSummary').innerHTML = `
            <div class="sewd-summary-inner">
                <div class="sewd-sum-item">
                    <div class="sewd-sum-val">${totalResult.toFixed(4)}</div>
                    <div class="sewd-sum-label">Total Annual Waste Score</div>
                </div>
                <div class="sewd-sum-item">
                    <div class="sewd-sum-val" style="color:${summaryLvl.color}">${avg.toFixed(4)}</div>
                    <div class="sewd-sum-label">Monthly Avg Waste Score</div>
                </div>
                <div class="sewd-sum-item">
                    <div class="sewd-sum-val" style="color:#ff4f5b">${MONTHS[maxMonth]}</div>
                    <div class="sewd-sum-label">Highest Consumption Month</div>
                </div>
                <div class="sewd-sum-item">
                    <div class="sewd-sum-val" style="color:#00d4aa">${MONTHS[minMonth]}</div>
                    <div class="sewd-sum-label">Lowest Consumption Month</div>
                </div>
                <div class="sewd-sum-item sewd-sum-badge-wrap">
                    <div class="sewd-sum-badge" style="background:${summaryLvl.color}22; border:1px solid ${summaryLvl.color}44; color:${summaryLvl.color}">${summaryLvl.emoji} Overall: ${summaryLvl.label}</div>
                </div>
            </div>`;

        resultsEl.style.display = 'block';
        btn.textContent = '✅ Done! Re-Analyse';
        btn.disabled = false;

        // Save data to Firebase
        if (window.saveEnergyDataToFirebase) {
            window.saveEnergyDataToFirebase(values, avg);
        }

        // Scroll into results smoothly
        resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 900);
}

function loadSewdExample() {
    document.getElementById('sewdInput').value = EXAMPLE_INPUT;
    document.getElementById('sewdError').style.display = 'none';
}

function clearSewdResults() {
    document.getElementById('sewdInput').value = '';
    document.getElementById('sewdError').style.display = 'none';
    document.getElementById('sewdResults').style.display = 'none';
    document.getElementById('sewdCalcBtn').textContent = '⚡ Analyse Waste';
}

// ===== SITE SETTINGS =====
function saveSiteSettings() {
    const email = document.getElementById('editContactEmail').value;
    const phone = document.getElementById('editContactPhone').value;
    const repoSiddhi = document.getElementById('editRepoSiddhi').value;
    const repoHarish = document.getElementById('editRepoHarish').value;

    if (window.saveSiteSettingsToFirebase) {
        window.saveSiteSettingsToFirebase({ email, phone, repoSiddhi, repoHarish });
    }

    // In a real full-stack app, we would make an API call here (e.g., PUT /api/settings)
    // fetch('/api/settings', { method: 'PUT', body: JSON.stringify({ email, phone, ... }) })

    const msg = document.getElementById('settingsSaveMessage');
    msg.style.display = 'block';

    setTimeout(() => {
        msg.style.display = 'none';
    }, 3000);
}
