#!/usr/bin/env python3
"""Download freely licensed portraits from Wikimedia Commons into web/public/portraits/."""
from __future__ import annotations

import json
import urllib.parse
import urllib.request
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "web" / "public" / "portraits"
OUT.mkdir(parents=True, exist_ok=True)

SEARCH = {
    "项羽": "Xiang Yu Western Chu portrait",
    "刘邦": "Liu Bang Emperor Gaozu of Han",
    "秦始皇": "Qin Shi Huang portrait",
    "李白": "Li Bai Tang dynasty poet",
    "武则天": "Wu Zetian empress portrait",
    "岳飞": "Yue Fei Song dynasty",
    "韩信": "Han Xin general",
    "荆轲": "Jing Ke",
    "貂蝉": "Diaochan",
    "花木兰": "Hua Mulan",
    "赵匡胤": "Emperor Taizu of Song Zhao Kuangyin",
    "虞姬": "Consort Yu Yu Ji",
    "姜维": "Jiang Wei Shu Han",
    "扁鹊": "Bian Que",
    "程咬金": "Cheng Yaojin",
    "杨延昭": "Yang Yanzhao",
    "杨再兴": "Yang Zaixing",
    "褒姒": "Baosi",
    "时迁": "Shi Qian Water Margin",
}

KNOWN_FILES = {
    "项羽": ["Xiang Yu.jpg", "项羽像.jpg", "項羽.jpg", "Xiang Yu.png"],
    "刘邦": ["Emperor Gaozu of Han.jpg", "Liu Bang.jpg", "汉高祖刘邦.jpg"],
    "秦始皇": ["Qin Shi Huang.jpg", "秦始皇.jpg", "First Emperor of Qin.jpg"],
    "李白": ["Li Bai.jpg", "李白像.jpg", "Li Po.jpg"],
    "武则天": ["Wu Zetian.jpg", "武则天.jpg", "Empress Wu Zetian.jpg"],
    "岳飞": ["Yue Fei.jpg", "岳飞像.jpg", "YueFei.jpg"],
    "韩信": ["Han Xin.jpg", "韩信.jpg"],
    "荆轲": ["Jing Ke.jpg", "荆轲.jpg"],
    "貂蝉": ["Diaochan.jpg", "貂蝉.jpg", "Diao Chan.jpg"],
    "花木兰": ["Hua Mulan.jpg", "花木兰.jpg", "Mulan.jpg"],
    "赵匡胤": ["Emperor Taizu of Song.jpg", "宋太祖.jpg", "Zhao Kuangyin.jpg"],
    "虞姬": ["Consort Yu.jpg", "虞姬.jpg", "Yu Ji.jpg"],
    "姜维": ["Jiang Wei.jpg", "姜维.jpg"],
    "扁鹊": ["Bian Que.jpg", "扁鹊.jpg"],
    "程咬金": ["Cheng Yaojin.jpg", "程咬金.jpg"],
    "杨延昭": ["Yang Yanzhao.jpg", "杨延昭.jpg", "楊延昭.jpg"],
    "杨再兴": ["Yang Zaixing.jpg", "杨再兴.jpg"],
    "褒姒": ["Baosi.jpg", "褒姒.jpg"],
    "时迁": ["Shi Qian.jpg", "时迁.jpg", "時遷.jpg"],
}

UA = {"User-Agent": "JianghuSlay/1.0 (educational; local game assets)"}


def api(params: dict) -> dict:
    params = {**params, "format": "json"}
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=40) as resp:
        return json.load(resp)


def file_info(title: str, width: int = 480) -> dict | None:
    if not title.startswith("File:"):
        title = f"File:{title}"
    data = api(
        {
            "action": "query",
            "titles": title,
            "prop": "imageinfo",
            "iiprop": "url|mime",
            "iiurlwidth": str(width),
        }
    )
    for page in data.get("query", {}).get("pages", {}).values():
        if page.get("imageinfo"):
            info = page["imageinfo"][0]
            info["_title"] = title
            return info
    return None


def search_files(query: str) -> list[str]:
    data = api(
        {
            "action": "query",
            "list": "search",
            "srsearch": query,
            "srnamespace": "6",
            "srlimit": "10",
        }
    )
    return [hit["title"] for hit in data.get("query", {}).get("search", [])]


def download(url: str, dest: Path) -> None:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as resp:
        dest.write_bytes(resp.read())


def pick_ext(mime: str) -> str:
    if "png" in mime:
        return ".png"
    if "webp" in mime:
        return ".webp"
    if "gif" in mime:
        return ".gif"
    return ".jpg"


def resolve_hero(hero: str) -> dict | None:
    for fname in KNOWN_FILES.get(hero, []):
        info = file_info(fname)
        if info and str(info.get("mime", "")).startswith("image/"):
            print(f"  known: {fname}")
            return info
    for title in search_files(SEARCH[hero]):
        info = file_info(title.replace("File:", ""))
        if not info:
            continue
        mime = str(info.get("mime", ""))
        if mime.startswith("image/") and mime != "image/svg+xml":
            print(f"  search: {title}")
            return info
    # Chinese name search
    for title in search_files(hero):
        info = file_info(title.replace("File:", ""))
        if not info:
            continue
        mime = str(info.get("mime", ""))
        if mime.startswith("image/") and mime != "image/svg+xml":
            print(f"  zh-search: {title}")
            return info
    return None


def main() -> None:
    results: dict[str, str | None] = {}
    for hero in SEARCH:
        print(f"== {hero} ==")
        info = resolve_hero(hero)
        if not info:
            print("  FAILED")
            results[hero] = None
            continue
        url = info.get("thumburl") or info.get("url")
        ext = pick_ext(str(info.get("mime", "")))
        dest = OUT / f"{hero}{ext}"
        try:
            download(url, dest)
            print(f"  saved {dest.name} ({dest.stat().st_size} bytes)")
            results[hero] = dest.name
        except Exception as exc:  # noqa: BLE001
            print(f"  download fail: {exc}")
            results[hero] = None

    manifest = {k: v for k, v in results.items() if v}
    (OUT / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print("got", len(manifest), "/", len(SEARCH))
    print(json.dumps(manifest, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
