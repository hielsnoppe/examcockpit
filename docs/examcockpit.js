// import './data.js';

// import CircleProgress from './circle-progress.min.js'

const msh = 1000 * 60 * 60;
const msm = 1000 * 60;
const mss = 1000;
const units = {
    hours: 1000 * 60 * 60,
    minutes: 1000 * 60,
    seconds: 1000
}

// const formatTime = new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit" }).format;
const formatTime = (milliseconds) => {
    return (new Date(milliseconds)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const formatDuration = (milliseconds) => {
    
    if (milliseconds <= 0) return '00:00:00';

    let ms = milliseconds;
    const h = Math.floor(ms / msh)
    ms = ms - h * msh;
    const m = Math.floor(ms / msm);
    ms = ms - m * msm;
    const s = Math.floor(ms / mss);

    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0': '') + m + ':' + (s < 10 ? '0' : '') + s;
}

const formatDate = (milliseconds) => {
    return (new Date(milliseconds)).toLocaleDateString();
}

function onLoad () {

    var flightinfo = {
        scheduled: (new Date(2024, 2-1, 9, 10, 0, 0)).getTime(),
        duration: 90 * units.minutes,
        pilot: 'Niels Hoppe',
        title: 'Tools and Methods of Data Analysis',
        subtitle: 'Written Examination'
    }

    const e_body = document.body;
    const e_starttime = document.getElementById('starttime');
    const e_endtime = document.getElementById('endtime');
    
    const e_wc = document.getElementById('wc_occupied');
    const e_seatbelt = document.getElementById('seatbelt');
    const e_submit = document.getElementById('submissions_accepted');
    
    const e_duration = document.getElementById('duration');
    const btn_start = document.getElementById('btn-start');
    const e_night = document.getElementById('theme-night');

    const e_progress = document.getElementById('progress');
    e_progress.textFormat = (value) => formatDuration(value);

    var duration = 10 * mss;
    var starttime, endtime;
    var countdown;
    var step = 0;

    const flightplan = [
        { 'at': 0.0, 'do': () => { setSeatbelt(true); setCollect(false) } },
        { 'at': 0.1, 'do': () => setSeatbelt(false) },
        { 'at': 0.5, 'do': () => setCollect(true) },
        { 'at': 0.9, 'do': () => setCollect(false) },
        { 'at': 1.0, 'do': () => { setSeatbelt(true); setCollect(true) } },
    ]

    function init () {
        e_starttime.innerHTML = formatTime(flightinfo.scheduled);
        e_endtime.innerHTML = formatTime(flightinfo.scheduled + flightinfo.duration);
        e_duration.value = flightinfo.duration / units.minutes;
    }
    
    function start () {
        duration = e_duration.value * units.minutes;
        starttime = Date.now();
        endtime = starttime + duration;
        countdown = window.setInterval(tick, 100);

        e_body.classList.remove('preflight');
        e_body.classList.add('departed');

        e_starttime.innerHTML = formatTime(starttime);
        e_endtime.innerHTML = formatTime(endtime);
        e_progress.max = duration;
    }

    function land () {
        setSeatbelt(true);
        window.clearInterval(countdown);
        e_body.classList.remove('departed');
        e_body.classList.add('landed');
    }

    function park () {
        setSeatbelt(false);
    }

    function checkFlightplan (remaining, percent) {
        
        const current = flightplan[step];
        if (!current) return;

        const active_rel = (current['at'] < 1 && current['at'] <= 1 - percent);
        //const active_abs = (current['at'] >= 1 && current['at'] >= remaining);
        const active_abs = false;
        
        if (active_abs || active_rel) {
            current['do']();
            step = step + 1;
        }
    }

    function setToilet (occupied) {
        w_wc.checked = occupied;
    }

    function setSeatbelt (turbulence) {
        e_wc.disabled = turbulence;
        e_seatbelt.checked = turbulence;
    }

    function setCollect (accepted) {
        e_submit.checked = accepted;
    }
    
    function tick () {
        const remaining = endtime - Date.now();
        const percent = remaining / duration;

        e_progress.value = remaining;

        checkFlightplan(remaining, percent);
    
        if (remaining <= 0) {
            land();
        }
    }

    function handleClickSeatbelt (event) {
        setSeatbelt(event.target.checked)
    }

    function handleClickNight () {
        document.body.classList.remove('day', 'night');
        const _class = e_night.checked ? 'night' : 'day';
        document.body.classList.add(_class);
    }

    btn_start.addEventListener('click', start);
    e_night.addEventListener('click', handleClickNight);
    e_seatbelt.addEventListener('click', handleClickSeatbelt);

    init();
}

document.addEventListener('DOMContentLoaded', onLoad);