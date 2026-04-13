//DOM References
const terminalOverlay = document.getElementById('terminal-overlay');
const terminalInput   = document.getElementById('terminal-input');
const terminalHistory = document.getElementById('terminal-history');
const rootBody        = document.getElementById('root-body');
const introOverlay    = document.getElementById('intro-overlay');
//Boot Sequence
document.addEventListener('DOMContentLoaded', () => {
  const INTRO_DURATION = 2500;
  setTimeout(() => {
    introOverlay.style.display = 'none';
    document.querySelectorAll('.load-sequenced').forEach((comp) => {
      const randomDelay = Math.random() * 1500;
      setTimeout(() => { comp.classList.add('flicker-in-active'); }, randomDelay);
    });
  startUptimeInterval();
  startFastRandomizer1();  // 0.5s: LIVE_SYSTEM_LOGS, FPS/BUFFER/COORD, TECHNICAL_METADATA (VECTOR X/Y/Z/V)

  startSlowRandomizer2();  // 0.5s: Uplink/Signal/Latency, TECHNICAL_LOG
  }, INTRO_DURATION);
});
// Centralized Randomizer 1 & 2 + Uptime preserved
const sessionStart = Date.now();
function formatUptime(ms) {
  const t = Math.floor(ms / 1000);
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
}
let cpuCurrent = 8, cpuTarget = 8;
function nextCpuTarget() {
  const spike = Math.random() < 0.08 ? 40 + Math.random() * 50 : 0;
  cpuTarget = Math.min(99, Math.max(2, 10 + (Math.random()-0.5)*10 + spike));
}
function updateCpu() {
  cpuCurrent += (cpuTarget - cpuCurrent) * 0.12;
  const el = document.getElementById('stat-temp');
  const bar = document.getElementById('stat-temp-bar');
  if (!el || !bar) return;
  el.textContent = Math.round(cpuCurrent) + '%';
  if (cpuCurrent < 40)      { el.style.color='#ffffff'; bar.style.background='#ffffff'; }
  else if (cpuCurrent < 70) { el.style.color='#ffe08b'; bar.style.background='#ffe08b'; }
  else                       { el.style.color='#ff4444'; bar.style.background='#ff4444'; }
  bar.style.width = cpuCurrent.toFixed(1) + '%';
}
function updateMemory() {
  const el = document.getElementById('stat-mem');
  const bar = document.getElementById('stat-mem-bar');
  if (!el || !bar) return;
  let pct;
  if (window.performance && performance.memory && performance.memory.jsHeapSizeLimit > 0) {
    pct = Math.round((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100);
  } else {
    const prev = parseFloat(el.textContent) || 20;
    pct = Math.round(Math.min(99, Math.max(5, prev + (Math.random()-0.48)*3)));
  }
  el.textContent = pct + '%';
  bar.style.width = pct + '%';
}
function startUptimeInterval() {
  const el = document.getElementById('stat-uptime');
  if (el) el.textContent = formatUptime(0);
  setInterval(() => {
    const el = document.getElementById('stat-uptime');
    if (el) el.textContent = formatUptime(Date.now() - sessionStart);
    const mu = document.getElementById('meta-uptime');
    if (mu) mu.textContent = formatUptime(Date.now() - sessionStart);
  }, 1000);
  nextCpuTarget();
  setInterval(nextCpuTarget, 3500);  // ~3.5s avg for CPU spikes
  updateCpu(); updateMemory();
  setInterval(updateMemory, 3000);
}
function rnd(min, max, decimals) {
  const v = Math.random() * (max - min) + min;
  return decimals ? v.toFixed(decimals) : Math.round(v);
}
let logSeq = 77402;
//FAST TICKER — 0.5s unified: FPS + BUFFER + CPU + SYS LOGS
let fpsCurrent = 60;
function nextFps() {
  const dip = Math.random() < 0.05 ? -(20 + Math.random()*20) : 0;
  fpsCurrent = Math.min(60, Math.max(24, fpsCurrent + (Math.random()-0.5)*1.5 + dip));
  fpsCurrent += (60 - fpsCurrent) * 0.08;
}
const BUFFER_VALS = ['512KB','768KB','1024KB','1280KB','1536KB','2048KB'];
let bufferIdx = 2;
function nextBuffer() {
  if (Math.random() < 0.15) bufferIdx = Math.floor(Math.random()*BUFFER_VALS.length);
}
const SYSTEM_LOG_POOL = [
  { tag:'[INFO]',  cls:'text-tertiary',  msgs:[
    'UPLINK_ESTABLISHED_THROUGH_SAT_RELAY_04',
    'HEARTBEAT_SIGNAL_RECEIVED_FROM_FIELD_UNIT_BRAVO',
    'HEARTBEAT_SIGNAL_RECEIVED_FROM_FIELD_UNIT_ALPHA',
    'PACKET_SYNC_COMPLETE_NODE_07',
    'SATELLITE_HANDSHAKE_CONFIRMED_RELAY_11',
    'RECONNECTION_SUCCESSFUL_VIA_BACKUP_CHANNEL',
    'SECTOR_SWEEP_INITIATED_ZONE_4G',
    'DRONE_FEED_AUTHENTICATED_UNIT_DELTA',
    'COMM_BURST_RECEIVED_FROM_BASE_STATION',
    'FIELD_AGENT_STATUS_REPORT_LOGGED',
  ]},
  { tag:'[DEBUG]', cls:'text-white/40', msgs:[
    'DECRYPTING_PACKET_HASH_8829_AA_FF',
    'BUFFER_FLUSH_TRIGGERED_AT_THRESHOLD_80PCT',
    'CHECKSUM_VERIFIED_BLOCK_0xF4A2',
    'CACHE_INVALIDATED_SESSION_TOKEN_EXPIRED',
    'POLLING_INTERVAL_ADJUSTED_TO_250MS',
    'MEMORY_PAGE_SWAP_DETECTED_ADDR_0x3B00',
    'ASYNC_WORKER_SPAWNED_THREAD_ID_14',
    'LATENCY_JITTER_MEASURED_4MS_VARIANCE',
  ]},
  { tag:'[WARN]',  cls:'text-secondary', msgs:[
    'UNAUTHORIZED_ACCESS_ATTEMPT_DETECTED_FROM_IP:192.168.1.104',
    'SIGNAL_DEGRADATION_DETECTED_SECTOR_7G',
    'ENCRYPTION_KEY_ROTATION_OVERDUE_BY_48H',
    'ANOMALOUS_PACKET_PATTERN_FROM_NODE_03',
    'FIELD_UNIT_CHARLIE_SIGNAL_WEAK',
    'PROXY_ROUTE_UNSTABLE_REROUTING...',
    'INTRUSION_SIGNATURE_FLAGGED_CLASS_B',
    'HIGH_LATENCY_BURST_220MS_DETECTED',
  ]},
  { tag:'[SYS]',  cls:'text-white/40', msgs:[
    'MEMORY_FLUSH_SEQUENCE_COMPLETE',
    'WATCHDOG_TIMER_RESET',
    'KERNEL_MODULE_RELOADED_ATHERNA_CORE',
    'SYSTEM_HEALTH_CHECK_PASSED',
    'LOG_ROTATION_TRIGGERED_SIZE_LIMIT_REACHED',
    'GARBAGE_COLLECTION_CYCLE_COMPLETE',
    'PROCESS_TABLE_COMPACTED',
    'SCHEDULED_TASK_EXECUTED_JOB_ID_0044',
  ]},
];
function getTimestamp() {
  const now = new Date();
  return String(now.getHours()).padStart(2,'00')+':'+
         String(now.getMinutes()).padStart(2,'00')+':'+
         String(now.getSeconds()).padStart(2,'00');
}
function pickRandom(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
let logTickCount = 0, logNextFire = 3 + Math.floor(Math.random()*6);
function appendSystemLog() {
  const container = document.getElementById('system-log-feed');
  if (!container) return;
  const entry = pickRandom(SYSTEM_LOG_POOL);
  const msg   = pickRandom(entry.msgs);
  const row   = document.createElement('div');
  row.className = 'flex gap-4';
  row.innerHTML =
    '<span class="text-white/20 shrink-0">'+getTimestamp()+'</span>'+
    '<span class="shrink-0 '+entry.cls+'">'+entry.tag+'</span>'+
    '<span class="'+(entry.tag==='[WARN]'?entry.cls:'')+'">' +msg+'</span>';
  container.appendChild(row);
  while (container.children.length > 80) container.removeChild(container.firstChild);
  container.scrollTop = container.scrollHeight;
}
function startFastRandomizer1() {
  // Init system log
  const sysLog = document.getElementById('system-log-feed');
  if (sysLog) sysLog.innerHTML = '';
  appendSystemLog();
  // 0.25s fast loop
  setInterval(() => {
    // FPS, BUFFER, COORD/LOC_TRACKER
    nextFps();
    const fpsEl = document.getElementById('hud-fps');
    if (fpsEl) fpsEl.textContent = fpsCurrent.toFixed(2);
    nextBuffer();
    const bufEl = document.getElementById('hud-buffer');
    if (bufEl) bufEl.textContent = BUFFER_VALS[bufferIdx];
    // VECTOR_COORDINATES meta + loc (TECHNICAL_METADATA)
    const metaX = document.getElementById('meta-x');
    const metaY = document.getElementById('meta-y');
    const metaZ = document.getElementById('meta-z');
    const metaV = document.getElementById('meta-v');  // renamed from w
    if (metaX) metaX.textContent = rnd(100, 200, 2);
    if (metaY) metaY.textContent = rnd(0, 10, 2);
    if (metaZ) metaZ.textContent = rnd(800, 950, 2);
    if (metaV) metaV.textContent = rnd(800, 1800) + ' km/h';

    // COORD & ALT under FPS/BUFFER
    const coordEl = document.querySelector('#ui-mission p[ class="mt-1 text-white font-mono text-[9px] uppercase tracking-widest"]');
    const altEl = coordEl ? coordEl.nextElementSibling : null;
    if (coordEl) {
      const lat = (34 + (Math.random() - 0.5) * 2).toFixed(4);
      const lon = (-118 + (Math.random() - 0.5) * 1).toFixed(4);
      coordEl.innerHTML = `COORD: ${lat}° N, ${lon}° W`;
    }
    if (altEl) {
      altEl.textContent = `ALT: ${Math.floor(10000 + Math.random() * 5000).toLocaleString()} FT`;
    }
    // LIVE_SYSTEM_LOGS every 0.5s
    appendSystemLog();
    updateCpu();
  }, 500);
}
//TECHNICAL LOG — own independent randomizer (2–6s)
const TECH_LOG_POOL = [
  { tag:'[OK]',  cls:'text-primary', msgs:[
    'COMMS_LINK_ESTABLISHED_0x442A',
    'RE-ROUTE_THRU_PROXY_88.1.10.1',
    'SENTINEL_DRONE_LAUNCH_SUCCESS',
    'TARGET_ACQUIRED_40.7128N',
    'UPLINK_STABLE_BITRATE_50MBPS',
    'ENCRYPTION_HANDSHAKE_COMPLETE',
    'FIREWALL_RULE_APPLIED_ZONE_C',
    'DATA_INTEGRITY_VERIFIED_BLOCK_FF',
    'RELAY_NODE_SYNCED_ID_0x9A',
    'SYSTEM_IDLE_AWAITING_INPUT',
    'AUTH_TOKEN_REFRESHED_TTL_3600',
    'BACKUP_CHANNEL_ONLINE_RELAY_B2',
  ]},
  { tag:'[WRN]', cls:'text-secondary', msgs:[
    'ENCRYPTION_LAYER_3_FAIL_RETRYING...',
    'LATENCY_SPIKE_DETECTED_120MS',
    'PACKET_LOSS_THRESHOLD_EXCEEDED_2PCT',
    'NODE_RESPONSE_TIMEOUT_ID_0x7F',
    'CHECKSUM_MISMATCH_BLOCK_0xC3',
    'BUFFER_OVERFLOW_RISK_AT_78PCT',
    'TLS_CERT_EXPIRY_IN_72H',
    'SIGNAL_NOISE_RATIO_DEGRADED',
  ]},
  { tag:'[INF]', cls:'text-tertiary', msgs:[
    'PARSING_INTEL_STREAM_0xFFA21',
    'LOG_ENTRY_ARCHIVED_SEQ_77403',
    'SECTOR_MAP_UPDATED_GRID_REF_J4',
    'AGENT_CALLSIGN_REGISTERED_BRAVO',
    'PRIORITY_QUEUE_DEPTH_12_ITEMS',
    'BANDWIDTH_USAGE_34MBPS_CURRENT',
    'SESSION_UPTIME_MILESTONE_1H',
    'DIAGNOSTIC_SNAPSHOT_CAPTURED',
  ]},
];
function appendTechLog(customRow) {
  const container = document.getElementById('tech-log-feed');
  if (!container) return;
  let row;
  if (customRow) {
    row = customRow;
  } else {
    const entry = pickRandom(TECH_LOG_POOL);
    const msg   = pickRandom(entry.msgs);
    row = document.createElement('div');
    row.className = 'flex gap-3';
    row.innerHTML =
      '<span class="text-primary/40 shrink-0">'+getTimestamp()+'</span>'+
      '<span class="shrink-0 '+entry.cls+'">'+entry.tag+'</span>'+
      '<span class="'+(entry.tag==='[WRN]'?entry.cls:'')+'">' +msg+'</span>';
  }
  const cursor = document.getElementById('tech-log-cursor');
  if (cursor) container.insertBefore(row, cursor);
  else container.appendChild(row);
  const rows = container.querySelectorAll('div:not(#tech-log-cursor)');
  if (rows.length > 60) rows[0].remove();
  container.scrollTop = container.scrollHeight;
}
function startSlowRandomizer2() {
  // TECHNICAL_LOG 1s
  setInterval(() => {
    appendTechLog();
  }, 1000);
  // Uplink, Signal, Latency HUD/meta 1s + LOC_TRACKER x/y/z/v
  setInterval(() => {
    const signalPct = rnd(82, 100);
    const latency   = rnd(8, 45);
    const uplink    = signalPct > 88 ? 'ACTIVE' : 'DEGRADED';
    const hudUplink  = document.getElementById('hud-uplink');
    const hudSignal  = document.getElementById('hud-signal');
    const hudLatency = document.getElementById('hud-latency');
    if (hudUplink)  { hudUplink.textContent = uplink; hudUplink.style.color = uplink==='ACTIVE'?'':'#ff4444'; }
    if (hudSignal)  hudSignal.textContent  = signalPct + '%';
    if (hudLatency) hudLatency.textContent = latency + 'ms';
    // TECHNICAL_METADATA status/signal/logseq
    const metaStatus = document.getElementById('meta-status');
    const metaSignal = document.getElementById('meta-signal');
    const metaLogseq = document.getElementById('meta-logseq');
    if (metaStatus) { metaStatus.textContent = signalPct>85?'OK':'WARN'; metaStatus.style.color = signalPct>85?'#ffffff':'#ff4444'; }
    if (metaSignal) metaSignal.textContent = signalPct + '% STRENGTH';
    if (metaLogseq) { logSeq += Math.floor(Math.random()*3+1); metaLogseq.textContent = logSeq; }
    // LOC_TRACKER x/y/z/v (moved to 1s slow randomizer)
    const locX = document.getElementById('loc-x');
    const locY = document.getElementById('loc-y');
    const locZ = document.getElementById('loc-z');
    const locV = document.getElementById('loc-v');
    if (locX) locX.textContent = rnd(100, 150, 5);
    if (locY) locY.textContent = (Math.random()<0.5?'-':'') + rnd(75, 125, 5);
    if (locZ) locZ.textContent = rnd(0, 100, 5).toString().padStart(8,'0');
    if (locV) locV.textContent = rnd(10, 65) + 'km/h';
  }, 1000);
}
//Admin Message
function sendAdminMessage() {
  const input = document.getElementById('admin-input');
  if (!input) return;
  const msg = input.value.trim();
  if (!msg) return;
  const row = document.createElement('div');
  row.className = 'flex gap-3';
  row.innerHTML =
    '<span class="text-primary/40 shrink-0">'+getTimestamp()+'</span>'+
    '<span class="shrink-0 font-bold" style="color:#7ec8e3;">[CMD]</span>'+
    '<span class="font-bold" style="color:#7ec8e3;">'+msg.toUpperCase()+'</span>';
  appendTechLog(row);
  input.value = '';
  input.focus();
}

// Enter key support for admin input
document.addEventListener('DOMContentLoaded', () => {
  const adminInput = document.getElementById('admin-input');
  if (adminInput) {
    adminInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendAdminMessage();
      }
    });
  }
});
//TERMINAL
function toggleTerminal() {
  terminalOverlay.classList.toggle('hidden');
  if (!terminalOverlay.classList.contains('hidden')) terminalInput.focus();
}
terminalInput.addEventListener('keypress', function(e) {
  if (e.key !== 'Enter') return;
  const cmd = this.value.trim().toLowerCase();
  const historyItem = document.createElement('div');
  historyItem.textContent = '> ' + this.value;
  terminalHistory.appendChild(historyItem);
  if (cmd === 'exit') {
    const r = document.createElement('div');
    r.className = 'text-secondary';
    r.textContent = 'SYSTEM_TERMINATED. INITIATING SHUTDOWN...';
    terminalHistory.appendChild(r);
    setTimeout(() => {
      rootBody.classList.add('sim-shutdown');
      setTimeout(() => { document.body.innerHTML=''; document.body.style.backgroundColor='black'; }, 600);
    }, 1000);
  } else if (cmd !== '') {
    const r = document.createElement('div');
    r.className = 'text-error';
    r.textContent = 'COMMAND_NOT_FOUND: "' + cmd + '" IS NOT RECOGNIZED.';
    terminalHistory.appendChild(r);
  }
  this.value = '';
  terminalHistory.scrollTop = terminalHistory.scrollHeight;
});
//SPOTIFY WIDGET
function toggleSpotify() {
  const widget = document.getElementById('spotify-widget');
  const icon   = document.getElementById('music-icon');
  widget.classList.toggle('hidden');
  icon.textContent = widget.classList.contains('hidden') ? 'music_off' : 'music_note';
}
function closeSpotify() {
  const widget = document.getElementById('spotify-widget');
  const icon   = document.getElementById('music-icon');
  widget.classList.add('hidden');
  icon.textContent = 'music_off';
}