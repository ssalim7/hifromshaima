// ai-widget.js
(function () {
  // ---------- 1. Inject CSS for the widget ----------
  const css = `
    .ai-chat-launcher{
      position:fixed;
      right:1.25rem;
      bottom:1.25rem;
      width:54px;
      height:54px;
      border-radius:50%;
      border:2px solid var(--burgundy, #7A1F2B);
      background:var(--paper, #ffffff);
      color:var(--burgundy, #7A1F2B);
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:1.5rem;
      box-shadow:0 10px 24px rgb(0 0 0 / 0.18);
      cursor:pointer;
      z-index:70;
    }
    .ai-chat-launcher span{
      transform:translateY(1px);
    }

    .ai-chat-window{
      position:fixed;
      right:1.25rem;
      bottom:4.5rem;
      width:320px;
      max-width:90vw;
      background:var(--paper, #ffffff);
      border-radius:16px;
      box-shadow:0 16px 40px rgb(0 0 0 / 0.25);
      border:1px solid var(--smoke, #e9eaec);
      display:none;
      flex-direction:column;
      overflow:hidden;
      z-index:70;
      font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,"Helvetica Neue",Arial;
    }
    .ai-chat-window.open{display:flex;}

    .ai-chat-header{
      padding:.6rem .8rem;
      background:linear-gradient(135deg,var(--burgundy, #7A1F2B),var(--charcoal, #1F1F1F));
      color:#fff;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:.5rem;
    }
    .ai-chat-header-title{
      font-size:.9rem;
      font-weight:600;
    }
    .ai-chat-header-pill{
      font-size:.7rem;
      padding:.15rem .45rem;
      border-radius:999px;
      background:rgba(255,255,255,.14);
    }
    .ai-chat-close{
      border:none;
      background:transparent;
      color:#fff;
      cursor:pointer;
      font-size:1rem;
    }

    .ai-chat-body{
      padding:.6rem .6rem .5rem;
      max-height:260px;
      overflow-y:auto;
      font-size:.85rem;
      background:var(--mist, #f4f4f5);
      color:var(--text, #111113);
    }
    .ai-msg{
      margin:.25rem 0;
      display:flex;
    }
    .ai-msg.ai-bot{justify-content:flex-start;}
    .ai-msg.ai-user{justify-content:flex-end;}
    .ai-bubble{
      padding:.35rem .55rem;
      border-radius:12px;
      max-width:80%;
      line-height:1.4;
    }
    .ai-bot .ai-bubble{
      background:var(--paper, #ffffff);
      border:1px solid var(--smoke, #e9eaec);
    }
    .ai-user .ai-bubble{
      background:var(--burgundy, #7A1F2B);
      color:#fff;
    }

    .ai-chat-footer{
      border-top:1px solid var(--smoke, #e9eaec);
      padding:.4rem;
      background:var(--paper, #ffffff);
      display:flex;
      gap:.35rem;
    }
    .ai-chat-input{
      flex:1;
      border-radius:999px;
      border:1px solid var(--smoke, #e9eaec);
      padding:.3rem .6rem;
      font-size:.8rem;
      outline:none;
      background:var(--paper, #ffffff);
      color:var(--text, #111113);
    }
    .ai-chat-input:focus{
      border-color:var(--burgundy, #7A1F2B);
    }
    .ai-chat-send{
      border-radius:999px;
      border:none;
      padding:.3rem .7rem;
      font-size:.8rem;
      background:var(--burgundy, #7A1F2B);
      color:#fff;
      cursor:pointer;
    }
    .ai-chat-send:hover{
      filter:brightness(1.05);
    }

    @media (max-width:600px){
      .ai-chat-window{
        right:.6rem;
        bottom:4rem;
        width:92vw;
      }
      .ai-chat-launcher{
        right:.7rem;
        bottom:1rem;
      }
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ---------- 2. Create launcher + chat window HTML ----------
  const launcher = document.createElement('button');
  launcher.className = 'ai-chat-launcher';
  launcher.type = 'button';
  launcher.setAttribute('aria-label', 'Open chat assistant');
  launcher.innerHTML = '<span>💬</span>';

  const chat = document.createElement('div');
  chat.className = 'ai-chat-window';
  chat.id = 'ai-chat';
  chat.innerHTML = `
    <div class="ai-chat-header">
      <div>
        <div class="ai-chat-header-title" id="ai-chat-title">24/7 Site Assistant</div>
        <div class="ai-chat-header-pill" id="ai-chat-pill">General helper</div>
      </div>
      <button class="ai-chat-close" type="button" aria-label="Close chat">✕</button>
    </div>
    <div class="ai-chat-body" id="ai-chat-body"></div>
    <form class="ai-chat-footer" id="ai-chat-form">
      <input
        type="text"
        class="ai-chat-input"
        id="ai-chat-input"
        placeholder="Ask me something..."
        autocomplete="off"
      />
      <button class="ai-chat-send" type="submit">Send</button>
    </form>
  `;

  document.body.appendChild(launcher);
  document.body.appendChild(chat);

  // ---------- 3. Wire up behaviour ----------
  const body = chat.querySelector('#ai-chat-body');
  const form = chat.querySelector('#ai-chat-form');
  const input = chat.querySelector('#ai-chat-input');
  const closeBtn = chat.querySelector('.ai-chat-close');
  const titleEl = chat.querySelector('#ai-chat-title');
  const pillEl = chat.querySelector('#ai-chat-pill');

  const path = window.location.pathname.toLowerCase();
  const isRestaurantPage = path.includes('showcase'); // Nori & Ember page

  if (isRestaurantPage) {
    titleEl.textContent = 'Nori-Bot — Menu & Concept Helper';
    pillEl.textContent = 'Restaurant AI assistant';
  } else {
    titleEl.textContent = '24/7 Portfolio Assistant';
    pillEl.textContent = 'General site helper';
  }

  function addMessage(text, from){
    const wrap = document.createElement('div');
    wrap.className = 'ai-msg ' + (from === 'user' ? 'ai-user' : 'ai-bot');
    const bubble = document.createElement('div');
    bubble.className = 'ai-bubble';
    bubble.textContent = text;
    wrap.appendChild(bubble);
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }

  function initialGreeting(){
    body.innerHTML = '';
    if(isRestaurantPage){
      addMessage(
        'Hi, I\'m Nori-Bot 🍜 — here 24/7 to talk about the Nori & Ember concept, menu ideas, and location. Ask about dishes, target customers, or why Salford works.',
        'bot'
      );
    }else{
      addMessage(
        'Hi, I\'m your 24/7 site assistant 🤖 — I can explain Shaima\'s skills, this project, or how to get in touch.',
        'bot'
      );
    }
  }

  function getBotReply(message){
    const msg = message.toLowerCase();

    if(isRestaurantPage){
      if(msg.includes('menu') || msg.includes('food') || msg.includes('dish')){
        return 'Nori & Ember focuses on Japanese-inspired bowls, grilled skewers and small plates — designed to be comforting, affordable, and easy to customise for students and young professionals.';
      }
      if(msg.includes('location') || msg.includes('where') || msg.includes('salford')){
        return 'The concept location is around Salford Quays / MediaCity — close to tram links, student housing and offices, which supports both daytime and evening trade.';
      }
      if(msg.includes('target') || msg.includes('customer') || msg.includes('audience')){
        return 'The main target customers are students, young professionals, and local residents looking for somewhere cosier than fast food, but still affordable and relaxed.';
      }
      if(msg.includes('data') || msg.includes('tech') || msg.includes('ai')){
        return 'Behind the scenes, Shaima imagines using data from POS, feedback forms and bookings to understand peak times, best-selling dishes and which marketing campaigns actually work.';
      }
      return 'Great question! As Nori-Bot, I can talk about the restaurant concept, menu ideas, target customers, marketing, or how this links to Shaima\'s Business Management with Innovation & Technology degree.';
    }

    // General site helper
    if(msg.includes('contact') || msg.includes('email') || msg.includes('phone')){
      return 'You can contact Shaima using the Contact page on this site — there you\'ll find email, phone and links to LinkedIn & GitHub.';
    }
    if(msg.includes('skills') || msg.includes('what can shaima do') || msg.includes('cv')){
      return 'Shaima combines business management, basic web development, data tools like Excel, and design tools such as Canva/Figma. Check the Skills page for a full breakdown.';
    }
    if(msg.includes('business') || msg.includes('degree') || msg.includes('university')){
      return 'Shaima studies Business Management with Innovation & Technology at the University of Salford, focusing on how tech, data and design support better business decisions.';
    }
    if(msg.includes('data') || msg.includes('analyst') || msg.includes('future')){
      return 'Shaima is aiming towards data-focused roles, like data analyst, where she can mix problem solving, Excel/Power BI skills and communication to support decision-making.';
    }
    return 'I\'m a small front-end AI helper 🤍 I can answer questions about this portfolio, Shaima\'s degree, skills, and the Nori & Ember business concept.';
  }

  launcher.addEventListener('click', () => {
    const isOpen = chat.classList.contains('open');
    if(isOpen){
      chat.classList.remove('open');
    }else{
      chat.classList.add('open');
      initialGreeting();
      input.focus();
    }
  });

  closeBtn.addEventListener('click', () => {
    chat.classList.remove('open');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if(!text) return;
    addMessage(text, 'user');
    input.value = '';
    const reply = getBotReply(text);
    setTimeout(() => addMessage(reply, 'bot'), 300);
  });
})();
