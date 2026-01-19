const i18n = {
    ar: {
        switchBtn: "English", yes: "نعم →", no: "← لا", swipeHint: "يمين للموافقة | يسار للرفض",
        restart: "إعادة الاختبار", suggestedPath: "المسار المقترح", instruction: "انقر على المحطات لاستكشاف المصادر 👇",
        congrats: "مبارك الوصول!",
        questions: [
            { text: "هل تود استكشاف شغفك المهني؟ اسحب لليمين!", icon: "🚀", track: "start" },
            { text: "هل تهتم بتصميم واجهات المواقع وألوانها؟", icon: "🎨", track: "Frontend" },
            { text: "هل يشدك بناء تطبيقات الهواتف الذكية؟", icon: "📱", track: "Mobile" },
            { text: "هل لديك فضول حول الذكاء الاصطناعي؟", icon: "🤖", track: "AI" }
        ],
        journeys: {
            AI: { title: "خبير ذكاء اصطناعي", nodes: [{x:140, y:10, i:"🐍", l:"بايثون"}, {x:70, y:80, i:"📊", l:"البيانات"}, {x:210, y:150, i:"🧠", l:"تعلم الآلة"}, {x:140, y:285, i:"🏆", l:"الاحتراف", w:true}] },
            Frontend: { title: "مطور واجهات", nodes: [{x:140, y:10, i:"📄", l:"HTML/CSS"}, {x:70, y:80, i:"🎨", l:"تصميم UI"}, {x:210, y:150, i:"✨", l:"JavaScript"}, {x:140, y:285, i:"🏆", l:"الاحتراف", w:true}] },
            Mobile: { title: "مطور تطبيقات", nodes: [{x:140, y:10, i:"📱", l:"Dart"}, {x:70, y:80, i:"🚀", l:"Flutter"}, {x:210, y:150, i:"📲", l:"Firebase"}, {x:140, y:285, i:"🏆", l:"الاحتراف", w:true}] }
        }
    },
    en: {
        switchBtn: "العربية", yes: "Yes →", no: "← No", swipeHint: "Right for Yes | Left for No",
        restart: "Restart", suggestedPath: "Suggested Path", instruction: "Click nodes to learn 👇",
        congrats: "Goal Reached!",
        questions: [
            { text: "Want to find your tech passion? Swipe Right!", icon: "🚀", track: "start" },
            { text: "Do you like web design and colors?", icon: "🎨", track: "Frontend" },
            { text: "Do you want to build mobile apps?", icon: "📱", track: "Mobile" },
            { text: "Are you curious about AI?", icon: "🤖", track: "AI" }
        ],
        journeys: {
            AI: { title: "AI Expert", nodes: [{x:140, y:10, i:"🐍", l:"Python"}, {x:70, y:80, i:"📊", l:"Data"}, {x:210, y:150, i:"🧠", l:"ML"}, {x:140, y:285, i:"🏆", l:"Mastery", w:true}] },
            Frontend: { title: "Frontend Dev", nodes: [{x:140, y:10, i:"📄", l:"HTML/CSS"}, {x:70, y:80, i:"🎨", l:"UI Design"}, {x:210, y:150, i:"✨", l:"JavaScript"}, {x:140, y:285, i:"🏆", l:"Mastery", w:true}] },
            Mobile: { title: "Mobile Dev", nodes: [{x:140, y:10, i:"📱", l:"Dart"}, {x:70, y:80, i:"🚀", l:"Flutter"}, {x:210, y:150, i:"📲", l:"Firebase"}, {x:140, y:285, i:"🏆", l:"Mastery", w:true}] }
        }
    }
};

let currentLang = 'ar', currentQuestionIndex = 0, scores = { Frontend: 0, Mobile: 0, AI: 0 }, isDragging = false, startX = 0, currentX = 0;
const card = document.getElementById('mainCard'), container = document.getElementById('cardContainer'), progressBar = document.getElementById('progressBar');

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.getElementById('langSwitcher').innerText = i18n[currentLang].switchBtn;
    document.getElementById('noText').innerText = i18n[currentLang].no;
    document.getElementById('yesText').innerText = i18n[currentLang].yes;
    updateCard();
}

function updateCard() {
    const qList = i18n[currentLang].questions;
    const q = qList[currentQuestionIndex];
    progressBar.style.width = (currentQuestionIndex / (qList.length - 1)) * 100 + "%";
    card.innerHTML = `<div class="icon-main">${q.icon}</div><h3>${q.text}</h3><p style="color:#888; font-size:0.85rem;">${i18n[currentLang].swipeHint}</p>`;
    card.style.transform = 'translateX(0px) rotate(0deg)';
}

function showResult() {
    const best = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    const track = i18n[currentLang].journeys[best] || i18n[currentLang].journeys.AI;
    document.getElementById('hintArea').style.display = 'none';
    container.innerHTML = `
        <div class="card" style="height:auto; opacity:1; cursor:default">
            <h3 style="color:var(--primary-color)">${i18n[currentLang].suggestedPath}</h3>
            <h2>${track.title}</h2>
            <div class="map-container">
                <svg viewBox="0 0 280 320"><path class="path-line" d="M140 30 C50 90, 50 120, 140 160 C230 200, 230 240, 140 280" /></svg>
                ${track.nodes.map(n => `
    <a href="${n.u}" target="_blank" class="node ${n.w ? 'winner' : ''}" 
       style="top:${n.y}px; left:${n.x-24}px; text-decoration: none;">
       ${n.i}
    </a>
    <div class="node-label" style="top:${n.y+45}px; left:${n.x-35}px">${n.l}</div>
`).join('')}
            </div>
            <button onclick="location.reload()">${i18n[currentLang].restart}</button>
        </div>`;
}

function startDrag(e) { isDragging = true; startX = e.clientX || e.touches[0].clientX; card.style.transition = 'none'; }
function moveDrag(e) { 
    if (!isDragging) return;
    currentX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
    let deltaX = currentX - startX;
    card.style.transform = `translateX(${deltaX}px) rotate(${deltaX / 15}deg)`;
}
function endDrag() {
    if (!isDragging) return; isDragging = false;
    let deltaX = currentX - startX;
    if (Math.abs(deltaX) > 100) {
        if (deltaX > 0 && currentQuestionIndex > 0) scores[i18n[currentLang].questions[currentQuestionIndex].track]++;
        currentQuestionIndex++;
        currentQuestionIndex < i18n[currentLang].questions.length ? updateCard() : showResult();
    } else {
        card.style.transition = '0.5s'; card.style.transform = 'translateX(0px) rotate(0deg)';
    }
}

card.addEventListener('mousedown', startDrag); card.addEventListener('touchstart', startDrag);
window.addEventListener('mousemove', moveDrag); window.addEventListener('touchmove', moveDrag);
window.addEventListener('mouseup', endDrag); window.addEventListener('touchend', endDrag);
updateCard();