/* YouTube Studio helpers for the built-in browser pane (paste with the javascript tool, then call).
 *
 * Why this exists: the pane has no file-upload tool and the Mac's file picker can't be driven, so files
 * are built INSIDE the Studio page and handed to its hidden <input type=file> elements. Big files (the
 * film, the Short) still need the creator's one click on "Select files". Everything else goes here.
 *
 * Proven on episode 1 (Oct 2026). Studio markup changes; if a selector fails, read the page and adapt.
 */

/* 1. Lexend in the page, for canvas text */
window.__pkFonts = async () => {
  if ([...document.fonts].some(f => f.family === 'PKLexend')) return 'ready';
  for (const [w, u] of [['400', 'wlptgwvFAVdoq2_F94zlCfv0bz1WCzsW_LA'], ['700', 'wlptgwvFAVdoq2_F94zlCfv0bz1WC9wR_LA']]) {
    const f = new FontFace('PKLexend', `url(https://fonts.gstatic.com/s/lexend/v26/${u}.ttf)`, {weight: w});
    await f.load(); document.fonts.add(f);
  }
  return 'loaded';
};

/* 2. every <input type=file>, through shadow roots, in page order */
window.__pkInputs = () => {
  const out = []; const walk = r => { r.querySelectorAll('*').forEach(e => { if (e.tagName === 'INPUT' && e.type === 'file') out.push(e); if (e.shadowRoot) walk(e.shadowRoot); }); };
  walk(document); return out;
};

/* 3. hand a Blob to a file input as if the user picked it */
window.__pkPut = (input, blob, name, type) => {
  const dt = new DataTransfer(); dt.items.add(new File([blob], name, {type: type || blob.type}));
  input.files = dt.files; input.dispatchEvent(new Event('change', {bubbles: true})); return blob.size;
};
window.__pkB64 = (b64, mime) => new Blob([Uint8Array.from(atob(b64), c => c.charCodeAt(0))], {type: mime});

/* 4. thumbnail: background frame (small WebP, base64, right 720 px of the template) + brand text on canvas.
 *    Make the WebP with: python3 tools/publish/thumbnail.py ... then
 *    python3 -c "from PIL import Image;Image.open('EP/build/thumb.png').convert('RGB').crop((560,0,1280,720)).save('bg.webp',quality=85,method=6)"
 *    base64 -w0 bg.webp   (~15 KB of text) and pass it here. Text must match release.json. */
window.__pkThumb = async (bgB64, kicker, l1, l2Accent, l2Rest, sub) => {
  await window.__pkFonts();
  const bmp = await createImageBitmap(window.__pkB64(bgB64, 'image/webp'));
  const cv = document.createElement('canvas'); cv.width = 1280; cv.height = 720; const c = cv.getContext('2d'), F = 'PKLexend';
  c.fillStyle = '#0B1226'; c.fillRect(0, 0, 1280, 720); c.drawImage(bmp, 560, 0);
  c.textBaseline = 'alphabetic'; c.textAlign = 'left';
  c.fillStyle = '#EAAA45'; c.font = `700 58px ${F}`; c.letterSpacing = '3.5px'; c.fillText(kicker, 64, 180);
  c.letterSpacing = '-1px'; c.font = `700 112px ${F}`; c.fillStyle = '#F7F7F5'; c.fillText(l1, 64, 312);
  c.fillStyle = '#EAAA45'; c.fillText(l2Accent, 64, 420); const w = c.measureText(l2Accent + ' ').width;
  c.fillStyle = '#F7F7F5'; c.fillText(l2Rest, 64 + w, 420);
  c.letterSpacing = '0px'; c.font = `400 34px ${F}`; c.fillStyle = '#CBD1E2'; c.fillText(sub, 64, 497);
  c.fillStyle = '#EAAA45'; c.beginPath(); c.roundRect(64, 604, 64, 64, 13.4); c.fill();
  c.fillStyle = '#121E3B'; c.font = `700 31px ${F}`; c.textAlign = 'center'; const m = c.measureText('PK'); c.fillText('PK', 96, 636 + m.actualBoundingBoxAscent / 2 + 1);
  return await new Promise(r => cv.toBlob(r, 'image/jpeg', 0.92));
};
/* upload: in the upload dialog's Details step, window.__pkInputs() holds one image input (accept image/jpeg,image/png):
 *   window.__pkPut(window.__pkInputs().find(i=>/image/.test(i.accept)), await window.__pkThumb(...), 'thumbnail.jpg') */

/* 5. captions: cues = [[startSec, endSec, text], ...] (from release/captions-en.srt, parsed in Python and pasted as JSON)
 *    Open Video elements > Subtitles > Add > Upload file, tick "With timing" (do NOT press Continue: it opens the
 *    Mac's file picker), then:  window.__pkPut(window.__pkInputs().find(i=>i.closest('[id]')?.id==='captions-file-loader'), window.__pkSrt(cues), 'captions.srt', 'application/x-subrip')
 *    then Cancel the leftover type prompt and press Done. */
window.__pkSrt = cues => {
  const ts = t => { const p = n => String(n).padStart(2, '0'); const s = t % 60; return `${p(Math.floor(t / 3600))}:${p(Math.floor(t % 3600 / 60))}:${p(Math.floor(s))},${String(Math.round((s % 1) * 1000) % 1000).padStart(3, '0')}`; };
  return new Blob([cues.map((c, i) => `${i + 1}\n${ts(c[0])} --> ${ts(c[1])}\n${c[2]}\n`).join('\n')], {type: 'application/x-subrip'});
};

/* 6. translations, on studio.youtube.com/video/<id>/translations
 *    window.__pkAddLang('Hindi') adds the row; hover the row's Title & description cell and click the pencil
 *    (computer tool), then window.__pkTD(title, description) fills and publishes it. Repeat per language.
 *    Language names as Studio lists them: Hindi, Spanish, Portuguese (Brazil), Indonesian, French, German, Japanese, Arabic */
window.__pkAddLang = async name => {
  [...document.querySelectorAll('ytcp-button')].find(b => b.innerText.trim() === 'Add language').click();
  await new Promise(r => setTimeout(r, 1200));
  const it = [...document.querySelectorAll('tp-yt-paper-item')].find(i => i.innerText.trim() === name && i.getBoundingClientRect().height > 0);
  if (!it) return 'not in list: ' + name; it.click(); await new Promise(r => setTimeout(r, 2500));
  const row = [...document.querySelectorAll('ytgn-video-translation-row')].find(r => r.innerText.trim().split('\n')[0] === name);
  row.scrollIntoView({block: 'center'}); const b = row.getBoundingClientRect(); return {rowCenterY_css: Math.round(b.y + b.height / 2)};
};
window.__pkTD = async (title, desc) => {
  const tas = []; const w = x => { x.querySelectorAll('textarea').forEach(e => { if (e.getBoundingClientRect().width > 0) tas.push(e); }); x.querySelectorAll('*').forEach(e => e.shadowRoot && w(e.shadowRoot)); }; w(document);
  const right = tas.filter(t => t.getBoundingClientRect().x > 300);
  const set = (el, v) => { el.focus(); Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(el, v); el.dispatchEvent(new Event('input', {bubbles: true})); };
  set(right[0], title); set(right[1], desc); await new Promise(r => setTimeout(r, 800));
  let pb = null; const w2 = x => { x.querySelectorAll('ytcp-button#publish-button').forEach(e => { if (e.getBoundingClientRect().width > 0) pb = e; }); x.querySelectorAll('*').forEach(e => e.shadowRoot && w2(e.shadowRoot)); }; w2(document);
  pb.click(); await new Promise(r => setTimeout(r, 2500)); return 'published';
};

/* 7. rich text boxes (title, description, playlist fields) are contenteditable #textbox: replace all text */
window.__pkText = (el, text) => {
  el.focus(); const s = getSelection(), r = document.createRange(); r.selectNodeContents(el); s.removeAllRanges(); s.addRange(r);
  document.execCommand('insertText', false, text); return el.innerText.length;
};

/* 8. upload dialog radios by name: VIDEO_MADE_FOR_KIDS_NOT_MFK, VIDEO_PAID_PRODUCT_PLACEMENT_NO,
 *    VIDEO_HAS_ALTERED_CONTENT_NO, PUBLIC / PRIVATE / UNLISTED (Visibility step). Language and playlist are
 *    ytcp-text-dropdown-trigger elements; pick items from tp-yt-paper-item by exact text. */
window.__pkRadio = names => { const d = document.querySelector('ytcp-uploads-dialog'); names.forEach(n => d.querySelector(`tp-yt-paper-radio-button[name=${n}]`)?.click()); return names; };
