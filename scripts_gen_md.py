#!/usr/bin/env python3
"""Generate Markdown mirrors of each docs page from its <main> content, then
assemble llms-full.txt. Re-run after editing docs HTML:  python3 scripts_gen_md.py
No build step is required to serve the site; this only refreshes the .md/llms-full.txt."""
import re, glob, os, html as ihtml
from html.parser import HTMLParser

ORDER = [
  "docs/get-started/index.html",
  "docs/get-started/self-hosted/index.html",
  "docs/quickstart/index.html",
  "docs/concepts/index.html",
  "docs/agents/index.html",
  "docs/architecture/index.html",
  "docs/mcp-tools/index.html",
  "docs/api/index.html",
  "docs/configuration/index.html",
  "docs/integrations/index.html",
  "docs/llm/index.html",
  "docs/deployment/index.html",
  "docs/security/index.html",
  "docs/troubleshooting/index.html",
]

class MD(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out=[]; self.inline=[]; self.skip=0; self.pre=False
        self.in_li=False; self.ol=False; self.listidx=[]
        self.href=None; self.row=[]; self.cell=None; self.table=None; self.in_head=False
        self.cur=None  # current block: h1/h2/h3/p/li/blockquote
        self.blockquote=False
    def _flush(self):
        txt="".join(self.inline).strip()
        self.inline=[]
        if not txt and self.cur not in ("li",): 
            self.cur=None; return
        if self.cur in ("h1","h2","h3"):
            self.out.append(("#"*int(self.cur[1]))+" "+txt+"\n")
        elif self.cur=="li":
            prefix=("%d. "%self.listidx[-1]) if self.ol else "- "
            self.out.append(prefix+txt+"\n")
        elif self.cur=="blockquote":
            if txt: self.out.append("> "+txt+"\n")
        elif self.cur=="p":
            self.out.append(txt+"\n")
        self.cur=None
    def handle_starttag(self,tag,attrs):
        a=dict(attrs); cls=a.get("class","")
        if tag in ("script","style","svg","nav"): self.skip+=1; return
        if self.skip: return
        if tag in ("h1","h2","h3"): self._flush(); self.cur=tag
        elif tag=="p":
            if "doc-breadcrumb" in cls or "eyebrow" in cls: self.skip+=1; self._brk=True; return
            self._flush(); self.cur="p"
        elif tag=="span" and "callout__icon" in cls: self.skip+=1; self._brk=True; return
        elif tag=="pre": self._flush(); self.pre=True; self.out.append("```\n")
        elif tag=="code" and not self.pre: self.inline.append("`")
        elif tag in ("strong","b"): self.inline.append("**")
        elif tag in ("em","i"): self.inline.append("*")
        elif tag=="a": self.href=a.get("href"); self.inline.append("[")
        elif tag=="ul": self._flush(); self.ol=False
        elif tag=="ol": self._flush(); self.ol=True; self.listidx.append(0)
        elif tag=="li":
            self._flush()
            if self.ol: self.listidx[-1]+=1
            self.cur="li"
        elif tag=="br": self.inline.append(" ")
        elif tag=="table": self._flush(); self.table=[]; 
        elif tag=="thead": self.in_head=True
        elif tag=="tr": self.row=[]
        elif tag in ("th","td"): self.cell=[]
        elif tag=="div" and "callout" in cls: self._flush(); self.blockquote=True
    def handle_endtag(self,tag):
        if tag in ("script","style","svg","nav") and self.skip: self.skip-=1; return
        if tag in ("p","span") and getattr(self,"_brk",False): self.skip-=1; self._brk=False; return
        if self.skip: return
        if tag in ("h1","h2","h3","p"): self._flush()
        elif tag=="pre":
            self.pre=False
            if self.out and not self.out[-1].endswith("\n"): self.out.append("\n")
            self.out.append("```\n")
        elif tag=="code" and not self.pre: self.inline.append("`")
        elif tag in ("strong","b"): self.inline.append("**")
        elif tag in ("em","i"): self.inline.append("*")
        elif tag=="a":
            self.inline.append("](%s)"%self.href if self.href else "]")
            self.href=None
        elif tag=="li": self._flush()
        elif tag=="ol":
            if self.listidx: self.listidx.pop()
        elif tag in ("th","td"):
            self.row.append("".join(self.cell).strip().replace("\n"," ")); self.cell=None
        elif tag=="tr":
            if self.table is not None and self.row: self.table.append(self.row)
        elif tag=="thead": self.in_head=False
        elif tag=="table":
            self._emit_table(); self.table=None
        elif tag=="div" and self.blockquote:
            self._flush(); self.blockquote=False
        if self.blockquote and tag in ("p",): pass
    def _emit_table(self):
        if not self.table: return
        self.out.append("")
        hdr=self.table[0]
        self.out.append("| "+" | ".join(hdr)+" |\n")
        self.out.append("| "+" | ".join("---" for _ in hdr)+" |\n")
        for r in self.table[1:]:
            self.out.append("| "+" | ".join(r)+" |\n")
        self.out.append("")
    def handle_data(self,data):
        if self.skip: return
        if self.pre: self.out.append(data); return
        if self.cell is not None: self.cell.append(data); return
        if self.cur=="blockquote" or self.blockquote:
            self.cur="blockquote"; self.inline.append(data); return
        self.inline.append(data)

def convert(path):
    html=open(path,encoding="utf-8").read()
    m=re.search(r'<main[^>]*>(.*?)</main>', html, re.S)
    if not m: return None
    p=MD(); p.feed(m.group(1)); p.close()
    md=[]
    prev_blank=True
    for line in "".join(p.out).split("\n"):
        if line.strip()=="" :
            if prev_blank: continue
            md.append(""); prev_blank=True
        else:
            md.append(line); prev_blank=False
    # tidy heading spacing
    text="\n".join(md).strip()+"\n"
    text=re.sub(r"\n(#)", r"\n\n\1", text)
    text=re.sub(r"\n{3,}", "\n\n", text)
    return text

def md_path(path):
    # docs/concepts/index.html -> docs/concepts.md ; docs/get-started/index.html -> docs/get-started.md
    d=os.path.dirname(path)
    return d+".md"

made=[]
for path in glob.glob("docs/**/index.html", recursive=True):
    if path=="docs/index.html": continue
    text=convert(path)
    if text is None: continue
    url="https://maskin.io/"+os.path.dirname(path)+"/"
    body="> Source: %s\n\n%s"%(url,text)
    open(md_path(path),"w",encoding="utf-8").write(body)
    made.append(md_path(path))

# assemble llms-full.txt in IA order
parts=["# Maskin — full documentation\n",
"> The open-source, MCP-native system where humans and AI agents close the loop together — from customer signal to shipped bet to measured outcome. This file concatenates all Maskin documentation for full-context ingestion by LLMs. Canonical site: https://maskin.io/  ·  Source: https://github.com/sindre-ai/maskin\n"]
for path in ORDER:
    mp=md_path(path)
    if os.path.exists(mp):
        parts.append("\n---\n\n"+open(mp,encoding="utf-8").read().strip()+"\n")
open("llms-full.txt","w",encoding="utf-8").write("\n".join(parts))
print("Markdown mirrors written:", len(made))
print("llms-full.txt lines:", sum(1 for _ in open("llms-full.txt")))
