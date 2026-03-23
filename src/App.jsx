import React from "react";
import { useState, useRef, useCallback, useEffect } from "react";

const G_BLUE   = "#4285F4";
const G_GREEN  = "#34A853";
const G_RED    = "#EA4335";
const G_YELLOW = "#FBBC04";

/* ---
   ICONS
--- */
const Dot = ({ c, s = 8 }) => (
  <span style={{ display:"inline-block", width:s, height:s, borderRadius:"50%", background:c, flexShrink:0 }} />
);
const CheckIco = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill={G_GREEN}/>
    <path d="M4.5 8L7 10.5L11.5 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const CopyIco = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/>
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>
);
const SparkIco = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="url(#spk)"/>
    <defs>
      <linearGradient id="spk" x1="4" y1="2" x2="20" y2="18" gradientUnits="userSpaceOnUse">
        <stop stopColor={G_BLUE}/><stop offset="1" stopColor={G_GREEN}/>
      </linearGradient>
    </defs>
  </svg>
);
const PinIco = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const DlIco = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const UpIco = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={G_BLUE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

/* ---
   SHARED UI
--- */
function CopyBtn({ text }) {
  const [ok, setOk] = useState(false);
  const go = async () => {
    try { await navigator.clipboard.writeText(text); }
    catch(_ce) { const t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select(); document.execCommand("copy"); document.body.removeChild(t); }
    setOk(true); setTimeout(() => setOk(false), 2000);
  };
  return (
    <button onClick={go} style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:20, border:`1.5px solid ${ok ? G_GREEN : "#DADCE0"}`, background:ok ? "#E6F4EA" : "white", color:ok ? G_GREEN : "#5F6368", cursor:"pointer", fontSize:12, fontFamily:"inherit", fontWeight:600, transition:"all .2s" }}>
      {ok ? <CheckIco/> : <CopyIco/>}{ok ? "Copied!" : "Copy"}
    </button>
  );
}

function CharBar({ n, max = 1400 }) {
  const p = Math.min(n / max * 100, 100);
  const inRange = n >= 1250 && n <= 1400;
  const tooShort = n < 1250;
  const c = inRange ? G_GREEN : tooShort ? G_YELLOW : G_RED;
  const label = inRange ? "✓ Good" : tooShort ? "Too short" : "Too long";
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:5 }}>
      <div style={{ flex:1, height:5, borderRadius:4, background:"#E8EAED", overflow:"hidden" }}>
        <div style={{ width:`${p}%`, height:"100%", background:c, borderRadius:4, transition:"width .3s,background .3s" }}/>
      </div>
      <span style={{ fontSize:11, color:c, minWidth:90, textAlign:"right", fontWeight:600 }}>{n} chars · {label}</span>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, multiline, hint, type = "text" }) {
  const s = { width:"100%", padding:"10px 13px", borderRadius:10, border:"1.5px solid #DADCE0", fontSize:13.5, fontFamily:"inherit", color:"#3C4043", background:"white", boxSizing:"border-box", outline:"none", transition:"border-color .2s,box-shadow .2s", resize:"vertical" };
  const fo = e => { e.target.style.borderColor = G_BLUE; e.target.style.boxShadow = `0 0 0 3px ${G_BLUE}1a`; };
  const bl = e => { e.target.style.borderColor = "#DADCE0"; e.target.style.boxShadow = "none"; };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
      <label style={{ fontSize:12.5, fontWeight:600, color:"#5F6368" }}>{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={4} style={s} onFocus={fo} onBlur={bl}/>
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...s, resize:undefined }} onFocus={fo} onBlur={bl}/>
      }
      {hint && <span style={{ fontSize:11, color:"#9AA0A6" }}>{hint}</span>}
    </div>
  );
}

function CardHead({ icon, title, badge }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:9, padding:"15px 22px", borderBottom:"1.5px solid #F1F3F4", background:"linear-gradient(135deg,#F8F9FF,white)" }}>
      <span style={{ fontSize:17 }}>{icon}</span>
      <span style={{ fontWeight:700, fontSize:14.5, color:"#202124" }}>{title}</span>
      {badge && <span style={{ marginLeft:"auto", fontSize:10.5, fontWeight:700, background:"#E8F0FE", color:G_BLUE, padding:"3px 9px", borderRadius:20, letterSpacing:".04em" }}>{badge}</span>}
    </div>
  );
}

function Dots() {
  return (
    <span style={{ display:"inline-flex", gap:3, alignItems:"center" }}>
      {[0,1,2].map(i => <span key={i} style={{ width:5, height:5, borderRadius:"50%", background:"white", animation:`bo 1.2s ease ${i * 0.2}s infinite` }}/>)}
    </span>
  );
}

function RichDesc({ content, busy }) {
  if (!content && !busy) return <div style={{ color:"#BDC1C6", fontSize:13, textAlign:"center", padding:"20px 0" }}>Output will appear here...</div>;
  const lines = (content || "").split("\n");
  const nodes = [];
  let key = 0;
  for (const line of lines) {
    const t = line.trim();
    if (!t) { nodes.push(<div key={key++} style={{ height:7 }}/>); continue; }
    if (t.startsWith("#")) {
      const tags = t.split(/\s+/).filter(x => x.startsWith("#"));
      nodes.push(
        <div key={key++} style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:4 }}>
          {tags.map((tg, ti) => <span key={ti} style={{ fontSize:12, padding:"3px 10px", borderRadius:20, background:`${G_BLUE}12`, color:G_BLUE, fontWeight:600 }}>{tg}</span>)}
        </div>
      );
      continue;
    }
    if (t.startsWith("✓") || t.startsWith("* ") || t.startsWith("* ")) {
      const txt = t.startsWith("✓") ? t.slice(1).trim() : t.slice(2).trim();
      nodes.push(
        <div key={key++} style={{ display:"flex", gap:8, alignItems:"flex-start", padding:"2px 0" }}>
          <span style={{ color:G_GREEN, fontWeight:700, fontSize:14, flexShrink:0, marginTop:1 }}>✓</span>
          <span style={{ fontSize:13.5, color:"#3C4043", lineHeight:1.6 }}>{txt}</span>
        </div>
      );
      continue;
    }
    if (t === "Patients choose us for:" || t === "Patients choose us for") {
      nodes.push(<div key={key++} style={{ fontSize:13.5, color:"#202124", fontWeight:700, marginTop:4, marginBottom:2 }}>{t}</div>);
      continue;
    }
    if (/book your|free consultation|take the first step|call us|schedule|visit us|contact us today|get in touch|reach out/i.test(t)) {
      nodes.push(<div key={key++} style={{ padding:"10px 14px", borderRadius:9, background:`linear-gradient(135deg,${G_GREEN}15,${G_BLUE}10)`, border:`1.5px solid ${G_GREEN}40`, fontSize:13.5, fontWeight:700, color:"#1B5E20", lineHeight:1.6, marginTop:4 }}>{t}</div>);
      continue;
    }
    nodes.push(<div key={key++} style={{ fontSize:13.5, color:"#3C4043", lineHeight:1.75 }}>{t}</div>);
  }
  if (busy) nodes.push(<span key="cur" style={{ display:"inline-block", width:2, height:16, background:G_BLUE, marginLeft:2, verticalAlign:"middle", animation:"blink 1s step-end infinite" }}/>);
  return <div style={{ display:"flex", flexDirection:"column", gap:2 }}>{nodes}</div>;
}

function OutBlock({ title, content, accent, icon, isUrl, busy }) {
  return (
    <div style={{ borderRadius:13, border:"1.5px solid #E8EAED", overflow:"hidden", background:"white", boxShadow:"0 1px 5px rgba(60,64,67,.07)", animation:"su .4s ease" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 16px", borderBottom:"1.5px solid #E8EAED", background:`linear-gradient(135deg,${accent}0d,white)` }}>
        <span style={{ fontWeight:700, fontSize:13, color:"#202124" }}>{icon} {title}</span>
        {content && <CopyBtn text={content}/>}
      </div>
      <div style={{ padding:"14px 16px" }}>
        {isUrl ? (
          content
            ? <div style={{ fontFamily:"'Roboto Mono',monospace", fontSize:12, lineHeight:1.6, color:G_BLUE, whiteSpace:"pre-wrap", wordBreak:"break-all", background:"#F8F9FA", borderRadius:8, padding:"9px 11px", border:"1.5px solid #E8EAED" }}>{content}</div>
            : <div style={{ color:"#BDC1C6", fontSize:13, textAlign:"center", padding:"16px 0" }}>Output will appear here...</div>
        ) : (
          <>
            <RichDesc content={content} busy={busy}/>
            {content && <CharBar n={content.length}/>}
          </>
        )}
      </div>
    </div>
  );
}

/* ---
   EXIF + XMP HELPERS
--- */
function toRat(deg) {
  const d  = Math.floor(Math.abs(deg));
  const mf = (Math.abs(deg) - d) * 60;
  const m  = Math.floor(mf);
  const s  = Math.round((mf - m) * 60 * 1000);
  return [[d, 1], [m, 1], [s, 1000]];
}

function buildExifFull(lat, lng, keywords, bizName) {
  const enc = new TextEncoder();
  const ascii = str => { const b = enc.encode(str); const r = new Uint8Array(b.length + 1); r.set(b); return r; };
  const utf16le = str => {
    const buf = new Uint8Array(str.length * 2 + 2);
    for (let i = 0; i < str.length; i++) {
      buf[i * 2] = str.charCodeAt(i) & 0xFF;
      buf[i * 2 + 1] = (str.charCodeAt(i) >> 8) & 0xFF;
    }
    return buf;
  };

  // Format: "kw1, kw2, kw3," -- comma-separated with trailing comma (geoimgr.com standard)
  const kwCsv  = keywords.map(k => k.trim()).join(", ") + ",";
  const primary = keywords[0] || bizName;

  const bImgDesc   = ascii(kwCsv);          // ImageDescription = keywords
  const bArtist    = ascii(bizName);
  const bCopyright = ascii(bizName);
  const bXPTitle   = utf16le(primary);
  const bXPComment = utf16le(kwCsv);
  const bXPAuthor  = utf16le(bizName);
  const bXPKw      = utf16le(kwCsv);        // XPKeywords = keywords (geoimgr reads this)
  const bXPSubject = utf16le(kwCsv);        // XPSubject = all keywords

  // IFD layout (little-endian TIFF):
  // 0     : header (8)
  // 8     : IFD0   (2 + 9*12 + 4 = 114) - ends at 122
  // 122   : GPS    (2 + 5*12 + 4 = 70)  - ends at 192
  // 192+  : data blobs
  const IFD0 = 8;
  const GPS  = 122;
  const DATA = 192;

  let cur = DATA;
  const place = b => { const o = cur; cur += b.length; if (cur & 1) cur++; return o; };
  const oImgDesc   = place(bImgDesc);
  const oArtist    = place(bArtist);
  const oCopyright = place(bCopyright);
  const oXPTitle   = place(bXPTitle);
  const oXPComment = place(bXPComment);
  const oXPAuthor  = place(bXPAuthor);
  const oXPKw      = place(bXPKw);
  const oXPSubject = place(bXPSubject);
  const oGpsVer = cur; cur += 4;
  const oLatRef = cur; cur += 2; if (cur & 1) cur++;
  const oLonRef = cur; cur += 2; if (cur & 1) cur++;
  const oLatRat = cur; cur += 24;
  const oLonRat = cur; cur += 24;

  const ab = new ArrayBuffer(cur);
  const dv = new DataView(ab);
  const u8 = new Uint8Array(ab);

  // TIFF header
  u8[0] = 0x49; u8[1] = 0x49;
  dv.setUint16(2, 0x002A, true);
  dv.setUint32(4, IFD0, true);

  const wE = (base, idx, tag, type, count, val) => {
    const o = base + 2 + idx * 12;
    dv.setUint16(o,     tag,   true);
    dv.setUint16(o + 2, type,  true);
    dv.setUint32(o + 4, count, true);
    dv.setUint32(o + 8, val,   true);
  };

  // IFD0 -- 9 entries
  dv.setUint16(IFD0, 9, true);
  wE(IFD0, 0, 0x010E, 2, bImgDesc.length,   oImgDesc);
  wE(IFD0, 1, 0x013B, 2, bArtist.length,    oArtist);
  wE(IFD0, 2, 0x8298, 2, bCopyright.length, oCopyright);
  wE(IFD0, 3, 0x9C9B, 7, bXPTitle.length,   oXPTitle);
  wE(IFD0, 4, 0x9C9C, 7, bXPComment.length, oXPComment);
  wE(IFD0, 5, 0x9C9D, 7, bXPAuthor.length,  oXPAuthor);
  wE(IFD0, 6, 0x9C9E, 7, bXPKw.length,      oXPKw);
  wE(IFD0, 7, 0x9C9F, 7, bXPSubject.length, oXPSubject);
  wE(IFD0, 8, 0x8825, 4, 1,                  GPS);
  dv.setUint32(IFD0 + 2 + 9 * 12, 0, true);

  // GPS IFD -- 5 entries
  dv.setUint16(GPS, 5, true);
  wE(GPS, 0, 0x0000, 1, 4, 0x02020000);
  wE(GPS, 1, 0x0001, 2, 2, oLatRef);
  wE(GPS, 2, 0x0002, 5, 3, oLatRat);
  wE(GPS, 3, 0x0003, 2, 2, oLonRef);
  wE(GPS, 4, 0x0004, 5, 3, oLonRat);
  dv.setUint32(GPS + 2 + 5 * 12, 0, true);

  // Write blobs
  u8.set(bImgDesc,   oImgDesc);
  u8.set(bArtist,    oArtist);
  u8.set(bCopyright, oCopyright);
  u8.set(bXPTitle,   oXPTitle);
  u8.set(bXPComment, oXPComment);
  u8.set(bXPAuthor,  oXPAuthor);
  u8.set(bXPKw,      oXPKw);
  u8.set(bXPSubject, oXPSubject);

  // GPS values
  u8[oGpsVer] = 2; u8[oGpsVer + 1] = 2;
  u8[oLatRef] = lat >= 0 ? 78 : 83;
  u8[oLonRef] = lng >= 0 ? 69 : 87;
  let off = oLatRat;
  toRat(lat).forEach(([n, d]) => { dv.setUint32(off, n, true); dv.setUint32(off + 4, d, true); off += 8; });
  off = oLonRat;
  toRat(lng).forEach(([n, d]) => { dv.setUint32(off, n, true); dv.setUint32(off + 4, d, true); off += 8; });

  return u8;
}

function buildExifSeg(data) {
  const hdr = new TextEncoder().encode("Exif\0\0");
  const len = 2 + hdr.length + data.length;
  const seg = new Uint8Array(2 + len);
  seg[0] = 0xFF; seg[1] = 0xE1;
  seg[2] = (len >> 8) & 0xFF; seg[3] = len & 0xFF;
  seg.set(hdr, 4); seg.set(data, 4 + hdr.length);
  return seg;
}

function buildXmpSeg(lat, lng, keywords, bizName) {
  const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const allKw = new Set();
  keywords.forEach(k => {
    const t = k.trim(); if (!t) return;
    allKw.add(t);
    allKw.add(t.toLowerCase());
    allKw.add(t.replace(/\b\w/g, c => c.toUpperCase()));
    allKw.add(`${bizName} ${t}`);
    allKw.add(`${t} near me`);
    allKw.add(`best ${t}`);
    allKw.add(`${t} specialist`);
  });
  allKw.add(bizName); allKw.add(bizName.toLowerCase());
  const kwArr = [...allKw].filter(Boolean);
  const kwCsv = kwArr.slice(0, 8).join(", ") + ",";

  const xmp = `<?xpacket begin='\uFEFF' id='W5M0MpCehiHzreSzNTczkc9d'?>
<x:xmpmeta xmlns:x='adobe:ns:meta/'>
 <rdf:RDF xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#'>
  <rdf:Description xmlns:dc='http://purl.org/dc/elements/1.1/' xmlns:xmp='http://ns.adobe.com/xap/1.0/' xmlns:photoshop='http://ns.adobe.com/photoshop/1.0/' xmlns:Iptc4xmpCore='http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/' xmlns:exif='http://ns.adobe.com/exif/1.0/'>
   <dc:title><rdf:Alt><rdf:li xml:lang='x-default'>${esc(keywords.map(k=>k.trim()).join(", ") + ",")}</rdf:li></rdf:Alt></dc:title>
   <dc:description><rdf:Alt><rdf:li xml:lang='x-default'>${esc(keywords.map(k=>k.trim()).join(", ") + ",")}</rdf:li></rdf:Alt></dc:description>
   <dc:subject><rdf:Bag>${kwArr.map(k => `<rdf:li>${esc(k)}</rdf:li>`).join("")}</rdf:Bag></dc:subject>
   <dc:creator><rdf:Seq><rdf:li>${esc(bizName)}</rdf:li></rdf:Seq></dc:creator>
   <xmp:Label>${esc(keywords[0] || bizName)}</xmp:Label>
   <photoshop:Headline>${esc(bizName)} - ${esc(keywords.slice(0, 2).join(" | "))}</photoshop:Headline>
   <Iptc4xmpCore:Keywords><rdf:Bag>${kwArr.map(k => `<rdf:li>${esc(k)}</rdf:li>`).join("")}</rdf:Bag></Iptc4xmpCore:Keywords>
   <exif:GPSLatitude>${Math.abs(lat).toFixed(7)}${lat >= 0 ? "N" : "S"}</exif:GPSLatitude>
   <exif:GPSLongitude>${Math.abs(lng).toFixed(7)}${lng >= 0 ? "E" : "W"}</exif:GPSLongitude>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end='w'?>`;

  const ns  = new TextEncoder().encode("http://ns.adobe.com/xap/1.0/\0");
  const xb  = new TextEncoder().encode(xmp);
  const len = 2 + ns.length + xb.length;
  const seg = new Uint8Array(2 + len);
  seg[0] = 0xFF; seg[1] = 0xE1;
  seg[2] = (len >> 8) & 0xFF; seg[3] = len & 0xFF;
  seg.set(ns, 4); seg.set(xb, 4 + ns.length);
  return seg;
}


/* - IPTC IIM APP13 builder -
   geoimgr.com "Keywords and Tags" reads IPTC IIM 2:25 (keywords)
   geoimgr.com "Description"       reads IPTC IIM 2:120 (caption)
   Embedded as JPEG APP13 (0xFFED) with "Photoshop 3.0" header
- */
function buildIptcSeg(keywords, description) {
  const enc = new TextEncoder();

  // Build IPTC dataset records
  // Each record: 0x1C, record_num(1), dataset_num(1), length(2), data
  const records = [];

  const addRecord = (rec, ds, data) => {
    const bytes = typeof data === "string" ? enc.encode(data) : data;
    const r = new Uint8Array(5 + bytes.length);
    r[0] = 0x1C; r[1] = rec; r[2] = ds;
    r[3] = (bytes.length >> 8) & 0xFF;
    r[4] = bytes.length & 0xFF;
    r.set(bytes, 5);
    records.push(r);
  };

  // 1:90 -- Coded Character Set (UTF-8 escape: ESC % G)
  addRecord(1, 90, new Uint8Array([0x1B, 0x25, 0x47]));

  // 2:25 -- Keywords (one record per keyword -- this is what geoimgr reads as "Keywords and Tags")
  keywords.forEach(kw => { if (kw.trim()) addRecord(2, 25, kw.trim()); });

  // 2:120 -- Caption/Abstract (description -- what geoimgr reads as "Description")
  const capText = keywords.map(k => k.trim()).join(", ") + ",";
  addRecord(2, 120, capText);

  // 2:105 -- Headline
  addRecord(2, 105, keywords[0] || "");

  // 2:80 -- Byline (creator)
  // skip to keep it clean

  // Concatenate all records
  let total = 0;
  records.forEach(r => total += r.length);
  const iptcData = new Uint8Array(total);
  let off = 0;
  records.forEach(r => { iptcData.set(r, off); off += r.length; });

  // Wrap in Photoshop 3.0 IRB (Image Resource Block 0x0404 = IPTC-NAA)
  // Header: "Photoshop 3.0\0" (14 bytes)
  // IRB: "8BIM" + resourceID(2) + pascal-string name (at least 2 bytes padded to even) + dataLen(4) + data
  const ps3Header = enc.encode("Photoshop 3.0 ");
  const bim       = enc.encode("8BIM");
  const resID     = new Uint8Array([0x04, 0x04]);        // 0x0404 = IPTC-NAA
  const nameField = new Uint8Array([0x00, 0x00]);         // empty pascal string (2 bytes, even-padded)
  const dataLen   = new Uint8Array(4);
  dataLen[0] = (iptcData.length >> 24) & 0xFF;
  dataLen[1] = (iptcData.length >> 16) & 0xFF;
  dataLen[2] = (iptcData.length >> 8)  & 0xFF;
  dataLen[3] =  iptcData.length        & 0xFF;

  const irbSize = bim.length + resID.length + nameField.length + dataLen.length + iptcData.length;
  const totalSize = ps3Header.length + irbSize;

  // APP13 marker: 0xFFED + 2-byte length (length includes the 2 length bytes)
  const segLen = 2 + totalSize;
  const seg = new Uint8Array(2 + segLen);
  seg[0] = 0xFF; seg[1] = 0xED;
  seg[2] = (segLen >> 8) & 0xFF; seg[3] = segLen & 0xFF;
  let p = 4;
  seg.set(ps3Header, p); p += ps3Header.length;
  seg.set(bim,       p); p += bim.length;
  seg.set(resID,     p); p += resID.length;
  seg.set(nameField, p); p += nameField.length;
  seg.set(dataLen,   p); p += dataLen.length;
  seg.set(iptcData,  p);

  return seg;
}

function injectIntoJpeg(jpegU8, exifSeg, xmpSeg, iptcSeg) {
  let i = 2;
  while (i < jpegU8.length - 3 && jpegU8[i] === 0xFF) {
    const mk = jpegU8[i + 1];
    const sl = (jpegU8[i + 2] << 8) | jpegU8[i + 3];
    if (mk === 0xE0) { i += 2 + sl; break; }
    if (mk === 0xE1) { i += 2 + sl; continue; } // strip old APP1
    if (mk === 0xED) { i += 2 + sl; continue; } // strip old APP13 (IPTC)
    break;
  }
  const soi  = jpegU8.slice(0, 2);
  const kept = jpegU8.slice(2, i);
  const rest = jpegU8.slice(i);
  const out  = new Uint8Array(soi.length + kept.length + exifSeg.length + xmpSeg.length + iptcSeg.length + rest.length);
  let p = 0;
  out.set(soi,     p); p += soi.length;
  out.set(kept,    p); p += kept.length;
  out.set(exifSeg, p); p += exifSeg.length;
  out.set(xmpSeg,  p); p += xmpSeg.length;
  out.set(iptcSeg, p); p += iptcSeg.length;
  out.set(rest,    p);
  return out;
}

function processGeoTag(file, lat, lng, keywords, bizName) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("FileReader failed."));
    reader.onload = e => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not decode image. Try a different file."));
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width  = img.naturalWidth  || img.width;
          canvas.height = img.naturalHeight || img.height;
          if (!canvas.width || !canvas.height) { reject(new Error("Image has zero dimensions.")); return; }
          canvas.getContext("2d").drawImage(img, 0, 0);
          const b64    = canvas.toDataURL("image/jpeg", 0.92).split(",")[1];
          const bin    = atob(b64);
          const jpegU8 = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) jpegU8[i] = bin.charCodeAt(i);
          const exifSeg = buildExifSeg(buildExifFull(lat, lng, keywords, bizName));
          const xmpSeg  = buildXmpSeg(lat, lng, keywords, bizName);
          const iptcSeg = buildIptcSeg(keywords, bizName);
          const final   = injectIntoJpeg(jpegU8, exifSeg, xmpSeg, iptcSeg);
          let s = "";
          for (let i = 0; i < final.length; i++) s += String.fromCharCode(final[i]);
          resolve({ dataURL: "data:image/jpeg;base64," + btoa(s) });
        } catch (err) { reject(new Error("Processing error: " + err.message)); }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}


/* --- GOOGLE SHEET CLIENT DATABASE --- */
const SHEET_URL_DEFAULT = "https://script.google.com/macros/s/AKfycbw4xapFw8WcZa2eKCNH2lJveaOgFaj_9gkZGT7ZauCFPllujf37TugRS25-cSGhU26n/exec";

// Fetch clients live from Apps Script Web App
async function readClientsViaScript(webAppUrl) {
  var res = await fetch("/.netlify/functions/sheet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: webAppUrl, action: "getClients" })
  });
  if (!res.ok) throw new Error("Proxy error: " + res.status);
  var data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.clients || [];
}

async function sheetPost(webAppUrl, body) {
  try {
    var res = await fetch("/.netlify/functions/sheet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.assign({ url: webAppUrl }, body))
    });
    if (!res.ok) return { success: true };
    return await res.json();
  } catch(e) {
    return { success: true };
  }
}




/* --- SCHEDULE DATA (hardcoded from sheet) --- */
const SCHEDULE_ROWS = [
  {exec:"Ivan",date:"02-03-2026",name:"Dr Kalamkar's welldent family dental care",url:"https://drkalamkar.com/",keywords:"dentist in sakkardara, dental clinic in sakkardara, dentist in nandanvan, dental clinic in nandanvan",lat:21.1279349458418,lng:79.1163414047705},
  {exec:"Ivan",date:"02-03-2026",name:"Dr. Kunal Pawar's Dental Clinic Of Braces, Implants & Digital Smile Designing- Hadapsar, Pune",url:"https://drkunalpawardental.com/",keywords:"dental clinic in hadapsar, dentist in hadapsar, dental clinic in magarpatta, dentist in magarpatta",lat:18.5021782785397,lng:73.9298904288358},
  {exec:"Ivan",date:"02-03-2026",name:"Sanghavi Dental Clinic & Implant centre",url:"https://sanghavidentalclinic.com/",keywords:"dental clinic in baramati, dentist in baramati",lat:18.1517915710446,lng:74.5816669482183},
  {exec:"Ivan",date:"02-03-2026",name:"Dr. Batra's Dental Care Clinic",url:"https://batradental.com/",keywords:"dental clinic in bhandara, dentist in bhandara",lat:21.16650901254,lng:79.6567873730153},
  {exec:"Ivan",date:"03-03-2026",name:"s.v. SMILE 32 DENTAL Clinic/Dr.Konda Amarnath /Dr.K.Prachi",url:"https://svsmile32.com/",keywords:"dentist in nizamabad, dental clinic in nizamabad",lat:18.6710094950668,lng:78.1035488715083},
  {exec:"Ivan",date:"03-03-2026",name:"Dental Design Clinic | Dentist Near Gangapur Rd, Nashik",url:"https://dentaldesignnashik.com/",keywords:"dentist in gangapur road nashik, dental clinic in gangapur road nashik, best dentist in nashik, best dental clinic in nashik",lat:20.0092030152797,lng:73.7730296920612},
  {exec:"Ivan",date:"03-03-2026",name:"Yashashree Dental & Orthodontic Clinic Satara",url:"https://yashashreedental.com/",keywords:"dental clinic in satara, dentist in satara",lat:17.6871714653388,lng:74.0054351777347},
  {exec:"Ivan",date:"03-03-2026",name:"Dr. Kunal Pawar's Dental Clinic Of Braces, Implants & Digital Smile Designing- Hadapsar, Pune",url:"https://drkunalpawardental.com/dental-implants-in-hadapsar.php",keywords:"dental implant in hadapsar, dental implant in magarpatta",lat:18.5021782785397,lng:73.9298904288358},
  {exec:"Ivan",date:"03-03-2026",name:"Rai Dental Clinic Bilaspur",url:"https://raidentalclinic.in/",keywords:"dentist in bilaspur, dental clinic in bilaspur",lat:22.0754230646446,lng:82.1602331120428},
  {exec:"Ivan",date:"04-03-2026",name:"Omkarananda Dental Care & Research",url:"https://omkaranandadental.com/",keywords:"dentist in bistanpur,dental clinic in bistupur",lat:22.7969077648307,lng:86.1845130967129},
  {exec:"Ivan",date:"04-03-2026",name:"Dr Kalamkar's welldent family dental care",url:"https://drkalamkar.com/root-canal-treatment.php",keywords:"root canal treatment in sakkardara, root canal treatment in nandanvan",lat:21.1279349458418,lng:79.1163414047705},
  {exec:"Ivan",date:"04-03-2026",name:"Sankalp Braces and Dental Clinic Nagpur",url:"https://sankalpbraces.com/",keywords:"dental clinic in wanjari nagar,dentist in wanjari nagar,braces treatment in wanjari nagar,orthodontist in wanjari nagar,braces specialist in wanjari nagar",lat:21.1259148115891,lng:79.0932141040868},
  {exec:"Ivan",date:"04-03-2026",name:"Sanghavi Dental Clinic & Implant centre",url:"https://sanghavidentalclinic.com/root-canal-treatment-in-baramati.php",keywords:"root canal treatment in baramati",lat:18.1517915710446,lng:74.5816669482183},
  {exec:"Ivan",date:"05-03-2026",name:"s.v. SMILE 32 DENTAL Clinic/Dr.Konda Amarnath /Dr.K.Prachi",url:"https://svsmile32.com/root-canal-treatment-nizamabad.php",keywords:"root canal treatment in nizamabad",lat:18.6710094950668,lng:78.1035488715083},
  {exec:"Ivan",date:"05-03-2026",name:"Dental Design Clinic | Dentist Near Gangapur Rd, Nashik",url:"https://dentaldesignnashik.com/root-canal-treatment-nashik.php",keywords:"root canal treatment in gangapur road nashik, root canal treatment in nashik",lat:20.0092030152797,lng:73.7730296920612},
  {exec:"Ivan",date:"05-03-2026",name:"Yashashree Dental & Orthodontic Clinic Satara",url:"https://yashashreedental.com/root-canal-treatment.php",keywords:"root canal treatment in satara",lat:17.6871714653388,lng:74.0054351777347},
  {exec:"Ivan",date:"05-03-2026",name:"Rai Dental Clinic Bilaspur",url:"https://raidentalclinic.in/root-canal-treatment-in-bilaspur.php",keywords:"root canal treatment in bilaspur",lat:22.0754230646446,lng:82.1602331120428},
  {exec:"Ivan",date:"06-03-2026",name:"Omkarananda Dental Care & Research",url:"https://omkaranandadental.com/root-canal-treatment-bistupur.php",keywords:"root canal treatment in bistupur",lat:22.7969077648307,lng:86.1845130967129},
  {exec:"Ivan",date:"06-03-2026",name:"Sankalp Braces and Dental Clinic Nagpur",url:"https://sankalpbraces.com/root-canal-treatment-in-wanjari-nagar-nagpur.php",keywords:"root canal treatment in wanjari nagar",lat:21.1259148115891,lng:79.0932141040868},
  {exec:"Ivan",date:"06-03-2026",name:"Dr. Batra's Dental Care Clinic",url:"https://batradental.com/dental-implant-treatment-bhandara.php",keywords:"dental implants in bhandara",lat:21.16650901254,lng:79.6567873730153},
  {exec:"Ivan",date:"09-03-2026",name:"Dr Kalamkar's welldent family dental care",url:"https://drkalamkar.com/dental-implant-treatment.php",keywords:"dental implant treatment in sakkardara, dental implant treatment in nandanvan",lat:21.1279349458418,lng:79.1163414047705},
  {exec:"Ivan",date:"09-03-2026",name:"Dr. Kunal Pawar's Dental Clinic Of Braces, Implants & Digital Smile Designing- Hadapsar, Pune",url:"https://drkunalpawardental.com/root-canal-treatment-in-hadapsar.php",keywords:"root canal treatment in hadapsar, root canal treatment in magarpatta",lat:18.5021782785397,lng:73.9298904288358},
  {exec:"Ivan",date:"09-03-2026",name:"Sanghavi Dental Clinic & Implant centre",url:"https://sanghavidentalclinic.com/dental-implants-in-baramati.php",keywords:"dental implant in baramati",lat:18.1517915710446,lng:74.5816669482183},
  {exec:"Ivan",date:"09-03-2026",name:"Dr. Batra's Dental Care Clinic",url:"https://batradental.com/braces-treatment-bhandara.php",keywords:"braces treatment in bhandara",lat:21.16650901254,lng:79.6567873730153},
  {exec:"Ivan",date:"10-03-2026",name:"s.v. SMILE 32 DENTAL Clinic/Dr.Konda Amarnath /Dr.K.Prachi",url:"https://svsmile32.com/dental-implant-treatment-nizamabad.php",keywords:"dental implant treatment in nizamabad",lat:18.6710094950668,lng:78.1035488715083},
  {exec:"Ivan",date:"10-03-2026",name:"Dental Design Clinic | Dentist Near Gangapur Rd, Nashik",url:"https://dentaldesignnashik.com/dental-implant-treatment-nashik.php",keywords:"dental implant treatment in gangapur road nashik, dental implant treatment in nashik",lat:20.0092030152797,lng:73.7730296920612},
  {exec:"Ivan",date:"10-03-2026",name:"Yashashree Dental & Orthodontic Clinic Satara",url:"https://yashashreedental.com/dental-implants.php",keywords:"dental implant treatment in satara",lat:17.6871714653388,lng:74.0054351777347},
  {exec:"Ivan",date:"10-03-2026",name:"Dr. Kunal Pawar's Dental Clinic Of Braces, Implants & Digital Smile Designing- Hadapsar, Pune",url:"https://drkunalpawardental.com/braces-treatment-in-hadapsar.php",keywords:"braces treatment in hadapsar, braces treatment in magarpatta",lat:18.5021782785397,lng:73.9298904288358},
  {exec:"Ivan",date:"10-03-2026",name:"Rai Dental Clinic Bilaspur",url:"https://raidentalclinic.in/dental-implant-treatment-in-bilaspur.php",keywords:"dental implant treatment in bilaspur",lat:22.0754230646446,lng:82.1602331120428},
  {exec:"Ivan",date:"11-03-2026",name:"Omkarananda Dental Care & Research",url:"https://omkaranandadental.com/dental-implant-treatment-bistupur.php",keywords:"dental implant treatment in bistupur",lat:22.7969077648307,lng:86.1845130967129},
  {exec:"Ivan",date:"11-03-2026",name:"Dr Kalamkar's welldent family dental care",url:"https://drkalamkar.com/braces-treatment.php",keywords:"braces treatment in sakkardara, braces treatment in nandanvan",lat:21.1279349458418,lng:79.1163414047705},
  {exec:"Ivan",date:"11-03-2026",name:"Sankalp Braces and Dental Clinic Nagpur",url:"https://sankalpbraces.com/dental-implants-in-wanjari-nagar-nagpur.php",keywords:"dental implant treatment in wanjari nagar",lat:21.1259148115891,lng:79.0932141040868},
  {exec:"Ivan",date:"11-03-2026",name:"Sanghavi Dental Clinic & Implant centre",url:"https://sanghavidentalclinic.com/braces-treatment-in-baramati.php",keywords:"braces treatment in baramati",lat:18.1517915710446,lng:74.5816669482183},
  {exec:"Ivan",date:"12-03-2026",name:"s.v. SMILE 32 DENTAL Clinic/Dr.Konda Amarnath /Dr.K.Prachi",url:"https://svsmile32.com/braces-treatment-nizamabad.php",keywords:"braces treatment in nizamabad",lat:18.6710094950668,lng:78.1035488715083},
  {exec:"Ivan",date:"12-03-2026",name:"Dental Design Clinic | Dentist Near Gangapur Rd, Nashik",url:"https://dentaldesignnashik.com/braces-treatment-nashik.php",keywords:"braces treatment in nashik, braces treatment in gangapur road nashik",lat:20.0092030152797,lng:73.7730296920612},
  {exec:"Ivan",date:"12-03-2026",name:"Yashashree Dental & Orthodontic Clinic Satara",url:"https://yashashreedental.com/braces-treatment.php",keywords:"braces treatment in satara",lat:17.6871714653388,lng:74.0054351777347},
  {exec:"Ivan",date:"12-03-2026",name:"Rai Dental Clinic Bilaspur",url:"https://raidentalclinic.in/braces-treatment-in-bilaspur.php",keywords:"braces treatment in bilaspur",lat:22.0754230646446,lng:82.1602331120428},
  {exec:"Ivan",date:"13-03-2026",name:"Omkarananda Dental Care & Research",url:"https://omkaranandadental.com/braces-treatment-bistupur.php",keywords:"braces treatment in bistupur",lat:22.7969077648307,lng:86.1845130967129},
  {exec:"Ivan",date:"13-03-2026",name:"Sankalp Braces and Dental Clinic Nagpur",url:"https://sankalpbraces.com/",keywords:"dental clinic in wanjari nagar,dentist in wanjari nagar,braces treatment in wanjari nagar,orthodontist in wanjari nagar,braces specialist in wanjari nagar",lat:21.1259148115891,lng:79.0932141040868},
  {exec:"Ivan",date:"13-03-2026",name:"Dr. Batra's Dental Care Clinic",url:"https://batradental.com/root-canal-treatment-bhandara.php",keywords:"root canal treatment in bhandara",lat:21.16650901254,lng:79.6567873730153},
  {exec:"Ivan",date:"16-03-2026",name:"Dr Kalamkar's welldent family dental care",url:"https://drkalamkar.com/",keywords:"dentist in sakkardara, dental clinic in sakkardara, dentist in nandanvan, dental clinic in nandanvan",lat:21.1279349458418,lng:79.1163414047705},
  {exec:"Ivan",date:"16-03-2026",name:"Dr. Kunal Pawar's Dental Clinic Of Braces, Implants & Digital Smile Designing- Hadapsar, Pune",url:"https://drkunalpawardental.com/",keywords:"dental clinic in hadapsar, dentist in hadapsar, dental clinic in magarpatta, dentist in magarpatta",lat:18.5021782785397,lng:73.9298904288358},
  {exec:"Ivan",date:"16-03-2026",name:"Sanghavi Dental Clinic & Implant centre",url:"https://sanghavidentalclinic.com/",keywords:"dental clinic in baramati, dentist in baramati",lat:18.1517915710446,lng:74.5816669482183},
  {exec:"Ivan",date:"16-03-2026",name:"Dr. Batra's Dental Care Clinic",url:"https://batradental.com/",keywords:"dental clinic in bhandara, dentist in bhandara",lat:21.16650901254,lng:79.6567873730153},
  {exec:"Ivan",date:"17-03-2026",name:"s.v. SMILE 32 DENTAL Clinic/Dr.Konda Amarnath /Dr.K.Prachi",url:"https://svsmile32.com/braces-treatment-nizamabad.php",keywords:"orthodontist in nizamabad",lat:18.6710094950668,lng:78.1035488715083},
  {exec:"Ivan",date:"17-03-2026",name:"Dental Design Clinic | Dentist Near Gangapur Rd, Nashik",url:"https://dentaldesignnashik.com/dental-implant-specialist-in-nashik.php",keywords:"dental implant specialist in gangapur road nashik",lat:20.0092030152797,lng:73.7730296920612},
  {exec:"Ivan",date:"17-03-2026",name:"Yashashree Dental & Orthodontic Clinic Satara",url:"https://yashashreedental.com/dr-sandeep-chavan.php",keywords:"orthodontist in satara",lat:17.6871714653388,lng:74.0054351777347},
  {exec:"Ivan",date:"17-03-2026",name:"Dr. Kunal Pawar's Dental Clinic Of Braces, Implants & Digital Smile Designing- Hadapsar, Pune",url:"https://drkunalpawardental.com/dental-implants-in-hadapsar.php",keywords:"dental implant in hadapsar, dental implant in magarpatta",lat:18.5021782785397,lng:73.9298904288358},
  {exec:"Ivan",date:"17-03-2026",name:"Rai Dental Clinic Bilaspur",url:"https://raidentalclinic.in/",keywords:"dentist in bilaspur, dental clinic in bilaspur",lat:22.0754230646446,lng:82.1602331120428},
  {exec:"Ivan",date:"18-03-2026",name:"Omkarananda Dental Care & Research",url:"https://omkaranandadental.com/",keywords:"dentist in bistanpur,dental clinic in bistupur",lat:22.7969077648307,lng:86.1845130967129},
  {exec:"Ivan",date:"18-03-2026",name:"Dr Kalamkar's welldent family dental care",url:"https://drkalamkar.com/root-canal-treatment.php",keywords:"root canal treatment in sakkardara, root canal treatment in nandanvan",lat:21.1279349458418,lng:79.1163414047705},
  {exec:"Ivan",date:"18-03-2026",name:"Sankalp Braces and Dental Clinic Nagpur",url:"https://sankalpbraces.com/root-canal-treatment-in-wanjari-nagar-nagpur.php",keywords:"root canal treatment in wanjari nagar",lat:21.1259148115891,lng:79.0932141040868},
  {exec:"Ivan",date:"18-03-2026",name:"Sanghavi Dental Clinic & Implant centre",url:"https://sanghavidentalclinic.com/root-canal-treatment-in-baramati.php",keywords:"root canal treatment in baramati",lat:18.1517915710446,lng:74.5816669482183},
  {exec:"Ivan",date:"19-03-2026",name:"s.v. SMILE 32 DENTAL Clinic/Dr.Konda Amarnath /Dr.K.Prachi",url:"https://svsmile32.com/oral-maxillofacial-surgeon-nizamabad.php",keywords:"oral maxillofacial surgeon in nizamabad",lat:18.6710094950668,lng:78.1035488715083},
  {exec:"Ivan",date:"19-03-2026",name:"Dental Design Clinic | Dentist Near Gangapur Rd, Nashik",url:"https://dentaldesignnashik.com/",keywords:"dentist in gangapur road nashik, dental clinic in gangapur road nashik, best dentist in nashik, best dental clinic in nashik",lat:20.0092030152797,lng:73.7730296920612},
  {exec:"Ivan",date:"19-03-2026",name:"Yashashree Dental & Orthodontic Clinic Satara",url:"https://yashashreedental.com/dr-sandeep-chavan.php",keywords:"best orthodontist in satara",lat:17.6871714653388,lng:74.0054351777347},
  {exec:"Ivan",date:"19-03-2026",name:"Rai Dental Clinic Bilaspur",url:"https://raidentalclinic.in/root-canal-treatment-in-bilaspur.php",keywords:"root canal treatment in bilaspur",lat:22.0754230646446,lng:82.1602331120428},
  {exec:"Ivan",date:"20-03-2026",name:"Omkarananda Dental Care & Research",url:"https://omkaranandadental.com/root-canal-treatment-bistupur.php",keywords:"root canal treatment in bistupur",lat:22.7969077648307,lng:86.1845130967129},
  {exec:"Ivan",date:"20-03-2026",name:"Sankalp Braces and Dental Clinic Nagpur",url:"https://sankalpbraces.com/dental-implants-in-wanjari-nagar-nagpur.php",keywords:"dental implant treatment in wanjari nagar",lat:21.1259148115891,lng:79.0932141040868},
  {exec:"Ivan",date:"20-03-2026",name:"Dr. Batra's Dental Care Clinic",url:"https://batradental.com/dental-implant-treatment-bhandara.php",keywords:"dental implants in bhandara",lat:21.16650901254,lng:79.6567873730153},
  {exec:"Ivan",date:"23-03-2026",name:"Dr Kalamkar's welldent family dental care",url:"https://drkalamkar.com/dental-implant-treatment.php",keywords:"dental implant treatment in sakkardara, dental implant treatment in nandanvan",lat:21.1279349458418,lng:79.1163414047705},
  {exec:"Ivan",date:"23-03-2026",name:"Dr. Kunal Pawar's Dental Clinic Of Braces, Implants & Digital Smile Designing- Hadapsar, Pune",url:"https://drkunalpawardental.com/root-canal-treatment-in-hadapsar.php",keywords:"root canal treatment in hadapsar, root canal treatment in magarpatta",lat:18.5021782785397,lng:73.9298904288358},
  {exec:"Ivan",date:"23-03-2026",name:"Sanghavi Dental Clinic & Implant centre",url:"https://sanghavidentalclinic.com/dental-implants-in-baramati.php",keywords:"dental implant in baramati",lat:18.1517915710446,lng:74.5816669482183},
  {exec:"Ivan",date:"23-03-2026",name:"Dr. Batra's Dental Care Clinic",url:"https://batradental.com/braces-treatment-bhandara.php",keywords:"braces treatment in bhandara",lat:21.16650901254,lng:79.6567873730153},
  {exec:"Ivan",date:"24-03-2026",name:"s.v. SMILE 32 DENTAL Clinic/Dr.Konda Amarnath /Dr.K.Prachi",url:"https://svsmile32.com/",keywords:"dentist in nizamabad, dental clinic in nizamabad",lat:18.6710094950668,lng:78.1035488715083},
  {exec:"Ivan",date:"24-03-2026",name:"Dental Design Clinic | Dentist Near Gangapur Rd, Nashik",url:"https://dentaldesignnashik.com/root-canal-treatment-nashik.php",keywords:"root canal treatment in gangapur road nashik, root canal treatment in nashik",lat:20.0092030152797,lng:73.7730296920612},
  {exec:"Ivan",date:"24-03-2026",name:"Yashashree Dental & Orthodontic Clinic Satara",url:"https://yashashreedental.com/dr-sandeep-chavan.php",keywords:"braces specialist in satara",lat:17.6871714653388,lng:74.0054351777347},
  {exec:"Ivan",date:"24-03-2026",name:"Dr. Kunal Pawar's Dental Clinic Of Braces, Implants & Digital Smile Designing- Hadapsar, Pune",url:"https://drkunalpawardental.com/braces-treatment-in-hadapsar.php",keywords:"braces treatment in hadapsar, braces treatment in magarpatta",lat:18.5021782785397,lng:73.9298904288358},
  {exec:"Ivan",date:"24-03-2026",name:"Rai Dental Clinic Bilaspur",url:"https://raidentalclinic.in/dental-implant-treatment-in-bilaspur.php",keywords:"dental implant treatment in bilaspur",lat:22.0754230646446,lng:82.1602331120428},
  {exec:"Ivan",date:"25-03-2026",name:"Omkarananda Dental Care & Research",url:"https://omkaranandadental.com/dental-implant-treatment-bistupur.php",keywords:"dental implant treatment in bistupur",lat:22.7969077648307,lng:86.1845130967129},
  {exec:"Ivan",date:"25-03-2026",name:"Dr Kalamkar's welldent family dental care",url:"https://drkalamkar.com/braces-treatment.php",keywords:"braces treatment in sakkardara, braces treatment in nandanvan",lat:21.1279349458418,lng:79.1163414047705},
  {exec:"Ivan",date:"25-03-2026",name:"Sankalp Braces and Dental Clinic Nagpur",url:"https://sankalpbraces.com/",keywords:"dental clinic in wanjari nagar,dentist in wanjari nagar,braces treatment in wanjari nagar,orthodontist in wanjari nagar,braces specialist in wanjari nagar",lat:21.1259148115891,lng:79.0932141040868},
  {exec:"Ivan",date:"25-03-2026",name:"Sanghavi Dental Clinic & Implant centre",url:"https://sanghavidentalclinic.com/braces-treatment-in-baramati.php",keywords:"braces treatment in baramati",lat:18.1517915710446,lng:74.5816669482183},
  {exec:"Ivan",date:"26-03-2026",name:"s.v. SMILE 32 DENTAL Clinic/Dr.Konda Amarnath /Dr.K.Prachi",url:"https://svsmile32.com/root-canal-treatment-nizamabad.php",keywords:"root canal treatment in nizamabad",lat:18.6710094950668,lng:78.1035488715083},
  {exec:"Ivan",date:"26-03-2026",name:"Dental Design Clinic | Dentist Near Gangapur Rd, Nashik",url:"https://dentaldesignnashik.com/dental-implant-treatment-nashik.php",keywords:"dental implant treatment in gangapur road nashik, dental implant treatment in nashik",lat:20.0092030152797,lng:73.7730296920612},
  {exec:"Ivan",date:"26-03-2026",name:"Yashashree Dental & Orthodontic Clinic Satara",url:"https://yashashreedental.com/",keywords:"dental clinic in satara, dentist in satara",lat:17.6871714653388,lng:74.0054351777347},
  {exec:"Ivan",date:"26-03-2026",name:"Rai Dental Clinic Bilaspur",url:"https://raidentalclinic.in/braces-treatment-in-bilaspur.php",keywords:"braces treatment in bilaspur",lat:22.0754230646446,lng:82.1602331120428},
  {exec:"Ivan",date:"27-03-2026",name:"Omkarananda Dental Care & Research",url:"https://omkaranandadental.com/braces-treatment-bistupur.php",keywords:"braces treatment in bistupur",lat:22.7969077648307,lng:86.1845130967129},
  {exec:"Ivan",date:"27-03-2026",name:"Sankalp Braces and Dental Clinic Nagpur",url:"https://sankalpbraces.com/root-canal-treatment-in-wanjari-nagar-nagpur.php",keywords:"root canal treatment in wanjari nagar",lat:21.1259148115891,lng:79.0932141040868},
  {exec:"Ivan",date:"27-03-2026",name:"Dr. Batra's Dental Care Clinic",url:"https://batradental.com/root-canal-treatment-bhandara.php",keywords:"root canal treatment in bhandara",lat:21.16650901254,lng:79.6567873730153},
  {exec:"Pranjali",date:"02-03-2026",name:"Panorama Dental Clinic , Nadiad",url:"https://www.panoramadental.in/",keywords:"dentist in nadiad,dental clinic in nadiad",lat:22.6711646433429,lng:72.8608055072742},
  {exec:"Pranjali",date:"02-03-2026",name:"Dr Devasheesh Kamra Saket",url:"https://drdevasheeshkamra.com/",keywords:"best neurointerventional surgeon in Saket",lat:28.5274887923306,lng:77.214445528323},
  {exec:"Pranjali",date:"02-03-2026",name:"Dr. Shivgunde's Dental Clinic Solapur",url:"https://shivgundedental.com/",keywords:"dental clinic in solapur,dentist in solapur,cosmetic dentist in solapur",lat:17.6620500403008,lng:75.9068810225413},
  {exec:"Pranjali",date:"02-03-2026",name:"PPN DENTAL AND IMPLANT CENTRE",url:"https://ppndentalclinic.com/",keywords:"dentist in palani, dental clinic in palani",lat:10.4518624822507,lng:77.516828778265},
  {exec:"Pranjali",date:"03-03-2026",name:"DR GIRHE DENTAL CLINIC",url:"https://drgirhedental.com/",keywords:"dentist in aurangabad,dental clinic in aurangabad",lat:19.8692871373843,lng:75.3672988553198},
  {exec:"Pranjali",date:"03-03-2026",name:"DANTBATRISA - The Family Dentist | Dental Clinic Chandkheda",url:"https://dantbatrisa.com/",keywords:"dentist in chandkheda,dental clinic in chandkheda",lat:23.1282572791571,lng:72.5580043645875},
  {exec:"Pranjali",date:"03-03-2026",name:"OM HAPPY TEETH Advanced Dental Care Implant Laser Centre",url:"https://www.omhappyteeth.com/",keywords:"dentist in pimple saudagar, dental clinic in pimple saudagar",lat:18.595343905822,lng:73.7877152824285},
  {exec:"Pranjali",date:"03-03-2026",name:"Smile Craft Dental Studio, Satellite Ahmedabad",url:"https://www.smilecraftdentalstudio.com/",keywords:"dentist in satellite ahmedabad, dental clinic in satellite ahmedabad",lat:23.0180683732588,lng:72.5299184802583},
  {exec:"Pranjali",date:"03-03-2026",name:"Dr Roshan's Advanced Dental Clinic and implant centre",url:"https://drroshandental.com/",keywords:"dentist in mulund east, dental clinic in mulund east, dentist in mulund, dental clinic in mulund",lat:19.168717477337,lng:72.9601803495164},
  {exec:"Pranjali",date:"03-03-2026",name:"Dental Hub - Dental Clinic in Jamshedpur",url:"https://www.dental-hub.in/",keywords:"dentist in jamshedpur, dental clinic in jamshedpur",lat:22.804570261868,lng:86.2028840670498},
  {exec:"Pranjali",date:"03-03-2026",name:"Dr.Saurabh Gandhi. tiny teeth. Dentistry for kids and teens",url:"https://tinyteeth.in/kids-dental-clinic-chembur.php",keywords:"kids dentist in chembur,kids dental clinic in chembur,pediatric dentist in chembur",lat:19.0658513899172,lng:72.8956390679587},
  {exec:"Pranjali",date:"04-03-2026",name:"Cosmodental Clinic and Implant Centre Wanowrie (Pune)",url:"https://www.cosmodentalclinic.com/",keywords:"dental clinic in wanowrie,dentist in Wanowrie,cosmetic dentist in wanowrie",lat:18.500567653868,lng:73.9007472999982},
  {exec:"Pranjali",date:"04-03-2026",name:"Dr Devasheesh Kamra Saket",url:"https://drdevasheeshkamra.com/",keywords:"best brain surgeon in Saket",lat:28.5274887923306,lng:77.214445528323},
  {exec:"Pranjali",date:"04-03-2026",name:"Panorama Dental Clinic , Nadiad",url:"https://www.panoramadental.in/root-canal-treatment-in-nadiad-gujarat.php",keywords:"root canal treatment in nadiad",lat:22.6711646433429,lng:72.8608055072742},
  {exec:"Pranjali",date:"04-03-2026",name:"Dr. Shivgunde's Dental Clinic Solapur",url:"https://shivgundedental.com/dental-implants-solapur.php",keywords:"dental implants in solapur",lat:17.6620500403008,lng:75.9068810225413},
  {exec:"Pranjali",date:"04-03-2026",name:"Shah Multispeciality Dental Care Centre",url:"https://flysmileage.com/dental-clinic-in-raviwar-peth-pune.php",keywords:"dentist in raviwar peth, dental clinic in raviwar peth",lat:18.5105016946709,lng:73.8623483990295},
  {exec:"Pranjali",date:"04-03-2026",name:"Fly Dental Clinic salisbury park",url:"https://flysmileage.com/",keywords:"dentist in salisbury park, dental clinic in salisbury park",lat:18.49424790129,lng:73.8737037203457},
  {exec:"Pranjali",date:"04-03-2026",name:"Fly Dental Clinic Bibwewadi, Pune",url:"https://flysmileage.com/dental-clinic-in-bibwewadi-pune.php",keywords:"dentist in bibwewadi, dental clinic in bibwewadi",lat:18.4711505366671,lng:73.8640629723006},
  {exec:"Pranjali",date:"04-03-2026",name:"S.G Jain Multispeciality Dental Clinic and Implant center",url:"https://sgjaindental.com/",keywords:"dentist in r s puram, dental clinic in r s puram",lat:11.0069068151588,lng:76.9583924860437},
  {exec:"Pranjali",date:"05-03-2026",name:"DANTBATRISA - The Family Dentist | Dental Clinic Chandkheda",url:"https://dantbatrisa.com/root-canal-treatment-in-chandkheda-ahmedabad.php",keywords:"root canal treatment in chandkheda",lat:23.1282572791571,lng:72.5580043645875},
  {exec:"Pranjali",date:"05-03-2026",name:"OM HAPPY TEETH Advanced Dental Care Implant Laser Centre",url:"https://www.omhappyteeth.com/root-canal-treatment-pimple-saudagar/",keywords:"root canal treatment pimple saudagar",lat:18.595343905822,lng:73.7877152824285},
  {exec:"Pranjali",date:"05-03-2026",name:"Smile Craft Dental Studio, Satellite Ahmedabad",url:"https://www.smilecraftdentalstudio.com/root-canal-treatment-in-satellite-ahmedabad.php",keywords:"root canal treatment in satellite ahmedabad",lat:23.0180683732588,lng:72.5299184802583},
  {exec:"Pranjali",date:"05-03-2026",name:"Dr Roshan's Advanced Dental Clinic and implant centre",url:"https://drroshandental.com/root-canal-treatment.php",keywords:"root canal treatment in mulund east, root canal treatment in mulund",lat:19.168717477337,lng:72.9601803495164},
  {exec:"Pranjali",date:"05-03-2026",name:"PPN DENTAL AND IMPLANT CENTRE",url:"https://ppndentalclinic.com/root-canal-treatment-in-palani.php",keywords:"root canal treatment in palani",lat:10.4518624822507,lng:77.516828778265},
  {exec:"Pranjali",date:"06-03-2026",name:"DR GIRHE DENTAL CLINIC",url:"https://drgirhedental.com/root-canal-treatment-aurangabad.php",keywords:"root canal treatment in aurangabad",lat:19.8692871373843,lng:75.3672988553198},
  {exec:"Pranjali",date:"06-03-2026",name:"Cosmodental Clinic and Implant Centre Wanowrie (Pune)",url:"https://www.cosmodentalclinic.com/dental-implant-treatment-wanowrie",keywords:"dental implant treatment in Wanowrie,dental implant specialist in wanowrie",lat:18.500567653868,lng:73.9007472999982},
  {exec:"Pranjali",date:"06-03-2026",name:"Dr.Saurabh Gandhi. tiny teeth. Dentistry for kids and teens",url:"https://tinyteeth.in/root-canal-treatment.php",keywords:"root canal treatment for kids in chembur,root canal treatment for kids in tilak nagar mumbai",lat:19.0658513899172,lng:72.8956390679587},
  {exec:"Pranjali",date:"06-03-2026",name:"Dental Hub - Dental Clinic in Jamshedpur",url:"https://www.dental-hub.in/root-canal-treatment-in-jamshedpur/",keywords:"root canal treatment in jamshedpur",lat:22.804570261868,lng:86.2028840670498},
  {exec:"Pranjali",date:"06-03-2026",name:"Shah Multispeciality Dental Care Centre",url:"https://flysmileage.com/dental-implants-in-raviwar-peth-pune.php",keywords:"dental implants in raviwar peth",lat:18.5105016946709,lng:73.8623483990295},
  {exec:"Pranjali",date:"06-03-2026",name:"Fly Dental Clinic salisbury park",url:"https://flysmileage.com/root-canal-treatment-in-salisbury-park-pune.php",keywords:"root canal treatment in salisbury park",lat:18.49424790129,lng:73.8737037203457},
  {exec:"Pranjali",date:"06-03-2026",name:"Fly Dental Clinic Bibwewadi, Pune",url:"https://flysmileage.com/root-canal-treatment-in-bibwewadi-pune.php",keywords:"root canal treatment in bibwewadi",lat:18.4711505366671,lng:73.8640629723006},
  {exec:"Pranjali",date:"06-03-2026",name:"S.G Jain Multispeciality Dental Clinic and Implant center",url:"https://sgjaindental.com/root-canal-treatment-in-rs-puram.php",keywords:"root canal treatment in r s puram",lat:11.0069068151588,lng:76.9583924860437},
  {exec:"Pranjali",date:"09-03-2026",name:"Panorama Dental Clinic , Nadiad",url:"https://www.panoramadental.in/braces-treatment-in-nadiad-gujarat.php",keywords:"braces treatment in nadiad",lat:22.6711646433429,lng:72.8608055072742},
  {exec:"Pranjali",date:"09-03-2026",name:"Dr Devasheesh Kamra Saket",url:"https://drdevasheeshkamra.com/",keywords:"brain specialist in Saket",lat:28.5274887923306,lng:77.214445528323},
  {exec:"Pranjali",date:"09-03-2026",name:"Dr. Shivgunde's Dental Clinic Solapur",url:"https://shivgundedental.com/braces-treatment-solapur.php",keywords:"braces treatment in solapur",lat:17.6620500403008,lng:75.9068810225413},
  {exec:"Pranjali",date:"09-03-2026",name:"PPN DENTAL AND IMPLANT CENTRE",url:"https://ppndentalclinic.com/braces-treatment-in-palani.php",keywords:"braces treatment in palani",lat:10.4518624822507,lng:77.516828778265},
  {exec:"Pranjali",date:"10-03-2026",name:"DR GIRHE DENTAL CLINIC",url:"https://drgirhedental.com/dental-implant-treatment-aurangabad.php",keywords:"dental implant treatment in aurangabad",lat:19.8692871373843,lng:75.3672988553198},
  {exec:"Pranjali",date:"10-03-2026",name:"DANTBATRISA - The Family Dentist | Dental Clinic Chandkheda",url:"https://dantbatrisa.com/braces-treatment-in-chandkheda-ahmedabad.php",keywords:"braces treatment in chandkheda",lat:23.1282572791571,lng:72.5580043645875},
  {exec:"Pranjali",date:"10-03-2026",name:"OM HAPPY TEETH Advanced Dental Care Implant Laser Centre",url:"https://www.omhappyteeth.com/braces-treatment-pimple-saudagar/",keywords:"braces treatment in pimple saudagar",lat:18.595343905822,lng:73.7877152824285},
  {exec:"Pranjali",date:"10-03-2026",name:"Smile Craft Dental Studio, Satellite Ahmedabad",url:"https://www.smilecraftdentalstudio.com/dental-implants-in-satellite-ahmedabad.php",keywords:"dental implant treatment in satellite ahmedabad",lat:23.0180683732588,lng:72.5299184802583},
  {exec:"Pranjali",date:"10-03-2026",name:"Dr Roshan's Advanced Dental Clinic and implant centre",url:"https://drroshandental.com/dental-implants.php",keywords:"dental implant treatment in mulund east, dental implant treatment in mulund",lat:19.168717477337,lng:72.9601803495164},
  {exec:"Pranjali",date:"10-03-2026",name:"Dental Hub - Dental Clinic in Jamshedpur",url:"https://www.dental-hub.in/braces-treatment-in-jamshedpur/",keywords:"braces treatment in jamshedpur",lat:22.804570261868,lng:86.2028840670498},
  {exec:"Pranjali",date:"10-03-2026",name:"Dr.Saurabh Gandhi. tiny teeth. Dentistry for kids and teens",url:"https://tinyteeth.in/braces-treatment-for-kids.php",keywords:"braces treatment for kids in chembur",lat:19.0658513899172,lng:72.8956390679587},
  {exec:"Pranjali",date:"11-03-2026",name:"Cosmodental Clinic and Implant Centre Wanowrie (Pune)",url:"https://www.cosmodentalclinic.com/braces-treatment-wanowrie",keywords:"braces treatment in Wanowrie,braces treatment in Fatima Nagar, Wanowrie",lat:18.500567653868,lng:73.9007472999982},
  {exec:"Pranjali",date:"11-03-2026",name:"Dr Devasheesh Kamra Saket",url:"https://drdevasheeshkamra.com/",keywords:"best neurosurgeon in Saket",lat:28.5274887923306,lng:77.214445528323},
  {exec:"Pranjali",date:"11-03-2026",name:"Panorama Dental Clinic , Nadiad",url:"https://www.panoramadental.in/dental-implants-in-nadiad-gujarat.php",keywords:"dental implant treatment in nadiad",lat:22.6711646433429,lng:72.8608055072742},
  {exec:"Pranjali",date:"11-03-2026",name:"Dr. Shivgunde's Dental Clinic Solapur",url:"https://shivgundedental.com/root-canal-treatment-solapur.php",keywords:"root canal treatment in solapur, endodontic treatment in solapur",lat:17.6620500403008,lng:75.9068810225413},
  {exec:"Pranjali",date:"11-03-2026",name:"Shah Multispeciality Dental Care Centre",url:"https://flysmileage.com/braces-treatment-in-raviwar-peth-pune.php",keywords:"braces treatment in raviwar peth",lat:18.5105016946709,lng:73.8623483990295},
  {exec:"Pranjali",date:"11-03-2026",name:"Fly Dental Clinic salisbury park",url:"https://flysmileage.com/braces-treatment-in-salisbury-park-pune.php",keywords:"braces treatment in salisbury park",lat:18.49424790129,lng:73.8737037203457},
  {exec:"Pranjali",date:"11-03-2026",name:"Fly Dental Clinic Bibwewadi, Pune",url:"https://flysmileage.com/braces-treatment-in-bibwewadi-pune.php",keywords:"braces treatment in bibwewadi",lat:18.4711505366671,lng:73.8640629723006},
  {exec:"Pranjali",date:"11-03-2026",name:"S.G Jain Multispeciality Dental Clinic and Implant center",url:"https://sgjaindental.com/braces-treatment-in-rs-puram.php",keywords:"braces treatment in r s puram",lat:11.0069068151588,lng:76.9583924860437},
  {exec:"Pranjali",date:"12-03-2026",name:"DANTBATRISA - The Family Dentist | Dental Clinic Chandkheda",url:"https://dantbatrisa.com/dental-implants-in-chandkheda-ahmedabad.php",keywords:"dental implant treatment in chandkheda",lat:23.1282572791571,lng:72.5580043645875},
  {exec:"Pranjali",date:"12-03-2026",name:"OM HAPPY TEETH Advanced Dental Care Implant Laser Centre",url:"https://www.omhappyteeth.com/dental-implant-pimple-saudagar/",keywords:"dental implant treatment in pimple saudagar",lat:18.595343905822,lng:73.7877152824285},
  {exec:"Pranjali",date:"12-03-2026",name:"Smile Craft Dental Studio, Satellite Ahmedabad",url:"https://www.smilecraftdentalstudio.com/orthodontic-treatment-in-satellite-ahmedabad.php",keywords:"braces treatment in satellite ahmedabad",lat:23.0180683732588,lng:72.5299184802583},
  {exec:"Pranjali",date:"12-03-2026",name:"Dr Roshan's Advanced Dental Clinic and implant centre",url:"https://drroshandental.com/braces-treatment.php",keywords:"braces treatment in mulund east, braces treatment in mulund",lat:19.168717477337,lng:72.9601803495164},
  {exec:"Pranjali",date:"12-03-2026",name:"PPN DENTAL AND IMPLANT CENTRE",url:"https://ppndentalclinic.com/dental-implants-in-palani.php",keywords:"dental implant treatment in palani",lat:10.4518624822507,lng:77.516828778265},
  {exec:"Pranjali",date:"13-03-2026",name:"DR GIRHE DENTAL CLINIC",url:"https://drgirhedental.com/braces-treatment-aurangabad.php",keywords:"braces treatment in aurangabad",lat:19.8692871373843,lng:75.3672988553198},
  {exec:"Pranjali",date:"13-03-2026",name:"Cosmodental Clinic and Implant Centre Wanowrie (Pune)",url:"https://www.cosmodentalclinic.com/root-canal-treatment-wanowrie",keywords:"root canal treatment in Wanowrie, root canal treatment in Fatima Nagar, Wanowrie",lat:18.500567653868,lng:73.9007472999982},
  {exec:"Pranjali",date:"13-03-2026",name:"Dr.Saurabh Gandhi. tiny teeth. Dentistry for kids and teens",url:"https://tinyteeth.in/",keywords:"kids dentist in tilak nagar mumbai,kids dental clinic in tilak nagar mumbai",lat:19.0658513899172,lng:72.8956390679587},
  {exec:"Pranjali",date:"13-03-2026",name:"Dental Hub - Dental Clinic in Jamshedpur",url:"https://www.dental-hub.in/dental-implants-in-jamshedpur/",keywords:"dental implant treatment in jamshedpur",lat:22.804570261868,lng:86.2028840670498},
  {exec:"Pranjali",date:"13-03-2026",name:"Shah Multispeciality Dental Care Centre",url:"https://flysmileage.com/wisdom-tooth-removal-in-raviwar-peth-pune.php",keywords:"wisdom tooth removal in raviwar peth",lat:18.5105016946709,lng:73.8623483990295},
  {exec:"Pranjali",date:"13-03-2026",name:"Fly Dental Clinic salisbury park",url:"https://flysmileage.com/dental-implants-in-salisbury-park-pune.php",keywords:"dental implants in salisbury park",lat:18.49424790129,lng:73.8737037203457},
  {exec:"Pranjali",date:"13-03-2026",name:"Fly Dental Clinic Bibwewadi, Pune",url:"https://flysmileage.com/wisdom-tooth-removal-in-bibwewadi-pune.php",keywords:"wisdom tooth removal in bibwewadi",lat:18.4711505366671,lng:73.8640629723006},
  {exec:"Pranjali",date:"13-03-2026",name:"S.G Jain Multispeciality Dental Clinic and Implant center",url:"https://sgjaindental.com/dental-implant-treatment-in-rs-puram.php",keywords:"dental implant treatment in r s puram",lat:11.0069068151588,lng:76.9583924860437},
  {exec:"Pranjali",date:"16-03-2026",name:"Panorama Dental Clinic , Nadiad",url:"https://www.panoramadental.in/",keywords:"dentist in nadiad,dental clinic in nadiad",lat:22.6711646433429,lng:72.8608055072742},
  {exec:"Pranjali",date:"16-03-2026",name:"Dr Devasheesh Kamra Saket",url:"https://drdevasheeshkamra.com/migraine-treatment-in-saket-south-delhi.php",keywords:"migraine treatment doctor in saket",lat:28.5274887923306,lng:77.214445528323},
  {exec:"Pranjali",date:"16-03-2026",name:"Dr. Shivgunde's Dental Clinic Solapur",url:"https://shivgundedental.com/kids-dental-treatment-solapur.php",keywords:"kids dentist in solapur",lat:17.6620500403008,lng:75.9068810225413},
  {exec:"Pranjali",date:"16-03-2026",name:"PPN DENTAL AND IMPLANT CENTRE",url:"https://ppndentalclinic.com/implant-specialist-in-palani.php",keywords:"dental implant specialist in palani",lat:10.4518624822507,lng:77.516828778265},
  {exec:"Pranjali",date:"17-03-2026",name:"DR GIRHE DENTAL CLINIC",url:"https://drgirhedental.com/oral-and-maxillofacial-surgeon-aurangabad.php",keywords:"maxillofacial surgeon in aurangabad",lat:19.8692871373843,lng:75.3672988553198},
  {exec:"Pranjali",date:"17-03-2026",name:"DANTBATRISA - The Family Dentist | Dental Clinic Chandkheda",url:"https://dantbatrisa.com/",keywords:"dentist in chandkheda,dental clinic in chandkheda",lat:23.1282572791571,lng:72.5580043645875},
  {exec:"Pranjali",date:"17-03-2026",name:"OM HAPPY TEETH Advanced Dental Care Implant Laser Centre",url:"https://www.omhappyteeth.com/smile-makeover-specialist/",keywords:"smile makeover expert in pimple saudagar",lat:18.595343905822,lng:73.7877152824285},
  {exec:"Pranjali",date:"17-03-2026",name:"Smile Craft Dental Studio, Satellite Ahmedabad",url:"https://www.smilecraftdentalstudio.com/dr-nirali-patel.php",keywords:"smile makeover specialist in satellite ahmedabad",lat:23.0180683732588,lng:72.5299184802583},
  {exec:"Pranjali",date:"17-03-2026",name:"Dr Roshan's Advanced Dental Clinic and implant centre",url:"https://drroshandental.com/dr-roshan-kolhe.php",keywords:"dental implant specialist in mulund east, dental implant specialist in mulund",lat:19.168717477337,lng:72.9601803495164},
  {exec:"Pranjali",date:"17-03-2026",name:"Dental Hub - Dental Clinic in Jamshedpur",url:"https://www.dental-hub.in/",keywords:"dentist in jamshedpur, dental clinic in jamshedpur",lat:22.804570261868,lng:86.2028840670498},
  {exec:"Pranjali",date:"17-03-2026",name:"Dr.Saurabh Gandhi. tiny teeth. Dentistry for kids and teens",url:"https://tinyteeth.in/braces-treatment-for-kids.php",keywords:"braces treatment for kids in tilak nagar mumbai,braces treatment for kids in kurla",lat:19.0658513899172,lng:72.8956390679587},
  {exec:"Pranjali",date:"18-03-2026",name:"Cosmodental Clinic and Implant Centre Wanowrie (Pune)",url:"https://www.cosmodentalclinic.com/",keywords:"dental clinic in wanowrie,dentist in Wanowrie,cosmetic dentist in wanowrie",lat:18.500567653868,lng:73.9007472999982},
  {exec:"Pranjali",date:"18-03-2026",name:"Dr Devasheesh Kamra Saket",url:"https://drdevasheeshkamra.com/",keywords:"best neurointerventional surgeon in Saket",lat:28.5274887923306,lng:77.214445528323},
  {exec:"Pranjali",date:"18-03-2026",name:"Panorama Dental Clinic , Nadiad",url:"https://www.panoramadental.in/root-canal-treatment-in-nadiad-gujarat.php",keywords:"root canal treatment in nadiad",lat:22.6711646433429,lng:72.8608055072742},
  {exec:"Pranjali",date:"18-03-2026",name:"Dr. Shivgunde's Dental Clinic Solapur",url:"https://shivgundedental.com/",keywords:"dental clinic in solapur,dentist in solapur,cosmetic dentist in solapur",lat:17.6620500403008,lng:75.9068810225413},
  {exec:"Pranjali",date:"18-03-2026",name:"Shah Multispeciality Dental Care Centre",url:"https://flysmileage.com/root-canal-treatment-in-raviwar-peth-pune.php",keywords:"root canal treatment in raviwar peth",lat:18.5105016946709,lng:73.8623483990295},
  {exec:"Pranjali",date:"18-03-2026",name:"Fly Dental Clinic salisbury park",url:"https://flysmileage.com/wisdom-tooth-removal-in-salisbury-park-pune.php",keywords:"wisdom tooth removal in salisbury park",lat:18.49424790129,lng:73.8737037203457},
  {exec:"Pranjali",date:"18-03-2026",name:"Fly Dental Clinic Bibwewadi, Pune",url:"https://flysmileage.com/teeth-cleaning-in-bibwewadi-pune.php",keywords:"teeth cleaning in bibwewadi",lat:18.4711505366671,lng:73.8640629723006},
  {exec:"Pranjali",date:"18-03-2026",name:"S.G Jain Multispeciality Dental Clinic and Implant center",url:"https://sgjaindental.com/dental-clinic-in-sai-baba-colony.php",keywords:"dentist in saibaba colony, dental clinic in saibaba colony",lat:11.0069068151588,lng:76.9583924860437},
  {exec:"Pranjali",date:"19-03-2026",name:"DANTBATRISA - The Family Dentist | Dental Clinic Chandkheda",url:"https://dantbatrisa.com/root-canal-treatment-in-chandkheda-ahmedabad.php",keywords:"root canal treatment in chandkheda",lat:23.1282572791571,lng:72.5580043645875},
  {exec:"Pranjali",date:"19-03-2026",name:"OM HAPPY TEETH Advanced Dental Care Implant Laser Centre",url:"https://www.omhappyteeth.com/dental-implant-specialist/",keywords:"dental implant specialist pimple saudagar",lat:18.595343905822,lng:73.7877152824285},
  {exec:"Pranjali",date:"19-03-2026",name:"Smile Craft Dental Studio, Satellite Ahmedabad",url:"https://www.smilecraftdentalstudio.com/dr-nirali-patel.php",keywords:"dental implant specialist in satellite ahmedabad",lat:23.0180683732588,lng:72.5299184802583},
  {exec:"Pranjali",date:"19-03-2026",name:"Dr Roshan's Advanced Dental Clinic and implant centre",url:"https://drroshandental.com/dr-mehnaaz-khan.php",keywords:"cosmetic dentist in mulund east, cosmetic dentist in mulund",lat:19.168717477337,lng:72.9601803495164},
  {exec:"Pranjali",date:"19-03-2026",name:"PPN DENTAL AND IMPLANT CENTRE",url:"https://ppndentalclinic.com/",keywords:"dentist in palani, dental clinic in palani",lat:10.4518624822507,lng:77.516828778265},
  {exec:"Pranjali",date:"20-03-2026",name:"DR GIRHE DENTAL CLINIC",url:"https://drgirhedental.com/",keywords:"dentist in aurangabad,dental clinic in aurangabad",lat:19.8692871373843,lng:75.3672988553198},
  {exec:"Pranjali",date:"20-03-2026",name:"Cosmodental Clinic and Implant Centre Wanowrie (Pune)",url:"https://www.cosmodentalclinic.com/dental-implant-treatment-wanowrie",keywords:"dental implant treatment in Wanowrie,dental implant specialist in wanowrie",lat:18.500567653868,lng:73.9007472999982},
  {exec:"Pranjali",date:"20-03-2026",name:"Dr.Saurabh Gandhi. tiny teeth. Dentistry for kids and teens",url:"https://tinyteeth.in/kids-dentist-kurla.php",keywords:"kids dentist in kurla,kids dental clinic in kurla,pediatric dentist in kurla",lat:19.0658513899172,lng:72.8956390679587},
  {exec:"Pranjali",date:"20-03-2026",name:"Dental Hub - Dental Clinic in Jamshedpur",url:"https://www.dental-hub.in/root-canal-treatment-in-jamshedpur/",keywords:"root canal treatment in jamshedpur",lat:22.804570261868,lng:86.2028840670498},
  {exec:"Pranjali",date:"20-03-2026",name:"Shah Multispeciality Dental Care Centre",url:"https://flysmileage.com/dental-clinic-in-raviwar-peth-pune.php",keywords:"dentist in raviwar peth, dental clinic in raviwar peth",lat:18.5105016946709,lng:73.8623483990295},
  {exec:"Pranjali",date:"20-03-2026",name:"Fly Dental Clinic salisbury park",url:"https://flysmileage.com/",keywords:"dentist in salisbury park, dental clinic in salisbury park",lat:18.49424790129,lng:73.8737037203457},
  {exec:"Pranjali",date:"20-03-2026",name:"Fly Dental Clinic Bibwewadi, Pune",url:"https://flysmileage.com/dental-clinic-in-bibwewadi-pune.php",keywords:"dentist in bibwewadi, dental clinic in bibwewadi",lat:18.4711505366671,lng:73.8640629723006},
  {exec:"Pranjali",date:"20-03-2026",name:"S.G Jain Multispeciality Dental Clinic and Implant center",url:"https://sgjaindental.com/root-canal-treatment-in-rs-puram.php",keywords:"root canal treatment in saibaba colony",lat:11.0069068151588,lng:76.9583924860437},
  {exec:"Pranjali",date:"23-03-2026",name:"Panorama Dental Clinic , Nadiad",url:"https://www.panoramadental.in/dental-implants-in-nadiad-gujarat.php",keywords:"dental implant treatment in nadiad",lat:22.6711646433429,lng:72.8608055072742},
  {exec:"Pranjali",date:"23-03-2026",name:"Dr Devasheesh Kamra Saket",url:"https://drdevasheeshkamra.com/",keywords:"best brain surgeon in Saket",lat:28.5274887923306,lng:77.214445528323},
  {exec:"Pranjali",date:"23-03-2026",name:"Dr. Shivgunde's Dental Clinic Solapur",url:"https://shivgundedental.com/dental-implants-solapur.php",keywords:"dental implants in solapur",lat:17.6620500403008,lng:75.9068810225413},
  {exec:"Pranjali",date:"23-03-2026",name:"PPN DENTAL AND IMPLANT CENTRE",url:"https://ppndentalclinic.com/root-canal-treatment-in-palani.php",keywords:"root canal treatment in palani",lat:10.4518624822507,lng:77.516828778265},
  {exec:"Pranjali",date:"24-03-2026",name:"DR GIRHE DENTAL CLINIC",url:"https://drgirhedental.com/root-canal-treatment-aurangabad.php",keywords:"root canal treatment in aurangabad",lat:19.8692871373843,lng:75.3672988553198},
  {exec:"Pranjali",date:"24-03-2026",name:"DANTBATRISA - The Family Dentist | Dental Clinic Chandkheda",url:"https://dantbatrisa.com/dental-implants-in-chandkheda-ahmedabad.php",keywords:"dental implant treatment in chandkheda",lat:23.1282572791571,lng:72.5580043645875},
  {exec:"Pranjali",date:"24-03-2026",name:"OM HAPPY TEETH Advanced Dental Care Implant Laser Centre",url:"https://www.omhappyteeth.com/",keywords:"dentist in pimple saudagar, dental clinic in pimple saudagar",lat:18.595343905822,lng:73.7877152824285},
  {exec:"Pranjali",date:"24-03-2026",name:"Smile Craft Dental Studio, Satellite Ahmedabad",url:"https://www.smilecraftdentalstudio.com/",keywords:"dentist in satellite ahmedabad, dental clinic in satellite ahmedabad",lat:23.0180683732588,lng:72.5299184802583},
  {exec:"Pranjali",date:"24-03-2026",name:"Dr Roshan's Advanced Dental Clinic and implant centre",url:"https://drroshandental.com/",keywords:"dentist in mulund east, dental clinic in mulund east, dentist in mulund, dental clinic in mulund",lat:19.168717477337,lng:72.9601803495164},
  {exec:"Pranjali",date:"24-03-2026",name:"Dental Hub - Dental Clinic in Jamshedpur",url:"https://www.dental-hub.in/dental-implants-in-jamshedpur/",keywords:"dental implant treatment in jamshedpur",lat:22.804570261868,lng:86.2028840670498},
  {exec:"Pranjali",date:"24-03-2026",name:"Dr.Saurabh Gandhi. tiny teeth. Dentistry for kids and teens",url:"https://tinyteeth.in/kids-dental-clinic-chembur.php",keywords:"kids dentist in chembur,kids dental clinic in chembur,pediatric dentist in chembur",lat:19.0658513899172,lng:72.8956390679587},
  {exec:"Pranjali",date:"25-03-2026",name:"Cosmodental Clinic and Implant Centre Wanowrie (Pune)",url:"https://www.cosmodentalclinic.com/root-canal-treatment-wanowrie",keywords:"root canal treatment in Wanowrie,root canal treatment in Fatima Nagar, Wanowrie",lat:18.500567653868,lng:73.9007472999982},
  {exec:"Pranjali",date:"25-03-2026",name:"Dr Devasheesh Kamra Saket",url:"https://drdevasheeshkamra.com/",keywords:"brain specialist in Saket",lat:28.5274887923306,lng:77.214445528323},
  {exec:"Pranjali",date:"25-03-2026",name:"Panorama Dental Clinic , Nadiad",url:"https://www.panoramadental.in/braces-treatment-in-nadiad-gujarat.php",keywords:"braces treatment in nadiad",lat:22.6711646433429,lng:72.8608055072742},
  {exec:"Pranjali",date:"25-03-2026",name:"Dr. Shivgunde's Dental Clinic Solapur",url:"https://shivgundedental.com/braces-treatment-solapur.php",keywords:"braces treatment in solapur",lat:17.6620500403008,lng:75.9068810225413},
  {exec:"Pranjali",date:"25-03-2026",name:"Shah Multispeciality Dental Care Centre",url:"https://flysmileage.com/dental-implants-in-raviwar-peth-pune.php",keywords:"dental implants in raviwar peth",lat:18.5105016946709,lng:73.8623483990295},
  {exec:"Pranjali",date:"25-03-2026",name:"Fly Dental Clinic salisbury park",url:"https://flysmileage.com/root-canal-treatment-in-salisbury-park-pune.php",keywords:"root canal treatment in salisbury park",lat:18.49424790129,lng:73.8737037203457},
  {exec:"Pranjali",date:"25-03-2026",name:"Fly Dental Clinic Bibwewadi, Pune",url:"https://flysmileage.com/root-canal-treatment-in-bibwewadi-pune.php",keywords:"root canal treatment in bibwewadi",lat:18.4711505366671,lng:73.8640629723006},
  {exec:"Pranjali",date:"25-03-2026",name:"S.G Jain Multispeciality Dental Clinic and Implant center",url:"https://sgjaindental.com/dental-implant-treatment-in-rs-puram.php",keywords:"dental implant treatment in saibaba colony",lat:11.0069068151588,lng:76.9583924860437},
  {exec:"Pranjali",date:"26-03-2026",name:"DANTBATRISA - The Family Dentist | Dental Clinic Chandkheda",url:"https://dantbatrisa.com/braces-treatment-in-chandkheda-ahmedabad.php",keywords:"braces treatment in chandkheda",lat:23.1282572791571,lng:72.5580043645875},
  {exec:"Pranjali",date:"26-03-2026",name:"OM HAPPY TEETH Advanced Dental Care Implant Laser Centre",url:"https://www.omhappyteeth.com/root-canal-treatment-pimple-saudagar/",keywords:"root canal treatment pimple saudagar",lat:18.595343905822,lng:73.7877152824285},
  {exec:"Pranjali",date:"26-03-2026",name:"Smile Craft Dental Studio, Satellite Ahmedabad",url:"https://www.smilecraftdentalstudio.com/root-canal-treatment-in-satellite-ahmedabad.php",keywords:"root canal treatment in satellite ahmedabad",lat:23.0180683732588,lng:72.5299184802583},
  {exec:"Pranjali",date:"26-03-2026",name:"Dr Roshan's Advanced Dental Clinic and implant centre",url:"https://drroshandental.com/root-canal-treatment.php",keywords:"root canal treatment in mulund east, root canal treatment in mulund",lat:19.168717477337,lng:72.9601803495164},
  {exec:"Pranjali",date:"26-03-2026",name:"PPN DENTAL AND IMPLANT CENTRE",url:"https://ppndentalclinic.com/braces-treatment-in-palani.php",keywords:"braces treatment in palani",lat:10.4518624822507,lng:77.516828778265},
  {exec:"Pranjali",date:"27-03-2026",name:"DR GIRHE DENTAL CLINIC",url:"https://drgirhedental.com/dental-implant-treatment-aurangabad.php",keywords:"dental implant treatment in aurangabad",lat:19.8692871373843,lng:75.3672988553198},
  {exec:"Pranjali",date:"27-03-2026",name:"Cosmodental Clinic and Implant Centre Wanowrie (Pune)",url:"https://www.cosmodentalclinic.com/braces-treatment-wanowrie",keywords:"braces treatment in Wanowrie,braces treatment in Fatima Nagar, Wanowrie",lat:18.500567653868,lng:73.9007472999982},
  {exec:"Pranjali",date:"27-03-2026",name:"Dr.Saurabh Gandhi. tiny teeth. Dentistry for kids and teens",url:"https://tinyteeth.in/root-canal-treatment.php",keywords:"root canal treatment for kids in chembur,root canal treatment for kids in tilak nagar mumbai",lat:19.0658513899172,lng:72.8956390679587},
  {exec:"Pranjali",date:"27-03-2026",name:"Dental Hub - Dental Clinic in Jamshedpur",url:"https://www.dental-hub.in/braces-treatment-in-jamshedpur/",keywords:"braces treatment in jamshedpur",lat:22.804570261868,lng:86.2028840670498},
  {exec:"Pranjali",date:"27-03-2026",name:"Shah Multispeciality Dental Care Centre",url:"https://flysmileage.com/braces-treatment-in-raviwar-peth-pune.php",keywords:"braces treatment in raviwar peth",lat:18.5105016946709,lng:73.8623483990295},
  {exec:"Pranjali",date:"27-03-2026",name:"Fly Dental Clinic salisbury park",url:"https://flysmileage.com/braces-treatment-in-salisbury-park-pune.php",keywords:"braces treatment in salisbury park",lat:18.49424790129,lng:73.8737037203457},
  {exec:"Pranjali",date:"27-03-2026",name:"Fly Dental Clinic Bibwewadi, Pune",url:"https://flysmileage.com/braces-treatment-in-bibwewadi-pune.php",keywords:"braces treatment in bibwewadi",lat:18.4711505366671,lng:73.8640629723006},
  {exec:"Pranjali",date:"27-03-2026",name:"S.G Jain Multispeciality Dental Clinic and Implant center",url:"https://sgjaindental.com/braces-treatment-in-rs-puram.php",keywords:"braces treatment in saibaba colony",lat:11.0069068151588,lng:76.9583924860437},
  {exec:"Eknath",date:"02-03-2026",name:"Praveen Dental Care(Dr Praveen's Dental And Implant Specialities)",url:"https://praveendental.in/",keywords:"dentist in tirupati, dental clinic in tirupati",lat:13.6368501926595,lng:79.4232795598609},
  {exec:"Eknath",date:"02-03-2026",name:"Smile Gallery Dental Wellness Centre Arera Colony Bhopal",url:"https://smile-gallery.com/",keywords:"dentist in Bhopal, dental clinic in Bhopal, dentist in Arera Colony, dental clinic in Arera Colony",lat:23.4662964521801,lng:77.9397601689948},
  {exec:"Eknath",date:"02-03-2026",name:"Dr Gul's Dental Clinic Noida | Dentist in Sector 104",url:"https://drgulsdental.com/",keywords:"dentist in noida, dental clinic in noida",lat:28.5412468056769,lng:77.3694486752065},
  {exec:"Eknath",date:"02-03-2026",name:"SMILEKRAFT Maxillofacial Surgery and Dental Hospital/ Smilekraft Dental Implant Centre",url:"https://www.smilekraftnagpur.com/",keywords:"dental clinic in nagpur, dentist in nagpur",lat:21.1361964989524,lng:79.0813982815011},
  {exec:"Eknath",date:"02-03-2026",name:"Dr Arya's Dental Clinic Nagpur | Fixed Teeth In A Visit",url:"https://www.aryasdentalclinic.com/",keywords:"dental clinic in nagpur, dentist in nagpur",lat:21.1320785706811,lng:79.0532282163526},
  {exec:"Eknath",date:"03-03-2026",name:"Arihant Hospital & IVF Center",url:"https://arihanthospitalsikar.com/",keywords:"ivf center in sikar",lat:27.6170760774701,lng:75.1485962050572},
  {exec:"Eknath",date:"03-03-2026",name:"Anvi Dental Clinic Mysuru",url:"https://anvidental.in/",keywords:"dentist in mysuru, dental clinic in mysuru, dental clinic in kuvempu nagara, dentist in kuvempu nagara",lat:12.2817269326931,lng:76.625722732546},
  {exec:"Eknath",date:"03-03-2026",name:"Toothopia Dental Clinic Hiranandani Estate (Kids dental specialist)",url:"https://toothopia.in/",keywords:"dental clinic in ghodbunder road, dentist in ghodbunder road",lat:19.2582624885471,lng:72.9770002688016},
  {exec:"Eknath",date:"03-03-2026",name:"Navjeevan Nursing Care Center - Best Home Care Nursing Center Nagpur - 24Hrs. Facility",url:"https://navjeevannursingcare.com/",keywords:"nursing care centre in nagpur, 24/7 nursing facility nagpur",lat:21.1142410539198,lng:79.0997862878568},
  {exec:"Eknath",date:"03-03-2026",name:"Uru Dental Clinic Sector 1 HSR Layout",url:"https://urudental.com/",keywords:"dental clinic in sector 1 hsr layout, dentist in sector 1 hsr layout",lat:12.9189049444425,lng:77.65234174182},
  {exec:"Eknath",date:"04-03-2026",name:"Praveen Dental Care(Dr Praveen's Dental And Implant Specialities)",url:"https://praveendental.in/root-canal-treatment-in-tirupati.php",keywords:"root canal treatment in tirupati",lat:13.6368501926595,lng:79.4232795598609},
  {exec:"Eknath",date:"04-03-2026",name:"Smile Gallery Dental Wellness Centre Arera Colony Bhopal",url:"https://smile-gallery.com/treatment/root-canal-treatment-in-bhopal/",keywords:"root canal treatment in Bhopal, root canal treatment in Arera Colony",lat:23.4662964521801,lng:77.9397601689948},
  {exec:"Eknath",date:"04-03-2026",name:"Murthy Dental And Braces Clinic Mysore",url:"https://murthydentalclinic.com/",keywords:"dentist in mysore, dental clinic in mysore",lat:12.3003592568163,lng:76.6555134974641},
  {exec:"Eknath",date:"04-03-2026",name:"Dr Gul's Dental Clinic Noida | Dentist in Sector 104",url:"https://drgulsdental.com/root-canal-treatment-noida/",keywords:"root canal treatment in noida",lat:28.5412468056769,lng:77.3694486752065},
  {exec:"Eknath",date:"04-03-2026",name:"Asian Dental Clinic in Dhakoli Zirakpur",url:"https://www.asiandentalclinic.com/",keywords:"dental clinic in dhakoli, dentist in dhakoli",lat:30.6528229864463,lng:76.8462018934212},
  {exec:"Eknath",date:"04-03-2026",name:"Dr Arya's Dental Clinic Nagpur | Fixed Teeth In A Visit",url:"https://www.aryasdentalclinic.com/dental-implant-in-nagpur.php",keywords:"dental implants in nagpur",lat:21.1320785706811,lng:79.0532282163526},
  {exec:"Eknath",date:"05-03-2026",name:"Arihant Hospital & IVF Center",url:"https://arihanthospitalsikar.com/",keywords:"ivf fertility center in sikar",lat:27.6170760774701,lng:75.1485962050572},
  {exec:"Eknath",date:"05-03-2026",name:"Anvi Dental Clinic Mysuru",url:"https://anvidental.in/speciality-treatments/root-canal-treatment-in-kuvempunagar-mysore/",keywords:"root canal treatment in mysuru, root canal treatment in kuvempu nagara",lat:12.2817269326931,lng:76.625722732546},
  {exec:"Eknath",date:"05-03-2026",name:"Toothopia Dental Clinic Hiranandani Estate (Kids dental specialist)",url:"https://toothopia.in/dental-implants-in-ghodbunder-road.php",keywords:"dental implants in ghodbunder road",lat:19.2582624885471,lng:72.9770002688016},
  {exec:"Eknath",date:"05-03-2026",name:"Corium Skin Clinic",url:"https://coriumskinclinic.com/",keywords:"skin clinic in byramji town, skin clinic in nagpur, skin clinic in jaripatka",lat:21.1142410539198,lng:79.0997862878568},
  {exec:"Eknath",date:"06-03-2026",name:"Navjeevan Nursing Care Center - Best Home Care Nursing Center Nagpur - 24Hrs. Facility",url:"https://navjeevannursingcare.com/24x7-nursing-care-in-nagpur.php",keywords:"inpatient nursing care nagpur, long-term patient care nagpur",lat:21.1142410539198,lng:79.0997862878568},
  {exec:"Eknath",date:"06-03-2026",name:"Murthy Dental And Braces Clinic Mysore",url:"https://murthydentalclinic.com/root-canal-treatment-in-mysore.php",keywords:"root canal treatment in mysore",lat:12.3003592568163,lng:76.6555134974641},
  {exec:"Eknath",date:"06-03-2026",name:"SMILEKRAFT Maxillofacial Surgery and Dental Hospital/ Smilekraft Dental Implant Centre",url:"https://www.smilekraftnagpur.com/dental-implants-in-nagpur.php",keywords:"dental implants in nagpur, dental implant treatment in nagpur",lat:21.1361964989524,lng:79.0813982815011},
  {exec:"Eknath",date:"06-03-2026",name:"Asian Dental Clinic in Dhakoli Zirakpur",url:"https://www.asiandentalclinic.com/dental-implants-in-dhakoli-zirakpur.php",keywords:"dental implants in dhakoli, dental implants in zirakpur",lat:30.6528229864463,lng:76.8462018934212},
  {exec:"Eknath",date:"06-03-2026",name:"Uru Dental Clinic Sector 1 HSR Layout",url:"https://urudental.com/root-canal-treatment-in-sector-1-hsr-layout-bengaluru.php",keywords:"root canal treatment in sector 1 hsr layout",lat:12.9189049444425,lng:77.65234174182},
  {exec:"Eknath",date:"06-03-2026",name:"Corium Skin Clinic",url:"https://coriumskinclinic.com/dr-asra-khumushi.php",keywords:"dermatologist in byramji town, skin specialist in byramji town, dermatologist in nagpur, skin specialist in nagpur, dermatologist in jaripatka, skin specialist in jaripatka",lat:21.1142410539198,lng:79.0997862878568},
  {exec:"Eknath",date:"09-03-2026",name:"Praveen Dental Care(Dr Praveen's Dental And Implant Specialities)",url:"https://praveendental.in/dental-implants-in-tirupati.php",keywords:"dental implant treatment in tirupati",lat:13.6368501926595,lng:79.4232795598609},
  {exec:"Eknath",date:"09-03-2026",name:"Smile Gallery Dental Wellness Centre Arera Colony Bhopal",url:"https://smile-gallery.com/treatment/dental-implant-treatment-in-bhopal/",keywords:"dental implant treatment in Bhopal, dental implant treatment in Arera Colony",lat:23.4662964521801,lng:77.9397601689948},
  {exec:"Eknath",date:"09-03-2026",name:"Dr Gul's Dental Clinic Noida | Dentist in Sector 104",url:"https://drgulsdental.com/dental-implant-noida/",keywords:"dental implant treatment in noida",lat:28.5412468056769,lng:77.3694486752065},
  {exec:"Eknath",date:"09-03-2026",name:"SMILEKRAFT Maxillofacial Surgery and Dental Hospital/ Smilekraft Dental Implant Centre",url:"https://www.smilekraftnagpur.com/invisalign-treatment-nagpur.php",keywords:"aligners in nagpur",lat:21.1361964989524,lng:79.0813982815011},
  {exec:"Eknath",date:"09-03-2026",name:"Dr Arya's Dental Clinic Nagpur | Fixed Teeth In A Visit",url:"https://www.aryasdentalclinic.com/root-canal-treatment-in-nagpur.php",keywords:"root canal treatment in nagpur",lat:21.1320785706811,lng:79.0532282163526},
  {exec:"Eknath",date:"10-03-2026",name:"Arihant Hospital & IVF Center",url:"https://arihanthospitalsikar.com/",keywords:"ivf fertility Specialist in sikar",lat:27.6170760774701,lng:75.1485962050572},
  {exec:"Eknath",date:"10-03-2026",name:"Anvi Dental Clinic Mysuru",url:"https://anvidental.in/treatments/braces-treatment-in-kuvempunagar-mysore/",keywords:"braces treatment in mysuru, braces treatment in kuvempu nagara",lat:12.2817269326931,lng:76.625722732546},
  {exec:"Eknath",date:"10-03-2026",name:"Toothopia Dental Clinic Hiranandani Estate (Kids dental specialist)",url:"https://toothopia.in/root-canal-treatment-in-ghodbunder-road.php",keywords:"root canal treatment in ghodbunder road",lat:19.2582624885471,lng:72.9770002688016},
  {exec:"Eknath",date:"10-03-2026",name:"Navjeevan Nursing Care Center - Best Home Care Nursing Center Nagpur - 24Hrs. Facility",url:"https://navjeevannursingcare.com/cancer-care-nursing-centre-in-nagpur.php",keywords:"cancer patient nursing care in nagpur",lat:21.1142410539198,lng:79.0997862878568},
  {exec:"Eknath",date:"10-03-2026",name:"Uru Dental Clinic Sector 1 HSR Layout",url:"https://urudental.com/dental-implants-in-sector-1-hsr-layout-bengaluru.php",keywords:"dental implants in sector 1 hsr layout",lat:12.9189049444425,lng:77.65234174182},
  {exec:"Eknath",date:"11-03-2026",name:"Praveen Dental Care(Dr Praveen's Dental And Implant Specialities)",url:"https://praveendental.in/orthodontic-treatment-in-tirupati.php",keywords:"braces treatment in tirupati",lat:13.6368501926595,lng:79.4232795598609},
  {exec:"Eknath",date:"11-03-2026",name:"Smile Gallery Dental Wellness Centre Arera Colony Bhopal",url:"https://smile-gallery.com/treatment/braces-treatment-in-bhopal/",keywords:"braces treatment in Bhopal",lat:23.4662964521801,lng:77.9397601689948},
  {exec:"Eknath",date:"11-03-2026",name:"Murthy Dental And Braces Clinic Mysore",url:"https://murthydentalclinic.com/dental-implant-treatment-in-mysore.php",keywords:"dental implant treatment in mysore",lat:12.3003592568163,lng:76.6555134974641},
  {exec:"Eknath",date:"11-03-2026",name:"Dr Gul's Dental Clinic Noida | Dentist in Sector 104",url:"https://drgulsdental.com/braces-treatment-noida/",keywords:"braces treatment in noida",lat:28.5412468056769,lng:77.3694486752065},
  {exec:"Eknath",date:"11-03-2026",name:"Asian Dental Clinic in Dhakoli Zirakpur",url:"https://www.asiandentalclinic.com/root-canal-treatment-in-dhakoli-zirakpur.php",keywords:"root canal treatment in dhakoli, root canal treatment in zirakpur",lat:30.6528229864463,lng:76.8462018934212},
  {exec:"Eknath",date:"11-03-2026",name:"Dr Arya's Dental Clinic Nagpur | Fixed Teeth In A Visit",url:"https://www.aryasdentalclinic.com/orthodontic-treatment-in-nagpur.php",keywords:"braces treatment in nagpur",lat:21.1320785706811,lng:79.0532282163526},
  {exec:"Eknath",date:"12-03-2026",name:"Arihant Hospital & IVF Center",url:"https://arihanthospitalsikar.com/",keywords:"leading ivf hospital in sikar",lat:27.6170760774701,lng:75.1485962050572},
  {exec:"Eknath",date:"12-03-2026",name:"Anvi Dental Clinic Mysuru",url:"https://anvidental.in/treatments/dental-implants-in-kuvempunagar-mysore/",keywords:"dental implants in mysuru, dental implants in kuvempu nagara",lat:12.2817269326931,lng:76.625722732546},
  {exec:"Eknath",date:"12-03-2026",name:"Toothopia Dental Clinic Hiranandani Estate (Kids dental specialist)",url:"https://toothopia.in/braces-treatment-in-ghodbunder-road.php",keywords:"braces treatment in ghodbunder road",lat:19.2582624885471,lng:72.9770002688016},
  {exec:"Eknath",date:"12-03-2026",name:"Corium Skin Clinic",url:"https://coriumskinclinic.com/",keywords:"skin clinic in byramji town, skin clinic in nagpur, skin clinic in jaripatka",lat:21.1735878544863,lng:79.0809104957832},
  {exec:"Eknath",date:"13-03-2026",name:"Navjeevan Nursing Care Center - Best Home Care Nursing Center Nagpur - 24Hrs. Facility",url:"https://navjeevannursingcare.com/paralysis-nursing-care-centre-in-nagpur.php",keywords:"paralysis care in nagpur",lat:21.1142410539198,lng:79.0997862878568},
  {exec:"Eknath",date:"13-03-2026",name:"Murthy Dental And Braces Clinic Mysore",url:"https://murthydentalclinic.com/braces-treatment-in-mysore.php",keywords:"braces treatment in mysore",lat:12.3003592568163,lng:76.6555134974641},
  {exec:"Eknath",date:"13-03-2026",name:"SMILEKRAFT Maxillofacial Surgery and Dental Hospital/ Smilekraft Dental Implant Centre",url:"https://www.smilekraftnagpur.com/root-canal-treatment-nagpur.php",keywords:"root canal treatment in nagpur",lat:21.1361964989524,lng:79.0813982815011},
  {exec:"Eknath",date:"13-03-2026",name:"Asian Dental Clinic in Dhakoli Zirakpur",url:"https://www.asiandentalclinic.com/braces-treatment-in-dhakoli-zirakpur.php",keywords:"braces in dhakoli, braces in zirakpur",lat:30.6528229864463,lng:76.8462018934212},
  {exec:"Eknath",date:"13-03-2026",name:"Uru Dental Clinic Sector 1 HSR Layout",url:"https://urudental.com/braces-treatment-in-sector-1-hsr-layout-bengaluru.php",keywords:"braces treatment in sector 1 hsr layout",lat:12.9189049444425,lng:77.65234174182},
  {exec:"Eknath",date:"13-03-2026",name:"Corium Skin Clinic",url:"https://coriumskinclinic.com/dr-asra-khumushi.php",keywords:"dermatologist in byramji town, skin specialist in byramji town, dermatologist in nagpur, skin specialist in nagpur, dermatologist in jaripatka, skin specialist in jaripatka",lat:21.1735878544863,lng:79.0809104957832},
  {exec:"Eknath",date:"16-03-2026",name:"Praveen Dental Care(Dr Praveen's Dental And Implant Specialities)",url:"https://praveendental.in/",keywords:"dentist in tirupati, dental clinic in tirupati",lat:13.6368501926595,lng:79.4232795598609},
  {exec:"Eknath",date:"16-03-2026",name:"Smile Gallery Dental Wellness Centre Arera Colony Bhopal",url:"https://smile-gallery.com/",keywords:"dentist in Bhopal, dental clinic in Bhopal, dentist in Arera Colony, dental clinic in Arera Colony",lat:23.4662964521801,lng:77.9397601689948},
  {exec:"Eknath",date:"16-03-2026",name:"Dr Gul's Dental Clinic Noida | Dentist in Sector 104",url:"https://drgulsdental.com/tmj-treatment-noida/",keywords:"tmj treatment in noida",lat:28.5412468056769,lng:77.3694486752065},
  {exec:"Eknath",date:"16-03-2026",name:"SMILEKRAFT Maxillofacial Surgery and Dental Hospital/ Smilekraft Dental Implant Centre",url:"https://www.smilekraftnagpur.com/dental-clinic-in-dhantoli-nagpur.php",keywords:"dental clinic in dhantoli, dentist in dhantoli",lat:21.1361964989524,lng:79.0813982815011},
  {exec:"Eknath",date:"16-03-2026",name:"Dr Arya's Dental Clinic Nagpur | Fixed Teeth In A Visit",url:"https://www.aryasdentalclinic.com/dental-clinic-in-bharat-nagar.php",keywords:"dental clinic in bharat nagar, dentist in bharat nagar",lat:21.1320785706811,lng:79.0532282163526},
  {exec:"Eknath",date:"17-03-2026",name:"Arihant Hospital & IVF Center",url:"https://arihanthospitalsikar.com/",keywords:"ivf center in sikar",lat:27.6170760774701,lng:75.1485962050572},
  {exec:"Eknath",date:"17-03-2026",name:"Anvi Dental Clinic Mysuru",url:"https://anvidental.in/doctors/dr-anup-sannagowdar/",keywords:"dental implant specialist in kuvempu nagara, dental implant specialist in mysuru",lat:12.2817269326931,lng:76.625722732546},
  {exec:"Eknath",date:"17-03-2026",name:"Toothopia Dental Clinic Hiranandani Estate (Kids dental specialist)",url:"https://toothopia.in/dental-clinic-in-hiranandani-estate-thane.php",keywords:"dental clinic in hiranandani estate, dentist in hiranandani estate",lat:19.2582624885471,lng:72.9770002688016},
  {exec:"Eknath",date:"17-03-2026",name:"Navjeevan Nursing Care Center - Best Home Care Nursing Center Nagpur - 24Hrs. Facility",url:"https://navjeevannursingcare.com/coma-patient-care-centre-in-nagpur.php",keywords:"coma patient care in nagpur",lat:21.1142410539198,lng:79.0997862878568},
  {exec:"Eknath",date:"17-03-2026",name:"Uru Dental Clinic Sector 1 HSR Layout",url:"https://urudental.com/dental-implant-specialist-in-sector-1-hsr-layout-bengaluru.php",keywords:"dental implant specialist in sector 1 hsr layout",lat:12.9189049444425,lng:77.65234174182},
  {exec:"Eknath",date:"18-03-2026",name:"Praveen Dental Care(Dr Praveen's Dental And Implant Specialities)",url:"https://praveendental.in/root-canal-treatment-in-tirupati.php",keywords:"root canal treatment in tirupati",lat:13.6368501926595,lng:79.4232795598609},
  {exec:"Eknath",date:"18-03-2026",name:"Smile Gallery Dental Wellness Centre Arera Colony Bhopal",url:"https://smile-gallery.com/treatment/root-canal-treatment-in-bhopal/",keywords:"root canal treatment in Bhopal, root canal treatment in Arera Colony",lat:23.4662964521801,lng:77.9397601689948},
  {exec:"Eknath",date:"18-03-2026",name:"Murthy Dental And Braces Clinic Mysore",url:"https://murthydentalclinic.com/",keywords:"dentist in mysore, dental clinic in mysore",lat:12.3003592568163,lng:76.6555134974641},
  {exec:"Eknath",date:"18-03-2026",name:"Dr Gul's Dental Clinic Noida | Dentist in Sector 104",url:"https://drgulsdental.com/smile-designing-noida/",keywords:"smile makeover in noida",lat:28.5412468056769,lng:77.3694486752065},
  {exec:"Eknath",date:"18-03-2026",name:"Asian Dental Clinic in Dhakoli Zirakpur",url:"https://www.asiandentalclinic.com/best-dental-clinic-in-zirakpur.php",keywords:"best dentist in zirakpur, best dental clinic in zirakpur",lat:30.6528229864463,lng:76.8462018934212},
  {exec:"Eknath",date:"18-03-2026",name:"Dr Arya's Dental Clinic Nagpur | Fixed Teeth In A Visit",url:"https://www.aryasdentalclinic.com/dental-implant-treatment-in-bharat-nagar.php",keywords:"dental implants in bharat nagar",lat:21.1320785706811,lng:79.0532282163526},
  {exec:"Eknath",date:"19-03-2026",name:"Arihant Hospital & IVF Center",url:"https://arihanthospitalsikar.com/",keywords:"ivf fertility center in sikar",lat:27.6170760774701,lng:75.1485962050572},
  {exec:"Eknath",date:"19-03-2026",name:"Anvi Dental Clinic Mysuru",url:"https://anvidental.in/",keywords:"dentist in mysuru, dental clinic in mysuru, dental clinic in kuvempu nagara, dentist in kuvempu nagara",lat:12.2817269326931,lng:76.625722732546},
  {exec:"Eknath",date:"19-03-2026",name:"Toothopia Dental Clinic Hiranandani Estate (Kids dental specialist)",url:"https://toothopia.in/dental-implants-in-hiranandani-estate-thane.php",keywords:"dental implants in hiranandani estate",lat:19.2582624885471,lng:72.9770002688016},
  {exec:"Eknath",date:"19-03-2026",name:"Corium Skin Clinic",url:"https://coriumskinclinic.com/",keywords:"skin clinic in byramji town, skin clinic in nagpur, skin clinic in jaripatka",lat:21.1735878544863,lng:79.0809104957832},
  {exec:"Eknath",date:"20-03-2026",name:"Navjeevan Nursing Care Center - Best Home Care Nursing Center Nagpur - 24Hrs. Facility",url:"https://navjeevannursingcare.com/",keywords:"nursing care centre in nagpur, 24/7 nursing facility nagpur",lat:21.1142410539198,lng:79.0997862878568},
  {exec:"Eknath",date:"20-03-2026",name:"Murthy Dental And Braces Clinic Mysore",url:"https://murthydentalclinic.com/root-canal-treatment-in-mysore.php",keywords:"root canal treatment in mysore",lat:12.3003592568163,lng:76.6555134974641},
  {exec:"Eknath",date:"20-03-2026",name:"SMILEKRAFT Maxillofacial Surgery and Dental Hospital/ Smilekraft Dental Implant Centre",url:"https://www.smilekraftnagpur.com/teeth-straightening-in-dhantoli.php",keywords:"braces treatment in dhantoli",lat:21.1361964989524,lng:79.0813982815011},
  {exec:"Eknath",date:"20-03-2026",name:"Asian Dental Clinic in Dhakoli Zirakpur",url:"https://www.asiandentalclinic.com/dental-clinic-in-peer-muchalla.php",keywords:"dentist in peer muchalla, dental clinic in peer muchalla",lat:30.6528229864463,lng:76.8462018934212},
  {exec:"Eknath",date:"20-03-2026",name:"Uru Dental Clinic Sector 1 HSR Layout",url:"https://urudental.com/",keywords:"dental clinic in sector 1 hsr layout, dentist in sector 1 hsr layout",lat:12.9189049444425,lng:77.65234174182},
  {exec:"Eknath",date:"20-03-2026",name:"Corium Skin Clinic",url:"https://coriumskinclinic.com/dr-asra-khumushi.php",keywords:"dermatologist in byramji town, skin specialist in byramji town, dermatologist in nagpur, skin specialist in nagpur, dermatologist in jaripatka, skin specialist in jaripatka",lat:21.1735878544863,lng:79.0809104957832},
  {exec:"Eknath",date:"23-03-2026",name:"Praveen Dental Care(Dr Praveen's Dental And Implant Specialities)",url:"https://praveendental.in/dental-implants-in-tirupati.php",keywords:"dental implant treatment in tirupati",lat:13.6368501926595,lng:79.4232795598609},
  {exec:"Eknath",date:"23-03-2026",name:"Smile Gallery Dental Wellness Centre Arera Colony Bhopal",url:"https://smile-gallery.com/treatment/dental-implant-treatment-in-bhopal/",keywords:"dental implant treatment in Bhopal, dental implant treatment in Arera Colony",lat:23.4662964521801,lng:77.9397601689948},
  {exec:"Eknath",date:"23-03-2026",name:"Dr Gul's Dental Clinic Noida | Dentist in Sector 104",url:"https://drgulsdental.com/",keywords:"dentist in noida, dental clinic in noida",lat:28.5412468056769,lng:77.3694486752065},
  {exec:"Eknath",date:"23-03-2026",name:"SMILEKRAFT Maxillofacial Surgery and Dental Hospital/ Smilekraft Dental Implant Centre",url:"https://www.smilekraftnagpur.com/root-canal-treatment-dhantoli.php",keywords:"root canal treatment in dhantoli",lat:21.1361964989524,lng:79.0813982815011},
  {exec:"Eknath",date:"23-03-2026",name:"Dr Arya's Dental Clinic Nagpur | Fixed Teeth In A Visit",url:"https://www.aryasdentalclinic.com/root-canal-treatment-in-bharat-nagar.php",keywords:"root canal treatment in bharat nagar",lat:21.1320785706811,lng:79.0532282163526},
  {exec:"Eknath",date:"24-03-2026",name:"Arihant Hospital & IVF Center",url:"https://arihanthospitalsikar.com/",keywords:"ivf fertility Specialist in sikar",lat:27.6170760774701,lng:75.1485962050572},
  {exec:"Eknath",date:"24-03-2026",name:"Anvi Dental Clinic Mysuru",url:"https://anvidental.in/speciality-treatments/root-canal-treatment-in-kuvempunagar-mysore/",keywords:"root canal treatment in mysuru, root canal treatment in kuvempu nagara",lat:12.2817269326931,lng:76.625722732546},
  {exec:"Eknath",date:"24-03-2026",name:"Toothopia Dental Clinic Hiranandani Estate (Kids dental specialist)",url:"https://toothopia.in/root-canal-treatment-in-hiranandani-estate-thane.php",keywords:"root canal treatment in hiranandani estate",lat:19.2582624885471,lng:72.9770002688016},
  {exec:"Eknath",date:"24-03-2026",name:"Navjeevan Nursing Care Center - Best Home Care Nursing Center Nagpur - 24Hrs. Facility",url:"https://navjeevannursingcare.com/24x7-nursing-care-in-nagpur.php",keywords:"inpatient nursing care nagpur, long-term patient care nagpur",lat:21.1142410539198,lng:79.0997862878568},
  {exec:"Eknath",date:"24-03-2026",name:"Uru Dental Clinic Sector 1 HSR Layout",url:"https://urudental.com/root-canal-treatment-in-sector-1-hsr-layout-bengaluru.php",keywords:"root canal treatment in sector 1 hsr layout",lat:12.9189049444425,lng:77.65234174182},
  {exec:"Eknath",date:"25-03-2026",name:"Praveen Dental Care(Dr Praveen's Dental And Implant Specialities)",url:"https://praveendental.in/orthodontic-treatment-in-tirupati.php",keywords:"braces treatment in tirupati",lat:13.6368501926595,lng:79.4232795598609},
  {exec:"Eknath",date:"25-03-2026",name:"Smile Gallery Dental Wellness Centre Arera Colony Bhopal",url:"https://smile-gallery.com/treatment/braces-treatment-in-bhopal/",keywords:"braces treatment in Bhopal",lat:23.4662964521801,lng:77.9397601689948},
  {exec:"Eknath",date:"25-03-2026",name:"Murthy Dental And Braces Clinic Mysore",url:"https://murthydentalclinic.com/dental-implant-treatment-in-mysore.php",keywords:"dental implant treatment in mysore",lat:12.3003592568163,lng:76.6555134974641},
  {exec:"Eknath",date:"25-03-2026",name:"Dr Gul's Dental Clinic Noida | Dentist in Sector 104",url:"https://drgulsdental.com/root-canal-treatment-noida/",keywords:"root canal treatment in noida",lat:28.5412468056769,lng:77.3694486752065},
  {exec:"Eknath",date:"25-03-2026",name:"Asian Dental Clinic in Dhakoli Zirakpur",url:"https://www.asiandentalclinic.com/dental-clinic-in-sector-20-panchkula.php",keywords:"dental clinic in sector 20 panchkula, dentist in sector 20 panchkula",lat:30.6528229864463,lng:76.8462018934212},
  {exec:"Eknath",date:"25-03-2026",name:"Dr Arya's Dental Clinic Nagpur | Fixed Teeth In A Visit",url:"https://www.aryasdentalclinic.com/braces-treatment-in-bharat-nagar.php",keywords:"braces treatment in bharat nagar",lat:21.1320785706811,lng:79.0532282163526},
  {exec:"Eknath",date:"26-03-2026",name:"Arihant Hospital & IVF Center",url:"https://arihanthospitalsikar.com/",keywords:"leading ivf hospital in sikar",lat:27.6170760774701,lng:75.1485962050572},
  {exec:"Eknath",date:"26-03-2026",name:"Anvi Dental Clinic Mysuru",url:"https://anvidental.in/treatments/braces-treatment-in-kuvempunagar-mysore/",keywords:"braces treatment in mysuru, braces treatment in kuvempu nagara",lat:12.2817269326931,lng:76.625722732546},
  {exec:"Eknath",date:"26-03-2026",name:"Toothopia Dental Clinic Hiranandani Estate (Kids dental specialist)",url:"https://toothopia.in/braces-treatment-in-hiranandani-estate-thane.php",keywords:"braces treatment in hiranandani estate",lat:19.2582624885471,lng:72.9770002688016},
  {exec:"Eknath",date:"26-03-2026",name:"Corium Skin Clinic",url:"https://coriumskinclinic.com/",keywords:"skin clinic in byramji town, skin clinic in nagpur, skin clinic in jaripatka",lat:21.1735878544863,lng:79.0809104957832},
  {exec:"Eknath",date:"27-03-2026",name:"Navjeevan Nursing Care Center - Best Home Care Nursing Center Nagpur - 24Hrs. Facility",url:"https://navjeevannursingcare.com/cancer-care-nursing-centre-in-nagpur.php",keywords:"cancer patient nursing care in nagpur",lat:21.1142410539198,lng:79.0997862878568},
  {exec:"Eknath",date:"27-03-2026",name:"Murthy Dental And Braces Clinic Mysore",url:"https://murthydentalclinic.com/braces-treatment-in-mysore.php",keywords:"braces treatment in mysore",lat:12.3003592568163,lng:76.6555134974641},
  {exec:"Eknath",date:"27-03-2026",name:"SMILEKRAFT Maxillofacial Surgery and Dental Hospital/ Smilekraft Dental Implant Centre",url:"https://www.smilekraftnagpur.com/dental-implants-dhantoli.php",keywords:"dental implants in dhantoli",lat:21.1361964989524,lng:79.0813982815011},
  {exec:"Eknath",date:"27-03-2026",name:"Asian Dental Clinic in Dhakoli Zirakpur",url:"https://www.asiandentalclinic.com/bps-dentures-in-chandigarh.php",keywords:"bps dentures in chandigarh",lat:30.6528229864463,lng:76.8462018934212},
  {exec:"Eknath",date:"27-03-2026",name:"Uru Dental Clinic Sector 1 HSR Layout",url:"https://urudental.com/dental-implants-in-sector-1-hsr-layout-bengaluru.php",keywords:"dental implants in sector 1 hsr layout",lat:12.9189049444425,lng:77.65234174182},
  {exec:"Eknath",date:"27-03-2026",name:"Corium Skin Clinic",url:"https://coriumskinclinic.com/dr-asra-khumushi.php",keywords:"dermatologist in byramji town, skin specialist in byramji town, dermatologist in nagpur, skin specialist in nagpur, dermatologist in jaripatka, skin specialist in jaripatka",lat:21.1735878544863,lng:79.0809104957832}
];

async function loadScheduleFromScript(webAppUrl) {
  if (!webAppUrl || !webAppUrl.trim()) {
    // Fallback to hardcoded data if no URL given
    return SCHEDULE_ROWS;
  }
  var res = await fetch("/.netlify/functions/sheet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: webAppUrl.trim(), action: "getSchedule" })
  });
  if (!res.ok) throw new Error("Schedule fetch failed: " + res.status);
  var data = await res.json();
  if (data.error) throw new Error(data.error);
  var rows = data.rows || [];
  // If sheet returns rows, use them; else fall back to hardcoded
  return rows.length > 0 ? rows : SCHEDULE_ROWS;
}

/* ---
   MAIN APP
--- */
export default function App() {
  const [kw,    setKw]    = useState("");
  const [biz,   setBiz]   = useState("");
  const [url,   setUrl]   = useState("");
  const [busy,  setBusy]  = useState(false);
  const [desc,  setDesc]  = useState("");
  const [utm,   setUtm]   = useState("");
  const [pErr,  setPErr]  = useState("");
  const [genStatus, setGenStatus] = useState("");

  const [file,       setFile]       = useState(null);
  const [prev,       setPrev]       = useState("");
  const [fmt,        setFmt]        = useState("jpg");
  const [lat,        setLat]        = useState("");
  const [lng,        setLng]        = useState("");
  const [gBusy,      setGBusy]      = useState(false);
  const [gResult,    setGResult]    = useState(null);
  const [gErr,       setGErr]       = useState("");
  const [dragging,   setDragging]   = useState(false);
  const [dlState,    setDlState]    = useState("idle");
  const [geoKwInput, setGeoKwInput] = useState("");
  const [geoKwList,  setGeoKwList]  = useState([]);


  // Client DB
  const [clients,       setClients]       = useState([]);
  const [dbLoading,     setDbLoading]     = useState(false);
  const [dbErr,         setDbErr]         = useState("");
  const [showAddForm,   setShowAddForm]   = useState(false);
  const [newBizName,    setNewBizName]    = useState("");
  const [newBizLat,     setNewBizLat]     = useState("");
  const [newBizLng,     setNewBizLng]     = useState("");
  const [saveErr,       setSaveErr]       = useState("");
  const [saveBusy,      setSaveBusy]      = useState(false);
  const [saveOk,        setSaveOk]        = useState(false);
  const [webAppUrl,     setWebAppUrl]     = useState(SHEET_URL_DEFAULT); // pre-filled

  // Schedule state
  const [scheduleData,  setScheduleData]  = useState([]);
  const [scheduleUrl,   setScheduleUrl]   = useState("");
  const [schedLoading,  setSchedLoading]  = useState(false);
  const [schedErr,      setSchedErr]      = useState("");
  const [availDates,    setAvailDates]    = useState([]);
  const [selectedDate,  setSelectedDate]  = useState("");
  const [dateClients,   setDateClients]   = useState([]);
  const [executives,    setExecutives]    = useState([]);
  const [selectedExec,  setSelectedExec]  = useState("");
  const [execDates,     setExecDates]     = useState([]);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminLoggedIn,  setAdminLoggedIn]  = useState(false);
  const [adminView,      setAdminView]      = useState("login");
  const [adminUser,      setAdminUser]      = useState("");
  const [adminPass,      setAdminPass]      = useState("");
  const [adminErr,       setAdminErr]       = useState("");
  const [newExecName,    setNewExecName]    = useState("");
  const [removeExecName, setRemoveExecName] = useState("");
  const [confirmRemove,  setConfirmRemove]  = useState(false);
  const [adminMsg,       setAdminMsg]       = useState("");

  // Detect Location state
  const [detectBusy,     setDetectBusy]     = useState(false);
  const [detectResults,  setDetectResults]  = useState([]);
  const [detectErr,      setDetectErr]      = useState("");
  const [detectOpen,     setDetectOpen]     = useState(false);

  const fileRef  = useRef(null);
  const geoKwRef = useRef(null);


  const loadClients = async (urlOverride) => {
    var target = (urlOverride || webAppUrl).trim();
    if (!target) { setDbErr("Please enter your Web App URL in Settings."); return; }
    setDbLoading(true); setDbErr("");
    try {
      const rows = await readClientsViaScript(target);
      setClients(rows);
    } catch(e) {
      setDbErr(e.message || "Failed to load clients.");
    }
    setDbLoading(false);
  };

  useEffect(function() {
    loadClients(SHEET_URL_DEFAULT);
    loadSchedule(SHEET_URL_DEFAULT);
  }, []);

  const loadSchedule = async (urlOverride) => {
    setSchedLoading(true); setSchedErr("");
    try {
      var schedUrl = urlOverride || webAppUrl || "";
      var rows = await loadScheduleFromScript(schedUrl);
      SCHEDULE_DATA_CACHE = rows;
      setScheduleData(rows);
      var seen = {};
      var dates = [];
      rows.forEach(function(r) { if (r.date && !seen[r.date]) { seen[r.date] = true; dates.push(r.date); } });
      dates.sort();
      setAvailDates(dates);
      setExecDates(dates);
      var execSeen = {};
      var execList = [];
      rows.forEach(function(r) { var ex = r.exec || ""; if (ex && !execSeen[ex]) { execSeen[ex] = true; execList.push(ex); } });
      execList.sort();
      setExecutives(execList);
    } catch(e) {
      setSchedErr(e.message || "Failed to load schedule.");
    }
    setSchedLoading(false);
  };

  const ADMIN_USER = "Admin";
  const ADMIN_PASS_KEY = "gmb_admin_pass";

  const getStoredPass = () => {
    try { return localStorage.getItem(ADMIN_PASS_KEY); }
    catch(e) { return null; }
  };
  const setStoredPass = (p) => {
    try { localStorage.setItem(ADMIN_PASS_KEY, p); }
    catch(e) {}
  };

  const openAdminModal = () => {
    setAdminErr(""); setAdminUser(""); setAdminPass(""); setAdminMsg("");
    setNewExecName(""); setRemoveExecName(""); setConfirmRemove(false);
    if (adminLoggedIn) { setAdminView("panel"); }
    else {
      var stored = getStoredPass();
      setAdminView(stored ? "login" : "setpass");
    }
    setShowAdminModal(true);
  };

  const handleAdminLogin = () => {
    if (adminUser !== ADMIN_USER) { setAdminErr("Invalid username."); return; }
    var stored = getStoredPass();
    if (!stored) { setAdminErr("Please set a password first."); return; }
    if (adminPass !== stored) { setAdminErr("Incorrect password."); return; }
    setAdminLoggedIn(true); setAdminView("panel"); setAdminErr("");
  };

  const handleSetPass = () => {
    if (adminUser !== ADMIN_USER) { setAdminErr("Username must be Admin."); return; }
    if (adminPass.length < 4) { setAdminErr("Password must be at least 4 characters."); return; }
    setStoredPass(adminPass);
    setAdminLoggedIn(true); setAdminView("panel"); setAdminErr("");
  };

  const handleAddExec = () => {
    var n = newExecName.trim();
    if (!n) { setAdminMsg("Enter a name."); return; }
    if (executives.find(function(e) { return e.toLowerCase() === n.toLowerCase(); })) {
      setAdminMsg("Executive already exists."); return;
    }
    setExecutives(function(prev) { return [...prev, n].sort(); });
    setNewExecName(""); setAdminMsg(n + " added successfully.");
  };

  const handleRemoveExec = () => {
    if (!removeExecName) { setAdminMsg("Select an executive to remove."); return; }
    if (!confirmRemove) { setConfirmRemove(true); setAdminMsg("Click Remove again to confirm removal of " + removeExecName + "."); return; }
    setExecutives(function(prev) { return prev.filter(function(e) { return e !== removeExecName; }); });
    if (selectedExec === removeExecName) { setSelectedExec(""); setExecDates([]); setSelectedDate(""); setDateClients([]); setBiz(""); setKw(""); setUrl(""); setLat(""); setLng(""); }
    setRemoveExecName(""); setConfirmRemove(false); setAdminMsg("Executive removed.");
  };

  const closeAdmin = () => { setShowAdminModal(false); setAdminErr(""); setAdminMsg(""); setConfirmRemove(false); };

  const onExecSelect = (exec) => {
    setSelectedExec(exec);
    setSelectedDate(""); setBiz(""); setKw(""); setUrl(""); setLat(""); setLng(""); setDateClients([]);
    if (!exec) { setExecDates(availDates); return; }
    var rows = scheduleData.filter(function(r) { return (r.exec || "") === exec; });
    var seen = {}; var dates = [];
    rows.forEach(function(r) { if (r.date && !seen[r.date]) { seen[r.date] = true; dates.push(r.date); } });
    dates.sort();
    setExecDates(dates);
  };

  const onDateSelect = (date) => {
    setSelectedDate(date);
    setBiz(""); setKw(""); setUrl(""); setLat(""); setLng("");
    if (!date) { setDateClients([]); return; }
    var filtered = scheduleData.filter(function(r) { return r.date === date && (!selectedExec || (r.exec || "") === selectedExec); });
    setDateClients(filtered);
  };

  const onScheduleClientSelect = (name) => {
    setBiz(name);
    var row = dateClients.find(function(r) { return r.name === name; });
    if (row) {
      setKw((row.keywords || "").replace(/,\s*/g, "\n"));
      setUrl(row.url || "");
      setLat(String(row.lat || ""));
      setLng(String(row.lng || ""));
    }
  };

  const selectClient = (name) => {
    setBiz(name);
    const found = clients.find(x => x.name === name);
    if (found) { setLat(String(found.lat)); setLng(String(found.lng)); }
  };

  const saveNewClient = async () => {
    const n  = newBizName.trim();
    const la = parseFloat(newBizLat);
    const lo = parseFloat(newBizLng);
    if (!n)  { setSaveErr("Business Name cannot be empty."); return; }
    if (isNaN(la) || la < -90  || la > 90)  { setSaveErr("Latitude must be a valid number (-90 to 90)."); return; }
    if (isNaN(lo) || lo < -180 || lo > 180) { setSaveErr("Longitude must be a valid number (-180 to 180)."); return; }
    if (clients.find(x => x.name.toLowerCase() === n.toLowerCase())) {
      setSaveErr("Client already exists in the database."); return;
    }
    setSaveBusy(true); setSaveErr("");
    try {
      var webAppTarget = webAppUrl.trim();
      if (webAppTarget && webAppTarget !== SHEET_URL_DEFAULT) {
        await sheetPost(webAppTarget, { action: "addClient", name: n, lat: la, lng: lo });
      }
      setClients(function(prev) { return [...prev, { name: n, lat: la, lng: lo }]; });
      setSaveOk(true);
      setTimeout(function() {
        setShowAddForm(false); setSaveOk(false);
        setNewBizName(""); setNewBizLat(""); setNewBizLng("");
      }, 1500);
    } catch(e) {
      setSaveErr("Save failed. Check your Web App URL.");
    }
    setSaveBusy(false);
  };

  const makeUTM = (u, k) => {
    const kl = k.split("\n").map(x => x.trim()).filter(Boolean);
    const ct = kl.slice(0, 3).join("-").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const b  = u.trim().replace(/\/$/, "");
    return `${b}${b.includes("?") ? "&" : "?"}utm_source=google&utm_medium=gmb&utm_campaign=post&utm_content=${ct}`;
  };

  // ── Detect Location from Keywords ────────────────────────────────
  const detectLocation = async () => {
    const kwLines = kw.split("\n").map(x => x.trim()).filter(Boolean);
    if (!kwLines.length) { setDetectErr("Enter at least one keyword first."); setDetectOpen(true); return; }

    setDetectBusy(true); setDetectErr(""); setDetectResults([]); setDetectOpen(true);

    const stopWords = new Set([
      "dentist","dental","clinic","doctor","hospital","centre","center","care","treatment",
      "implant","implants","braces","specialist","surgery","surgeon","skin","nursing",
      "root","canal","orthodontist","pediatric","kids","cosmetic","best","top",
      "in","at","for","and","or","the","a","an","of","with","by","near","me","service","services",
      "advanced","family","multispeciality","ivf","fertility","neurosurgeon","dermatologist",
      "facility","home","long","term","patient","inpatient","cancer","paralysis","coma",
      "endodontic","tmj","smile","makeover","aligner","aligners","bps","dentures","laser",
      "implant","implant","pediatric","orthodontic","maxillofacial","oral","digital","fixed",
      "specialist","specialist","restorative","cosmetic","preventive","emergency","general",
      "24/7","24hr","24hrs","hour","hours","teeth","tooth","gum","bone","jaw","wisdom","filling",
      "crown","bridge","veneer","whitening","cleaning","scaling","extraction","surgery","procedure",
      "treatment","therapy","care","clinic","centre","center","hospital","doctor","dr","dr."
    ]);

    // Extract ONE location term per keyword line — keep them separate
    const lineTerms = []; // [{line, term}]
    kwLines.forEach(line => {
      const clean = line.toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim();
      const words = clean.split(/\s+/).filter(Boolean);
      // Find the longest consecutive sequence of non-stopwords after "in"/"at"/"near"
      const inIdx = words.findIndex(w => w === "in" || w === "at" || w === "near");
      let seq = [];
      if (inIdx !== -1) {
        // Take words after "in/at/near" that are not stopwords
        for (let i = inIdx + 1; i < words.length; i++) {
          if (!stopWords.has(words[i]) && words[i].length > 1) seq.push(words[i]);
          else if (seq.length) break;
        }
      }
      // Fallback: take all non-stopword sequences
      if (!seq.length) {
        let s = [];
        words.forEach(w => {
          if (!stopWords.has(w) && w.length > 2) { s.push(w); }
          else { if (s.length >= 1) { seq = s; s = []; } }
        });
        if (!seq.length && s.length) seq = s;
      }
      const term = seq.join(" ").trim();
      if (term.length > 1) lineTerms.push({ line, term });
    });

    // Deduplicate terms but keep track of which lines share a term
    const termMap = {}; // term → [lines]
    lineTerms.forEach(({ line, term }) => {
      if (!termMap[term]) termMap[term] = { lines: [], term };
      termMap[term].lines.push(line);
    });
    const uniqueTerms = Object.values(termMap);

    // Also add business name as a search target (if filled)
    const bizTerms = [];
    if (biz && biz.trim()) {
      bizTerms.push({ term: biz.trim(), label: "Business Name", isBiz: true });
    }

    if (!uniqueTerms.length && !bizTerms.length) {
      setDetectErr("Could not extract any locations. Use keywords like 'dentist in Hadapsar'.");
      setDetectBusy(false); return;
    }

    // Geocode helper — asks Claude directly (training data knows Indian geography well)
    const geocodeTerm = async (searchTerm) => {
      try {
        const res = await fetch("/.netlify/functions/claude", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 600,
            messages: [{
              role: "user",
              content: `Give me GPS coordinates for the place named "${searchTerm}" in India. Return ONLY a valid JSON array (no explanation, no markdown, no code fences) with up to 3 best matches in this exact format:
[{"label":"Suburb/Area, City, State","lat":18.5088,"lng":73.9291},{"label":"...","lat":0.0,"lng":0.0}]
If you don't recognize the place, return an empty array: []
Return ONLY the JSON array, nothing else.`
            }]
          })
        });
        const data = await res.json();
        const raw = (data.content && data.content[0] ? data.content[0].text : "").trim()
          .replace(/^```[a-z]*\n?/i, "").replace(/```$/, "").replace(/\n/g, "").trim();
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter(r => r.label && typeof r.lat === "number" && typeof r.lng === "number" && r.lat !== 0);
      } catch(e) { return []; }
    };

    // Geocode all unique location terms (parallel)
    const groups = [];
    const seenLabels = new Set();

    // Process keyword location terms
    await Promise.all(uniqueTerms.map(async ({ term, lines }) => {
      const results = await geocodeTerm(term);
      const unique = results.filter(r => {
        if (seenLabels.has(r.label)) return false;
        seenLabels.add(r.label); return true;
      });
      if (unique.length) {
        groups.push({
          groupLabel: `📍 "${term}" (from: ${lines.slice(0,2).join(", ")}${lines.length > 2 ? ` +${lines.length-2} more` : ""})`,
          term,
          results: unique.slice(0, 3),
          isBiz: false
        });
      }
    }));

    // Process business name
    await Promise.all(bizTerms.map(async ({ term }) => {
      const results = await geocodeTerm(term);
      const unique = results.filter(r => {
        if (seenLabels.has(r.label + "_biz")) return false;
        seenLabels.add(r.label + "_biz"); return true;
      });
      if (unique.length) {
        groups.push({
          groupLabel: `🏢 Business: "${term}"`,
          term,
          results: unique.slice(0, 2),
          isBiz: true
        });
      }
    }));

    if (!groups.length) {
      setDetectErr("No matching locations found. Check your keywords contain place names like 'Hadapsar', 'Magarpatta', 'Nashik' etc.");
    } else {
      setDetectResults(groups);
    }
    setDetectBusy(false);
  };

  const applyDetectedLocation = (result) => {
    setLat(String(result.lat));
    setLng(String(result.lng));
    setDetectOpen(false);
    setDetectResults([]);
    setDetectErr("");
  };

  const generate = async () => {
    if (!kw.trim() || !biz.trim() || !url.trim()) { setPErr("Fill in Business Name, Keywords, and URL first."); return; }
    setPErr(""); setBusy(true); setDesc(""); setUtm(makeUTM(url, kw)); setGenStatus("Connecting...");

    const kl      = kw.split("\n").map(x => x.trim()).filter(Boolean);
    const primary = kl[0] || "";

    const hookStyles = ["question hook", "outcome-first hook", "contrast hook", "bold claim hook", "patient scenario hook"];
    const hookStyle  = hookStyles[Math.floor(Math.random() * hookStyles.length)];
    const seed       = Math.floor(Math.random() * 9000) + 1000;

    const system = `Write a Google Business Profile post for a dental/medical clinic. Output ONLY the post. No intro, no label, no explanation.

EXACT FORMAT TO FOLLOW (replicate this structure every time):

[Hook question OR bold statement using primary keyword + location]? At [Clinic Name], [brief value statement using primary keyword].
[2nd sentence expanding on what they offer using a secondary keyword.]

[Para 2 — personalized approach + technology/method sentence using keyword + location.]
[2nd sentence about clinic environment or patient experience using keyword.]

Patients choose us for:
* [Benefit 1 — use a keyword naturally]
* [Benefit 2 — use a keyword naturally]
* [Benefit 3 — clean/hygienic/comfortable environment]
* [Benefit 4 — transparent/honest treatment]
* [Benefit 5 — aftercare/follow-up]

[CTA sentence using clinic name + action + smile/health outcome.]
#tag1 #tag2 #tag3 #tag4 #tag5 #tag6 #tag7 #tag8 #tag9 #tag10 #tag11 #tag12

KEYWORD RULE — THIS IS THE MOST IMPORTANT RULE:
Every single keyword provided in the "All keywords" list MUST appear somewhere in the post body (paragraphs or bullets). Not one keyword can be skipped or omitted. If there are 6 keywords, all 6 must appear. If there are 10 keywords, all 10 must appear. Use each keyword as a natural phrase inside a sentence — do not just list them.

HASHTAG RULE:
- 10-12 hashtags, all lowercase, no hyphens, no spaces inside tags
- Convert EVERY provided keyword into a hashtag (smash words together): e.g. "dental clinic in hadapsar" → #dentalclinicinhadapsar
- Include clinic brand name as a tag
- Include #[primaryservice]nearme tag
- All on ONE line immediately after CTA — no blank line between CTA and hashtags

CHARACTER LIMIT: Entire post including hashtags MUST be under 1400 characters total. Write tight sentences to fit all keywords.

TONE: Warm, professional, trustworthy — like the clinic owner speaking directly to a patient. Not salesy.

BANNED: state-of-the-art, cutting-edge, passionate, dedicated team, committed to, seamlessly, world-class, holistic, empower, transforming, journey, rest assured, innovative, excellence

UNIQUENESS: Vary the hook each time — rotate: question / bold claim / outcome-first / patient scenario`;

    const kwChecklist = kl.map((k, i) => `${i + 1}. ${k}`).join("\n");

    const userMsg = `Business: ${biz}
Primary keyword: ${primary}
Hook style: ${hookStyle}
Seed: ${seed}

KEYWORDS TO USE — ALL ${kl.length} MUST APPEAR IN THE POST BODY:
${kwChecklist}

Do NOT skip any keyword above. Every single one must appear as a phrase in the paragraphs or bullets.

EXAMPLE of the exact format and tone I want (do NOT copy this — use it as a structural template only):

Looking for a trusted dentist in tirupati? At Praveen Dental Care, we provide expert oral health solutions for every patient. From routine check-ups to advanced restorations, we focus on precision, comfort, and lasting results.
We take a personalised approach to every treatment, ensuring clear communication and a stress-free experience. Our dental clinic in tirupati uses modern technology for accurate diagnosis and effective care.
Patients choose us for:
* Comprehensive consultations and oral health assessments
* Advanced implant and restorative treatments
* A clean, comfortable, and hygienic environment
* Transparent treatment plans with no hidden surprises
* Dedicated aftercare and follow-up support
Book your consultation at Praveen Dental Care today and take the first step toward a healthier smile.
#dentistintirupati #dentalclinicintirupati #praveendentalcare #tirupatidentist #dentalimplantstirupati #rootcanalintirupati #cosmeticdentistrytirupati #tirupatidentalspecialist #dentaltreatmenttirupati #implantdentistrytirupati #bracestirupati #dentistnearme

Now write a UNIQUE post for ${biz}. Use ALL ${kl.length} keywords listed above. Same structure, different content, different hook.`;

    const body = JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1200,
      system,
      messages: [{ role: "user", content: userMsg }]
    });

    const HEADERS = { "Content-Type": "application/json" };
    const API     = "/.netlify/functions/claude";

    // ── helper: fetch with abort timeout ─────────────────────────────
    const timedFetch = (url, opts, ms) => {
      const ctrl  = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), ms);
      return fetch(url, { ...opts, signal: ctrl.signal })
        .then(r  => { clearTimeout(timer); return r; })
        .catch(e => { clearTimeout(timer); throw e; });
    };

    // ── helper: safe status check ─────────────────────────────────────
    const checkStatus = (status) => {
      if (status === 401 || status === 403) throw new Error("auth_error");
      if (status === 529 || status === 503) throw new Error("overloaded");
      if (!String(status).startsWith("2"))  throw new Error("http_" + status);
    };

    // ── ATTEMPT 1: streaming ──────────────────────────────────────────
    let finalText = "";
    try {
      setGenStatus("Generating post...");
      const r = await timedFetch(API, { method: "POST", headers: HEADERS, body, }, 38000);
      checkStatus(r.status);

      if (r.body) {
        const reader  = r.body.getReader();
        const decoder = new TextDecoder();
        let buf = "", accumulated = "";

        const readChunk = () => Promise.race([
          reader.read(),
          new Promise((_, rej) => setTimeout(() => rej(new Error("idle")), 16000))
        ]);

        while (true) {
          let chunk;
          try { chunk = await readChunk(); } catch(_) { try { reader.cancel(); } catch(__){} break; }
          if (chunk.done) break;

          buf += decoder.decode(chunk.value, { stream: true });
          const evLines = buf.split("\n"); buf = evLines.pop();

          for (const line of evLines) {
            if (!line.startsWith("data: ")) continue;
            const raw = line.slice(6).trim();
            if (!raw || raw === "[DONE]") continue;
            try {
              const ev = JSON.parse(raw);
              if (ev.type === "content_block_delta" && ev.delta && ev.delta.type === "text_delta") {
                accumulated += ev.delta.text;
                const show = accumulated.length > 1400 ? accumulated.slice(0, 1400) : accumulated;
                setDesc(show);
                setGenStatus(accumulated.length < 100 ? "Writing..." : accumulated.length < 600 ? "Drafting..." : "Almost done...");
              }
            } catch(_) {}
          }
        }

        if (accumulated.length > 80) finalText = accumulated;
        else { setDesc(""); }
      }
    } catch(e) {
      const msg = e && e.message;
      if (msg === "auth_error") { setPErr("Authentication error — please reload the page."); setBusy(false); setGenStatus(""); return; }
      setDesc(""); setGenStatus("Retrying...");
    }

    // ── ATTEMPTS 2-4: non-streaming fallback ──────────────────────────
    let tries = 0;
    while (!finalText && tries < 3) {
      tries++;
      setGenStatus(tries === 1 ? "Switching to direct mode..." : `Retry ${tries}/3...`);
      await new Promise(res => setTimeout(res, tries === 1 ? 800 : 2000));

      try {
        const r = await timedFetch(API, { method: "POST", headers: HEADERS, body }, 45000);

        if (r.status === 529 || r.status === 503) {
          setGenStatus("Server busy — waiting...");
          await new Promise(res => setTimeout(res, 4000));
          continue;
        }
        if (r.status === 401 || r.status === 403) {
          setPErr("Authentication error — please reload the page.");
          setBusy(false); setGenStatus(""); return;
        }
        if (!r.ok) {
          if (tries < 3) continue;
          setPErr(`API error (${r.status}). Please try again.`);
          setBusy(false); setGenStatus(""); return;
        }

        setGenStatus("Processing...");
        const data = await r.json();
        const text = (data.content || []).map(b => b.text || "").join("").trim();

        if (text.length > 80) {
          finalText = text;
          setDesc(text.length > 1400 ? text.slice(0, 1400) : text);
        } else {
          if (tries < 3) { setGenStatus("Empty response — retrying..."); continue; }
          setPErr("No content received. Please try again in a moment.");
          setBusy(false); setGenStatus(""); return;
        }
      } catch(e) {
        const isTimeout = e && (e.name === "AbortError" || (e.message && e.message.includes("abort")));
        if (tries < 3) { setGenStatus(isTimeout ? "Timed out — retrying..." : "Connection error — retrying..."); continue; }
        setPErr(isTimeout ? "Request timed out. Check your connection and try again." : "Connection failed. Please check your network.");
        setBusy(false); setGenStatus(""); return;
      }
    }

    // ── post-process: enforce 1400 char hard cap ──────────────────────
    setDesc(prev => {
      if (!prev || prev.length <= 1400) return prev;
      const lines   = prev.split("\n");
      const hIdx    = lines.findIndex(l => l.trim().startsWith("#"));
      const hashLine = hIdx !== -1 ? lines.slice(hIdx).join("\n") : "";
      let body      = (hIdx !== -1 ? lines.slice(0, hIdx) : lines).join("\n").trimEnd();
      const target  = 1400 - (hashLine ? hashLine.length + 1 : 0);
      if (body.length > target) {
        let trimmed = body.slice(0, target);
        const lp = Math.max(trimmed.lastIndexOf(". "), trimmed.lastIndexOf(".\n"), trimmed.lastIndexOf("! "), trimmed.lastIndexOf("? "));
        trimmed = lp > target * 0.5 ? trimmed.slice(0, lp + 1).trimEnd() : trimmed.slice(0, trimmed.lastIndexOf(" ")).trimEnd();
        body = trimmed;
      }
      return (body + (hashLine ? "\n" + hashLine : "")).slice(0, 1400);
    });

    setGenStatus("");
    setBusy(false)
  };

  const reset = () => { setKw(""); setBiz(""); setUrl(""); setDesc(""); setUtm(""); setPErr(""); };

  const pickFile = useCallback(f => {
    if (!f) return;
    if (!f.type.startsWith("image/")) { setGErr("Please upload a valid image."); return; }
    setFile(f); setGResult(null); setGErr("");
    const r = new FileReader(); r.onload = e => setPrev(e.target.result); r.readAsDataURL(f);
  }, []);

  const onDrop = useCallback(e => { e.preventDefault(); setDragging(false); pickFile((e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0])); }, [pickFile]);

  const addGeoKw = () => {
    const val = geoKwInput.trim(); if (!val) return;
    const parts = val.split(",").map(v => v.trim()).filter(Boolean);
    setGeoKwList(prev => { const m = [...prev]; parts.forEach(p => { if (!m.includes(p)) m.push(p); }); return m; });
    setGeoKwInput(""); (geoKwRef.current && geoKwRef.current.focus());
  };
  const removeGeoKw = i => setGeoKwList(prev => prev.filter((_, idx) => idx !== i));

  const processGeo = async () => {
    if (!file) { setGErr("Please upload an image first."); return; }
    const la = parseFloat(lat), lo = parseFloat(lng);
    if (isNaN(la) || la < -90  || la > 90)   { setGErr("Latitude must be -90 to 90."); return; }
    if (isNaN(lo) || lo < -180 || lo > 180)  { setGErr("Longitude must be -180 to 180."); return; }
    const postKws = kw.split("\n").map(x => x.trim()).filter(Boolean);
    const merged  = [...new Set([...postKws, ...geoKwList])];
    if (!merged.length) { setGErr("Add at least one keyword above."); return; }
    setGBusy(true); setGErr(""); setGResult(null);
    try {
      const { dataURL } = await processGeoTag(file, la, lo, merged, biz || "Business");
      const fname = merged[0].toLowerCase().replace(/[^a-z0-9\s]/g, "").trim().replace(/\s+/g, " ");
      setGResult({ dataURL, filename:`${fname}.jpg`, merged });
    } catch (err) { setGErr(err.message || "Processing failed. Try a different image."); }
    finally { setGBusy(false); }
  };

  const download = async () => {
    if (!gResult) return; setDlState("trying");
    const { dataURL, filename } = gResult;
    try { const res = await fetch(dataURL); const blob = await res.blob(); const burl = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = burl; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); setTimeout(() => URL.revokeObjectURL(burl), 5000); setDlState("done"); setTimeout(() => setDlState("idle"), 3000); return; } catch (_) {}
    try { const a = document.createElement("a"); a.href = dataURL; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); setDlState("done"); setTimeout(() => setDlState("idle"), 3000); return; } catch (_) {}
    try { window.open(dataURL, "_blank"); } catch (_) {}
    setDlState("fallback");
  };

  const FMTS   = ["jpg","jpeg","png","webp","gif","bmp","tiff","avif","heic"];
  const kwList = kw.split("\n").map(x => x.trim()).filter(Boolean);

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#F8F9FF 0%,#F1F3F4 55%,#EDF7EE 100%)", fontFamily:"'Google Sans','Segoe UI',sans-serif", padding:"26px 14px 60px", boxSizing:"border-box" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto+Mono:wght@400&display=swap');
        @keyframes bo    { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
        @keyframes su    { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        * { box-sizing:border-box }
        .dz:hover { border-color:${G_BLUE}!important; background:#F0F4FF!important }
        select { -webkit-appearance:none; appearance:none }
      `}</style>

      <div style={{ maxWidth:760, margin:"0 auto", display:"flex", flexDirection:"column", gap:24 }}>

        {/* HEADER */}
        <div style={{ textAlign:"center", paddingBottom:4 }}>
          <div style={{ display:"flex", justifyContent:"center", gap:7, marginBottom:9 }}>
            {[G_BLUE, G_RED, G_YELLOW, G_GREEN].map((c, i) => <Dot key={i} c={c} s={9}/>)}
          </div>
          <h1 style={{ fontSize:28, fontWeight:700, margin:"0 0 5px", letterSpacing:"-.03em", background:`linear-gradient(135deg,${G_BLUE},${G_GREEN})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>GMB Post Creator Pro</h1>
          <p style={{ fontSize:13.5, color:"#5F6368", margin:0 }}>Ranking-optimized posts · UTM tracking · GeoTag image injection</p>
        </div>

        {/* POST GENERATOR */}
        <div style={{ background:"white", borderRadius:18, border:"1.5px solid #E8EAED", boxShadow:"0 3px 18px rgba(60,64,67,.09)", overflow:"hidden" }}>
          <CardHead icon="✍️" title="Post Generator" badge="AI · RANKING OPTIMIZED"/>
          <div style={{ padding:"20px 22px", display:"flex", flexDirection:"column", gap:16 }}>
            {/* SCHEDULE PANEL - always visible */}
            <div style={{ padding:"14px 16px", borderRadius:12, border:"2px solid " + G_BLUE, background:"linear-gradient(135deg,#E3F2FD,#F8FBFF)", display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ fontSize:12.5, fontWeight:700, color:G_BLUE, display:"flex", alignItems:"center", gap:6 }}>
                <span>📅</span>
                <span>Monthly Posting Schedule</span>
                {scheduleData.length > 0 && <span style={{ marginLeft:"auto", fontSize:11, fontWeight:400, color:"#5F6368" }}>{scheduleData.length} posts · {availDates.length} dates{executives.length > 0 ? " · " + executives.length + " execs" : ""}</span>}
              </div>
              {scheduleData.length === 0 && (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <div style={{ fontSize:12.5, color:"#5F6368", lineHeight:1.6 }}>
                    Paste your Google Apps Script Web App URL below to load your monthly schedule — executives, dates, and businesses will auto-fill.
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <input
                      id="schedule-url-input-inline"
                      value={webAppUrl}
                      onChange={e => setWebAppUrl(e.target.value)}
                      placeholder="https://script.google.com/macros/s/YOUR_ID/exec"
                      style={{ flex:1, padding:"9px 12px", borderRadius:9, border:"1.5px solid #DADCE0", fontSize:12, fontFamily:"inherit", color:"#3C4043", background:"white", outline:"none" }}
                      onFocus={e => { e.target.style.borderColor = G_BLUE; e.target.style.boxShadow = "0 0 0 3px #4285F41a"; }}
                      onBlur={e  => { e.target.style.borderColor = "#DADCE0"; e.target.style.boxShadow = "none"; }}
                    />
                    <button
                      onClick={() => { loadClients(webAppUrl); loadSchedule(webAppUrl); }}
                      disabled={schedLoading || dbLoading}
                      style={{ padding:"9px 16px", borderRadius:9, border:"none", background:(schedLoading||dbLoading)?"#BDC1C6":"linear-gradient(135deg,"+G_BLUE+","+G_GREEN+")", color:"white", fontSize:12.5, fontWeight:700, cursor:(schedLoading||dbLoading)?"not-allowed":"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}
                    >
                      {(schedLoading||dbLoading) ? "Connecting..." : "🔗 Connect Sheet"}
                    </button>
                  </div>
                  {schedErr && <div style={{ fontSize:11.5, color:"#EA4335", padding:"6px 10px", background:"#FEF1F0", borderRadius:7, border:"1px solid #EA433533" }}>⚠️ {schedErr}</div>}
                </div>
              )}
              {scheduleData.length > 0 && (
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {executives.length > 0 && (
                    <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                      <label style={{ fontSize:12, fontWeight:600, color:"#5F6368", display:"flex", alignItems:"center", justifyContent:"space-between" }}><span>👤 LSO Executive</span><button onClick={openAdminModal} style={{ fontSize:10.5, fontWeight:700, color:"white", background:adminLoggedIn?"#34A853":"#4285F4", border:"none", borderRadius:6, padding:"3px 9px", cursor:"pointer", fontFamily:"inherit" }}>{adminLoggedIn?"⚙️ Manage":"🔒 Manage"}</button></label>
                      <div style={{ position:"relative" }}>
                        <select value={selectedExec} onChange={e => onExecSelect(e.target.value)} style={{ width:"100%", padding:"10px 32px 10px 13px", borderRadius:10, border:"1.5px solid #DADCE0", fontSize:13, fontFamily:"inherit", color: selectedExec ? "#3C4043" : "#9AA0A6", background:"white", cursor:"pointer", outline:"none", WebkitAppearance:"none", appearance:"none" }}>
                          <option value="">-- Select executive --</option>
                          {executives.map(function(ex, i) { return <option key={i} value={ex}>{ex}</option>; })}
                        </select>
                        <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:"#5F6368", fontSize:11 }}>▾</span>
                      </div>
                    </div>
                  )}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                    <label style={{ fontSize:12, fontWeight:600, color:"#5F6368" }}>📆 Select Date</label>
                    <div style={{ position:"relative" }}>
                      <select value={selectedDate} onChange={e => onDateSelect(e.target.value)} style={{ width:"100%", padding:"10px 32px 10px 13px", borderRadius:10, border:"1.5px solid #DADCE0", fontSize:13, fontFamily:"inherit", color: selectedDate ? "#3C4043" : "#9AA0A6", background:"white", cursor:"pointer", outline:"none", WebkitAppearance:"none", appearance:"none" }}>
                        <option value="">-- Select posting date --</option>
                        {execDates.map(function(d, i) { return <option key={i} value={d}>{d}</option>; })}
                      </select>
                      <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:"#5F6368", fontSize:11 }}>▾</span>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                    <label style={{ fontSize:12, fontWeight:600, color:"#5F6368" }}>🏢 Business (this date)</label>
                    <div style={{ position:"relative" }}>
                      <select value={biz} onChange={e => onScheduleClientSelect(e.target.value)} disabled={!selectedDate} style={{ width:"100%", padding:"10px 32px 10px 13px", borderRadius:10, border:"1.5px solid #DADCE0", fontSize:13, fontFamily:"inherit", color: biz ? "#3C4043" : "#9AA0A6", background: selectedDate ? "white" : "#F8F9FA", cursor: selectedDate ? "pointer" : "not-allowed", outline:"none", WebkitAppearance:"none", appearance:"none", opacity: selectedDate ? 1 : 0.65 }}>
                        <option value="">{selectedDate ? "-- Select business --" : "-- Select a date first --"}</option>
                        {dateClients.map(function(cl, i) { return <option key={i} value={cl.name}>{cl.name}</option>; })}
                      </select>
                      <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:"#5F6368", fontSize:11 }}>▾</span>
                    </div>
                    {selectedDate && dateClients.length === 0 && <span style={{ fontSize:11, color:G_YELLOW }}>No businesses on this date.</span>}
                    {selectedDate && dateClients.length > 0 && <span style={{ fontSize:11, color:"#9AA0A6" }}>{dateClients.length} business{dateClients.length !== 1 ? "es" : ""} scheduled</span>}
                  </div>
                </div>
                </div>
              )}
              {biz && kw && (
                <div style={{ padding:"7px 11px", borderRadius:8, background:"#E8F5E9", border:"1.5px solid #34A85333", fontSize:11.5, color:"#2E7D32", fontWeight:600 }}>
                  All fields auto-filled — ready to generate
                </div>
              )}
            </div>

                        <Field label="🔑 SEO Keywords" value={kw} onChange={v => { setKw(v); setDetectResults([]); setDetectErr(""); setDetectOpen(false); }} multiline placeholder={"dental implants\ntooth replacement\nimplant dentist\npermanent teeth solution"} hint="One keyword per line -- also embedded into GeoTag metadata"/>

            {/* ── Detect Location Panel ── */}
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <button onClick={detectLocation} disabled={detectBusy} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:9, border:"1.5px solid #4285F4", background:detectBusy?"#F1F3F4":"white", color:detectBusy?"#9AA0A6":G_BLUE, fontSize:12.5, fontWeight:700, cursor:detectBusy?"not-allowed":"pointer", fontFamily:"inherit", transition:"all .2s", whiteSpace:"nowrap" }}>
                  {detectBusy ? <><Dots/><span style={{ marginLeft:4 }}>Detecting...</span></> : <><span>🌍</span><span>Detect Location from Keywords</span></>}
                </button>
                {detectOpen && (detectResults.length > 0 || detectErr) && (
                  <button onClick={() => { setDetectOpen(false); setDetectResults([]); setDetectErr(""); }} style={{ fontSize:12, color:"#5F6368", background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", padding:0, textDecoration:"underline" }}>Clear</button>
                )}
              </div>

              {detectOpen && (
                <div style={{ borderRadius:11, border:"1.5px solid #DADCE0", background:"white", boxShadow:"0 4px 18px rgba(60,64,67,.1)", overflow:"hidden", animation:"su .25s ease" }}>
                  {/* Header */}
                  <div style={{ padding:"9px 14px", background:"linear-gradient(135deg,#E8F0FE,#F8FBFF)", borderBottom:"1px solid #E8EAED", display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:13 }}>🌍</span>
                    <span style={{ fontSize:12.5, fontWeight:700, color:"#202124" }}>Location Detection</span>
                    <span style={{ fontSize:11, color:"#5F6368", marginLeft:"auto" }}>Powered by OpenStreetMap</span>
                  </div>

                  {detectErr && (
                    <div style={{ padding:"12px 14px", fontSize:12.5, color:"#EA4335", display:"flex", alignItems:"center", gap:7 }}>
                      <span>⚠️</span> {detectErr}
                    </div>
                  )}

                  {detectResults.length > 0 && (
                    <div style={{ padding:"10px 12px", display:"flex", flexDirection:"column", gap:14 }}>
                      <div style={{ fontSize:11.5, fontWeight:700, color:"#5F6368", paddingLeft:2 }}>
                        {detectResults.length} location group{detectResults.length > 1 ? "s" : ""} found — click any result to auto-fill coordinates:
                      </div>
                      {detectResults.map((group, gi) => (
                        <div key={gi} style={{ display:"flex", flexDirection:"column", gap:6 }}>
                          {/* Group header */}
                          <div style={{ fontSize:12, fontWeight:700, color: group.isBiz ? "#E67E22" : G_BLUE, padding:"5px 10px", borderRadius:7, background: group.isBiz ? "#FFF3E0" : "#E8F0FE", border:`1px solid ${group.isBiz ? "#FFB74D44" : G_BLUE+"33"}` }}>
                            {group.groupLabel}
                          </div>
                          {/* Results for this group */}
                          {group.results.map((r, ri) => (
                            <button key={ri} onClick={() => applyDetectedLocation(r)}
                              style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"10px 13px", borderRadius:9, border:"1.5px solid #E8EAED", background:"#FAFAFA", cursor:"pointer", fontFamily:"inherit", textAlign:"left", transition:"all .15s", marginLeft:8 }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = group.isBiz ? "#E67E22" : G_BLUE; e.currentTarget.style.background = group.isBiz ? "#FFF8F0" : "#F0F4FF"; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E8EAED"; e.currentTarget.style.background = "#FAFAFA"; }}>
                              <span style={{ fontSize:15, flexShrink:0, marginTop:1 }}>{group.isBiz ? "🏢" : "📍"}</span>
                              <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ fontSize:13, fontWeight:700, color:"#202124", marginBottom:2 }}>{r.label}</div>
                                <div style={{ display:"flex", gap:10, fontSize:11, fontWeight:600 }}>
                                  <span style={{ color:G_GREEN }}>Lat: {r.lat.toFixed(6)}</span>
                                  <span style={{ color:G_BLUE }}>Lng: {r.lng.toFixed(6)}</span>
                                </div>
                              </div>
                              <div style={{ flexShrink:0, alignSelf:"center", padding:"4px 10px", borderRadius:6, background: group.isBiz ? "#E67E22" : G_BLUE, color:"white", fontSize:11, fontWeight:700 }}>Use</div>
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                <label style={{ fontSize:12.5, fontWeight:600, color:"#5F6368", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span>🏢 Business Name</span>
                  <button onClick={() => { setShowAddForm(!showAddForm); setSaveErr(""); setSaveOk(false); }} style={{ fontSize:11, fontWeight:700, color:G_GREEN, background:"none", border:"none", cursor:"pointer", padding:0, fontFamily:"inherit" }}>+ Add Client</button>
                </label>
                <div style={{ position:"relative" }}>
                  <select value={biz} onChange={e => selectClient(e.target.value)} style={{ width:"100%", padding:"10px 32px 10px 13px", borderRadius:10, border:"1.5px solid #DADCE0", fontSize:13.5, fontFamily:"inherit", color: biz ? "#3C4043" : "#9AA0A6", background:"white", cursor:"pointer", outline:"none", WebkitAppearance:"none", appearance:"none" }}>
                    <option value="">-- Select a client --</option>
                    {clients.map((cl, i) => <option key={i} value={cl.name}>{cl.name}</option>)}
                  </select>
                  <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:"#5F6368", fontSize:11 }}>▾</span>
                </div>
                {dbLoading && <span style={{ fontSize:11, color:G_BLUE }}>Loading clients from sheet...</span>}
                {dbErr     && <div style={{ fontSize:11, color:G_RED, padding:"6px 10px", borderRadius:7, background:"#FEF1F0", border:"1.5px solid #EA433533", lineHeight:1.6 }}>⚠️ {dbErr}</div>}
                {!dbLoading && !dbErr && clients.length === 0 && <span style={{ fontSize:11, color:G_YELLOW }}>Connect your sheet in Settings below to load clients.</span>}
                {!dbLoading && !dbErr && clients.length > 0 && (
                  <span style={{ fontSize:11, color:"#9AA0A6" }}>{clients.length} client{clients.length !== 1 ? "s" : ""} loaded</span>
                )}
              </div>
              <Field label="🔗 Website URL" value={url} onChange={setUrl} placeholder="https://yourbiz.com/page" hint="Landing page for UTM"/>
            </div>

            {/* Add Client Form */}
            {showAddForm && (
              <div style={{ padding:"16px 18px", borderRadius:12, border:"2px solid " + G_GREEN, background:"linear-gradient(135deg,#E8F5E9,#F8FFFB)", display:"flex", flexDirection:"column", gap:12, animation:"su .3s ease" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontWeight:700, fontSize:14, color:"#2E7D32" }}>Add New Client</span>
                  <button onClick={() => setShowAddForm(false)} style={{ background:"none", border:"none", fontSize:18, cursor:"pointer", color:"#5F6368", lineHeight:1, padding:0 }}>x</button>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                    <label style={{ fontSize:12, fontWeight:600, color:"#5F6368" }}>Business Name</label>
                    <input value={newBizName} onChange={e => setNewBizName(e.target.value)} placeholder="e.g. Sanghavi Dental Clinic" style={{ padding:"9px 12px", borderRadius:9, border:"1.5px solid #DADCE0", fontSize:13, fontFamily:"inherit", outline:"none", color:"#3C4043" }}
                      onFocus={e => { e.target.style.borderColor = G_GREEN; e.target.style.boxShadow = "0 0 0 3px #34A85320"; }}
                      onBlur={e  => { e.target.style.borderColor = "#DADCE0"; e.target.style.boxShadow = "none"; }}/>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                      <label style={{ fontSize:12, fontWeight:600, color:"#5F6368" }}>Latitude</label>
                      <input type="number" step="any" value={newBizLat} onChange={e => setNewBizLat(e.target.value)} placeholder="e.g. 21.1458" style={{ padding:"9px 12px", borderRadius:9, border:"1.5px solid #DADCE0", fontSize:13, fontFamily:"inherit", outline:"none", color:"#3C4043" }}
                        onFocus={e => { e.target.style.borderColor = G_GREEN; e.target.style.boxShadow = "0 0 0 3px #34A85320"; }}
                        onBlur={e  => { e.target.style.borderColor = "#DADCE0"; e.target.style.boxShadow = "none"; }}/>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                      <label style={{ fontSize:12, fontWeight:600, color:"#5F6368" }}>Longitude</label>
                      <input type="number" step="any" value={newBizLng} onChange={e => setNewBizLng(e.target.value)} placeholder="e.g. 79.0882" style={{ padding:"9px 12px", borderRadius:9, border:"1.5px solid #DADCE0", fontSize:13, fontFamily:"inherit", outline:"none", color:"#3C4043" }}
                        onFocus={e => { e.target.style.borderColor = G_GREEN; e.target.style.boxShadow = "0 0 0 3px #34A85320"; }}
                        onBlur={e  => { e.target.style.borderColor = "#DADCE0"; e.target.style.boxShadow = "none"; }}/>
                    </div>
                  </div>
                </div>
                {saveErr && <div style={{ padding:"8px 12px", borderRadius:8, background:"#FEF1F0", border:"1.5px solid #EA433533", color:G_RED, fontSize:12.5 }}>⚠️ {saveErr}</div>}
                {saveOk  && <div style={{ padding:"8px 12px", borderRadius:8, background:"#E8F5E9", border:"1.5px solid #34A85344", color:"#2E7D32", fontSize:12.5 }}>Client saved!</div>}
                <button onClick={saveNewClient} disabled={saveBusy || saveOk} style={{ padding:"10px 16px", borderRadius:10, border:"none", background: saveOk ? G_GREEN : saveBusy ? "#BDC1C6" : "linear-gradient(135deg," + G_GREEN + "," + G_BLUE + ")", color:"white", fontSize:13.5, fontWeight:700, cursor: (saveBusy || saveOk) ? "not-allowed" : "pointer", fontFamily:"inherit", transition:"all .2s" }}>
                  {saveOk ? "Saved!" : saveBusy ? "Saving..." : "Save Client"}
                </button>
              </div>
            )}
            <div style={{ display:"flex", gap:9, padding:"10px 13px", borderRadius:9, background:"linear-gradient(135deg,#E8F5E9,#E3F2FD)", border:"1.5px solid #C8E6C9" }}>
              <span style={{ fontSize:14, flexShrink:0 }}>📈</span>
              <div>
                <div style={{ fontSize:11.5, fontWeight:700, color:"#2E7D32", marginBottom:2 }}>Ranking Power Mode Active</div>
                <div style={{ fontSize:11, color:"#388E3C", lineHeight:1.5 }}>Primary keyword in sentence 1 · keyword-rich bullets · entity signals · local CTA · mixed hashtags</div>
              </div>
            </div>
            {pErr && <div style={{ padding:"9px 13px", borderRadius:9, background:"#FEF1F0", border:`1.5px solid ${G_RED}33`, color:G_RED, fontSize:13 }}>⚠️ {pErr}</div>}
            {busy && genStatus && !desc && <div style={{ padding:"8px 13px", borderRadius:9, background:"#E8F0FE", border:"1.5px solid #4285F422", color:"#4285F4", fontSize:12.5, fontWeight:600, display:"flex", alignItems:"center", gap:8 }}><Dots/>{genStatus}</div>}
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={generate} disabled={busy} style={{ flex:1, padding:"11px 22px", borderRadius:11, border:"none", background:busy ? "#BDC1C6" : `linear-gradient(135deg,${G_BLUE},${G_GREEN})`, color:"white", fontSize:14, fontWeight:700, cursor:busy ? "not-allowed" : "pointer", boxShadow:busy ? "none" : `0 3px 12px ${G_BLUE}44`, transition:"all .2s", display:"flex", alignItems:"center", justifyContent:"center", gap:7, fontFamily:"inherit" }}>
                {busy ? <><Dots/><span style={{ marginLeft:5 }}>{desc ? "Writing..." : "Connecting..."}</span></> : <><SparkIco/><span>Generate Post</span></>}
              </button>
              {(desc || utm) && <button onClick={reset} style={{ padding:"11px 16px", borderRadius:11, border:"1.5px solid #DADCE0", background:"white", color:"#5F6368", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Reset</button>}
            </div>
          </div>
        </div>

        {/* OUTPUTS */}
        {(desc || utm || busy) && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, color:"#5F6368", fontSize:11.5, fontWeight:700, letterSpacing:".06em" }}>
              <span>OUTPUTS</span><div style={{ flex:1, height:1, background:"#E8EAED" }}/>
            </div>
            <OutBlock title="GMB Post Description" content={desc} accent={G_BLUE}  icon="📝" isUrl={false} busy={busy}/>
            <OutBlock title="UTM Tracking URL"      content={utm}  accent={G_GREEN} icon="🔗" isUrl={true}  busy={false}/>
          </div>
        )}

        {/* GEOTAG GENERATOR */}
        <div style={{ background:"white", borderRadius:18, border:"1.5px solid #E8EAED", boxShadow:"0 3px 18px rgba(60,64,67,.09)", overflow:"hidden" }}>
          <CardHead icon="📍" title="GeoTag Image Generator" badge="EXIF + XMP METADATA"/>
          <div style={{ padding:"20px 22px", display:"flex", flexDirection:"column", gap:18 }}>

            <div style={{ display:"flex", gap:9, padding:"10px 13px", borderRadius:9, background:"#FFF8E1", border:"1.5px solid #FFE082" }}>
              <span style={{ fontSize:14, flexShrink:0 }}>💡</span>
              <div style={{ fontSize:11.5, color:"#6D4C41", lineHeight:1.6 }}>
                <b>EXIF + XMP injection:</b> Keywords are written into <b>9 EXIF tags</b>, <b>IPTC APP13 block</b> (2:25 Keywords + 2:120 Caption -- what geoimgr.com reads), and <b>XMP metadata</b>. All three standards populated. Fully in-browser.
              </div>
            </div>

            {/* Upload */}
            <div>
              <label style={{ fontSize:12.5, fontWeight:600, color:"#5F6368", display:"block", marginBottom:6 }}>🖼️ Upload Image</label>
              <div className="dz" onClick={() => (fileRef.current && fileRef.current.click())}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                style={{ border:`2px dashed ${dragging ? G_BLUE : "#DADCE0"}`, borderRadius:12, background:dragging ? "#F0F4FF" : "#FAFAFA", cursor:"pointer", transition:"all .2s", overflow:"hidden", minHeight:prev ? 0 : 130 }}>
                {prev ? (
                  <div style={{ position:"relative" }}>
                    <img src={prev} alt="preview" style={{ width:"100%", maxHeight:240, objectFit:"contain", display:"block", background:"#F1F3F4" }}/>
                    <div style={{ position:"absolute", bottom:8, right:8, background:"rgba(0,0,0,.55)", color:"white", fontSize:11, padding:"3px 9px", borderRadius:16 }}>{(file && file.name)} · {((file && file.size || 0) / 1024).toFixed(0)} KB</div>
                  </div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, padding:"28px 20px", color:"#9AA0A6" }}>
                    <UpIco/>
                    <span style={{ fontSize:13.5, fontWeight:600, color:"#5F6368" }}>Click or drag and drop an image</span>
                    <span style={{ fontSize:11.5 }}>JPEG · PNG · WebP · GIF · BMP · TIFF · AVIF -- any format</span>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => pickFile((e.target.files && e.target.files[0]))}/>
              {prev && <button onClick={() => { setFile(null); setPrev(""); setGResult(null); setGErr(""); }} style={{ marginTop:6, fontSize:12, color:G_RED, background:"none", border:"none", cursor:"pointer", padding:0, fontFamily:"inherit" }}>Remove image</button>}
            </div>

            {/* Format + Coords */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                <label style={{ fontSize:12.5, fontWeight:600, color:"#5F6368" }}>📁 Output Format</label>
                <div style={{ position:"relative" }}>
                  <select value={fmt} onChange={e => setFmt(e.target.value)} style={{ width:"100%", padding:"10px 32px 10px 13px", borderRadius:10, border:"1.5px solid #DADCE0", fontSize:13.5, fontFamily:"inherit", color:"#3C4043", background:"white", cursor:"pointer" }}>
                    {FMTS.map(f => <option key={f} value={f}>{f.toUpperCase()}</option>)}
                  </select>
                  <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:"#5F6368", fontSize:11 }}>▾</span>
                </div>
                <span style={{ fontSize:10.5, color:"#9AA0A6" }}>Output is always JPEG (EXIF standard)</span>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                <label style={{ fontSize:12.5, fontWeight:600, color:"#5F6368", display:"flex", alignItems:"center", gap:5 }}><PinIco/> Latitude</label>
                <input type="number" step="any" value={lat} onChange={e => setLat(e.target.value)} placeholder="e.g. 21.1458"
                  style={{ padding:"10px 13px", borderRadius:10, border:"1.5px solid #DADCE0", fontSize:13.5, fontFamily:"inherit", color:"#3C4043", background:"white", width:"100%", outline:"none" }}
                  onFocus={e => { e.target.style.borderColor = G_BLUE; e.target.style.boxShadow = `0 0 0 3px ${G_BLUE}1a`; }}
                  onBlur={e  => { e.target.style.borderColor = "#DADCE0"; e.target.style.boxShadow = "none"; }}/>
                <span style={{ fontSize:10.5, color:"#9AA0A6" }}>-90 to 90 · North is +</span>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                <label style={{ fontSize:12.5, fontWeight:600, color:"#5F6368", display:"flex", alignItems:"center", gap:5 }}><PinIco/> Longitude</label>
                <input type="number" step="any" value={lng} onChange={e => setLng(e.target.value)} placeholder="e.g. 79.0882"
                  style={{ padding:"10px 13px", borderRadius:10, border:"1.5px solid #DADCE0", fontSize:13.5, fontFamily:"inherit", color:"#3C4043", background:"white", width:"100%", outline:"none" }}
                  onFocus={e => { e.target.style.borderColor = G_GREEN; e.target.style.boxShadow = `0 0 0 3px ${G_GREEN}1a`; }}
                  onBlur={e  => { e.target.style.borderColor = "#DADCE0"; e.target.style.boxShadow = "none"; }}/>
                <span style={{ fontSize:10.5, color:"#9AA0A6" }}>-180 to 180 · East is +</span>
              </div>
            </div>

            {/* KEYWORD STUFFING MANAGER */}
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <label style={{ fontSize:12.5, fontWeight:700, color:"#202124", display:"flex", alignItems:"center", gap:6 }}>
                🏷️ Keyword Stuffing
                <span style={{ fontSize:10.5, fontWeight:500, color:"#5F6368" }}>-- written into EXIF tags and XMP metadata</span>
              </label>
              <div style={{ display:"flex", gap:8 }}>
                <input ref={geoKwRef} value={geoKwInput} onChange={e => setGeoKwInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addGeoKw(); } }}
                  placeholder="Type a keyword and press Enter (or comma for multiple)"
                  style={{ flex:1, padding:"10px 13px", borderRadius:10, border:"1.5px solid #DADCE0", fontSize:13, fontFamily:"inherit", color:"#3C4043", background:"white", outline:"none" }}
                  onFocus={e => { e.target.style.borderColor = G_BLUE; e.target.style.boxShadow = `0 0 0 3px ${G_BLUE}1a`; }}
                  onBlur={e  => { e.target.style.borderColor = "#DADCE0"; e.target.style.boxShadow = "none"; }}/>
                <button onClick={addGeoKw} style={{ padding:"10px 16px", borderRadius:10, border:"none", background:`linear-gradient(135deg,${G_BLUE},${G_GREEN})`, color:"white", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", flexShrink:0 }}>+ Add</button>
              </div>

              {kwList.length > 0 && (
                <div style={{ padding:"8px 12px", borderRadius:8, background:"#F0F4FF", border:`1px solid ${G_BLUE}25` }}>
                  <div style={{ fontSize:11, fontWeight:700, color:G_BLUE, marginBottom:5 }}>Auto-imported from Post Generator ({kwList.length}):</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                    {kwList.map((k, i) => <span key={i} style={{ fontSize:11, padding:"2px 9px", borderRadius:20, background:G_BLUE, color:"white", fontWeight:600, opacity:0.85 }}>{k}</span>)}
                  </div>
                </div>
              )}

              {geoKwList.length > 0 && (
                <div style={{ padding:"8px 12px", borderRadius:8, background:"#E8F5E9", border:`1px solid ${G_GREEN}40` }}>
                  <div style={{ fontSize:11, fontWeight:700, color:"#2E7D32", marginBottom:5 }}>Additional GeoTag Keywords ({geoKwList.length}):</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                    {geoKwList.map((k, i) => (
                      <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11, padding:"3px 8px 3px 10px", borderRadius:20, background:G_GREEN, color:"white", fontWeight:600 }}>
                        {k}
                        <button onClick={() => removeGeoKw(i)} style={{ background:"rgba(255,255,255,.35)", border:"none", borderRadius:"50%", width:15, height:15, cursor:"pointer", color:"white", fontSize:10, display:"flex", alignItems:"center", justifyContent:"center", padding:0, fontWeight:700 }}>×</button>
                      </span>
                    ))}
                  </div>
                  <button onClick={() => setGeoKwList([])} style={{ marginTop:6, fontSize:11, color:G_RED, background:"none", border:"none", cursor:"pointer", padding:0, fontFamily:"inherit" }}>Clear all</button>
                </div>
              )}

              {(kwList.length > 0 || geoKwList.length > 0) && (
                <div style={{ padding:"8px 12px", borderRadius:8, background:"#FFFDE7", border:"1px solid #FDD835" }}>
                  <div style={{ fontSize:11, fontWeight:700, color:"#795548", marginBottom:3 }}>
                    EXIF: 9 tags · IPTC APP13: Keywords (2:25) + Caption (2:120) · XMP: ~{[...new Set([...kwList, ...geoKwList])].length * 7}+ entries
                  </div>
                  <div style={{ fontSize:10.5, color:"#6D4C41", lineHeight:1.6 }}>
                    <b>EXIF:</b> ImageDescription · Artist · Copyright · XPTitle · XPComment · XPAuthor · XPKeywords · XPSubject · GPS<br/>
                    <b>IPTC APP13 (2:25):</b> one record per keyword → geoimgr "Keywords &amp; Tags" field<br/>
                    <b>IPTC APP13 (2:120):</b> comma list → geoimgr "Description" field<br/>
                    <b>XMP:</b> dc:subject · dc:title · IPTC:Keywords · photoshop:Headline
                  </div>
                </div>
              )}
            </div>

            {gErr && <div style={{ padding:"9px 13px", borderRadius:9, background:"#FEF1F0", border:`1.5px solid ${G_RED}33`, color:G_RED, fontSize:13 }}>⚠️ {gErr}</div>}

            <button onClick={processGeo} disabled={gBusy} style={{ padding:"12px 22px", borderRadius:11, border:"none", background:gBusy ? "#BDC1C6" : `linear-gradient(135deg,${G_GREEN},${G_BLUE})`, color:"white", fontSize:14, fontWeight:700, cursor:gBusy ? "not-allowed" : "pointer", boxShadow:gBusy ? "none" : `0 3px 12px ${G_GREEN}44`, transition:"all .2s", display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontFamily:"inherit" }}>
              {gBusy ? <><Dots/><span style={{ marginLeft:5 }}>Embedding GeoTag...</span></> : <><span>📍</span><span>Embed GeoTag and Keywords into EXIF</span></>}
            </button>

            {/* RESULT */}
            {gResult && (
              <div style={{ borderRadius:13, border:`2px solid ${G_GREEN}`, overflow:"hidden", animation:"su .4s ease" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 16px", background:"linear-gradient(135deg,#E8F5E9,white)", borderBottom:`1.5px solid ${G_GREEN}33` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <CheckIco/>
                    <span style={{ fontWeight:700, fontSize:13.5, color:"#2E7D32" }}>GeoTagged Image Ready</span>
                  </div>
                  <button onClick={download} disabled={dlState === "trying"} style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 16px", borderRadius:20, border:"none", background:dlState === "done" ? G_GREEN : dlState === "trying" ? "#9AA0A6" : `linear-gradient(135deg,${G_GREEN},${G_BLUE})`, color:"white", cursor:dlState === "trying" ? "not-allowed" : "pointer", fontSize:13, fontWeight:700, boxShadow:`0 2px 8px ${G_GREEN}44`, fontFamily:"inherit", transition:"all .2s" }}>
                    {dlState === "trying" ? <><Dots/><span style={{ marginLeft:4 }}>Saving...</span></> : dlState === "done" ? <><CheckIco/><span style={{ marginLeft:3 }}>Saved!</span></> : <><DlIco/><span>Download Image</span></>}
                  </button>
                </div>

                {dlState === "fallback" && (
                  <div style={{ padding:"12px 16px", background:"#FFF8E1", borderBottom:"1.5px solid #FFE082", display:"flex", flexDirection:"column", gap:8 }}>
                    <div style={{ fontSize:12.5, fontWeight:700, color:"#795548" }}>Auto-download was blocked -- use one of these:</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                      <a href={gResult.dataURL} target="_blank" rel="noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"7px 14px", borderRadius:20, border:`1.5px solid ${G_BLUE}`, color:G_BLUE, background:"white", fontSize:12.5, fontWeight:600, textDecoration:"none" }}>Open in New Tab → Right-click → Save</a>
                      <a href={gResult.dataURL} download={gResult.filename} style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"7px 14px", borderRadius:20, border:`1.5px solid ${G_GREEN}`, color:G_GREEN, background:"white", fontSize:12.5, fontWeight:600, textDecoration:"none" }}><DlIco/> Save As Link</a>
                    </div>
                    <div style={{ fontSize:11, color:"#9AA0A6" }}>Mobile: tap Open in New Tab, long-press image, Save to Photos</div>
                  </div>
                )}

                <div style={{ padding:"14px 16px", display:"flex", gap:14, alignItems:"flex-start", flexWrap:"wrap" }}>
                  <div style={{ position:"relative", flexShrink:0 }}>
                    <img src={gResult.dataURL} alt="geotagged" style={{ maxHeight:160, maxWidth:220, objectFit:"contain", borderRadius:9, border:"1.5px solid #E8EAED", display:"block" }} title="Right-click to save"/>
                    <div style={{ position:"absolute", bottom:6, left:0, right:0, textAlign:"center", fontSize:10, color:"rgba(0,0,0,.45)", pointerEvents:"none" }}>right-click to save</div>
                  </div>
                  <div style={{ flex:1, minWidth:170, display:"flex", flexDirection:"column", gap:8 }}>
                    <div style={{ fontSize:11.5, fontWeight:700, color:"#5F6368", letterSpacing:".04em" }}>WRITTEN METADATA</div>
                    {[
                      ["📍", "GPS (EXIF)",                      `${parseFloat(lat).toFixed(5)}, ${parseFloat(lng).toFixed(5)}`],
                      ["🖼️", "ImageDescription (0x010E)",       `${biz || "Business"}: ${gResult.merged.slice(0,2).join(", ")}...`],
                      ["✏️", "Artist (0x013B)",                 biz || "Business"],
                      ["🪟", "XPKeywords (0x9C9E)",             `${gResult.merged.length} keywords, UTF-16LE`],
                      ["🪟", "XPTitle + XPSubject + XPComment", "Primary keyword + all keywords"],
                      ["📋", "IPTC Keywords (APP13 2:25)",      `${gResult.merged.length} individual keyword records`],
                      ["📋", "IPTC Caption (APP13 2:120)",       `comma list (geoimgr Description field)`],
                      ["🏷️", "XMP dc:subject",                   `~${gResult.merged.length * 7}+ expanded variants`],
                      ["📁", "Filename",                        gResult.filename],
                    ].map(([ic, lb, vl], i) => (
                      <div key={i} style={{ display:"flex", gap:7, alignItems:"flex-start" }}>
                        <span style={{ fontSize:13, flexShrink:0 }}>{ic}</span>
                        <div>
                          <div style={{ fontSize:10.5, color:"#9AA0A6", fontWeight:600, marginBottom:1 }}>{lb}</div>
                          <div style={{ fontSize:12, color:"#3C4043", wordBreak:"break-all" }}>{vl}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SHEET SETTINGS PANEL */}
        <div style={{ background:"white", borderRadius:18, border:"1.5px solid #E8EAED", boxShadow:"0 3px 18px rgba(60,64,67,.09)", overflow:"hidden" }}>
          <CardHead icon="⚙️" title="Google Sheet Settings" badge="CLIENT DATABASE"/>
          <div style={{ padding:"18px 22px", display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ fontSize:12.5, color:"#5F6368", lineHeight:1.7 }}>
              Paste your <b>Google Apps Script Web App URL</b> below to load clients and save new ones. Your sheet must have columns: <b>Business Name | Latitude | Longitude</b>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <input id="schedule-url-input" value={webAppUrl} onChange={e => setWebAppUrl(e.target.value)} placeholder="https://script.google.com/macros/s/YOUR_ID/exec"
                style={{ flex:1, padding:"10px 13px", borderRadius:10, border:"1.5px solid #DADCE0", fontSize:12.5, fontFamily:"inherit", color:"#3C4043", background:"white", outline:"none" }}
                onFocus={e => { e.target.style.borderColor = G_BLUE; e.target.style.boxShadow = "0 0 0 3px #4285F41a"; }}
                onBlur={e  => { e.target.style.borderColor = "#DADCE0"; e.target.style.boxShadow = "none"; }}/>
              <button onClick={() => { loadClients(webAppUrl); loadSchedule(webAppUrl); }} disabled={dbLoading || schedLoading} style={{ padding:"10px 18px", borderRadius:10, border:"none", background: (dbLoading || schedLoading) ? "#BDC1C6" : "linear-gradient(135deg," + G_BLUE + "," + G_GREEN + ")", color:"white", fontSize:13, fontWeight:700, cursor: (dbLoading || schedLoading) ? "not-allowed" : "pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
                {(dbLoading || schedLoading) ? "Connecting..." : "Connect"}
              </button>
            </div>
            {clients.length > 0 && (
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {clients.length > 0 && (
                  <div style={{ padding:"8px 12px", borderRadius:8, background:"#E8F5E9", border:"1.5px solid #34A85344", fontSize:12, color:"#2E7D32", fontWeight:600 }}>
                    ✅ Clients connected — {clients.length} client(s) loaded
                  </div>
                )}
                {scheduleData.length > 0 && (
                  <div style={{ padding:"8px 12px", borderRadius:8, background:"#E3F2FD", border:"1.5px solid #4285F444", fontSize:12, color:"#1565C0", fontWeight:600 }}>
                    ✅ Schedule connected — {scheduleData.length} posts across {availDates.length} dates · {executives.length} executives
                  </div>
                )}
                {schedErr && (
                  <div style={{ padding:"8px 12px", borderRadius:8, background:"#FEF1F0", border:"1.5px solid #EA433533", fontSize:12, color:"#EA4335" }}>
                    ⚠️ Schedule error: {schedErr}
                  </div>
                )}
              </div>
            )}

            <div style={{ height:1, background:"#E8EAED", margin:"2px 0" }}/>
            <div style={{ padding:"8px 12px", borderRadius:8, background: scheduleData.length > SCHEDULE_ROWS.length || (scheduleData.length > 0 && webAppUrl !== SHEET_URL_DEFAULT) ? "#E3F2FD" : "#E8F5E9", border:"1.5px solid " + (scheduleData.length > SCHEDULE_ROWS.length || (scheduleData.length > 0 && webAppUrl !== SHEET_URL_DEFAULT) ? "#4285F444" : "#34A85344"), fontSize:12, fontWeight:600, color: scheduleData.length > SCHEDULE_ROWS.length || (scheduleData.length > 0 && webAppUrl !== SHEET_URL_DEFAULT) ? "#1565C0" : "#2E7D32" }}>
              📅 {scheduleData.length > 0 ? scheduleData.length + " posts · " + availDates.length + " dates · " + executives.length + " executives loaded" : "Paste your Web App URL above and click Connect to load live schedule from Google Sheet."}
            </div>
            <div style={{ padding:"13px 14px", borderRadius:10, background:"#F8F9FA", border:"1px solid #E8EAED" }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#202124", marginBottom:8 }}>Apps Script Setup (2 minutes)</div>
              <ol style={{ margin:0, paddingLeft:18, fontSize:11.5, color:"#5F6368", lineHeight:2.1 }}>
                <li>Open your Google Sheet</li>
                <li>Click Extensions then Apps Script</li>
                <li>Delete all existing code, paste the script below</li>
                <li>Click Deploy then New Deployment then Web App</li>
                <li>Execute as: Me -- Who has access: Anyone</li>
                <li>Click Deploy, copy the Web App URL, paste above, click Connect</li>
              </ol>
              <div style={{ marginTop:10, padding:"12px 14px", borderRadius:9, background:"#1A1B2E", fontFamily:"'Roboto Mono',monospace", fontSize:10.5, lineHeight:1.9, color:"#A6E3A1", overflowX:"auto", whiteSpace:"pre" }}>
                {"function doGet(e) {\n  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();\n  var action = e.parameter.action;\n  if (action === 'getClients') {\n    var rows = sheet.getDataRange().getValues();\n    var clients = [];\n    for (var i = 1; i < rows.length; i++) {\n      if (rows[i][0]) clients.push({ name: rows[i][0], lat: parseFloat(rows[i][1]), lng: parseFloat(rows[i][2]) });\n    }\n    return ContentService.createTextOutput(JSON.stringify({clients:clients})).setMimeType(ContentService.MimeType.JSON);\n  }\n  if (action === 'getSchedule') {\n    var rows = sheet.getDataRange().getValues();\n    var result = [];\n    for (var i = 1; i < rows.length; i++) {\n      if (rows[i][1]) result.push({ exec: String(rows[i][0]), date: String(rows[i][1]), name: String(rows[i][2]), url: String(rows[i][3]), keywords: String(rows[i][4]), lat: parseFloat(rows[i][5]), lng: parseFloat(rows[i][6]) });\n    }\n    return ContentService.createTextOutput(JSON.stringify({rows:result})).setMimeType(ContentService.MimeType.JSON);\n  }\n  return ContentService.createTextOutput(JSON.stringify({error:'Unknown'})).setMimeType(ContentService.MimeType.JSON);\n}\n\nfunction doPost(e) {\n  var body = JSON.parse(e.postData.contents);\n  if (body.action === 'addClient') {\n    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();\n    sheet.appendRow([body.name, body.lat, body.lng]);\n    return ContentService.createTextOutput(JSON.stringify({success:true})).setMimeType(ContentService.MimeType.JSON);\n  }\n  return ContentService.createTextOutput(JSON.stringify({error:'Unknown'})).setMimeType(ContentService.MimeType.JSON);\n}"}
              </div>
            </div>
          </div>
        </div>


        {/* ADMIN MODAL */}
        {showAdminModal && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(3px)" }} onClick={function(e){if(e.target===e.currentTarget)closeAdmin();}}>
            <div style={{ background:"white", borderRadius:20, padding:"30px 32px", width:380, maxWidth:"92vw", display:"flex", flexDirection:"column", gap:18, boxShadow:"0 12px 50px rgba(0,0,0,0.28)", position:"relative", animation:"fadeInUp 0.2s ease" }}>
              <button onClick={closeAdmin} style={{ position:"absolute", top:14, right:16, background:"#F1F3F4", border:"none", fontSize:16, cursor:"pointer", color:"#5F6368", lineHeight:1, width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>×</button>

              {/* SET PASSWORD (first time) */}
              {adminView === "setpass" && (
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  <div>
                    <div style={{ fontSize:17, fontWeight:700, color:"#202124", marginBottom:4 }}>🔐 Set Admin Password</div>
                    <div style={{ fontSize:12.5, color:"#5F6368", lineHeight:1.5 }}>First-time setup. Set a secure password for Admin access. Username is locked to <strong>Admin</strong>.</div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    <div style={{ position:"relative" }}>
                      <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", fontSize:14, pointerEvents:"none" }}>👤</span>
                      <input value={adminUser} onChange={e => setAdminUser(e.target.value)} placeholder="Username (must be: Admin)" style={{ width:"100%", padding:"10px 12px 10px 34px", borderRadius:10, border:"1.5px solid #DADCE0", fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }} onFocus={e=>{e.target.style.borderColor=G_BLUE;}} onBlur={e=>{e.target.style.borderColor="#DADCE0";}}/>
                    </div>
                    <div style={{ position:"relative" }}>
                      <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", fontSize:14, pointerEvents:"none" }}>🔑</span>
                      <input type="password" value={adminPass} onChange={e => setAdminPass(e.target.value)} placeholder="New password (min 4 characters)" style={{ width:"100%", padding:"10px 12px 10px 34px", borderRadius:10, border:"1.5px solid #DADCE0", fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }} onFocus={e=>{e.target.style.borderColor=G_BLUE;}} onBlur={e=>{e.target.style.borderColor="#DADCE0";}} onKeyDown={e=>{if(e.key==="Enter")handleSetPass();}}/>
                    </div>
                  </div>
                  {adminErr && <div style={{ fontSize:12, color:"#EA4335", padding:"8px 12px", background:"#FEF1F0", borderRadius:8, border:"1px solid #FCCBC7", display:"flex", alignItems:"center", gap:6 }}>⚠️ {adminErr}</div>}
                  <button onClick={handleSetPass} style={{ padding:"11px", borderRadius:11, border:"none", background:"linear-gradient(135deg,"+G_BLUE+","+G_GREEN+")", color:"white", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit", letterSpacing:"0.3px" }}>Set Password & Continue →</button>
                </div>
              )}

              {/* LOGIN */}
              {adminView === "login" && (
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  <div>
                    <div style={{ fontSize:17, fontWeight:700, color:"#202124", marginBottom:4 }}>🔒 Admin Login</div>
                    <div style={{ fontSize:12.5, color:"#5F6368" }}>Enter your credentials to manage LSO Executives.</div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    <div style={{ position:"relative" }}>
                      <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", fontSize:14, pointerEvents:"none" }}>👤</span>
                      <input value={adminUser} onChange={e => setAdminUser(e.target.value)} placeholder="Username" style={{ width:"100%", padding:"10px 12px 10px 34px", borderRadius:10, border:"1.5px solid #DADCE0", fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }} onFocus={e=>{e.target.style.borderColor=G_BLUE;}} onBlur={e=>{e.target.style.borderColor="#DADCE0";}}/>
                    </div>
                    <div style={{ position:"relative" }}>
                      <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", fontSize:14, pointerEvents:"none" }}>🔑</span>
                      <input type="password" value={adminPass} onChange={e => setAdminPass(e.target.value)} placeholder="Password" style={{ width:"100%", padding:"10px 12px 10px 34px", borderRadius:10, border:"1.5px solid #DADCE0", fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }} onFocus={e=>{e.target.style.borderColor=G_BLUE;}} onBlur={e=>{e.target.style.borderColor="#DADCE0";}} onKeyDown={e=>{if(e.key==="Enter")handleAdminLogin();}}/>
                    </div>
                  </div>
                  {adminErr && <div style={{ fontSize:12, color:"#EA4335", padding:"8px 12px", background:"#FEF1F0", borderRadius:8, border:"1px solid #FCCBC7", display:"flex", alignItems:"center", gap:6 }}>⚠️ {adminErr}</div>}
                  <button onClick={handleAdminLogin} style={{ padding:"11px", borderRadius:11, border:"none", background:"linear-gradient(135deg,"+G_BLUE+","+G_GREEN+")", color:"white", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit", letterSpacing:"0.3px" }}>Login →</button>
                  <div style={{ textAlign:"center" }}>
                    <button onClick={function(){ var stored = getStoredPass(); if(!stored){ setAdminView("setpass"); } else { setAdminErr("Password already set. Contact Admin to reset."); }}} style={{ fontSize:11.5, color:"#4285F4", background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", textDecoration:"underline" }}>Forgot / Reset Password</button>
                  </div>
                </div>
              )}

              {/* MANAGEMENT PANEL */}
              {adminView === "panel" && (
                <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                  {/* Header */}
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingBottom:12, borderBottom:"1.5px solid #E8EAED" }}>
                    <div>
                      <div style={{ fontSize:17, fontWeight:700, color:"#202124" }}>⚙️ Executive Management</div>
                      <div style={{ fontSize:12, color:"#34A853", fontWeight:600, marginTop:2 }}>✓ Logged in as Admin</div>
                    </div>
                    <button onClick={function(){setAdminLoggedIn(false);setAdminView("login");setAdminUser("");setAdminPass("");setAdminMsg("");setAdminErr("");}} style={{ fontSize:12, color:"#EA4335", background:"#FEF1F0", border:"1px solid #FCCBC7", borderRadius:8, cursor:"pointer", fontFamily:"inherit", fontWeight:600, padding:"5px 11px" }}>Logout</button>
                  </div>

                  {/* Current list */}
                  <div style={{ padding:"12px 14px", borderRadius:12, background:"linear-gradient(135deg,#F8F9FA,#E8F5E9)", border:"1.5px solid #E8EAED" }}>
                    <div style={{ fontSize:12, fontWeight:700, color:"#5F6368", marginBottom:8, display:"flex", alignItems:"center", gap:6 }}>
                      <span>👥</span> Current Executives
                      <span style={{ background:"#4285F4", color:"white", borderRadius:12, padding:"1px 8px", fontSize:11, fontWeight:700 }}>{executives.length}</span>
                    </div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {executives.length === 0
                        ? <span style={{ fontSize:12, color:"#9AA0A6", fontStyle:"italic" }}>No executives yet. Add one below.</span>
                        : executives.map(function(ex,i){ return (
                          <span key={i} style={{ padding:"4px 12px", borderRadius:20, background:"white", color:G_BLUE, fontSize:12.5, fontWeight:600, border:"1.5px solid #4285F433", display:"flex", alignItems:"center", gap:5 }}>
                            <span style={{ width:7, height:7, borderRadius:"50%", background:G_GREEN, display:"inline-block" }}></span>
                            {ex}
                          </span>
                        ); })
                      }
                    </div>
                  </div>

                  {/* Add executive */}
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#202124", display:"flex", alignItems:"center", gap:6 }}>➕ Add Executive</div>
                    <div style={{ display:"flex", gap:8 }}>
                      <input value={newExecName} onChange={e=>{setNewExecName(e.target.value);setAdminMsg("");}} placeholder="Enter executive name…" style={{ flex:1, padding:"9px 12px", borderRadius:10, border:"1.5px solid #DADCE0", fontSize:13, fontFamily:"inherit", outline:"none" }} onFocus={e=>{e.target.style.borderColor=G_GREEN;e.target.style.boxShadow="0 0 0 3px "+G_GREEN+"22";}} onBlur={e=>{e.target.style.borderColor="#DADCE0";e.target.style.boxShadow="none";}} onKeyDown={e=>{if(e.key==="Enter")handleAddExec();}}/>
                      <button onClick={handleAddExec} style={{ padding:"9px 16px", borderRadius:10, border:"none", background:G_GREEN, color:"white", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", boxShadow:"0 2px 8px "+G_GREEN+"44" }}>+ Add</button>
                    </div>
                  </div>

                  {/* Remove executive */}
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#202124", display:"flex", alignItems:"center", gap:6 }}>🗑️ Remove Executive</div>
                    <div style={{ display:"flex", gap:8 }}>
                      <div style={{ flex:1, position:"relative" }}>
                        <select value={removeExecName} onChange={e=>{setRemoveExecName(e.target.value);setConfirmRemove(false);setAdminMsg("");}} style={{ width:"100%", padding:"9px 28px 9px 12px", borderRadius:10, border:"1.5px solid #DADCE0", fontSize:13, fontFamily:"inherit", color:removeExecName?"#3C4043":"#9AA0A6", background:"white", cursor:"pointer", outline:"none", WebkitAppearance:"none", appearance:"none" }}>
                          <option value="">-- Select executive to remove --</option>
                          {executives.map(function(ex,i){ return <option key={i} value={ex}>{ex}</option>; })}
                        </select>
                        <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:"#5F6368", fontSize:11 }}>▾</span>
                      </div>
                      <button onClick={handleRemoveExec} style={{ padding:"9px 14px", borderRadius:10, border:"1.5px solid "+(confirmRemove?"#EA4335":"#EA433555"), background:confirmRemove?"#EA4335":"white", color:confirmRemove?"white":"#EA4335", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", transition:"all 0.15s" }}>{confirmRemove?"⚠️ Confirm":"Remove"}</button>
                    </div>
                    {confirmRemove && removeExecName && <div style={{ fontSize:12, color:"#EA4335", padding:"7px 10px", background:"#FEF1F0", borderRadius:8, border:"1px solid #FCCBC7" }}>⚠️ This will remove <strong>{removeExecName}</strong> from the dropdown. Existing schedule rows are unaffected.</div>}
                  </div>

                  {adminMsg && (
                    <div style={{ padding:"9px 13px", borderRadius:10, background:adminMsg.includes("removed")||adminMsg.includes("added")||adminMsg.includes("successfully")?"#E8F5E9":"#FFF8E1", border:"1.5px solid "+(adminMsg.includes("removed")||adminMsg.includes("added")||adminMsg.includes("successfully")?"#34A85344":"#FDD83566"), fontSize:12.5, color:adminMsg.includes("removed")||adminMsg.includes("added")||adminMsg.includes("successfully")?"#2E7D32":"#F57F17", fontWeight:600, display:"flex", alignItems:"center", gap:7 }}>
                      {adminMsg.includes("removed")||adminMsg.includes("added")||adminMsg.includes("successfully") ? "✅" : "ℹ️"} {adminMsg}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {/* FOOTER */}
        <div style={{ textAlign:"center", color:"#9AA0A6", fontSize:11.5 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, flexWrap:"wrap" }}>
            {[G_BLUE, G_RED, G_YELLOW, G_GREEN].map((c, i) => <Dot key={i} c={c} s={5}/>)}
            <span style={{ marginLeft:4 }}>Posts up to 1,250 chars · UTM-ready · EXIF 9 tags + XMP keyword injection</span>
          </div>
        </div>
      </div>
    </div>
  );
}
