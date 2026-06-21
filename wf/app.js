/* ============================================================
   APP — state, session store, lifecycle logic, router.
   ============================================================ */

/* ---------- current logged-in user (demo session identity) ---------- */
const CURRENT_USER = { name: 'Ahmad Naqiuddin', id: 'A22CS0045', role: 'Student' };
window.CURRENT_USER = CURRENT_USER;

const WF = {
  screen: 'login',
  authTab: 'login',
  adminReturn: 'dashboard',
  is24h: false,
  selectedRoom: 'DK5 Lecture Hall',
  damage: false,            // 'open' | 'submitted' | false
  p2: { cap: 5, events: [], facilities: [], floor: 'Any Floor' },
  p3: { addons: {}, day: '2026-06-01', start: '09:00', end: '11:00', email: true, conflictError: null, pickerOpen: false, pickerMonth: 5, pickerYear: 2026 },
  p4: { sel: null, weekOffset: 0 },        // selected booking id (calendar detail); weekOffset: weeks from first bookable week
  p5: { idx: 0, approved: [], declined: [] },
  p6: { chips: [] },
  /* ---- dynamic session data (starts empty) ---- */
  session: {
    bookings: [],   // {id, roomName, floor, cap, event, day, start, end, addons, status, state, reported,
                     //  occu: 'unchecked'|'checked'|'vacant'|'released', occuDeadline}
    reports: [],    // {id, roomName, issues:[], details, time, status}
    activity: [],   // {action, room, time}
    counter: 0,
    rptCounter: 0,
    pendingRoom: '',
  },
};
window.WF = WF;

/* ---------- date / time helpers ---------- */
/* Full month of weekday keys (faculty venues operate Mon-Fri).
   Each key is a unique date string 'YYYY-MM-DD' used as WF.p3.day / booking.day. */
function buildMonthWeekdays(year, month){ // month: 0-indexed
  const days = [];
  const d = new Date(year, month, 1);
  while(d.getMonth()===month){
    const dow = d.getDay();
    if(dow>=1 && dow<=5){
      const key = d.toISOString().slice(0,10);
      days.push({ key, date: new Date(d), dow });
    }
    d.setDate(d.getDate()+1);
  }
  return days;
}
const CAL_YEAR = 2026, CAL_MONTH = 5; // June 2026 (0-indexed)
const MONTH_DAYS = buildMonthWeekdays(CAL_YEAR, CAL_MONTH);
const DAY_DATES = {};
const DOW_LABEL = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
MONTH_DAYS.forEach(d=>{ DAY_DATES[d.key] = d.date.getDate()+' '+d.date.toLocaleString('en-US',{month:'short'})+' '+CAL_YEAR; });
const DAYS = MONTH_DAYS.map(d=>d.key); // chronological list of all bookable weekday keys
function dowLabel(key){ const d = new Date(key); return DOW_LABEL[d.getDay()]; }
function weekKeysFor(key){
  // returns the Mon-Fri week (as date keys) containing the given key
  const d = new Date(key);
  const dow = d.getDay();
  const monOffset = dow===0 ? -6 : 1-dow;
  const monday = new Date(d); monday.setDate(d.getDate()+monOffset);
  const week = [];
  for(let i=0;i<5;i++){ const wd=new Date(monday); wd.setDate(monday.getDate()+i); week.push(wd.toISOString().slice(0,10)); }
  return week;
}
// All distinct Mon-Fri weeks within the bookable month, in order
const ALL_WEEKS = (()=>{
  const seen = new Set(); const weeks = [];
  MONTH_DAYS.forEach(d=>{
    const wk = weekKeysFor(d.key);
    const sig = wk[0];
    if(!seen.has(sig)){ seen.add(sig); weeks.push(wk); }
  });
  return weeks;
})();
const WEEK_COUNT = ALL_WEEKS.length;
// Backfill date labels for any week days that spill outside the bookable month
// (e.g. trailing Mon-Fri week extending into the next month) so labels never break.
ALL_WEEKS.flat().forEach(key=>{
  if(!DAY_DATES[key]){
    const d = new Date(key);
    DAY_DATES[key] = d.getDate()+' '+d.toLocaleString('en-US',{month:'short'})+' '+d.getFullYear();
  }
});
const TIME_OPTS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];
function dateLabel(day){ return `${dowLabel(day)}, ${DAY_DATES[day]||day}`; }
function durHrs(start,end){ return (parseInt(end)-parseInt(start)); }

/* ---------- derived getters ---------- */
function activeBookings(){ return WF.session.bookings.filter(b=>b.state==='active'); }
function pendingBookings(){ return WF.session.bookings.filter(b=>b.state==='pending'); }
function historyBookings(){ return WF.session.bookings.filter(b=>b.state!=='active'&&b.state!=='pending'); }
function usedRoomsCount(){ return new Set(WF.session.bookings.filter(b=>b.state!=='cancelled').map(b=>b.roomName)).size; }
function hoursBooked(){ return activeBookings().reduce((s,b)=>s+durHrs(b.start,b.end),0); }

/* ---------- mutations ---------- */
function addActivity(action, room){
  WF.session.activity.unshift({ action, room, time:'Just now' });
  WF.session.activity = WF.session.activity.slice(0,6);
}
function createBooking(data){
  WF.session.counter++;
  const id = 'BK-2026-' + String(WF.session.counter).padStart(3,'0');
  WF.session.bookings.push({
    id, status:'pending', state:'pending', reported:false, occu:'unchecked', occuDeadline:null,
    bookerName: CURRENT_USER.name, bookerId: CURRENT_USER.id, bookerRole: CURRENT_USER.role,
    ...data
  });
  addActivity('Booking requested', data.roomName);
  return id;
}
function cancelBooking(id){
  const b = WF.session.bookings.find(x=>x.id===id); if(!b) return;
  b.state='cancelled'; b.status='cancelled';
  addActivity('Booking cancelled', b.roomName);
}
function endBooking(id){
  const b = WF.session.bookings.find(x=>x.id===id); if(!b) return;
  b.state='expired'; b.status='completed';
  addActivity('Booking ended', b.roomName);
  WF.session.pendingRoom = b.roomName;
  WF.session.pendingBookingId = id;
  WF.damage = 'open';
}
function submitReport(issues, details){
  WF.session.rptCounter++;
  const room = WF.session.pendingRoom || WF.selectedRoom;
  const id = 'RPT-' + String(WF.session.rptCounter).padStart(3,'0');
  WF.session.reports.unshift({ id, roomName:room, issues:[...issues], details, time:'Just now', status:'Submitted' });
  const b = WF.session.bookings.find(x=>x.id===WF.session.pendingBookingId);
  if(b) b.reported = true;
  addActivity('Room report submitted', room);
}

/* ---------- OCCUPANCY / AUTO-RELEASE ----------
   Dummy simulation: when a booking is approved (becomes 'active'),
   it starts as 'unchecked'. The user can simulate check-in.
   If left unchecked, a short countdown ('vacant') begins and — if
   it elapses without check-in — the room auto-releases (booking
   is cancelled and freed up for others), purely for demo purposes.
------------------------------------------------- */
const OCCU_GRACE_MS  = 18000; // time before a fresh active booking is flagged "vacant"
const OCCU_RELEASE_MS = 12000; // time after "vacant" before auto-release

function startOccupancyWatch(b){
  b.occu = 'unchecked';
  b.occuDeadline = Date.now() + OCCU_GRACE_MS;
}
function checkInBooking(id){
  const b = WF.session.bookings.find(x=>x.id===id); if(!b) return;
  b.occu = 'checked';
  b.occuDeadline = null;
  addActivity('Checked in', b.roomName);
  render();
}
function releaseBooking(b){
  b.state='cancelled'; b.status='auto-released'; b.occu='released';
  addActivity('Room auto-released (no check-in)', b.roomName);
}
function tickOccupancy(){
  let changed = false;
  const now = Date.now();
  activeBookings().forEach(b=>{
    if(b.occu==='unchecked' && b.occuDeadline && now >= b.occuDeadline){
      b.occu = 'vacant';
      b.occuDeadline = now + OCCU_RELEASE_MS;
      addActivity('No check-in detected — marked vacant', b.roomName);
      changed = true;
    } else if(b.occu==='vacant' && b.occuDeadline && now >= b.occuDeadline){
      releaseBooking(b);
      changed = true;
    }
  });
  if(changed) render();
}
setInterval(tickOccupancy, 1000);

const ORDER = ['dashboard','recommend','summary','calendar'];
const NICE  = {
  login:'Login', dashboard:'P1 · Dashboard', recommend:'P2 · Recommend', summary:'P3 · Summary',
  calendar:'P4 · Calendar', 'admin-auth':'Admin Auth', admin:'Admin Board',
  mybookings:'My Bookings', reports:'Reports',
};

function toggleArr(arr, v){ const i=arr.indexOf(v); if(i>=0) arr.splice(i,1); else arr.push(v); }

/* ---------- render ---------- */
function render(){
  const stage = document.getElementById('stage');
  const S = window.SCREENS;
  let html = '';
  switch(WF.screen){
    case 'login':      html = S.renderLogin(); break;
    case 'admin-auth': html = S.renderAdminAuth(); break;
    case 'dashboard':  html = S.renderP1(); break;
    case 'recommend':  html = S.renderP2(); break;
    case 'summary':    html = S.renderP3(); break;
    case 'calendar':   html = S.renderP4(); break;
    case 'admin':      html = S.renderP5(); break;
    case 'mybookings': html = S.renderMyBookings(); break;
    case 'reports':    html = S.renderReports(); break;
  }
  stage.innerHTML = html;

  // damage modal overlays whatever screen is active
  if(WF.damage){
    const screenEl = stage.querySelector('.screen');
    if(screenEl){
      const wrap = document.createElement('div');
      wrap.innerHTML = WF.damage==='submitted' ? S.renderP6Submitted() : S.renderP6Overlay();
      screenEl.appendChild(wrap.firstElementChild);
    }
  }
  updateChrome();
}

function updateChrome(){
  document.querySelectorAll('.flowmap .node').forEach(n=>{
    n.classList.toggle('on', n.dataset.node===WF.screen);
  });
}

function goto(screen){
  WF.screen = screen;
  if(screen==='admin'){ WF.p5.idx = 0; }
  if(screen==='recommend'){ WF.p2 = { cap: 5, events: [], facilities: [], floor: 'Any Floor' }; }
  render();
}

/* ---------- click delegation ---------- */
document.addEventListener('click', (e)=>{
  const t = e.target.closest('[data-act]');
  if(!t) return;
  const act = t.dataset.act;
  const v = t.dataset.v;

  switch(act){
    case 'goto': goto(t.dataset.target); break;
    case 'time': WF.is24h = (v==='24'); render(); break;

    // auth / session
    case 'authtab': WF.authTab = v; render(); break;
    case 'logout': WF.screen='login'; WF.authTab='login'; render(); break;
    case 'adminGate': WF.adminReturn = (WF.screen==='admin-auth'?WF.adminReturn:WF.screen); goto('admin-auth'); break;
    case 'adminCancel': goto(WF.adminReturn || 'dashboard'); break;

    // P2 filters
    case 'selectRoom': WF.selectedRoom = t.dataset.room; WF.p3.conflictError = null; goto('summary'); break;
    case 'p2event': toggleArr(WF.p2.events, v); render(); break;
    case 'p2fac': toggleArr(WF.p2.facilities, v); render(); break;
    case 'p2floor': WF.p2.floor = v; render(); break;

    // P3 config
    case 'p3day': WF.p3.day = v; WF.p3.conflictError = null; WF.p3.pickerOpen = false; render(); break;
    case 'p3dateToggle': WF.p3.pickerOpen = !WF.p3.pickerOpen; render(); break;
    case 'p3dateNav': {
      let m = WF.p3.pickerMonth + Number(v);
      let y = WF.p3.pickerYear;
      if(m<0){ m=11; y--; } if(m>11){ m=0; y++; }
      // clamp to the only month with bookable data (June 2026) for this prototype
      if(y===2026 && m>=5 && m<=5){ WF.p3.pickerMonth=m; WF.p3.pickerYear=y; }
      render(); break;
    }
    case 'p3addon': {
      if(e.target.closest('[data-noclick]')) break;
      if(WF.p3.addons[v]!==undefined) delete WF.p3.addons[v]; else WF.p3.addons[v]=1;
      render(); break;
    }
    case 'p3qty': {
      const [id,d] = v.split(':');
      WF.p3.addons[id] = Math.max(1, (WF.p3.addons[id]||1) + Number(d));
      render(); break;
    }
    case 'p3email': WF.p3.email = !WF.p3.email; render(); break;
    case 'confirm': {
      const room = (window.ROOMS||[]).find(r=>r.name===WF.selectedRoom) || window.ROOMS[0];
      let { day, start, end } = WF.p3;
      if(end <= start){ const i=TIME_OPTS.indexOf(start); end = TIME_OPTS[Math.min(i+2,TIME_OPTS.length-1)]; }
      // Conflict check: block if room has an active or pending booking overlapping this slot
      const conflict = WF.session.bookings.find(b=>
        b.roomName === room.name &&
        b.day === day &&
        (b.state === 'active' || b.state === 'pending') &&
        b.start < end && b.end > start
      );
      if(conflict){
        WF.p3.conflictError = `${room.name} is already booked from ${fmtT(conflict.start)}–${fmtT(conflict.end)} on ${dateLabel(day)}. Choose a different time or room.`;
        render();
        break;
      }
      WF.p3.conflictError = null;
      createBooking({ roomName:room.name, floor:room.floor, cap:room.cap, event:room.event, day, start, end, addons:{...WF.p3.addons} });
      WF.p3.addons = {};
      // sync calendar to the week of the newly created booking
      const weekStart = weekKeysFor(day)[0];
      const idx = ALL_WEEKS.findIndex(w=>w[0]===weekStart);
      if(idx>=0) WF.p4.weekOffset = idx;
      goto('dashboard');
      break;
    }

    // calendar — only booked cells are clickable (no quick-book)
    case 'p4book': WF.p4.sel = (WF.p4.sel===v?null:v); render(); break;
    case 'p4close': WF.p4.sel = null; render(); break;
    case 'p4weekNav': {
      const next = WF.p4.weekOffset + Number(v);
      WF.p4.weekOffset = Math.max(0, Math.min(WEEK_COUNT-1, next));
      WF.p4.sel = null;
      render(); break;
    }

    // booking lifecycle (my bookings + calendar)
    case 'cancelBk': cancelBooking(v); WF.p4.sel=null; render(); break;
    case 'endBk': endBooking(v); WF.p4.sel=null; render(); break;
    case 'checkIn': checkInBooking(v); break;

    // P5 admin
    case 'p5nav': WF.p5.idx = Math.max(0, WF.p5.idx + Number(v)); render(); break;
    case 'p5approve': case 'p5decline': {
      const pending = WF.session.bookings.filter(b=>b.state==='pending');
      const idx = Math.min(WF.p5.idx, Math.max(0, pending.length-1));
      const cur = pending[idx];
      if(cur){
        if(act==='p5approve'){
          cur.state='active'; cur.status='confirmed';
          startOccupancyWatch(cur);
          addActivity('Booking approved', cur.roomName);
        } else {
          cur.state='cancelled'; cur.status='declined';
          addActivity('Booking declined', cur.roomName);
        }
        WF.p5.idx = 0;
      }
      render(); break;
    }

    // P6 damage report
    case 'p6chip': toggleArr(WF.p6.chips, v); render(); break;
    case 'p6submit': {
      submitReport(WF.p6.chips, '');
      WF.damage='submitted'; render();
      setTimeout(()=>{ WF.damage=false; WF.p6.chips=[]; render(); }, 1500);
      break;
    }
    case 'p6skip': WF.damage=false; WF.p6.chips=[]; render(); break;
  }
});

/* ---------- slider bar approve/decline on admin board ---------- */
(function(){
  let dragging = false, trackRect = null;
  const APPROVE_ZONE = 0.72;
  const DECLINE_ZONE = 0.28;

  function getEls(){ return { track: document.querySelector('.swipe-track'), thumb: document.querySelector('.swipe-thumb') }; }

  function pct(clientX){
    if(!trackRect) return 0.5;
    return Math.max(0, Math.min(1, (clientX - trackRect.left) / trackRect.width));
  }

  function applyPos(p){
    const {track, thumb} = getEls(); if(!thumb || !track) return;
    const thumbW = thumb.getBoundingClientRect().width || 50;
    const maxPx = trackRect.width - thumbW;
    thumb.style.left = (p * maxPx) + 'px';
    const fill = track.querySelector('.swipe-fill');
    const icon = thumb.querySelector('.swipe-thumb-icon');
    if(p > 0.5){
      const r = (p - 0.5) / 0.5;
      fill.style.cssText = `background:rgba(79,174,93,${0.12+r*0.35});width:${p*100}%;left:0;`;
      thumb.style.background = `var(--success)`;
      thumb.style.opacity = String(0.55 + r*0.45);
      icon.textContent = p >= APPROVE_ZONE ? '✓' : '→';
    } else if(p < 0.5){
      const r = (0.5 - p) / 0.5;
      fill.style.cssText = `background:rgba(226,87,76,${0.12+r*0.35});width:${(1-p)*100}%;left:${p*100}%;`;
      thumb.style.background = `var(--error)`;
      thumb.style.opacity = String(0.55 + r*0.45);
      icon.textContent = p <= DECLINE_ZONE ? '✕' : '←';
    } else {
      fill.style.cssText = 'background:transparent;width:0;';
      thumb.style.background = '#cdd6df';
      thumb.style.opacity = '1';
      icon.textContent = '⇔';
    }
    track.querySelector('.swipe-label-decline').style.opacity = p <= DECLINE_ZONE ? '1' : '0.35';
    track.querySelector('.swipe-label-approve').style.opacity = p >= APPROVE_ZONE ? '1' : '0.35';
  }

  function snapBack(){
    const {track, thumb} = getEls(); if(!thumb||!track) return;
    thumb.style.transition = 'left 0.25s ease, background 0.25s ease';
    const thumbW = thumb.getBoundingClientRect().width || 50;
    thumb.style.left = ((trackRect.width - thumbW) / 2) + 'px';
    thumb.style.background = '#cdd6df';
    thumb.style.opacity = '1';
    thumb.querySelector('.swipe-thumb-icon').textContent = '⇔';
    track.querySelector('.swipe-fill').style.cssText = 'background:transparent;width:0;';
    track.querySelector('.swipe-label-decline').style.opacity = '0.35';
    track.querySelector('.swipe-label-approve').style.opacity = '0.35';
    setTimeout(()=>{ const {thumb:t}=getEls(); if(t) t.style.transition='none'; }, 260);
  }

  function onStart(clientX){
    const {track, thumb} = getEls(); if(!thumb||!track) return;
    trackRect = track.getBoundingClientRect();
    const tr = thumb.getBoundingClientRect();
    if(clientX < tr.left - 8 || clientX > tr.right + 8) return;
    dragging = true;
    thumb.style.transition = 'none';
  }
  function onMove(clientX){ if(!dragging) return; applyPos(pct(clientX)); }
  function onEnd(clientX){
    if(!dragging) return; dragging = false;
    const p = pct(clientX);
    const {thumb} = getEls();
    const thumbW = thumb ? (thumb.getBoundingClientRect().width || 50) : 50;
    if(p >= APPROVE_ZONE){
      if(thumb){ thumb.style.transition='left 0.2s ease'; thumb.style.left=(trackRect.width-thumbW)+'px'; }
      setTimeout(()=>{ document.querySelector('[data-act="p5approve"]')?.click(); }, 220);
    } else if(p <= DECLINE_ZONE){
      if(thumb){ thumb.style.transition='left 0.2s ease'; thumb.style.left='0px'; }
      setTimeout(()=>{ document.querySelector('[data-act="p5decline"]')?.click(); }, 220);
    } else { snapBack(); }
  }

  document.addEventListener('mousedown',  e=>{ onStart(e.clientX); });
  document.addEventListener('mousemove',  e=>{ onMove(e.clientX); });
  document.addEventListener('mouseup',    e=>{ onEnd(e.clientX); });
  document.addEventListener('touchstart', e=>{ onStart(e.touches[0].clientX); }, {passive:true});
  document.addEventListener('touchmove',  e=>{ onMove(e.touches[0].clientX); }, {passive:true});
  document.addEventListener('touchend',   e=>{ onEnd(e.changedTouches[0].clientX); });
})();

/* selects (P3 start/end) */
document.addEventListener('change', (e)=>{
  const sel = e.target.closest('[data-change]');
  if(!sel) return;
  const key = sel.dataset.change;
  if(key==='p2cap'){ WF.p2.cap = Number(sel.value); render(); }
  if(key==='p3start'){ WF.p3.start = sel.value; WF.p3.conflictError = null; if(WF.p3.end<=WF.p3.start){ const i=TIME_OPTS.indexOf(WF.p3.start); WF.p3.end=TIME_OPTS[Math.min(i+1,TIME_OPTS.length-1)]; } render(); }
  if(key==='p3end'){ WF.p3.end = sel.value; WF.p3.conflictError = null; render(); }
});

render();
