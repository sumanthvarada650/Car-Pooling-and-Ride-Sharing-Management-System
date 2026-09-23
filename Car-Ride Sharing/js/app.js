/**
 * ShareCar India — Application Controller
 * Handles Search Filters, Expressway & Daily IT Commute Routing,
 * Multi-Seat Reservations, Publish Ride (Driver Flow), and PostgreSQL DBMS Inspector.
 */

document.addEventListener('DOMContentLoaded', () => {
    const db = window.carpoolDB;

    // Active Passenger State (Aryan Verma - Aadhaar Verified)
    const currentPassengerId = 1;
    let currentCategory = 'all';
    let selectedRideForBooking = null;
    let selectedSeatsCount = 1;

    // DOM References
    const ridesContainer    = document.getElementById('ridesContainer');
    const searchLeavingFrom = document.getElementById('searchLeavingFrom');
    const searchGoingTo     = document.getElementById('searchGoingTo');
    const searchSeats       = document.getElementById('searchSeats');
    const sortRidesSelect   = document.getElementById('sortRidesSelect');

    const modalBookSeats   = document.getElementById('modalBookSeats');
    const modalPublishRide = document.getElementById('modalPublishRide');
    const modalPgConsole   = document.getElementById('modalPgConsole');

    // Boot
    initHeaderAndWallet();
    initSearchAndFilters();
    initBookingWorkflow();
    initPublishWorkflow();
    initPgConsole();
    renderPopularRoutes();
    renderRecentActivity();
    renderRidesList();

    // =================================================================
    // 1. Header & Wallet
    // =================================================================
    function initHeaderAndWallet() {
        updateWalletDisplay();
        document.getElementById('btnQuickTopUp').addEventListener('click', () => {
            db.topUpBalance(currentPassengerId, 500);
            updateWalletDisplay();
            showToast('UPI Wallet Recharged! 💳', 'Added ₹500.00 via Google Pay / PhonePe UPI to your ShareCar wallet.', 'success');
            renderRecentActivity();
        });
    }

    function updateWalletDisplay() {
        const passenger = db.passengers.find(p => p.passenger_id === currentPassengerId);
        const user      = db.app_users.find(u => u.user_id === currentPassengerId);
        if (passenger && user) {
            document.getElementById('headerUserName').textContent    = `${user.first_name} ${user.last_name}`;
            document.getElementById('headerUserAvatar').textContent  = `${user.first_name[0]}${user.last_name[0]}`;
            document.getElementById('headerUserBalance').textContent = `₹${passenger.balance.toFixed(2)}`;
            document.getElementById('sidebarWalletBalance').textContent = `₹${passenger.balance.toFixed(2)}`;
        }
    }

    // =================================================================
    // 2. Search & Category Filters
    // =================================================================
    function initSearchAndFilters() {
        document.getElementById('btnPerformSearch').addEventListener('click', renderRidesList);
        searchLeavingFrom.addEventListener('input', renderRidesList);
        searchGoingTo.addEventListener('input', renderRidesList);
        searchSeats.addEventListener('change', renderRidesList);
        sortRidesSelect.addEventListener('change', renderRidesList);

        // Swap button
        const swapBtn = document.getElementById('btnSwapLocations');
        if (swapBtn) {
            swapBtn.addEventListener('click', () => {
                const tmp = searchLeavingFrom.value;
                searchLeavingFrom.value = searchGoingTo.value;
                searchGoingTo.value = tmp;
                renderRidesList();
            });
        }

        // Category Tabs (All, Intercity, Within-City, Ladies-Only)
        const categories = [
            { key: 'all', id: 'tabCatAll' },
            { key: 'intercity', id: 'tabCatIntercity' },
            { key: 'within_city', id: 'tabCatWithinCity' },
            { key: 'ladies_only', id: 'tabCatLadies' }
        ];

        categories.forEach(cat => {
            const btn = document.getElementById(cat.id);
            if (btn) {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.category-tab-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentCategory = cat.key;
                    renderRidesList();
                });
            }
        });

        updateCategoryBadges();
    }

    function updateCategoryBadges() {
        const scheduled = db.rides.filter(r => r.status === 'scheduled');
        const badgeAll = document.getElementById('badgeCountAll');
        const badgeInter = document.getElementById('badgeCountIntercity');
        const badgeCity = document.getElementById('badgeCountWithinCity');
        const badgeLadies = document.getElementById('badgeCountLadies');

        if (badgeAll) badgeAll.textContent = scheduled.length;
        if (badgeInter) badgeInter.textContent = scheduled.filter(r => r.ride_category === 'intercity').length;
        if (badgeCity) badgeCity.textContent = scheduled.filter(r => r.ride_category === 'within_city').length;
        if (badgeLadies) badgeLadies.textContent = scheduled.filter(r => r.ladies_only).length;
    }

    // =================================================================
    // 3. Render Ride Cards
    // =================================================================
    function renderRidesList() {
        const leaving     = searchLeavingFrom.value;
        const going       = searchGoingTo.value;
        const seatsNeeded = Number(searchSeats.value);
        const sortBy      = sortRidesSelect.value;

        let rides = db.searchRides(leaving, going, currentCategory, seatsNeeded);

        if (sortBy === 'price_asc') {
            rides.sort((a, b) => a.price_per_seat - b.price_per_seat);
        } else if (sortBy === 'rating_desc') {
            rides.sort((a, b) => b.driverRating - a.driverRating);
        }

        const titleMap = {
            intercity:   '🚗 Highway & Intercity Expressways',
            within_city: '⚡ Daily City & IT Corridor Commutes',
            ladies_only: '👩 Ladies-Only Verified Carpools',
            all:         'Available Carpool Rides'
        };
        document.getElementById('ridesListTitle').textContent   = titleMap[currentCategory] || 'Available Carpool Rides';
        document.getElementById('ridesCountSummary').textContent = `${rides.length} verified trip${rides.length !== 1 ? 's' : ''} available on Indian routes`;

        if (rides.length === 0) {
            ridesContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <h3 class="empty-state-title">No matching rides found</h3>
                    <p class="empty-state-desc">Try checking your pickup or drop landmark (e.g. Dadar, Wakad, Hinjawadi, Silk Board, Whitefield) or publish a new ride offer!</p>
                    <button class="btn-publish-ride" style="margin: 0 auto; display: inline-flex;" onclick="document.getElementById('btnOpenPublishModal').click()">
                        <span>➕</span> Offer empty seats on this route
                    </button>
                </div>`;
            return;
        }

        ridesContainer.innerHTML = rides.map(ride => buildRideCard(ride)).join('');

        // Attach booking handlers
        document.querySelectorAll('.btn-trigger-book').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                openBookingModal(Number(btn.dataset.id));
            });
        });

        // Card click → expand details
        document.querySelectorAll('.ride-card').forEach(card => {
            card.addEventListener('click', e => {
                if (e.target.closest('.btn-trigger-book')) return;
                card.classList.toggle('expanded');
            });
        });
    }

    function buildRideCard(ride) {
        const isLowSeats = ride.available_seats <= 2;

        const catBadge = ride.ride_category === 'intercity'
            ? `<span class="badge badge-intercity">🚗 Intercity Highway</span>`
            : `<span class="badge badge-within-city">⚡ City IT Commute</span>`;

        const ladiesBadge = ride.isLadiesOnly
            ? `<span class="badge badge-ladies">👩 Ladies Only</span>`
            : '';

        const fastagBadge = ride.hasFastag
            ? `<span class="badge badge-fastag">🛣️ FASTag Included</span>`
            : '';

        const acBadge = ride.hasAc
            ? `<span class="badge" style="background:#E0F2FE;color:#0369A1;border:1px solid #BAE6FD;font-weight:600;">❄️ AC Chilled</span>`
            : '';

        const chaiBadge = ride.hasChaiStop
            ? `<span class="badge badge-chai">☕ Highway Dhaba Halt</span>`
            : '';

        const seatBadge = `<span class="badge ${isLowSeats ? 'badge-seats' : 'badge-instant'}">💺 ${ride.available_seats} seat${ride.available_seats > 1 ? 's' : ''} left</span>`;
        const distBadge = `<span class="badge badge-vehicle">📍 ${ride.distanceKm} km</span>`;
        const luggageBadge = `<span class="badge badge-vehicle">🧳 Dicky: ${ride.luggage_size}</span>`;
        const routeBadge = `<span class="badge badge-route">🛣️ ${ride.routeVia}</span>`;

        return `
            <div class="ride-card" data-id="${ride.ride_id}">
                <div class="ride-card-main">
                    <div class="route-timeline">
                        <div class="timeline-track">
                            <div class="timeline-dot"></div>
                            <div class="timeline-line"></div>
                            <div class="timeline-dot dest"></div>
                        </div>
                        <div class="timeline-points">
                            <div style="margin-bottom: 1.15rem;">
                                <div class="point-time-city">
                                    <span class="point-time">${ride.departure_time}</span>
                                    <span class="point-city">${ride.originCity}</span>
                                </div>
                                <div class="point-address">📍 Landmark: ${ride.originAddress}</div>
                            </div>
                            <div>
                                <div class="point-time-city">
                                    <span class="point-city">${ride.destCity}</span>
                                </div>
                                <div class="point-address">🏁 Drop: ${ride.destAddress}</div>
                            </div>
                        </div>
                    </div>

                    <div class="ride-price-block">
                        <div class="price-val">₹${ride.price_per_seat.toFixed(0)}</div>
                        <div class="price-sub">per seat</div>
                        <div style="font-size: 0.72rem; color: var(--bbc-green); font-weight: 600; margin-top: 0.2rem;">✓ Zero Surge Pricing</div>
                        <div style="margin-top: 0.65rem;">
                            <button class="btn-book-card btn-trigger-book" data-id="${ride.ride_id}">
                                Reserve Seats
                            </button>
                        </div>
                    </div>
                </div>

                <div class="ride-card-footer">
                    <div class="driver-info-group">
                        <div class="driver-avatar">${ride.driverAvatar}</div>
                        <div class="driver-meta">
                            <h4>${ride.driverName} <span class="badge badge-aadhaar" style="font-size:0.65rem;padding:0.1rem 0.4rem;">✓ Aadhaar KYC</span></h4>
                            <div class="driver-rating-pill">
                                <span class="star">★</span> ${ride.driverRating.toFixed(1)}
                                <span style="color:var(--bbc-text-sub);font-weight:500;font-size:0.73rem;">(${ride.driverRides} trips · DL: ${ride.driverLicense})</span>
                            </div>
                        </div>
                    </div>
                    <div class="ride-badges">
                        ${catBadge}
                        ${ladiesBadge}
                        ${seatBadge}
                        ${fastagBadge}
                        ${acBadge}
                        ${chaiBadge}
                        ${distBadge}
                        ${routeBadge}
                        <span class="badge badge-vehicle">🚘 ${ride.vehicleModel} (${ride.vehiclePlate})</span>
                        ${luggageBadge}
                    </div>
                </div>
            </div>`;
    }

    // =================================================================
    // 4. Booking Workflow
    // =================================================================
    let currentAcidLogText = '';

    function initBookingWorkflow() {
        const formControls     = document.getElementById('bookingFormControls');
        const acidContainer    = document.getElementById('bookingAcidContainer');
        const successActions   = document.getElementById('bookingSuccessActions');
        const btnDone          = document.getElementById('btnDoneBooking');
        const btnCopySql       = document.getElementById('btnCopyAcidSql');
        const btnViewInDb      = document.getElementById('btnViewBookingInDb');
        const methodSelect     = document.getElementById('bookingPaymentMethodSelect');

        document.getElementById('btnCloseBookModal').addEventListener('click', () => {
            modalBookSeats.classList.remove('open');
        });

        modalBookSeats.addEventListener('click', e => {
            if (e.target === modalBookSeats) modalBookSeats.classList.remove('open');
        });

        if (btnDone) {
            btnDone.addEventListener('click', () => {
                modalBookSeats.classList.remove('open');
            });
        }

        if (btnCopySql) {
            btnCopySql.addEventListener('click', () => {
                if (currentAcidLogText) {
                    navigator.clipboard.writeText(currentAcidLogText).then(() => {
                        showToast('ACID SQL Copied! 📋', 'Full transaction log copied to clipboard for your DBMS report.', 'success');
                    }).catch(() => {
                        // Fallback
                        const ta = document.createElement('textarea');
                        ta.value = currentAcidLogText;
                        document.body.appendChild(ta);
                        ta.select();
                        document.execCommand('copy');
                        document.body.removeChild(ta);
                        showToast('ACID SQL Copied! 📋', 'Full transaction log copied to clipboard for your DBMS report.', 'success');
                    });
                }
            });
        }

        if (btnViewInDb) {
            btnViewInDb.addEventListener('click', () => {
                modalBookSeats.classList.remove('open');
                const tableSelect = document.getElementById('selectPgTable');
                if (tableSelect) {
                    tableSelect.value = 'ride_booking';
                }
                setTimeout(() => {
                    document.getElementById('btnOpenPgConsole').click();
                }, 200);
            });
        }

        document.getElementById('btnSeatMinus').addEventListener('click', () => {
            if (selectedSeatsCount > 1) { selectedSeatsCount--; updateBookingCalc(); }
        });

        document.getElementById('btnSeatPlus').addEventListener('click', () => {
            if (selectedRideForBooking && selectedSeatsCount < selectedRideForBooking.available_seats) {
                selectedSeatsCount++;
                updateBookingCalc();
            }
        });

        document.getElementById('btnConfirmBooking').addEventListener('click', () => {
            if (!selectedRideForBooking) return;
            const res = db.bookSeatsTransaction(selectedRideForBooking.ride_id, currentPassengerId, selectedSeatsCount);
            
            // Build raw SQL text for clipboard
            currentAcidLogText = res.log.map(s => `[${s.step}]\n${s.msg}`).join('\n\n');
            renderAcidLog(res.log);

            if (res.success) {
                const total = (selectedSeatsCount * selectedRideForBooking.price_per_seat).toFixed(2);
                const selectedMethodText = methodSelect ? methodSelect.options[methodSelect.selectedIndex].text.split('(')[0].trim() : 'ShareCar Wallet';

                // Display persistent ACID trace and actions without auto-closing!
                formControls.style.display = 'none';
                acidContainer.style.display = 'block';
                successActions.style.display = 'block';

                document.getElementById('bookingSuccessDetails').textContent = 
                    `Booking #${res.booking.booking_id} confirmed · ${selectedSeatsCount} seat(s) reserved · ₹${total} paid via ${selectedMethodText}.`;

                showToast(
                    'Seat Reserved! 🎉',
                    `Booking #${res.booking.booking_id} confirmed on ${selectedRideForBooking.routeVia}. ₹${total} debited. Meet driver at ${selectedRideForBooking.originAddress.split(',')[0]}.`,
                    'success'
                );

                updateWalletDisplay();
                updateCategoryBadges();
                renderRidesList();
                renderRecentActivity();
                // NO setTimeout to close modal — it stays still for the user to inspect!
            } else {
                acidContainer.style.display = 'block';
                showToast('Booking Failed', res.error, 'error');
            }
        });
    }

    function openBookingModal(rideId) {
        const ride = db.searchRides('', '', 'all', 1).find(r => r.ride_id === rideId);
        if (!ride) return;
        selectedRideForBooking = ride;
        selectedSeatsCount = 1;

        // Reset modal UI to fresh booking state
        const formControls   = document.getElementById('bookingFormControls');
        const acidContainer  = document.getElementById('bookingAcidContainer');
        const successActions = document.getElementById('bookingSuccessActions');

        if (formControls) formControls.style.display = 'block';
        if (acidContainer) acidContainer.style.display = 'none';
        if (successActions) successActions.style.display = 'none';

        document.getElementById('modalSeatsMaxLabel').textContent = `Max available: ${ride.available_seats} seat(s)`;

        document.getElementById('bookingRideSummary').innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
                <span style="font-weight:800;font-size:1.1rem;color:var(--bbc-dark);">${ride.originCity} ➔ ${ride.destCity}</span>
                <span style="font-weight:700;color:var(--bbc-blue);font-family:var(--font-heading);font-size:1.15rem;">₹${ride.price_per_seat.toFixed(0)} / seat</span>
            </div>
            <div style="font-size:0.85rem;color:var(--bbc-dark);font-weight:600;margin-bottom:0.35rem;">
                🛣️ ${ride.routeVia} &nbsp;·&nbsp; 📍 ${ride.distanceKm} km
            </div>
            <div style="font-size:0.82rem;color:var(--bbc-text-sub);line-height:1.45;">
                🕐 Departure: <strong>${ride.departure_time}</strong><br>
                👤 Driver: <strong>${ride.driverName}</strong> (★ ${ride.driverRating.toFixed(1)} · Aadhaar KYC Verified)<br>
                🚘 Vehicle: <strong>${ride.vehicleModel}</strong> (${ride.vehiclePlate} · ${ride.vehicleFuel})<br>
                📍 Pickup Landmark: <strong>${ride.originAddress}</strong>
            </div>
            <div style="margin-top:0.6rem;display:flex;gap:0.4rem;flex-wrap:wrap;">
                <span class="badge badge-fastag">FASTag Included</span>
                <span class="badge badge-instant">Chilled AC</span>
                ${ride.hasChaiStop ? '<span class="badge badge-chai">Highway Dhaba Halt</span>' : ''}
                ${ride.isLadiesOnly ? '<span class="badge badge-ladies">Ladies-Only Carpool</span>' : ''}
            </div>`;

        updateBookingCalc();
        modalBookSeats.classList.add('open');
    }

    function updateBookingCalc() {
        document.getElementById('modalSeatValue').textContent       = selectedSeatsCount;
        document.getElementById('modalSeatsCountLabel').textContent = `${selectedSeatsCount} Seat${selectedSeatsCount > 1 ? 's' : ''}`;
        if (selectedRideForBooking) {
            const total = (selectedSeatsCount * selectedRideForBooking.price_per_seat).toFixed(2);
            document.getElementById('modalTotalFare').textContent = `₹${total}`;
        }
    }

    function renderAcidLog(log) {
        const logEl = document.getElementById('modalAcidLog');
        logEl.style.display = 'block';
        logEl.innerHTML = log.map(s =>
            `<div class="acid-step ${s.status}"><strong>[${s.step}]</strong> ${s.msg}</div>`
        ).join('');
    }

    // =================================================================
    // 5. Publish a Ride Workflow
    // =================================================================
    function initPublishWorkflow() {
        const btnOpen     = document.getElementById('btnOpenPublishModal');
        const btnClose    = document.getElementById('btnClosePublishModal');
        const btnCancel   = document.getElementById('btnCancelPublish');
        const form        = document.getElementById('formPublishRide');
        const pubCatInput = document.getElementById('pubCategory');

        // Populate locations with landmarks
        const locOptions = db.locations
            .map(l => `<option value="${l.location_id}">${l.city_name} — ${l.address}</option>`)
            .join('');
        document.getElementById('pubOrigin').innerHTML = locOptions;
        document.getElementById('pubDestination').innerHTML = locOptions;
        document.getElementById('pubDestination').selectedIndex = 1;

        // Populate drivers
        document.getElementById('pubDriver').innerHTML = db.drivers.map(d => {
            const user = db.app_users.find(u => u.user_id === d.driver_id);
            const veh  = db.vehicles.find(v => v.driver_id === d.driver_id);
            return `<option value="${d.driver_id}">${user ? user.first_name + ' ' + user.last_name : 'Driver'} (${veh ? veh.model : 'Car'}) ★${d.avg_rating} [Aadhaar KYC]</option>`;
        }).join('');

        // Radio buttons sync
        document.querySelectorAll('input[name="pubCategoryRadio"]').forEach(radio => {
            radio.addEventListener('change', () => { pubCatInput.value = radio.value; });
        });

        btnOpen.addEventListener('click',   () => modalPublishRide.classList.add('open'));
        btnClose.addEventListener('click',  () => modalPublishRide.classList.remove('open'));
        btnCancel.addEventListener('click', () => modalPublishRide.classList.remove('open'));

        modalPublishRide.addEventListener('click', e => {
            if (e.target === modalPublishRide) modalPublishRide.classList.remove('open');
        });

        form.addEventListener('submit', e => {
            e.preventDefault();
            const originId   = document.getElementById('pubOrigin').value;
            const destId     = document.getElementById('pubDestination').value;
            const category   = pubCatInput.value;
            const depTime    = document.getElementById('pubDepartureTime').value;
            const routeVia   = document.getElementById('pubRouteVia').value;
            const driverId   = document.getElementById('pubDriver').value;
            const fuel       = document.getElementById('pubFuel').value;
            const seats      = document.getElementById('pubSeats').value;
            const price      = document.getElementById('pubPrice').value;
            const luggage    = document.getElementById('pubLuggage').value;
            const ladiesOnly = document.getElementById('pubLadiesOnly').checked;

            if (originId === destId) {
                showToast('Validation Error', 'Origin and destination pickup points must be different.', 'error');
                return;
            }

            db.publishRide(driverId, originId, destId, category, depTime, seats, price, luggage, routeVia, fuel, ladiesOnly);
            modalPublishRide.classList.remove('open');
            updateCategoryBadges();
            renderRidesList();
            renderPopularRoutes();
            showToast('Ride Published! 🚗', `Your carpool offer on ${routeVia} is now live for passengers to book.`, 'success');
        });
    }

    // =================================================================
    // 6. PostgreSQL DBMS Console
    // =================================================================
    function initPgConsole() {
        const btnOpen     = document.getElementById('btnOpenPgConsole');
        const btnClose    = document.getElementById('btnClosePgModal');
        const tableSelect = document.getElementById('selectPgTable');
        const filterInput = document.getElementById('filterPgInput');
        const btnExport   = document.getElementById('btnDownloadPgDump');

        btnOpen.addEventListener('click', () => { renderPgTable(); modalPgConsole.classList.add('open'); });
        btnClose.addEventListener('click', () => modalPgConsole.classList.remove('open'));
        modalPgConsole.addEventListener('click', e => { if (e.target === modalPgConsole) modalPgConsole.classList.remove('open'); });

        tableSelect.addEventListener('change', renderPgTable);
        filterInput.addEventListener('input', renderPgTable);

        btnExport.addEventListener('click', () => {
            const sql  = db.exportPostgreSql();
            const blob = new Blob([sql], { type: 'text/sql;charset=utf-8;' });
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement('a');
            a.href     = url;
            a.download = `sharecar_india_schema_${Date.now()}.sql`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('SQL Schema Dump Ready 💾', 'Downloaded PostgreSQL 16+ .sql script with 3NF Indian tables & seeds.', 'success');
        });
    }

    function renderPgTable() {
        const tableName  = document.getElementById('selectPgTable').value;
        const filterText = document.getElementById('filterPgInput').value.toLowerCase();
        const thead      = document.getElementById('theadPgInspector');
        const tbody      = document.getElementById('tbodyPgInspector');
        const footerEl   = document.getElementById('pgFooterInfo');

        const rawData = db.getTableData(tableName);
        if (!rawData || rawData.length === 0) {
            thead.innerHTML = '';
            tbody.innerHTML = `<tr><td style="text-align:center;color:var(--bbc-text-sub);padding:2rem;">Table is empty</td></tr>`;
            if (footerEl) footerEl.textContent = `Rows: 0 | Table: ${tableName}`;
            return;
        }

        const cols = Object.keys(rawData[0]);
        const filtered = rawData.filter(row => {
            if (!filterText) return true;
            return cols.some(c => String(row[c]).toLowerCase().includes(filterText));
        });

        thead.innerHTML = `<tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr>`;
        tbody.innerHTML = filtered.map(row =>
            `<tr>${cols.map(c => {
                const val = row[c];
                if (val === null || val === undefined) return `<td style="color:var(--bbc-text-sub);font-style:italic;">NULL</td>`;
                if (typeof val === 'boolean') return `<td><strong style="color:${val ? 'var(--bbc-green)' : 'var(--bbc-orange)'};">${val ? 'TRUE' : 'FALSE'}</strong></td>`;
                if (typeof val === 'number' && (c.includes('price') || c.includes('amount') || c.includes('balance'))) {
                    return `<td style="font-weight:700;color:var(--bbc-green);">₹${val.toFixed(2)}</td>`;
                }
                if (typeof val === 'number' && c.includes('rating')) {
                    return `<td style="color:var(--bbc-gold);font-weight:700;">★ ${val.toFixed(1)}</td>`;
                }
                return `<td>${val}</td>`;
            }).join('')}</tr>`
        ).join('');

        if (footerEl) footerEl.textContent = `Rows: ${filtered.length} / ${rawData.length} | Table: ${tableName}`;
    }

    // =================================================================
    // 7. Popular Routes Sidebar
    // =================================================================
    function renderPopularRoutes() {
        const container = document.getElementById('popularRoutes');
        if (!container) return;

        const routes = [
            { from: 'Mumbai', to: 'Pune',          via: 'Expressway',        minPrice: 350 },
            { from: 'Bengaluru', to: 'Chennai',    via: 'NH44 Hosur',        minPrice: 650 },
            { from: 'Delhi', to: 'Jaipur',        via: 'Delhi-Mumbai Exp',  minPrice: 480 },
            { from: 'Delhi', to: 'Chandigarh',    via: 'GT Road / Murthal', minPrice: 420 },
            { from: 'Hyderabad', to: 'Bengaluru',  via: 'NH44 Highway',      minPrice: 850 },
            { from: 'Mumbai', to: 'Goa',          via: 'NH66 Konkan',       minPrice: 950 },
            { from: 'Bengaluru', to: 'Mysuru',     via: '10-Lane Expressway',minPrice: 250 }
        ];

        container.innerHTML = routes.map(r => `
            <div class="popular-route-item" onclick="fillSearch('${r.from}','${r.to}')">
                <div>
                    <span class="popular-route-cities">${r.from} ➔ ${r.to}</span>
                    <span style="display:block;font-size:0.72rem;color:var(--bbc-text-sub);">${r.via}</span>
                </div>
                <span class="popular-route-price">from ₹${r.minPrice}</span>
            </div>`).join('');
    }

    // Global for popular route click
    window.fillSearch = (from, to) => {
        searchLeavingFrom.value = from;
        searchGoingTo.value = to;
        renderRidesList();
        document.getElementById('rides-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // =================================================================
    // 8. Recent Activity Sidebar
    // =================================================================
    function renderRecentActivity() {
        const container = document.getElementById('recentActivity');
        if (!container) return;

        const activities = [
            ...db.bookings.slice(-3).reverse().map(b => ({
                icon: '🎫',
                text: `Booking #${b.booking_id} reserved (${b.seats_booked} seat${b.seats_booked > 1 ? 's' : ''}, ₹${b.total_amount})`,
                time: new Date(b.booked_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
            })),
            ...db.payments.slice(-2).reverse().map(p => ({
                icon: '💳',
                text: `Payment ₹${p.amount.toFixed(2)} via ${p.payment_method}`,
                time: new Date(p.payment_date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
            }))
        ].slice(0, 5);

        if (activities.length === 0) {
            container.innerHTML = `<p style="font-size:0.82rem;color:var(--bbc-text-sub);">No recent activity yet.</p>`;
            return;
        }

        container.innerHTML = activities.map(a => `
            <div class="activity-item">
                <div class="activity-icon">${a.icon}</div>
                <div>
                    <div class="activity-text">${a.text}</div>
                    <div class="activity-time">${a.time}</div>
                </div>
            </div>`).join('');
    }

    // =================================================================
    // 9. Toast Notifications
    // =================================================================
    function showToast(title, message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = 'toast';

        const colors = { success: 'var(--bbc-green)', error: 'var(--bbc-red)', info: 'var(--bbc-blue)' };
        const icons  = { success: '✅', error: '⚠️', info: 'ℹ️' };

        toast.style.borderLeftColor = colors[type] || colors.info;
        toast.innerHTML = `
            <span style="font-size:1.25rem;flex-shrink:0;">${icons[type] || '💬'}</span>
            <div>
                <strong style="display:block;font-size:0.9rem;color:var(--bbc-dark);font-family:var(--font-heading);">${title}</strong>
                <span style="font-size:0.8rem;color:var(--bbc-text-sub);">${message}</span>
            </div>`;

        container.appendChild(toast);
        setTimeout(() => {
            toast.style.transition = 'all 0.35s ease';
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(60px)';
            setTimeout(() => toast.remove(), 350);
        }, 4500);
    }
});
