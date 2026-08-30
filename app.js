/**
 * L'Illusion du Temps — Application de Spécialiste (Hero Canvas & Mobile Mode)
 * Loi de Paul Janet f(x) = 1/x et Intégrale de Vie V(A) = ln(A)
 * Explications au survol (Mouse Over / Touch) sur chaque année
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- State Variables ---
    let currentAge = 40;
    const maxAge = 100;
    let minAge = 1;
    let compareAge = 10;
    let activeTab = 'curve';
    let isDraggingCanvas = false;

    let hoveredAge = null;

    // --- DOM Elements ---
    const ageSlider = document.getElementById('age-slider');
    const ageDisplay = document.getElementById('age-display');
    const compareAgeInput = document.getElementById('compare-age-input');

    // Floating HUD Interactive Buttons
    const hudBadgePerceived = document.getElementById('hud-badge-perceived');
    const hudPerceivedPct = document.getElementById('hud-perceived-pct');
    const hudPerceivedIntegral = document.getElementById('hud-perceived-integral');

    const hudBadgeMidpoint = document.getElementById('hud-badge-midpoint');
    const hudMidpointVal = document.getElementById('hud-midpoint-val');

    const hudBadgeSpeed = document.getElementById('hud-badge-speed');
    const hudSpeedLabel = document.getElementById('hud-speed-label');
    const hudSpeedVal = document.getElementById('hud-speed-val');

    const popoverCompareAge = document.getElementById('popover-compare-age');
    const btnClosePopover = document.getElementById('btn-close-popover');
    const compareOptBtns = document.querySelectorAll('.compare-opt-btn');

    // Dynamic Card 3 Description
    const cardMidpointDesc = document.getElementById('card-midpoint-desc');

    // Canvas elements & Tooltip
    const curveCanvas = document.getElementById('curve-canvas');
    const lnCanvas = document.getElementById('ln-canvas');
    const canvasTooltip = document.getElementById('canvas-tooltip');
    const lifeBlocksGrid = document.getElementById('life-blocks-grid');

    // Hourglass elements
    const hgChronoVal = document.getElementById('hg-chrono-val');
    const hgPerceivedVal = document.getElementById('hg-perceived-val');
    const hgBarChrono = document.getElementById('hg-bar-chrono');
    const hgBarPerceived = document.getElementById('hg-bar-perceived');
    const spdCurAge = document.getElementById('spd-cur-age');
    const spdTargetAge = document.getElementById('spd-target-age');
    const spdResultText = document.getElementById('spd-result-text');

    // Buttons
    const presetButtons = document.querySelectorAll('.preset-btn');
    const tabCurveBtn = document.getElementById('btn-tab-curve');
    const tabLnBtn = document.getElementById('btn-tab-ln');
    const tabGridBtn = document.getElementById('btn-tab-grid');
    const tabHourglassBtn = document.getElementById('btn-tab-hourglass');

    const viewCurve = document.getElementById('view-curve');
    const viewLn = document.getElementById('view-ln');
    const viewGrid = document.getElementById('view-grid');
    const viewHourglass = document.getElementById('view-hourglass');

    // Theoretical Info Drawer
    const btnToggleInfo = document.getElementById('btn-toggle-info');
    const btnCloseInfo = document.getElementById('btn-close-info');
    const infoDrawer = document.getElementById('info-drawer');

    // --- Math Functions ---

    function fx(x) {
        if (x <= 0) return 1.0;
        return 1.0 / x;
    }

    function volumeIntegral(A) {
        if (A <= 1) return 0.0;
        return Math.log(A);
    }

    function perceivedPercentage(A, N = 100) {
        const total = volumeIntegral(N);
        if (total <= 0) return 0.0;
        const current = volumeIntegral(A);
        return Math.min(100.0, Math.max(0.0, (current / total) * 100.0));
    }

    function subjectiveMidpoint(N = 100) {
        return Math.sqrt(N);
    }

    function speedRatio(age, referenceAge = 10) {
        if (referenceAge <= 0 || age <= 0) return 1.0;
        return age / referenceAge;
    }

    function perceivedWeekDays(age, referenceAge = 10) {
        if (referenceAge <= 0 || age <= 0) return 7.0;
        return (7.0 * referenceAge) / age;
    }

    function updateSliderBackground(val) {
        if (!ageSlider) return;
        const min = parseInt(ageSlider.min, 10) || 1;
        const max = parseInt(ageSlider.max, 10) || 100;
        const pct = ((val - min) / (max - min)) * 100;
        ageSlider.style.background = `linear-gradient(to right, #7c3aed 0%, #6366f1 ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)`;
    }

    // --- App Update Logic ---

    function updateAll() {
        if (ageSlider) currentAge = parseInt(ageSlider.value, 10);
        if (compareAgeInput) compareAge = parseInt(compareAgeInput.value, 10) || 10;

        if (ageDisplay) ageDisplay.textContent = currentAge;
        updateSliderBackground(currentAge);

        const percPct = perceivedPercentage(currentAge, maxAge);
        const curVol = volumeIntegral(currentAge);
        const maxVol = volumeIntegral(maxAge);

        // Update Floating HUD Badges
        if (hudPerceivedPct) hudPerceivedPct.textContent = `${percPct.toFixed(1)}%`;
        if (hudPerceivedIntegral) hudPerceivedIntegral.textContent = `(ln ${currentAge} = ${curVol.toFixed(2)})`;

        const midpointAge = subjectiveMidpoint(maxAge);
        if (hudMidpointVal) hudMidpointVal.textContent = `${midpointAge.toFixed(1)} ans`;

        if (cardMidpointDesc) {
            cardMidpointDesc.innerHTML = `Pour une vie de <strong>${maxAge} ans</strong>, la moitié exacte (<strong>50%</strong>) de votre perception de vie est déjà vécue dès l'âge de <strong>${midpointAge.toFixed(1)} ans</strong> (calculé par √${maxAge}) !`;
        }

        const ratio = speedRatio(currentAge, compareAge);
        const days = perceivedWeekDays(currentAge, compareAge);
        const daysFormatted = days.toFixed(1).replace('.', ',');

        if (hudSpeedLabel) hudSpeedLabel.textContent = `Semaine vs ${compareAge}a :`;
        if (hudSpeedVal) hudSpeedVal.textContent = `${daysFormatted} j`;

        // Update Hourglass View
        if (hgChronoVal) hgChronoVal.textContent = `${currentAge} / ${maxAge} ans`;
        if (hgPerceivedVal) hgPerceivedVal.textContent = `${curVol.toFixed(2)} / ${maxVol.toFixed(2)} ln`;

        const chronoPct = (currentAge / maxAge) * 100.0;
        if (hgBarChrono) {
            hgBarChrono.style.width = `${chronoPct}%`;
            hgBarChrono.textContent = `${chronoPct.toFixed(1)}%`;
        }
        if (hgBarPerceived) {
            hgBarPerceived.style.width = `${percPct}%`;
            hgBarPerceived.textContent = `${percPct.toFixed(1)}%`;
        }

        if (spdCurAge) spdCurAge.textContent = currentAge;
        if (spdTargetAge) spdTargetAge.textContent = compareAge;
        const weekUnit = days >= 2.0 ? 'jours' : 'jour';
        if (spdResultText) spdResultText.textContent = `${daysFormatted} ${weekUnit}`;

        renderActiveView();
    }

    function renderActiveView() {
        if (activeTab === 'curve') {
            drawCurveCanvas();
        } else if (activeTab === 'ln') {
            drawLnCanvas();
        } else if (activeTab === 'grid') {
            renderLifeGrid();
        }
    }

    // --- CANVAS RENDERING WITH CLEAN ANNOTATIONS: f(x) = 1/x ---

    function drawCurveCanvas() {
        if (!curveCanvas) return;
        const ctx = curveCanvas.getContext('2d');
        const rect = curveCanvas.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;

        const dpr = window.devicePixelRatio || 1;
        curveCanvas.width = Math.floor(rect.width * dpr);
        curveCanvas.height = Math.floor(rect.height * dpr);
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = rect.height;
        const isMobile = width < 640;
        const margin = { 
            top: isMobile ? 45 : 60, 
            right: isMobile ? 25 : 60, 
            bottom: isMobile ? 50 : 65, 
            left: isMobile ? 50 : 75 
        };
        const graphW = Math.max(10, width - margin.left - margin.right);
        const graphH = Math.max(10, height - margin.top - margin.bottom);

        ctx.clearRect(0, 0, width, height);

        const yMax = 1.0;
        const xMax = maxAge;

        function mapX(x) {
            return margin.left + ((x - 1) / (xMax - 1)) * graphW;
        }

        function mapY(y) {
            return margin.top + graphH - (y / yMax) * graphH;
        }

        // 1. Gridlines
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#e2e8f0';
        ctx.fillStyle = '#64748b';
        ctx.font = `500 ${isMobile ? '10px' : '12px'} JetBrains Mono, sans-serif`;

        // X Axis Ticks & Lines
        const xStep = isMobile ? 20 : 10;
        for (let x = 1; x <= xMax; x += xStep) {
            const px = mapX(x);
            ctx.beginPath();
            ctx.moveTo(px, margin.top);
            ctx.lineTo(px, margin.top + graphH);
            ctx.stroke();

            ctx.textAlign = 'center';
            ctx.fillText(`${x}a`, px, margin.top + graphH + (isMobile ? 18 : 24));
        }

        // Y Axis Ticks & Lines
        const yTicks = [0, 0.25, 0.5, 0.75, 1.0];
        for (let y of yTicks) {
            const py = mapY(y);
            ctx.beginPath();
            ctx.moveTo(margin.left, py);
            ctx.lineTo(margin.left + graphW, py);
            ctx.stroke();

            ctx.textAlign = 'right';
            ctx.fillText((y * 100).toFixed(0) + '%', margin.left - 8, py + 4);
        }

        // 2. Shaded Area Under Curve
        ctx.beginPath();
        ctx.moveTo(mapX(1), mapY(0));

        const stepsPast = 250;
        for (let i = 0; i <= stepsPast; i++) {
            const x = 1 + (i / stepsPast) * (currentAge - 1);
            const y = fx(x);
            ctx.lineTo(mapX(x), mapY(y));
        }
        ctx.lineTo(mapX(currentAge), mapY(0));
        ctx.closePath();

        const pastGrad = ctx.createLinearGradient(margin.left, 0, mapX(currentAge), 0);
        pastGrad.addColorStop(0, 'rgba(124, 58, 237, 0.32)');
        pastGrad.addColorStop(1, 'rgba(99, 102, 241, 0.22)');
        ctx.fillStyle = pastGrad;
        ctx.fill();

        // Future Area
        if (currentAge < maxAge) {
            ctx.beginPath();
            ctx.moveTo(mapX(currentAge), mapY(0));

            const stepsFuture = 250;
            for (let i = 0; i <= stepsFuture; i++) {
                const x = currentAge + (i / stepsFuture) * (maxAge - currentAge);
                const y = fx(x);
                ctx.lineTo(mapX(x), mapY(y));
            }
            ctx.lineTo(mapX(maxAge), mapY(0));
            ctx.closePath();

            ctx.fillStyle = 'rgba(241, 245, 249, 0.75)';
            ctx.fill();
        }

        // 3. 1/x Curve Line
        ctx.beginPath();
        const totalSteps = 400;
        for (let i = 0; i <= totalSteps; i++) {
            const x = 1 + (i / totalSteps) * (maxAge - 1);
            const y = fx(x);
            const px = mapX(x);
            const py = mapY(y);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.lineWidth = isMobile ? 3 : 4;
        ctx.strokeStyle = '#7c3aed';
        ctx.stroke();

        // 4. Subjective Midpoint Marker (sqrt(100) = 10) - Dashed vertical line
        const midX = subjectiveMidpoint(maxAge);
        const midPx = mapX(midX);

        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(midPx, margin.top);
        ctx.lineTo(midPx, margin.top + graphH);
        ctx.stroke();
        ctx.restore();

        // 5. Current Age Marker (Interactive Cursor)
        const curPx = mapX(currentAge);
        const curPy = mapY(fx(currentAge));

        ctx.beginPath();
        ctx.moveTo(curPx, margin.top);
        ctx.lineTo(curPx, margin.top + graphH);
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(curPx, curPy, isMobile ? 6 : 8, 0, Math.PI * 2);
        ctx.fillStyle = '#0284c7';
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        ctx.fillStyle = '#0284c7';
        ctx.font = `bold ${isMobile ? '11px' : '13px'} Outfit, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(`Âge: ${currentAge} ans`, curPx, margin.top + graphH + (isMobile ? 32 : 42));

        // 6. Main Axes Lines & Annotations
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#94a3b8';

        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top + graphH);
        ctx.lineTo(margin.left + graphW + 10, margin.top + graphH);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top - 15);
        ctx.lineTo(margin.left, margin.top + graphH);
        ctx.stroke();

        ctx.fillStyle = '#334155';
        ctx.font = `700 ${isMobile ? '10px' : '13px'} Inter, sans-serif`;
        ctx.textAlign = 'right';
        ctx.fillText('Âge (x) →', width - margin.right, height - 10);

        // 7. Hover / Drag Cursor Logic
        if (hoveredAge !== null && hoveredAge >= 1 && hoveredAge <= maxAge) {
            const hPx = mapX(hoveredAge);
            const hPy = mapY(fx(hoveredAge));

            ctx.save();
            ctx.setLineDash([2, 2]);
            ctx.strokeStyle = '#ec4899';
            ctx.beginPath();
            ctx.moveTo(hPx, margin.top);
            ctx.lineTo(hPx, margin.top + graphH);
            ctx.stroke();
            ctx.restore();

            ctx.beginPath();
            ctx.arc(hPx, hPy, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#ec4899';
            ctx.fill();

            if (canvasTooltip) {
                const ttAge = document.getElementById('tt-age');
                const ttWeight = document.getElementById('tt-weight');
                const ttIntegral = document.getElementById('tt-integral');
                const ttPct = document.getElementById('tt-pct');
                const ttWeek = document.getElementById('tt-week');

                ttAge.textContent = `${hoveredAge.toFixed(1)} ans`;
                const w = fx(hoveredAge);
                ttWeight.textContent = `${w.toFixed(3)} (${(w * 100).toFixed(1)}%)`;
                const v = volumeIntegral(hoveredAge);
                ttIntegral.textContent = v.toFixed(3);
                const p = perceivedPercentage(hoveredAge, maxAge);
                ttPct.textContent = `${p.toFixed(1)}%`;
                if (ttWeek) {
                    const wDays = perceivedWeekDays(hoveredAge, compareAge);
                    const unit = wDays >= 2.0 ? 'jours' : 'jour';
                    ttWeek.textContent = `${wDays.toFixed(1).replace('.', ',')} ${unit}`;
                }

                canvasTooltip.classList.remove('hidden');
                
                let leftPos = hPx + 15;
                if (leftPos + 200 > width) leftPos = hPx - 210;
                let topPos = Math.max(15, hPy - 35);

                canvasTooltip.style.left = `${leftPos}px`;
                canvasTooltip.style.top = `${topPos}px`;
            }
        } else {
            if (canvasTooltip) canvasTooltip.classList.add('hidden');
        }
    }

    // Interactive Mouse & Touch Dragging Helper
    function updateAgeFromPointer(e, canvas) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
        const mouseX = clientX - rect.left;
        const width = rect.width;
        const isMobile = width < 640;
        const margin = { left: isMobile ? 50 : 75, right: isMobile ? 25 : 60 };
        const graphW = width - margin.left - margin.right;

        if (mouseX >= margin.left && mouseX <= margin.left + graphW) {
            const xVal = minAge + ((mouseX - margin.left) / graphW) * (maxAge - minAge);
            return Math.min(maxAge, Math.max(1, xVal));
        }
        return null;
    }

    // Direct Canvas Drag, Mouse & Touch Events for Curve Canvas
    if (curveCanvas) {
        curveCanvas.addEventListener('mousedown', (e) => {
            isDraggingCanvas = true;
            const ageVal = updateAgeFromPointer(e, curveCanvas);
            if (ageVal !== null) {
                ageSlider.value = Math.round(ageVal);
                updateAll();
            }
        });

        curveCanvas.addEventListener('mousemove', (e) => {
            const ageVal = updateAgeFromPointer(e, curveCanvas);
            hoveredAge = ageVal;

            if (isDraggingCanvas && ageVal !== null) {
                ageSlider.value = Math.round(ageVal);
                updateAll();
            } else {
                drawCurveCanvas();
            }
        });

        curveCanvas.addEventListener('touchstart', (e) => {
            isDraggingCanvas = true;
            const ageVal = updateAgeFromPointer(e, curveCanvas);
            if (ageVal !== null) {
                ageSlider.value = Math.round(ageVal);
                updateAll();
            }
        }, { passive: true });

        curveCanvas.addEventListener('touchmove', (e) => {
            const ageVal = updateAgeFromPointer(e, curveCanvas);
            hoveredAge = ageVal;

            if (isDraggingCanvas && ageVal !== null) {
                ageSlider.value = Math.round(ageVal);
                updateAll();
            } else {
                drawCurveCanvas();
            }
        }, { passive: true });

        window.addEventListener('mouseup', () => {
            isDraggingCanvas = false;
        });

        window.addEventListener('touchend', () => {
            isDraggingCanvas = false;
            hoveredAge = null;
            drawCurveCanvas();
        });

        curveCanvas.addEventListener('mouseleave', () => {
            if (!isDraggingCanvas) {
                hoveredAge = null;
                drawCurveCanvas();
            }
        });
    }

    // --- CANVAS RENDERING WITH CLEAN ANNOTATIONS: V(x) = ln(x) ---

    function drawLnCanvas() {
        if (!lnCanvas) return;
        const ctx = lnCanvas.getContext('2d');
        const rect = lnCanvas.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;

        const dpr = window.devicePixelRatio || 1;
        lnCanvas.width = Math.floor(rect.width * dpr);
        lnCanvas.height = Math.floor(rect.height * dpr);
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = rect.height;
        const isMobile = width < 640;
        const margin = { 
            top: isMobile ? 25 : 60, 
            right: isMobile ? 25 : 60, 
            bottom: isMobile ? 45 : 65, 
            left: isMobile ? 45 : 85 
        };
        const graphW = Math.max(10, width - margin.left - margin.right);
        const graphH = Math.max(10, height - margin.top - margin.bottom);

        ctx.clearRect(0, 0, width, height);

        const maxVolume = volumeIntegral(maxAge);

        function mapX(x) {
            return margin.left + ((x - 1) / (maxAge - 1)) * graphW;
        }

        function mapY(v) {
            return margin.top + graphH - (v / maxVolume) * graphH;
        }

        // 1. Gridlines
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#e2e8f0';
        ctx.fillStyle = '#64748b';
        ctx.font = `500 ${isMobile ? '10px' : '12px'} JetBrains Mono, sans-serif`;

        // 50% Midpoint Line
        const halfY = mapY(maxVolume * 0.5);
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(margin.left, halfY);
        ctx.lineTo(margin.left + graphW, halfY);
        ctx.stroke();
        ctx.restore();

        const midX = subjectiveMidpoint(maxAge);
        ctx.fillStyle = '#b45309';
        ctx.font = `bold ${isMobile ? '10px' : '12px'} Inter, sans-serif`;
        ctx.textAlign = 'right';
        ctx.fillText(`★ 50% Volume (√100 = 10a)`, margin.left + graphW - 5, halfY - 6);

        // X Ticks
        const xStep = isMobile ? 20 : 10;
        for (let x = 1; x <= maxAge; x += xStep) {
            const px = mapX(x);
            ctx.beginPath();
            ctx.moveTo(px, margin.top);
            ctx.lineTo(px, margin.top + graphH);
            ctx.stroke();

            ctx.textAlign = 'center';
            ctx.fillText(`${x}a`, px, margin.top + graphH + (isMobile ? 18 : 24));
        }

        // Y Ticks
        for (let v = 0; v <= maxVolume; v += 1) {
            const py = mapY(v);
            ctx.beginPath();
            ctx.moveTo(margin.left, py);
            ctx.lineTo(margin.left + graphW, py);
            ctx.stroke();

            ctx.textAlign = 'right';
            ctx.fillText(`${v.toFixed(1)} ln`, margin.left - 8, py + 4);
        }

        // 2. Shaded Past Volume
        ctx.beginPath();
        ctx.moveTo(mapX(1), mapY(0));
        const steps = 250;
        for (let i = 0; i <= steps; i++) {
            const x = 1 + (i / steps) * (currentAge - 1);
            const v = volumeIntegral(x);
            ctx.lineTo(mapX(x), mapY(v));
        }
        ctx.lineTo(mapX(currentAge), mapY(0));
        ctx.closePath();

        const grad = ctx.createLinearGradient(margin.left, 0, mapX(currentAge), 0);
        grad.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
        grad.addColorStop(1, 'rgba(124, 58, 237, 0.25)');
        ctx.fillStyle = grad;
        ctx.fill();

        // 3. Draw ln(x) Curve Line
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
            const x = 1 + (i / steps) * (maxAge - 1);
            const v = volumeIntegral(x);
            const px = mapX(x);
            const py = mapY(v);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.lineWidth = isMobile ? 3 : 4;
        ctx.strokeStyle = '#4f46e5';
        ctx.stroke();

        // Current Age Node
        const curPx = mapX(currentAge);
        const curPy = mapY(volumeIntegral(currentAge));

        ctx.beginPath();
        ctx.arc(curPx, curPy, isMobile ? 6 : 7, 0, Math.PI * 2);
        ctx.fillStyle = '#4f46e5';
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        // Axes
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top + graphH);
        ctx.lineTo(margin.left + graphW + 10, margin.top + graphH);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top - 15);
        ctx.lineTo(margin.left, margin.top + graphH);
        ctx.stroke();

        ctx.fillStyle = '#334155';
        ctx.font = `700 ${isMobile ? '10px' : '13px'} Inter, sans-serif`;
        ctx.textAlign = 'right';
        ctx.fillText('Âge (x) →', width - margin.right, height - 10);
    }

    // Touch events for Ln Canvas
    if (lnCanvas) {
        lnCanvas.addEventListener('touchstart', (e) => {
            isDraggingCanvas = true;
            const ageVal = updateAgeFromPointer(e, lnCanvas);
            if (ageVal !== null) {
                ageSlider.value = Math.round(ageVal);
                updateAll();
            }
        }, { passive: true });

        lnCanvas.addEventListener('touchmove', (e) => {
            const ageVal = updateAgeFromPointer(e, lnCanvas);
            if (isDraggingCanvas && ageVal !== null) {
                ageSlider.value = Math.round(ageVal);
                updateAll();
            }
        }, { passive: true });
    }

    // --- LIFE BLOCKS GRID RENDERING WITH MOUSE OVER TOOLTIPS FOR EVERY YEAR ---

    function renderLifeGrid() {
        if (!lifeBlocksGrid) return;
        lifeBlocksGrid.innerHTML = '';

        const maxW = 1.0;
        for (let year = 1; year <= maxAge; year++) {
            const weight = fx(year);
            const weightPct = weight * 100;
            const isPassed = year <= currentAge;
            const isMidpoint = Math.round(subjectiveMidpoint(maxAge)) === year;
            const cumulativeVol = volumeIntegral(year);
            const cumulativePct = perceivedPercentage(year, maxAge);
            const gridDays = perceivedWeekDays(year, compareAge);
            const gridDaysFormatted = gridDays.toFixed(1).replace('.', ',');
            const gridUnit = gridDays >= 2.0 ? 'jours' : 'jour';
            const weekText = year === compareAge
                ? `★ À ${year} ans, la semaine fait 7,0 jours (âge repère).`
                : `À ${year} ans, la semaine paraît en avoir ${gridDaysFormatted} ${gridUnit} (vs 7j à ${compareAge} ans).`;

            const isTopRow = year <= 20;
            const popoverPosClass = isTopRow ? 'top-full mt-2' : 'bottom-full mb-2';

            const block = document.createElement('div');
            block.className = `life-block p-2 sm:p-2.5 rounded-lg sm:rounded-xl border flex flex-col justify-between cursor-pointer transition-all shadow-2xs relative group ${
                isPassed 
                    ? 'bg-purple-50 border-purple-200 text-purple-950 hover:bg-purple-100 hover:border-purple-300' 
                    : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-50'
            } ${isMidpoint ? 'ring-2 ring-amber-400 shadow-md shadow-amber-400/20' : ''}`;

            const relativeHeight = Math.max(35, Math.min(100, Math.round((weight / maxW) * 100 + 35)));
            block.style.minHeight = `${relativeHeight}px`;

            // HTML content with rich Mouseover Tooltip for every year
            block.innerHTML = `
                <div class="flex items-center justify-between text-[9px] sm:text-[10px] font-mono pointer-events-none">
                    <span class="font-bold ${isPassed ? 'text-purple-700' : 'text-slate-400'}">An ${year}</span>
                    ${isMidpoint ? '<span class="text-amber-600 font-bold text-[10px] sm:text-xs">★</span>' : ''}
                </div>
                <div class="text-[10px] sm:text-[11px] font-bold font-outfit mt-0.5 sm:mt-1 pointer-events-none ${isPassed ? 'text-purple-900' : 'text-slate-600'}">
                    ${weightPct.toFixed(1)}%
                </div>

                <!-- RICH MOUSEOVER POPOVER FOR THIS YEAR -->
                <div class="hidden group-hover:block absolute left-1/2 -translate-x-1/2 ${popoverPosClass} w-56 sm:w-64 bg-slate-950 text-white p-2.5 sm:p-3 rounded-xl shadow-2xl z-50 pointer-events-none text-left space-y-1 sm:space-y-1.5 border border-purple-500/50 backdrop-blur-xl transition-all">
                    <div class="font-bold text-[11px] sm:text-xs text-purple-300 border-b border-slate-800 pb-1 flex items-center justify-between">
                        <span>An ${year} (${isPassed ? 'Déjà vécu' : 'À venir'})</span>
                        ${isMidpoint ? '<span class="text-amber-400 font-mono text-[9px] sm:text-[10px]">★ Mi-vie 50%</span>' : ''}
                    </div>
                    <div class="text-[10px] sm:text-[11px] text-slate-300 space-y-1 font-sans leading-snug">
                        <div>• <strong>Poids (1/x) :</strong> ${weightPct.toFixed(2)}% d'une vie antérieure</div>
                        <div>• <strong>Volume cumulé :</strong> ln(${year}) = ${cumulativeVol.toFixed(2)} ln</div>
                        <div>• <strong>Perception vécue :</strong> ${cumulativePct.toFixed(1)}% de toute une vie</div>
                        <div class="p-1 sm:p-1.5 bg-purple-950/90 rounded border border-purple-800/80 text-purple-200 text-[9px] sm:text-[10px] mt-1 italic">
                            ${weekText}
                        </div>
                    </div>
                </div>
            `;

            block.addEventListener('click', () => {
                ageSlider.value = year;
                updateAll();
            });

            lifeBlocksGrid.appendChild(block);
        }
    }

    // --- Tab Switcher ---

    function setActiveTab(tabName) {
        activeTab = tabName;

        [tabCurveBtn, tabLnBtn, tabGridBtn, tabHourglassBtn].forEach(btn => btn && btn.classList.remove('active'));
        [viewCurve, viewLn, viewGrid, viewHourglass].forEach(panel => panel && panel.classList.add('hidden'));

        const hudButtonsRow = document.getElementById('hud-buttons-row');
        const isMobile = window.innerWidth < 640;

        if (hudButtonsRow) {
            if (tabName === 'curve') {
                hudButtonsRow.classList.remove('hidden');
            } else {
                hudButtonsRow.classList.add('hidden');
            }
        }

        if (tabName === 'curve') {
            if (tabCurveBtn) tabCurveBtn.classList.add('active');
            if (viewCurve) viewCurve.classList.remove('hidden');
        } else if (tabName === 'ln') {
            if (tabLnBtn) tabLnBtn.classList.add('active');
            if (viewLn) viewLn.classList.remove('hidden');
        } else if (tabName === 'grid') {
            if (tabGridBtn) tabGridBtn.classList.add('active');
            if (viewGrid) viewGrid.classList.remove('hidden');
        } else if (tabName === 'hourglass') {
            if (tabHourglassBtn) tabHourglassBtn.classList.add('active');
            if (viewHourglass) viewHourglass.classList.remove('hidden');
        }

        setTimeout(renderActiveView, 50);
    }

    // --- INTERACTIVE HUD BUTTON HANDLERS ---

    if (hudBadgePerceived) {
        hudBadgePerceived.addEventListener('click', () => {
            if (activeTab === 'curve') {
                setActiveTab('ln');
            } else {
                setActiveTab('curve');
            }
        });
    }

    if (hudBadgeMidpoint) {
        hudBadgeMidpoint.addEventListener('click', () => {
            const midpointAge = Math.round(subjectiveMidpoint(maxAge));
            ageSlider.value = midpointAge;
            updateAll();
        });
    }

    if (hudBadgeSpeed && popoverCompareAge) {
        hudBadgeSpeed.addEventListener('click', (e) => {
            e.stopPropagation();
            popoverCompareAge.classList.toggle('hidden');
        });

        if (btnClosePopover) {
            btnClosePopover.addEventListener('click', (e) => {
                e.stopPropagation();
                popoverCompareAge.classList.add('hidden');
            });
        }

        compareOptBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const targetAgeVal = parseInt(btn.getAttribute('data-target'), 10);
                if (targetAgeVal) {
                    if (compareAgeInput) compareAgeInput.value = targetAgeVal;
                    compareOptBtns.forEach(b => b.classList.remove('bg-sky-600', 'text-white'));
                    btn.classList.add('bg-sky-600', 'text-white');
                    popoverCompareAge.classList.add('hidden');
                    updateAll();
                }
            });
        });

        document.addEventListener('click', (e) => {
            if (!popoverCompareAge.contains(e.target) && e.target !== hudBadgeSpeed) {
                popoverCompareAge.classList.add('hidden');
            }
        });
    }

    // --- Theoretical Info Drawer Toggling ---

    if (btnToggleInfo && infoDrawer) {
        btnToggleInfo.addEventListener('click', () => {
            infoDrawer.classList.toggle('hidden');
        });
    }

    if (btnCloseInfo && infoDrawer) {
        btnCloseInfo.addEventListener('click', () => {
            infoDrawer.classList.add('hidden');
        });
    }

    // --- Why Sqrt Top-Level Modal Handler (Intégrale tab) ---
    const btnWhySqrt = document.getElementById('btn-why-sqrt');
    const popoverWhySqrt = document.getElementById('popover-why-sqrt');
    const btnCloseWhySqrt = document.getElementById('btn-close-why-sqrt');
    const btnCloseWhySqrtFooter = document.getElementById('btn-close-why-sqrt-footer');

    if (btnWhySqrt && popoverWhySqrt) {
        btnWhySqrt.addEventListener('mouseenter', () => {
            popoverWhySqrt.classList.add('active');
        });

        btnWhySqrt.addEventListener('click', (e) => {
            e.stopPropagation();
            popoverWhySqrt.classList.toggle('active');
        });

        if (btnCloseWhySqrt) {
            btnCloseWhySqrt.addEventListener('click', (e) => {
                e.stopPropagation();
                popoverWhySqrt.classList.remove('active');
            });
        }

        if (btnCloseWhySqrtFooter) {
            btnCloseWhySqrtFooter.addEventListener('click', (e) => {
                e.stopPropagation();
                popoverWhySqrt.classList.remove('active');
            });
        }

        popoverWhySqrt.addEventListener('click', (e) => {
            if (e.target === popoverWhySqrt) {
                popoverWhySqrt.classList.remove('active');
            }
        });
    }

    // --- Event Listeners Setup ---

    if (ageSlider) ageSlider.addEventListener('input', updateAll);

    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const ageVal = parseInt(btn.getAttribute('data-age'), 10);
            if (ageVal) {
                ageSlider.value = ageVal;
                updateAll();
            }
        });
    });

    if (tabCurveBtn) tabCurveBtn.addEventListener('click', () => setActiveTab('curve'));
    if (tabLnBtn) tabLnBtn.addEventListener('click', () => setActiveTab('ln'));
    if (tabGridBtn) tabGridBtn.addEventListener('click', () => setActiveTab('grid'));
    if (tabHourglassBtn) tabHourglassBtn.addEventListener('click', () => setActiveTab('hourglass'));

    const resizeObserver = new ResizeObserver(() => {
        renderActiveView();
    });

    if (curveCanvas) resizeObserver.observe(curveCanvas.parentElement);
    if (lnCanvas) resizeObserver.observe(lnCanvas.parentElement);

    window.addEventListener('resize', () => {
        setActiveTab(activeTab);
    });

    setTimeout(updateAll, 50);
});
