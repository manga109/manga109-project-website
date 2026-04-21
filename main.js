// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
if (navToggle) {
  navToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
}

// ---- 109 manga titles (folder names, from asset/manga_name.txt) ----
const MANGA_TITLES = [
  'ARMS','AisazuNihaIrarenai','AkkeraKanjinchou','Akuhamu','AosugiruHaru',
  'AppareKappore','Arisa','BEMADER_P','BakuretsuKungFuGirl','Belmondo',
  'BokuHaSitatakaKun','BurariTessenTorimonocho','ByebyeC-BOY','Count3DeKimeteAgeru',
  'DollGun','Donburakokko','DualJustice','EienNoWith','EvaLady',
  'EverydayOsakanaChan','GOOD_KISS_Ver2','GakuenNoise','GarakutayaManta',
  'GinNoChimera','Hamlet','HanzaiKousyouninMinegishiEitarou','HaruichibanNoFukukoro',
  'HarukaRefrain','HealingPlanet','HeiseiJimen','HighschoolKimengumi_vol01',
  'HighschoolKimengumi_vol20','HinagikuKenzan','HisokaReturns','JangiriPonpon',
  'JijiBabaFight','Joouari','Jyovolley','KarappoHighschool','KimiHaBokuNoTaiyouDa',
  'KoukouNoHitotachi','KuroidoGanka','KyokugenCyclone','LancelotFullThrottle',
  'LoveHina_vol01','LoveHina_vol14','MAD_STONE','MadouTaiga','MagicStarGakuin',
  'MagicianLoad','MariaSamaNihaNaisyo','MayaNoAkaiKutsu','MemorySeijin',
  'MeteoSanStrikeDesu','MiraiSan','MisutenaideDaisy','MoeruOnisan_vol01',
  'MoeruOnisan_vol19','MomoyamaHaikagura','MukoukizuNoChonbo','MutekiBoukenSyakuma',
  'Nekodama','NichijouSoup','Ningyoushi','OL_Lunch','OhWareraRettouSeitokai',
  'PLANET7','ParaisoRoad','PikaruGenkiDesu','PlatinumJungle','PrayerHaNemurenai',
  'PrismHeart','PsychoStaff','Raphael','ReveryEarth','RinToSiteSippuNoNaka',
  'RisingGirl','Saisoku','SaladDays_vol01','SaladDays_vol18',
  'SamayoeruSyonenNiJunaiWo','SeisinkiVulnus','ShimatteIkouze_vol01',
  'ShimatteIkouze_vol26','SonokiDeABC','SyabondamaKieta','TaiyouNiSmash',
  'TapkunNoTanteisitsu','TasogareTsushin','TennenSenshiG','TensiNoHaneToAkumaNoShippo',
  'TetsuSan',"That'sIzumiko",'TotteokiNoABC','ToutaMairimasu','TouyouKidan',
  'TsubasaNoKioku',"UchiNoNyan'sDiary",'UchuKigekiM774','UltraEleven',
  'UnbalanceTokyo','WarewareHaOniDearu','YamatoNoHane','YasasiiAkuma',
  'YouchienBoueigumi','YoumaKourin','YukiNoFuruMachi','YumeNoKayoiji','YumeiroCooking'
];

function formatTitle(t) {
  const cleaned = t.replace(/_vol\d+$/i, '');
  return cleaned.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ');
}

function buildRow(id, offset = 0) {
  const row = document.getElementById(id);
  if (!row) return;
  const tiles = [];
  const count = 28;
  for (let i = 0; i < count; i++) {
    const idx = (i + offset) % MANGA_TITLES.length;
    const folder = MANGA_TITLES[idx];
    const title = formatTitle(folder);
    const num = String(idx + 1).padStart(3, '0');
    tiles.push(
      `<div class="gallery-tile">
         <img src="asset/images_crop/${encodeURIComponent(folder)}.jpg" alt="${title}" loading="lazy" onerror="this.remove()">
         <div class="gallery-tile-meta">
           <span class="tile-num">#${num}</span>
           <span class="tile-title">${title}</span>
         </div>
       </div>`
    );
  }
  row.innerHTML = tiles.join('') + tiles.join('');
}
buildRow('row1', 0);
buildRow('row2', 37);

// ---- Feature card BibTeX toggle ----
document.querySelectorAll('.feature-toggle').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const id = btn.getAttribute('aria-controls');
    const panel = document.getElementById(id);
    if (!panel) return;
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    panel.hidden = open;
  });
});

// ---- BibTeX copy buttons ----
document.querySelectorAll('.copy-btn').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const target = document.getElementById(btn.dataset.target);
    if (!target) return;
    const text = target.textContent || '';
    try {
      await navigator.clipboard.writeText(text);
    } catch (_) {
      const range = document.createRange();
      range.selectNode(target);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      try { document.execCommand('copy'); } catch (__) { /* noop */ }
      window.getSelection().removeAllRanges();
    }
    const label = btn.querySelector('span');
    const original = label ? label.textContent : '';
    if (label) label.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.classList.remove('copied');
      if (label) label.textContent = original;
    }, 1600);
  });
});
