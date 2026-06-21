/* ============================================================
   SCREENS — render functions return HTML strings.
   High-fidelity visual system: primary/secondary/success/
   warning/error palette per design-system slide.
   ============================================================ */

function to12(t){ const [h,m]=t.split(':').map(Number); const p=h>=12?'PM':'AM'; const hr=h%12||12; return `${hr}:${String(m).padStart(2,'0')} ${p}`; }
function to12s(t){ const [h]=t.split(':').map(Number); const p=h>=12?'PM':'AM'; return `${h%12||12}${p}`; }
function fmtT(t){ return WF.is24h ? t : to12(t); }
function fmtTs(t){ return WF.is24h ? t : to12s(t); }
function ico(label, cls){ return `<span class="ico ${cls||''}">${label||''}</span>`; }

/* ---------- SVG icon library (crisp, clearly visible) ---------- */
const SVG_ICONS = {
  dashboard:  `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="2"/><rect x="13" y="3" width="8" height="5" rx="1.5" stroke="currentColor" stroke-width="2"/><rect x="13" y="10" width="8" height="11" rx="1.5" stroke="currentColor" stroke-width="2"/><rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="2"/></svg>`,
  plus:       `<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>`,
  calendar:   `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  bookings:   `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3.5 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  reports:    `<svg viewBox="0 0 24 24" fill="none"><path d="M5 4h11l3 3v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8 12h8M8 16h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  shield:     `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3 4 6v6c0 5 3.4 8 8 9 4.6-1 8-4 8-9V6l-8-3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  logout:     `<svg viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  clock:      `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3.2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  pin:        `<svg viewBox="0 0 24 24" fill="none"><path d="M12 22s7-6.8 7-12a7 7 0 1 0-14 0c0 5.2 7 12 7 12Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.6" stroke="currentColor" stroke-width="2"/></svg>`,
  users:      `<svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3.2" stroke="currentColor" stroke-width="2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16 14c2.5.3 4.5 2.5 4.5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="17" cy="8" r="2.4" stroke="currentColor" stroke-width="2"/></svg>`,
  alert:      `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3 2 21h20L12 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 10v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg>`,
  check:      `<svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5 10 17l9-10" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  filter:     `<svg viewBox="0 0 24 24" fill="none"><path d="M4 5h16M7 12h10M10 19h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  star:       `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l2.7 5.9 6.3.7-4.7 4.4 1.3 6.3L12 17.3l-5.6 3 1.3-6.3-4.7-4.4 6.3-.7L12 3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  search:     `<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="m21 21-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  arrowRight: `<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  power:      `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3v8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7 6a8 8 0 1 0 10 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  cross:      `<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  mail:       `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  flag:       `<svg viewBox="0 0 24 24" fill="none"><path d="M5 21V4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M5 4h12l-2.5 4L17 12H5" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  // facility icons
  projector:  `<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="14" height="9" rx="2" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="11.5" r="2.2" stroke="currentColor" stroke-width="2"/><path d="M16 10v3l5 2.5v-8L16 10Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  microphone: `<svg viewBox="0 0 24 24" fill="none"><rect x="9" y="2" width="6" height="12" rx="3" stroke="currentColor" stroke-width="2"/><path d="M5 11a7 7 0 0 0 14 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 18v4M9 22h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  whiteboard: `<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="13" rx="2" stroke="currentColor" stroke-width="2"/><path d="M8 21l2-4M16 21l-2-4M7 9h10M7 13h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  aircon:     `<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="6" rx="2" stroke="currentColor" stroke-width="2"/><path d="M6 15v5M10 15l1.5 5M14 15 12.5 20M18 15v5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  wifi:       `<svg viewBox="0 0 24 24" fill="none"><path d="M2 9a16 16 0 0 1 20 0M5.5 13a11 11 0 0 1 13 0M9 17a6 6 0 0 1 6 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="20.2" r="1.1" fill="currentColor"/></svg>`,
  hdmi:       `<svg viewBox="0 0 24 24" fill="none"><path d="M4 9h13l3 3-3 3H4V9Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8 9V6M12 9V6M16 9V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  chairs:     `<svg viewBox="0 0 24 24" fill="none"><path d="M6 4v9M18 4v9M6 13h12l-1.5 7h-9L6 13Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  extension:  `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="9" width="10" height="6" rx="1.5" stroke="currentColor" stroke-width="2"/><circle cx="6.5" cy="12" r=".9" fill="currentColor"/><circle cx="9.5" cy="12" r=".9" fill="currentColor"/><path d="M13 12h4m0-3 4 3-4 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};
function svgIco(name, cls){
  return `<span class="svgico ${cls||''}">${SVG_ICONS[name]||SVG_ICONS.star}</span>`;
}
const FAC_ICON = { Projector:'projector', Microphone:'microphone', Whiteboard:'whiteboard', 'Air-Con':'aircon', WiFi:'wifi', HDMI:'hdmi' };
const ADDON_ICON = { mic:'microphone', projector:'projector', ext:'extension', chairs:'chairs' };

/* ---------- static data ---------- */
const EVENT_TYPES = ["Workshop","Hackathon","Meeting","Lecture","Seminar"];
const FACILITIES  = ["Projector","Microphone","Whiteboard","Air-Con","WiFi","HDMI"];
const FLOORS      = ["Any Floor","Level 1","Level 2","Level 3","Level 4","Level 5"];
const HOURS = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"];
const ROOMS = [
  { id:"R001", name:"DK5 Lecture Hall",      floor:"Level 5", cap:120, score:97, event:"Workshop",  fac:["Projector","Microphone","Air-Con","WiFi"], img:"hall" },
  { id:"R002", name:"Innovation Lab",        floor:"Level 2", cap:60,  score:91, event:"Hackathon", fac:["Projector","Whiteboard","WiFi","HDMI"], img:"lab" },
  { id:"R003", name:"Meeting Room 3B",       floor:"Level 3", cap:20,  score:85, event:"Meeting",   fac:["Projector","Whiteboard","Air-Con"], img:"meeting" },
  { id:"R004", name:"Seminar Room A",        floor:"Level 4", cap:45,  score:78, event:"Seminar",   fac:["Microphone","WiFi","Air-Con"], img:"seminar" },
  { id:"R005", name:"Computer Lab 1",        floor:"Level 1", cap:35,  score:72, event:"Workshop",  fac:["Projector","WiFi","HDMI"], img:"computer" },
  { id:"R006", name:"DK2 Auditorium",        floor:"Level 1", cap:200, score:95, event:"Lecture",   fac:["Projector","Microphone","Air-Con","WiFi","HDMI"], img:"hall" },
  { id:"R007", name:"Collaboration Studio",  floor:"Level 3", cap:25,  score:88, event:"Hackathon", fac:["Whiteboard","WiFi","HDMI"], img:"lab" },
  { id:"R008", name:"Boardroom 5C",          floor:"Level 5", cap:14,  score:82, event:"Meeting",   fac:["Projector","Whiteboard","Air-Con","WiFi"], img:"meeting" },
  { id:"R009", name:"Seminar Room B",        floor:"Level 2", cap:50,  score:76, event:"Seminar",   fac:["Microphone","Projector","Air-Con"], img:"seminar" },
  { id:"R010", name:"Computer Lab 2",        floor:"Level 4", cap:40,  score:74, event:"Workshop",  fac:["Projector","WiFi","HDMI","Air-Con"], img:"computer" },
];
const ADDONS = [
  ["mic","Microphone","Wired/wireless handset"],
  ["projector","Projector","HDMI + VGA input"],
  ["ext","Extension Wire","5m multi-socket"],
  ["chairs","Extra Chairs","Folding chairs, 10/unit"],
];
const ISSUE_CHIPS = [
  ["projector","Projector issue"],["mic","Mic not working"],["ac","A/C malfunction"],
  ["power","Power/socket issue"],["wifi","No WiFi"],["lights","Lighting problem"],["furniture","Broken furniture"],
];
window.ROOMS = ROOMS;

/* ---------- room photos: real stock photography (Unsplash, free license) ---------- */
const ROOM_PHOTOS = {
  hall:     'https://images.unsplash.com/photo-1760121788536-9797394e210e?w=480&h=360&fit=crop&auto=format&q=70',
  lab:      'https://images.unsplash.com/photo-1725030971425-e6ca11cfb0c9?w=480&h=360&fit=crop&auto=format&q=70',
  meeting:  'https://images.unsplash.com/photo-1618506487216-4e8c60a64c73?w=480&h=360&fit=crop&auto=format&q=70',
  seminar:  'https://images.unsplash.com/photo-1561089489-f13d5e730d72?w=480&h=360&fit=crop&auto=format&q=70',
  computer: 'https://images.unsplash.com/photo-1629904853716-f0bc54eea481?w=480&h=360&fit=crop&auto=format&q=70',
};
function roomThumb(type, roomName){
  const src = ROOM_PHOTOS[type] || ROOM_PHOTOS.hall;
  return `<img src="${src}" alt="${roomName||'Room photo'}" loading="lazy" onerror="this.style.display='none';this.parentElement.style.background='var(--primary-tint)';" />`;
}

/* ---------- generic bits ---------- */
function frame(url, inner){
  return `<div class="frame"><div class="titlebar">
      <span class="tl"></span><span class="tl"></span><span class="tl"></span>
      <span class="url">${url}</span>
    </div><div class="screen">${inner}</div></div>`;
}
function emptyBox(glyph, title, sub, ctaLabel, ctaTarget){
  return `<div class="emptybox">
    <div class="ph" style="width:56px;height:56px;border-radius:50%;">${glyph}</div>
    <span class="b7 t15">${title}</span>
    <span class="t12 muted" style="text-align:center;max-width:300px;">${sub}</span>
    ${ctaLabel?`<button class="btn primary sm mt8" data-act="goto" data-target="${ctaTarget}">${ctaLabel}</button>`:''}
  </div>`;
}
/* ---------- addon chip rendering: name + quantity, used in My Bookings & Admin ---------- */
function addonChips(addons, size){
  const entries = Object.entries(addons||{});
  if(!entries.length) return '';
  const cls = size==='sm' ? 'tag' : 'tag solid';
  return entries.map(([id,q])=>{
    const a = ADDONS.find(x=>x[0]===id);
    const label = a ? a[1] : id;
    const i = ADDON_ICON[id];
    return `<span class="${cls}">${i?svgIco(i,'sm'):''}${label} ×${q}</span>`;
  }).join('');
}
function statusTag(state){
  const map  = { active:['Confirmed','success'], expired:['Completed',''], cancelled:['Cancelled','error'], pending:['Pending','warning'] };
  const [label, cls] = map[state] || [state,''];
  return `<span class="tag ${cls}">${label}</span>`;
}

/* ---------- occupancy pulse (signature element) ---------- */
function occuPulse(b){
  if(!b || b.state!=='active') return '';
  const now = Date.now();
  if(b.occu==='checked'){
    return `<span class="occu-pulse checked"><span class="occu-dot"></span>Checked in</span>`;
  }
  if(b.occu==='vacant'){
    const remain = Math.max(0, Math.ceil((b.occuDeadline-now)/1000));
    return `<span class="occu-pulse vacant"><span class="occu-dot"></span>Vacant — auto-release in ${remain}s</span>`;
  }
  if(b.occu==='unchecked'){
    const remain = Math.max(0, Math.ceil((b.occuDeadline-now)/1000));
    return `<span class="occu-pulse checked" style="background:var(--primary-tint);color:var(--primary-deep);"><span class="occu-dot"></span>Awaiting check-in (${remain}s)</span>`;
  }
  return '';
}
function occuActionRow(b){
  if(!b || b.state!=='active') return '';
  if(b.occu==='checked') return '';
  return `<button class="btn sm" data-act="checkIn" data-v="${b.id}" style="border-color:var(--success);color:var(--success-deep);">✓ Check In Now</button>`;
}

/* ---------- persistent sidebar ---------- */
function navSidebar(active){
  const counts = { mybookings: WF.session.bookings.length, reports: WF.session.reports.length };
  const items = [
    ["Dashboard","dashboard","dashboard"],
    ["New Booking","recommend","plus"],
    ["Calendar","calendar","calendar"],
    ["My Bookings","mybookings","bookings"],
    ["Reports","reports","reports"],
  ];
  return `<aside class="side">
    <div class="brandbar">
      <div class="ph" style="width:34px;height:34px;flex-shrink:0;background:var(--primary);color:#fff;border:0;">FSK</div>
      <div class="col"><span class="b7 t13">FSKTM</span><span class="t10 muted mono">Venue Booking</span></div>
    </div>
    <nav class="navlist">
      ${items.map(([l,t,g])=>{const c=counts[t];return `<div class="navitem ${active===t?'on':''}" data-act="goto" data-target="${t}">${svgIco(g)}<span>${l}</span>${c?`<span class="navcount">${c}</span>`:''}</div>`;}).join('')}
    </nav>
    <div class="side-admin">
      <div class="navitem admin" data-act="adminGate">${svgIco('shield')}<span>Admin Mode</span></div>
    </div>
    <div class="userbar">
      <div class="row gap10">
        <div class="ph avatar" style="width:32px;height:32px;flex-shrink:0;background:var(--secondary);color:#fff;border:0;">AN</div>
        <div class="col"><span class="b6 t12">Ahmad Naqiuddin</span><span class="t10 muted mono">A22CS0045</span></div>
      </div>
      <button class="btn sm block" data-act="logout">⎋ &nbsp;Log Out</button>
    </div>
  </aside>`;
}
function shell(url, active, inner){
  return frame(url, `<div class="appbody">${navSidebar(active)}<main class="appmain">${inner}</main></div>`);
}

/* ============================================================
   LOGIN / SIGN-UP
   ============================================================ */
function renderLogin(){
  const tab = WF.authTab;
  const login = `
    <div class="col gap14">
      <div class="col gap6"><span class="t12 b6 muted">Matric / Staff ID or Email</span><div class="field ph-only">e.g. A22CS0045</div></div>
      <div class="col gap6"><span class="t12 b6 muted">Password</span><div class="field ph-only">••••••••</div></div>
      <div class="row between">
        <label class="row gap8" style="cursor:pointer;"><span class="cbox on">✓</span><span class="t12 muted">Remember me</span></label>
        <span class="t12 muted" style="text-decoration:underline;">Forgot password?</span>
      </div>
      <button class="btn primary block" data-act="goto" data-target="dashboard" style="padding:12px;">Log In</button>
      <div class="t12 muted" style="text-align:center;">Don't have an account? <span class="linktab" data-act="authtab" data-v="signup">Sign up</span></div>
    </div>`;
  const signup = `
    <div class="col gap14">
      <div class="col gap6"><span class="t12 b6 muted">Full Name</span><div class="field ph-only">e.g. Ahmad Naqiuddin</div></div>
      <div class="row gap12">
        <div class="col gap6" style="flex:1;min-width:0;"><span class="t12 b6 muted">Matric / Staff ID</span><div class="field ph-only">A22CS0045</div></div>
        <div class="col gap6" style="flex:1;min-width:0;"><span class="t12 b6 muted">Faculty Email</span><div class="field ph-only">name@graduate.utm.my</div></div>
      </div>
      <div class="row gap12">
        <div class="col gap6" style="flex:1;min-width:0;"><span class="t12 b6 muted">Password</span><div class="field ph-only">••••••••</div></div>
        <div class="col gap6" style="flex:1;min-width:0;"><span class="t12 b6 muted">Confirm Password</span><div class="field ph-only">••••••••</div></div>
      </div>
      <label class="row gap8" style="cursor:pointer;"><span class="cbox on">✓</span><span class="t12 muted">I agree to the facility usage terms</span></label>
      <button class="btn primary block" data-act="goto" data-target="dashboard" style="padding:12px;">Create Account</button>
      <div class="t12 muted" style="text-align:center;">Already have an account? <span class="linktab" data-act="authtab" data-v="login">Log in</span></div>
    </div>`;
  return frame("auth / login", `
    <div class="authwrap">
      <div class="authcard">
        <div class="col gap10" style="align-items:center;text-align:center;margin-bottom:6px;">
          <div class="ph" style="width:48px;height:48px;background:var(--primary);color:#fff;border:0;">FSK</div>
          <div class="col"><span class="b8 t18 disp">FSKTM Venue Booking</span><span class="t12 muted">Faculty of Computing · Self-service portal</span></div>
        </div>
        <div class="authtabs">
          <button class="${tab==='login'?'on':''}" data-act="authtab" data-v="login">Log In</button>
          <button class="${tab==='signup'?'on':''}" data-act="authtab" data-v="signup">Sign Up</button>
        </div>
        ${tab==='login'?login:signup}
      </div>
    </div>`);
}

/* ============================================================
   ADMIN GATE
   ============================================================ */
function renderAdminAuth(){
  return frame("auth / admin", `
    <div class="authwrap">
      <div class="authcard">
        <div class="col gap10" style="align-items:center;text-align:center;margin-bottom:4px;">
          <div class="ph" style="width:48px;height:48px;background:var(--secondary);color:#fff;border:0;">⛊</div>
          <div class="col"><span class="b8 t18 disp">Admin Access</span><span class="t12 muted">Restricted area — staff credentials required</span></div>
        </div>
        <div class="col gap14">
          <div class="col gap6"><span class="t12 b6 muted">Admin Username</span><div class="field ph-only">admin.fsktm</div></div>
          <div class="col gap6"><span class="t12 b6 muted">Password</span><div class="field ph-only">••••••••</div></div>
          <div class="row gap8" style="padding:10px 12px;border:1px dashed var(--warning-deep);border-radius:8px;background:var(--warning-tint);">
            <span class="t11" style="color:var(--warning-deep);">⚠ Admin actions are logged. Authorised faculty staff only.</span>
          </div>
          <button class="btn primary block" data-act="goto" data-target="admin" style="padding:12px;">Enter Admin Board</button>
          <button class="btn block" data-act="adminCancel">Cancel</button>
        </div>
      </div>
    </div>`);
}

/* ============================================================
   P1 — DASHBOARD
   ============================================================ */
function renderP1(){
  const active = activeBookings();
  const vacantNow = active.filter(b=>b.occu==='vacant').length;
  const stats = [
    ["Active Bookings", String(active.length), "Currently held", "bookings", "primary"],
    ["Rooms Used",      String(usedRoomsCount()), "All time", "pin", "secondary"],
    ["Vacancy Alerts",  String(vacantNow), vacantNow?"Needs attention":"All clear", "alert", vacantNow?"warning":"success"],
  ];
  const activeList = active.length ? active.map(b=>{
    const stripeCls = b.occu==='vacant' ? 'warning' : (b.occu==='checked' ? 'success' : '');
    return `
      <div class="lrow">
        <div class="stripe ${stripeCls}"></div>
        <div class="col gap6" style="flex:1;min-width:0;cursor:pointer;" data-act="goto" data-target="mybookings">
          <div class="row gap8 wrap">
            <span class="b7 t14 disp">${b.roomName}</span>
            <span class="tag solid">${b.event}</span>
          </div>
          <span class="t12 muted">${dateLabel(b.day)} · ${fmtT(b.start)} – ${fmtT(b.end)} · ${b.floor}</span>
          ${occuPulse(b)}
        </div>
        <div class="col gap8" style="align-items:flex-end;">
          ${occuActionRow(b)}
        </div>
      </div>`;
  }).join('')
    : `<div style="padding:6px;">${emptyBox(`<span class="svgico" style="width:26px;height:26px;color:var(--primary-deep);">${SVG_ICONS.bookings}</span>`,'No active bookings','When you reserve a room it shows up here and on the calendar.')}</div>`;

  const activity = WF.session.activity.length ? WF.session.activity.map(a=>`
      <div class="lrow" style="gap:10px;">
        <div class="ico" style="width:30px;height:30px;border-radius:8px;">${svgIco('clock','sm')}</div>
        <div class="col" style="flex:1;min-width:0;"><span class="b6 t13">${a.action}</span><span class="t11 muted mono">${a.room}</span></div>
        <span class="t11 muted mono">${a.time}</span>
      </div>`).join('')
    : `<div class="lrow muted t12" style="justify-content:center;padding:22px;">No activity yet.</div>`;

  return shell("app / dashboard", 'dashboard', `
    <header class="topbar">
      <div class="col gap4">
        <span class="b8 t20 disp">Good morning, Ahmad</span>
        <span class="t13 muted">Sunday, 8 June 2026 · FSKTM Faculty of Computing</span>
      </div>
      <div class="row gap8 wrap">
        <button class="btn primary" data-act="goto" data-target="recommend">+ &nbsp;New Booking</button>
      </div>
    </header>
    <div class="scrollpad">
      <div class="stat-row">
        ${stats.map(([l,v,s,g,tone])=>`<div class="stat">
          <div class="box" style="${tone==='success'?'background:var(--success-tint);color:var(--success-deep);':tone==='warning'?'background:var(--warning-tint);color:var(--warning-deep);':tone==='secondary'?'background:var(--secondary-tint);color:var(--secondary-deep);':'color:var(--primary-deep);'}">${svgIco(g)}</div>
          <div class="col"><span class="t12 muted">${l}</span><span class="b8 t22 disp">${v}</span><span class="t10 muted mono">${s}</span></div>
        </div>`).join('')}
      </div>
      <div class="uicard">
        <div class="head"><span class="b7 t15">Active Bookings</span><span class="tag solid">${active.length}</span></div>
        <div>${activeList}</div>
      </div>
      <div class="uicard">
        <div class="head"><span class="b7 t14">Recent Activity</span></div>
        <div>${activity}</div>
      </div>
    </div>`);
}

/* ============================================================
   P2 — RECOMMENDER
   ============================================================ */
/* ---------- dynamic compatibility score ----------
   Reflects how well a room matches the ACTIVE filters, not a fixed number.
   Rooms that fail a hard requirement (capacity/floor/event/facility) are
   excluded entirely before this runs (see renderP2 filter step).
   Among rooms that pass, score = weighted coverage of selected criteria:
   - Facilities: % of requested facilities present, plus a small bonus for
     extra facilities the room has beyond what was asked
   - Capacity: how closely capacity fits the requested minimum (a snug fit
     scores higher than a hugely oversized room)
   - Event type: exact match bonus
   - Floor: exact match bonus
   When no filters are active at all, falls back to a neutral baseline
   score so the list isn't all 100s with nothing selected.
------------------------------------------------------------------ */
function computeScore(r, s){
  const anyFilterActive = s.facilities.length || s.events.length || s.floor!=='Any Floor' || s.cap>5;
  if(!anyFilterActive) return 70;

  let points = 0, maxPoints = 0;

  // Facilities coverage (weight: 50)
  maxPoints += 50;
  if(s.facilities.length){
    const matched = s.facilities.filter(f=>r.fac.includes(f)).length;
    points += 50 * (matched / s.facilities.length);
  } else {
    points += 35;
  }

  // Capacity fit (weight: 25) — reward a snug fit over the minimum
  maxPoints += 25;
  if(s.cap > 5){
    const ratio = r.cap / s.cap;
    let capScore;
    if(ratio < 1) capScore = 0;
    else if(ratio <= 1.3) capScore = 1;
    else capScore = Math.max(0.45, 1 - (ratio-1.3)*0.18);
    points += 25 * capScore;
  } else {
    points += 18;
  }

  // Event type match (weight: 13)
  maxPoints += 13;
  if(s.events.length){
    points += s.events.includes(r.event) ? 13 : 0;
  } else {
    points += 9;
  }

  // Floor match (weight: 12)
  maxPoints += 12;
  if(s.floor !== 'Any Floor'){
    points += (r.floor === s.floor) ? 12 : 0;
  } else {
    points += 9;
  }

  // Bonus: extra facilities beyond what was requested
  if(s.facilities.length){
    const extras = r.fac.filter(f=>!s.facilities.includes(f)).length;
    points += Math.min(extras * 1.5, 5);
  }

  const pct = Math.round((points / maxPoints) * 100);
  return Math.max(40, Math.min(100, pct));
}

function renderP2(){
  const s = WF.p2;
  const filtered = ROOMS
    .filter(r => {
      if(r.cap < s.cap) return false;
      if(s.floor !== 'Any Floor' && r.floor !== s.floor) return false;
      if(s.events.length && !s.events.includes(r.event)) return false;
      if(s.facilities.length && !s.facilities.every(f => r.fac.includes(f))) return false;
      return true;
    })
    .map(r => ({ ...r, score: computeScore(r, s) }))
    .sort((a,b) => b.score - a.score);

  const filters = `
    <aside class="filterpanel">
      <div class="row gap8"><span class="svgico" style="width:16px;height:16px;color:var(--ink-2);">${SVG_ICONS.filter}</span><span class="label-kicker">Filters</span></div>
      <div class="col gap10">
        <div class="row between"><span class="b6 t13">Min. Capacity</span><span class="tag dark">${s.cap} pax</span></div>
        <input type="range" min="5" max="150" value="${s.cap}" data-change="p2cap"
          style="width:100%;accent-color:var(--primary);cursor:pointer;margin:4px 0;" />
        <div class="row between mono t10 muted"><span>5</span><span>150</span></div>
      </div>
      <div class="col gap10">
        <span class="b6 t13">Event Type</span>
        <div class="row gap6 wrap">${EVENT_TYPES.map(e=>`<span class="chip ${s.events.includes(e)?'on':''}" data-act="p2event" data-v="${e}">${e}</span>`).join('')}</div>
      </div>
      <div class="col gap8">
        <span class="b6 t13">Required Facilities</span>
        ${FACILITIES.map(f=>`<label class="row gap10 fac-filter-row" style="cursor:pointer;" data-act="p2fac" data-v="${f}">
          <span class="cbox ${s.facilities.includes(f)?'on':''}">${s.facilities.includes(f)?'✓':''}</span>${svgIco(FAC_ICON[f]||'star','sm')}<span class="t13">${f}</span>
        </label>`).join('')}
      </div>
      <div class="col gap6">
        <span class="b6 t13">Preferred Floor</span>
        ${FLOORS.map(fl=>`<div class="floor-pick-row ${s.floor===fl?'on':''}" data-act="p2floor" data-v="${fl}">
          <span class="t13">${fl}</span>${s.floor===fl?svgIco('check','sm'):''}
        </div>`).join('')}
      </div>
    </aside>`;

  const results = `
    <main class="resultscol">
      <div class="col gap4"><span class="b7 t15 disp">${filtered.length} room${filtered.length!==1?'s':''} matched</span><span class="t11 muted mono">Ranked by compatibility score</span></div>
      ${filtered.length ? filtered.map((r,i)=>`<div class="uicard" data-act="selectRoom" data-room="${r.name}" style="cursor:pointer;${i===0?'border-color:var(--primary);border-width:2px;':''}">
        <div class="row" style="align-items:stretch;min-width:0;">
          <div class="ph img room-photo" style="padding:0;overflow:hidden;">${roomThumb(r.img, r.name)}</div>
          <div class="row" style="flex:1;padding:14px;gap:12px;align-items:flex-start;min-width:0;">
            <div class="col gap6" style="flex:1;min-width:0;">
              <div class="row gap8 wrap">${i===0?'<span class="tag dark">BEST MATCH</span>':''}</div>
              <span class="b7 t15 disp">${r.name}</span>
              <div class="row gap12 wrap muted mono t11"><span class="row gap4">${svgIco('pin','sm')}${r.floor}</span><span class="row gap4">${svgIco('users','sm')}${r.cap} pax</span></div>
              <div class="row gap6 wrap mt4">${r.fac.map(f=>`<span class="tag">${svgIco(FAC_ICON[f]||'star','sm')}${f}</span>`).join('')}</div>
            </div>
            <div class="col gap8" style="align-items:flex-end;flex-shrink:0;">
              <div class="row gap4" style="align-items:baseline;"><span class="b8 t20 disp" style="color:var(--primary-deep);">${r.score}</span><span class="t10 muted mono">/100</span></div>
              <div style="width:60px;height:6px;background:var(--fill-2);border-radius:999px;overflow:hidden;"><div style="height:100%;width:${r.score}%;background:var(--primary);"></div></div>
              <span class="muted mt8">›</span>
            </div>
          </div>
        </div>
      </div>`).join('') : `<div class="col gap12" style="align-items:center;padding:40px;text-align:center;">
        <span style="font-size:32px;">🔍</span>
        <span class="b7 t16">No rooms match your filters</span>
        <span class="t12 muted">Try adjusting capacity, floor, or facilities</span>
      </div>`}
    </main>`;

  return shell("app / recommend", 'recommend', `
    <header class="topbar">
      <div class="row gap12 wrap">
        <button class="btn sm" data-act="goto" data-target="dashboard">← Back</button>
        <div class="col gap4"><span class="b8 t18 disp">Smart Room Recommender</span><span class="t13 muted">Tell us what you need — we'll find the best match.</span></div>
      </div>
      <span class="tag solid">${svgIco('star','sm')}AI-Powered Engine</span>
    </header>
    <div class="subbody">${filters}${results}</div>`);
}

/* ============================================================
   P3 — ADD-ONS & SUMMARY
   ============================================================ */
/* ---------- date picker (real calendar month-grid) ---------- */
function datePickerHTML(){
  const s = WF.p3;
  const y = s.pickerYear, m = s.pickerMonth;
  const first = new Date(y, m, 1);
  const startDow = first.getDay(); // 0=Sun
  const daysInMonth = new Date(y, m+1, 0).getDate();
  const monthLabel = first.toLocaleString('en-US',{month:'long'}) + ' ' + y;
  const todayKey = '2026-06-08'; // prototype "today"

  let cells = '';
  const leadBlanks = startDow===0 ? 6 : startDow-1;
  for(let i=0;i<leadBlanks;i++) cells += `<div class="dp-cell dp-blank"></div>`;
  for(let day=1; day<=daysInMonth; day++){
    const d = new Date(y, m, day);
    const dow = d.getDay();
    const key = d.toISOString().slice(0,10);
    const isWeekend = dow===0 || dow===6;
    const isPast = key < todayKey;
    const disabled = isWeekend || isPast;
    const isSel = s.day===key;
    const isToday = key===todayKey;
    cells += `<div class="dp-cell ${disabled?'dp-disabled':'dp-pick'} ${isSel?'dp-sel':''} ${isToday?'dp-today':''}" ${disabled?'':`data-act="p3day" data-v="${key}"`}>${day}</div>`;
  }
  return `<div class="datepicker">
    <div class="row between" style="margin-bottom:10px;">
      <button class="btn sm" style="padding:5px 8px;" data-act="p3dateNav" data-v="-1" disabled>‹</button>
      <span class="b7 t14 disp">${monthLabel}</span>
      <button class="btn sm" style="padding:5px 8px;" data-act="p3dateNav" data-v="1" disabled>›</button>
    </div>
    <div class="dp-grid dp-head">${['Mo','Tu','We','Th','Fr','Sa','Su'].map(d=>`<div>${d}</div>`).join('')}</div>
    <div class="dp-grid">${cells}</div>
    <div class="row gap8" style="margin-top:10px;padding-top:10px;border-top:1px solid var(--line);">
      <span class="sw" style="background:var(--primary);border-color:var(--primary);"></span><span class="t11 muted">Selected</span>
      <span class="sw" style="background:#fff;margin-left:10px;"></span><span class="t11 muted">Available weekday</span>
    </div>
  </div>`;
}

function renderP3(){
  const s = WF.p3;
  const room = ROOMS.find(r=>r.name===WF.selectedRoom) || ROOMS[0];
  const sel = s.addons;
  const startSel = `<select class="field" data-change="p3start">${TIME_OPTS.map(t=>`<option value="${t}" ${s.start===t?'selected':''}>${fmtT(t)}</option>`).join('')}</select>`;
  const endSel   = `<select class="field" data-change="p3end">${TIME_OPTS.filter(t=>t>s.start).map(t=>`<option value="${t}" ${s.end===t?'selected':''}>${fmtT(t)}</option>`).join('')}</select>`;

  const body = `
    <div class="subbody-scroll">
      <div class="p3grid">
        <div class="col gap16">
          <div class="uicard">
            <div class="head"><span class="label-kicker">Selected Room</span></div>
            <div class="row gap14" style="padding:16px 18px;flex-wrap:wrap;">
              <div class="ph" style="width:64px;height:64px;flex-shrink:0;padding:0;overflow:hidden;">${roomThumb(room.img, room.name)}</div>
              <div class="col gap6" style="flex:1;min-width:0;"><span class="b7 t16 disp">${room.name}</span>
                <div class="row gap8 wrap"><span class="tag">${svgIco('pin','sm')}${room.floor}</span><span class="tag">${svgIco('users','sm')}${room.cap} pax</span><span class="tag dark">${room.event}</span></div>
              </div>
            </div>
          </div>
          <div class="uicard">
            <div class="head"><span class="label-kicker">Date & Time</span></div>
            <div style="padding:16px 18px;" class="col gap14">
              <div class="col gap8" style="position:relative;">
                <span class="t12 b6 muted">Day</span>
                <button class="field row between" data-act="p3dateToggle" style="cursor:pointer;font-family:var(--sans);">
                  <span class="row gap8">${svgIco('calendar','sm')}<span>${dateLabel(s.day)}</span></span>
                  <span style="color:var(--ink-3);">${s.pickerOpen?'▲':'▼'}</span>
                </button>
                ${s.pickerOpen?datePickerHTML():''}
              </div>
              <div class="time-grid">
                <div class="col gap6"><span class="t12 b6 muted">Start</span>${startSel}</div>
                <div class="col gap6"><span class="t12 b6 muted">End</span>${endSel}</div>
              </div>
              <div class="row between" style="padding:12px 16px;border-radius:10px;background:var(--primary-tint);flex-wrap:wrap;gap:8px;">
                <span class="mono b6 t14" style="color:var(--primary-deep);">${fmtT(s.start)}</span>
                <div style="flex:1;min-width:20px;height:2px;background:var(--primary);opacity:.3;margin:0 12px;border-radius:2px;"></div>
                <span class="mono b6 t14" style="color:var(--primary-deep);">${fmtT(s.end)}</span>
              </div>
            </div>
          </div>
          <div class="uicard">
            <div class="head"><div class="col gap4"><span class="label-kicker">Facility Add-On Request</span><span class="t12 muted">Select equipment to attach to your booking.</span></div></div>
            <div style="padding:14px;" class="addon-grid">
              ${ADDONS.map(([id,label,desc])=>{const on=sel[id]!==undefined;return `
                <div class="uicard" data-act="p3addon" data-v="${id}" style="padding:12px;cursor:pointer;box-shadow:none;${on?'border-color:var(--primary);background:var(--primary-tint);':''}">
                  <div class="row between" style="margin-bottom:8px;"><div class="ph" style="width:34px;height:34px;">${ico('')}</div>${on?'<span class="tag dark">✓</span>':''}</div>
                  <div class="b6 t13">${label}</div><div class="t11 muted">${desc}</div>
                  ${on?`<div class="row gap8 mt12" data-noclick>
                    <button class="btn sm" data-act="p3qty" data-v="${id}:-1" style="width:26px;height:26px;padding:0;justify-content:center;">−</button>
                    <span class="mono b6 t13">${sel[id]}</span>
                    <button class="btn sm" data-act="p3qty" data-v="${id}:1" style="width:26px;height:26px;padding:0;justify-content:center;">+</button>
                    <span class="t11 muted mono">unit${sel[id]>1?'s':''}</span></div>`:''}
                </div>`;}).join('')}
            </div>
          </div>
          <div class="uicard">
            <div class="head"><span class="label-kicker">Event Details</span></div>
            <div style="padding:16px;" class="col gap12">
              <label class="row gap10" data-act="p3email" style="cursor:pointer;"><span class="switch ${s.email?'on':''}"><span class="nub"></span></span><span class="t13">✉ Send automated email reminder notification</span></label>
            </div>
          </div>
        </div>
        <div>
          <div class="uicard" style="position:sticky;top:0;">
            <div class="head" style="background:var(--secondary-deep);border-color:var(--secondary-deep);"><span class="b7 t14 disp" style="color:#fff;">Booking Summary</span></div>
            <div style="padding:16px;" class="col gap14">
              <div class="col gap4"><span class="label-kicker">Room</span><span class="b6 t14">${room.name}</span><span class="t11 muted mono">${room.floor} · ${room.cap} pax</span></div>
              <div class="divline"></div>
              <div class="col gap4"><span class="label-kicker">Date</span><span class="b6 t13">${dateLabel(s.day)}</span></div>
              <div class="col gap4"><span class="label-kicker">Time</span><span class="mono b6 t14">${fmtT(s.start)} – ${fmtT(s.end)}</span></div>
              ${Object.keys(sel).length?`<div class="divline"></div><div class="col gap6"><span class="label-kicker">Add-Ons</span>${Object.entries(sel).map(([id,q])=>{const a=ADDONS.find(x=>x[0]===id);return `<div class="row between"><span class="t12">${ico('','sm')} ${a[1]}</span><span class="tag">×${q}</span></div>`;}).join('')}</div>`:''}
              ${s.email?`<div class="row gap8" style="padding:9px 11px;border-radius:8px;background:var(--success-tint);"><span class="t11 mono" style="color:var(--success-deep);">✉ Email reminder active</span></div>`:''}
              <div class="divline"></div>
              <div class="row gap8" style="padding:10px 12px;border-radius:10px;border:1px dashed var(--warning-deep);background:var(--warning-tint);"><span class="t11" style="color:var(--warning-deep);">⚠ Bookings must be cancelled 2 hours prior to avoid penalties.</span></div>
              ${WF.p3.conflictError ? `<div class="row gap8" style="padding:10px 12px;border-radius:10px;border:1px solid var(--error);background:var(--error-tint);"><span class="t11" style="color:var(--error-deep);">✕ ${WF.p3.conflictError}</span></div>` : ""}
              <button class="btn primary block" data-act="confirm" style="padding:12px;">✓ &nbsp;Confirm Reservation</button>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  return shell("app / summary", 'recommend', `
    <header class="topbar">
      <div class="row gap12 wrap">
        <button class="btn sm" data-act="goto" data-target="recommend">← Back</button>
        <div class="col gap4"><span class="b8 t18 disp">Facility Add-Ons & Booking Summary</span><span class="t13 muted">Configure your reservation and confirm.</span></div>
      </div>
      <div class="seg" style="border-color:var(--line-2);background:#fff;"><button class="${!WF.is24h?'on':''}" data-act="time" data-v="12">12h</button><button class="${WF.is24h?'on':''}" data-act="time" data-v="24">24h</button></div>
    </header>
    ${body}`);
}

/* ============================================================
   P4 — CALENDAR
   ============================================================ */
function renderP4(){
  const sel = WF.p4.sel;
  const active = activeBookings();
  const cols = ROOMS.map(r=>r.name);
  const at = (room,day,hour)=> active.find(b=>b.roomName===room && b.day===day && b.start<=hour && b.end>hour);
  const startsAt = (room,day,hour)=> active.find(b=>b.roomName===room && b.day===day && b.start===hour);

  const weekOffset = Math.max(0, Math.min(WEEK_COUNT-1, WF.p4.weekOffset||0));
  const weekDays = ALL_WEEKS[weekOffset] || ALL_WEEKS[0];
  const weekLabel = `${DAY_DATES[weekDays[0]]} – ${DAY_DATES[weekDays[4]]}`;

  let grid = `<div class="calhead cal5"><div></div>${cols.map(r=>`<div>${r}</div>`).join('')}</div>`;
  weekDays.forEach(day=>{
    grid += `<div class="dayband">${dowLabel(day)} · ${DAY_DATES[day]}</div>`;
    HOURS.forEach(hour=>{
      let cells = `<div>${fmtTs(hour)}</div>`;
      cols.forEach(room=>{
        const bk = at(room,day,hour);
        const isStart = startsAt(room,day,hour);
        let cls='cell'; if(bk) cls+=' booked'; if(bk && bk.occu==='vacant') cls+=' vacant'; if(bk && sel===bk.id) cls+=' selcell';
        let inner = (bk && isStart) ? `<div class="ev">${bk.event}${bk.occu==='vacant'?' ⚠':''}</div>` : '';
        const attr = bk ? `data-act="p4book" data-v="${bk.id}"` : '';
        const cur = bk ? 'cursor:pointer;' : 'cursor:default;';
        cells += `<div class="${cls}" ${attr} style="${cur}">${inner}</div>`;
      });
      grid += `<div class="calrow cal5">${cells}</div>`;
    });
  });

  let panel = '';
  if(sel){
    const b = active.find(x=>x.id===sel);
    if(b){
      panel = `<div class="slotpanel">
        <div class="row between" style="margin-bottom:10px;"><span class="b7 t14 disp">${b.event}</span><button class="btn sm" data-act="p4close" style="padding:4px 8px;">✕</button></div>
        <div class="t12 muted mono" style="margin-bottom:4px;">${b.roomName} · ${dateLabel(b.day)}</div>
        <div class="mono b6 t13" style="margin-bottom:8px;">${fmtT(b.start)} – ${fmtT(b.end)}</div>
        ${occuPulse(b)}
        ${Object.keys(b.addons||{}).length?`<div class="row gap6 wrap" style="margin-top:10px;">${Object.entries(b.addons).map(([id,q])=>{const a=ADDONS.find(x=>x[0]===id);return `<span class="tag">${a?a[1]:id} ×${q}</span>`;}).join('')}</div>`:''}
        <div class="t11 muted mono" style="margin-top:10px;">${b.id}</div>
      </div>`;
    }
  }

  const legend = [["Available","#fff",""],["Your Booking","var(--primary-tint)","var(--primary)"],["Vacant — releasing","var(--warning-tint)","var(--warning)"]];
  const hint = active.length===0
    ? `<div class="row gap8" style="padding:10px var(--pad-x);background:var(--primary-tint);border-bottom:1px solid var(--line);flex-wrap:wrap;"><span class="t12" style="color:var(--primary-deep);">No bookings scheduled yet — confirm a reservation and it will appear on this calendar.</span></div>`
    : '';

  return shell("app / calendar", 'calendar', `
    <header class="topbar">
      <div class="col gap4"><span class="b8 t18 disp">FSKTM Venue Calendar</span><span class="t11 muted mono">Your reserved venues · Week view</span></div>
      <div class="row gap8 wrap">
        <div class="seg" style="border-color:var(--line-2);background:#fff;"><button class="${!WF.is24h?'on':''}" data-act="time" data-v="12">12h</button><button class="${WF.is24h?'on':''}" data-act="time" data-v="24">24h</button></div>
      </div>
    </header>
    <div class="row gap8 wrap" style="padding:10px var(--pad-x);border-bottom:1px solid var(--line);background:#fff;">
      <button class="btn sm" style="padding:5px 9px;" data-act="p4weekNav" data-v="-1" ${weekOffset===0?'disabled':''}>‹</button>
      <span class="b7 t14 disp">Week of ${weekLabel}</span>
      <button class="btn sm" style="padding:5px 9px;" data-act="p4weekNav" data-v="1" ${weekOffset===WEEK_COUNT-1?'disabled':''}>›</button>
      <div class="row gap12 wrap" style="margin-left:auto;">${legend.map(([l,c,bc])=>`<span class="row gap6 t11 muted mono"><span class="sw" style="background:${c};${bc?`border-color:${bc};`:''}"></span>${l}</span>`).join('')}</div>
    </div>
    ${hint}
    <div style="overflow:auto;background:#fff;flex:1;position:relative;"><div class="cal" style="--col-count:${cols.length};">${grid}</div>${panel}</div>`);
}

/* ============================================================
   MY BOOKINGS
   ============================================================ */
function renderMyBookings(){
  const active  = activeBookings();
  const pending = pendingBookings();
  const history = historyBookings();
  const bookingRow = (b, isActive)=>{
    const stripeCls = !isActive ? 'muted-s' : (b.occu==='vacant' ? 'warning' : (b.occu==='checked' ? 'success' : ''));
    return `
    <div class="lrow">
      <div class="stripe ${stripeCls}"></div>
      <div class="col gap6" style="flex:1;min-width:0;">
        <div class="row gap8 wrap"><span class="b7 t14">${b.roomName}</span><span class="tag solid">${b.event}</span>${statusTag(b.state)}${b.reported?'<span class="tag">report filed</span>':''}${b.status==='auto-released'?'<span class="tag error">auto-released</span>':''}</div>
        <div class="row gap12 wrap muted mono t12">
          <span>▦ ${dateLabel(b.day)}</span><span>◷ ${fmtT(b.start)} – ${fmtT(b.end)}</span><span>⌂ ${b.floor}</span>
        </div>
        ${Object.keys(b.addons||{}).length?`<div class="row gap6 wrap mt4">${addonChips(b.addons,'sm')}</div>`:''}
        ${isActive?occuPulse(b):''}
      </div>
      <span class="t11 muted mono">${b.id}</span>
      ${isActive?`<div class="row gap8 wrap">
        ${occuActionRow(b)}
        <button class="btn sm" data-act="cancelBk" data-v="${b.id}">✕ Cancel</button>
        <button class="btn sm primary" data-act="endBk" data-v="${b.id}">⏻ End</button>
      </div>`:''}
    </div>`;
  };

  const pendingRow = (b)=>`
    <div class="lrow">
      <div class="stripe warning"></div>
      <div class="col gap6" style="flex:1;min-width:0;">
        <div class="row gap8 wrap"><span class="b7 t14">${b.roomName}</span><span class="tag solid">${b.event}</span>${statusTag(b.state)}</div>
        <div class="row gap12 wrap muted mono t12">
          <span>▦ ${dateLabel(b.day)}</span><span>◷ ${fmtT(b.start)} – ${fmtT(b.end)}</span><span>⌂ ${b.floor}</span>
        </div>
        ${Object.keys(b.addons||{}).length?`<div class="row gap6 wrap mt4">${addonChips(b.addons,'sm')}</div>`:''}
        <span class="t11 muted mono">Awaiting admin approval</span>
      </div>
      <span class="t11 muted mono">${b.id}</span>
      <button class="btn sm" data-act="cancelBk" data-v="${b.id}">✕ Cancel</button>
    </div>`;

  const empty = WF.session.bookings.length===0;
  const inner = empty
    ? `<div class="scrollpad">${emptyBox('◷','No bookings yet','You have not reserved any venues yet. Start a booking and it will appear here.','+ Create New Booking','recommend')}</div>`
    : `<div class="scrollpad">
        <div class="uicard">
          <div class="head"><span class="b7 t15">Pending</span><span class="tag warning">${pending.length}</span></div>
          <div>${pending.length?pending.map(b=>pendingRow(b)).join(''):('<div class="lrow muted t12" style="justify-content:center;padding:22px;">No pending bookings.</div>')}</div>
        </div>
        <div class="uicard">
          <div class="head"><span class="b7 t15">Active</span><span class="tag success">${active.length}</span></div>
          <div>${active.length?active.map(b=>bookingRow(b,true)).join(''):('<div class="lrow muted t12" style="justify-content:center;padding:22px;">No active bookings.</div>')}</div>
        </div>
        <div class="uicard">
          <div class="head"><span class="b7 t15">History</span><span class="tag">${history.length}</span></div>
          <div>${history.length?history.map(b=>bookingRow(b,false)).join(''):('<div class="lrow muted t12" style="justify-content:center;padding:22px;">No past bookings.</div>')}</div>
        </div>
      </div>`;

  return shell("app / my-bookings", 'mybookings', `
    <header class="topbar">
      <div class="col gap4"><span class="b8 t18 disp">My Bookings</span><span class="t13 muted">All venues you've reserved.</span></div>
    </header>
    ${inner}`);
}

/* ============================================================
   REPORTS
   ============================================================ */
function renderReports(){
  const reps = WF.session.reports;
  const inner = reps.length===0
    ? `<div class="scrollpad">${emptyBox('⚠','No reports submitted','After a booking ends you can report room condition issues — your reports appear here.','Go to My Bookings','mybookings')}</div>`
    : `<div class="scrollpad">
        ${reps.map(r=>`<div class="uicard">
          <div class="head"><div class="row gap8 wrap"><span class="b7 t14">${r.roomName}</span><span class="tag dark">${r.status}</span></div><span class="t11 muted mono">${r.id} · ${r.time}</span></div>
          <div style="padding:14px 18px;" class="col gap10">
            ${r.issues.length?`<div class="row gap8 wrap">${r.issues.map(id=>{const c=ISSUE_CHIPS.find(x=>x[0]===id);return `<span class="tag error">${c?c[1]:id}</span>`;}).join('')}</div>`:'<span class="t12 muted">No specific equipment flagged.</span>'}
            ${r.details?`<span class="t13">${r.details}</span>`:''}
          </div>
        </div>`).join('')}
      </div>`;
  return shell("app / reports", 'reports', `
    <header class="topbar">
      <div class="col gap4"><span class="b8 t18 disp">Room Condition Reports</span><span class="t13 muted">Issues you've reported after using a venue.</span></div>
      <span class="tag">${reps.length} total</span>
    </header>
    ${inner}`);
}

/* ============================================================
   P5 — ADMIN SWIPE BOARD
   ============================================================ */
function renderP5(){
  const s = WF.p5;
  const allBookings = WF.session.bookings;
  const pending  = allBookings.filter(b=>b.state==='pending');
  const approved = allBookings.filter(b=>b.state==='active');
  const declined = allBookings.filter(b=>b.status==='declined');
  const released = allBookings.filter(b=>b.status==='auto-released');
  const idx = Math.min(s.idx, Math.max(0,pending.length-1));
  const cur = pending[idx] || null;
  const statRows = [["Pending",pending.length,"warning"],["Approved",approved.length,"success"],["Declined",declined.length,"error"],["Auto-Released",released.length,"error"],["Total",allBookings.length,""]];

  const cardArea = cur ? `
    <div class="row gap16" style="margin-bottom:6px;">
      <button class="btn sm" style="padding:6px 9px;" data-act="p5nav" data-v="-1">‹</button>
      <span class="mono t12 muted">${idx+1} / ${pending.length}</span>
      <button class="btn sm" style="padding:6px 9px;" data-act="p5nav" data-v="1">›</button>
    </div>
    <div class="swipe">
      <div class="pstripe"></div>
      <div class="row between" style="margin-bottom:14px;flex-wrap:wrap;gap:8px;">
        <div class="col gap6" style="min-width:0;">
          <div class="row gap8 wrap"><span class="t11 muted mono">${cur.id}</span><span class="tag warning">PENDING</span></div>
          <span class="b8 t18 disp">${cur.roomName}</span>
          <span class="t11 muted mono">${cur.floor}</span>
        </div>
        <div class="col gap4" style="align-items:flex-end;flex-shrink:0;"><span class="b7 t13">Student</span><span class="t11 muted mono">${cur.id}</span></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;">
        <div class="metsq">${svgIco('calendar','sm')}${dateLabel(cur.day)}</div><div class="metsq">${svgIco('clock','sm')}${fmtT(cur.start)} – ${fmtT(cur.end)}</div>
        <div class="metsq">${svgIco('pin','sm')}${cur.floor}</div><div class="metsq">${svgIco('users','sm')}${cur.cap} pax</div>
      </div>
      <div class="row gap8 wrap" style="margin-bottom:14px;"><span class="tag dark">${cur.event}</span>${addonChips(cur.addons)}</div>
      <div class="t12 muted" style="text-align:center;border-top:1px dashed var(--line-2);padding-top:12px;">
        <span style="color:var(--error-deep);font-weight:700;">✕ ←</span> &nbsp;Drag to decline or approve &nbsp;<span style="color:var(--success-deep);font-weight:700;">→ ✓</span>
      </div>
    </div>
    <div class="swipe-track">
      <div class="swipe-fill" style="position:absolute;top:0;height:100%;width:0;left:0;border-radius:999px;transition:none;pointer-events:none;"></div>
      <span class="swipe-label-decline" style="position:absolute;left:18px;top:50%;transform:translateY(-50%);font-size:12px;font-weight:700;color:var(--error-deep);opacity:0.35;pointer-events:none;">✕ DECLINE</span>
      <span class="swipe-label-approve" style="position:absolute;right:18px;top:50%;transform:translateY(-50%);font-size:12px;font-weight:700;color:var(--success-deep);opacity:0.35;pointer-events:none;">APPROVE ✓</span>
      <div class="swipe-thumb" style="position:absolute;top:4px;left:calc(50% - 25px);width:50px;height:50px;border-radius:50%;background:#cdd6df;box-shadow:0 2px 8px rgba(28,51,80,0.18);display:flex;align-items:center;justify-content:center;cursor:grab;transition:none;">
        <span class="swipe-thumb-icon" style="font-size:19px;color:#fff;pointer-events:none;">⇔</span>
      </div>
    </div>
    <div style="display:none;">
      <button data-act="p5decline">✕ Decline</button>
      <button data-act="p5approve">✓ Approve</button>
    </div>`
  : `<div class="col gap12" style="align-items:center;text-align:center;padding:40px;">
      <div class="ph" style="width:72px;height:72px;border-radius:50%;background:var(--success);color:#fff;border:0;">✓</div>
      <span class="b8 t20 disp">All caught up!</span><span class="t13 muted">No pending booking requests at this time.</span>
      <button class="btn primary mt8" data-act="goto" data-target="calendar">Back to Schedule</button>
    </div>`;

  const processed = [
    ...approved.map(b=>[b.id,'✓','var(--success-deep)']),
    ...declined.map(b=>[b.id,'✕','var(--error-deep)']),
    ...released.map(b=>[b.id,'⏻','var(--error-deep)']),
  ];

  return frame("app / admin", `
    <div class="admin-topbar">
      <div class="row gap12 wrap">
        <button class="btn sm" data-act="goto" data-target="calendar" style="background:transparent;color:#dce6f0;border-color:#3a5878;box-shadow:none;">← Back</button>
        <div class="row gap8"><span class="svgico" style="width:20px;height:20px;color:#9fb3c8;">${SVG_ICONS.shield}</span>
          <div class="col gap4"><span class="b8 t16 disp" style="color:#fff;">Admin Swipe Board</span><span class="t11 mono" style="color:#9fb3c8;">FSKTM Faculty Venue Management</span></div>
        </div>
      </div>
      <div class="row gap10 wrap">
        <span class="tag warning">● ${pending.length} pending</span>
        ${released.length?`<span class="tag error">⏻ ${released.length} auto-released</span>`:''}
        <button class="btn sm" data-act="goto" data-target="calendar" style="background:var(--primary);border-color:var(--primary);color:#fff;">${svgIco('calendar','sm')}Global Schedule</button>
      </div>
    </div>
    <div class="admin-appbody">
      <aside class="admin-sidebar">
        <div class="admin-sidebar-inner">
          <span class="label-kicker">Session Stats</span>
          ${statRows.map(([l,v,tone])=>`<div class="admin-stat-row"><span class="t13">${l}</span><span class="b8 t18 disp" style="${tone==='success'?'color:var(--success-deep);':tone==='warning'?'color:var(--warning-deep);':tone==='error'?'color:var(--error-deep);':''}">${v}</span></div>`).join('')}
          <div style="margin-top:auto;">
            <span class="label-kicker">Processed</span>
            <div class="col gap6 mt8">${processed.length?processed.map(([id,g,c])=>`<div class="row gap8 t11 mono muted"><span style="color:${c};font-weight:700;">${g}</span> ${id}</div>`).join(''):'<span class="t11 muted mono">— none yet —</span>'}</div>
          </div>
        </div>
      </aside>
      <main class="admin-main">
        <div class="admin-main-inner">${cardArea}</div>
      </main>
    </div>`);
}

/* ============================================================
   P6 — DAMAGE REPORT MODAL
   ============================================================ */
function renderP6Overlay(){
  const s = WF.p6;
  const room = WF.session.pendingRoom || WF.selectedRoom;
  return `<div class="overlay">
    <div class="modal">
      <div class="mhead">
        <div class="row between" style="align-items:flex-start;">
          <div class="row gap12">
            <div class="ph" style="width:40px;height:40px;background:rgba(255,255,255,.12);border:0;color:#fff;flex-shrink:0;">⚠</div>
            <div class="col gap4"><span class="t10 mono" style="color:#9fb3c8;letter-spacing:.07em;">POST-USE CHECK</span><span class="b8 t15 disp" style="color:#fff;">Room Condition Report</span></div>
          </div>
          <button class="btn sm" data-act="p6skip" style="background:transparent;border-color:#3a5878;color:#dce6f0;padding:4px 8px;flex-shrink:0;box-shadow:none;">✕</button>
        </div>
        <div class="t13" style="color:#cfdbe8;margin-top:12px;">Your booking for <b style="color:#fff;">${room}</b> has ended. Help us keep the space in great condition.</div>
      </div>
      <div style="padding:18px;" class="col gap16">
        <div class="col gap10">
          <span class="b7 t14">Is there any broken equipment or room issues to report?</span>
          <div class="row gap8 wrap">${ISSUE_CHIPS.map(([id,l])=>`<span class="chip ${s.chips.includes(id)?'on':''}" data-act="p6chip" data-v="${id}">${ico('','sm')}${l}</span>`).join('')}</div>
        </div>
        <div class="col gap6"><span class="t12 b6 muted">Additional details (optional)</span>
          <div class="field area ph-only" style="height:64px;padding-top:11px;">Describe the issue in more detail…</div>
        </div>
        <div class="row gap12" style="padding-top:2px;flex-wrap:wrap;">
          <button class="btn" data-act="p6skip">⤼ No issues, skip</button>
          <button class="btn primary" style="flex:1;min-width:120px;justify-content:center;" data-act="p6submit">➤ &nbsp;Submit Report</button>
        </div>
      </div>
    </div>
  </div>`;
}
function renderP6Submitted(){
  return `<div class="overlay"><div class="modal">
    <div style="padding:44px;" class="col gap12" style="align-items:center;text-align:center;">
      <div class="col gap12" style="align-items:center;text-align:center;">
        <div class="ph" style="width:64px;height:64px;border-radius:50%;background:var(--success);color:#fff;border:0;">✓</div>
        <span class="b8 t18 disp">Report Submitted!</span>
        <span class="t13 muted">Saved to your Reports. Thank you for keeping FSKTM facilities in shape.</span>
      </div>
    </div>
  </div></div>`;
}

window.SCREENS = { renderLogin, renderAdminAuth, renderP1, renderP2, renderP3, renderP4, renderP5, renderMyBookings, renderReports, renderP6Overlay, renderP6Submitted };
