#!/usr/bin/env bash
# Splices the recorded v2 sidebar frames into maskin-launch.mp4 and writes maskin-launch-v2.mp4.
# Seam times (video seconds) are variables so they can be moved without touching the filter graph:
#   IN_START  mock starts, cross-fades in over XFADE seconds (v1 is still visible underneath)
#   OUT_CUT   hard cut back to v1; the mock is an empty linen frame from 45.8 and v1 is empty by 46.0
set -euo pipefail

SRC=${SRC:-maskin-launch.mp4}
FRAMES=${FRAMES:-frames}
OUT=${OUT:-maskin-launch-v2.mp4}
IN_START=${IN_START:-17.0}
XFADE=${XFADE:-0.5}
OUT_CUT=${OUT_CUT:-46.0}
FPS=30
LIMIT=$((25 * 1024 * 1024))

IN_END=$(awk -v a="$IN_START" -v x="$XFADE" 'BEGIN{printf "%.3f", a + x}')

FILTER="
[0:v]trim=end=${IN_END},setpts=PTS-STARTPTS,fps=${FPS},setsar=1,format=yuv420p[a];
[1:v]setpts=PTS-STARTPTS,fps=${FPS},scale=1920:1080:out_color_matrix=bt709:out_range=tv,setsar=1,format=yuv420p[m];
[a][m]xfade=transition=fade:duration=${XFADE}:offset=${IN_START}[x];
[0:v]trim=start=${OUT_CUT},setpts=PTS-STARTPTS,fps=${FPS},setsar=1,format=yuv420p[c];
[x][c]concat=n=2:v=1:a=0[v]"

for crf in 21 23 25 27; do
  echo "encode crf=${crf}"
  ffmpeg -y -hide_banner -loglevel warning \
    -i "$SRC" -framerate "$FPS" -i "$FRAMES/f%04d.png" \
    -filter_complex "$FILTER" \
    -map "[v]" -map 0:a:0? -c:a copy \
    -c:v libx264 -preset slow -crf "$crf" -maxrate 3800k -bufsize 7600k \
    -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
    -movflags +faststart "$OUT"
  size=$(stat -c%s "$OUT")
  echo "size=${size} bytes (limit ${LIMIT})"
  if [ "$size" -lt "$LIMIT" ]; then
    break
  fi
done

size=$(stat -c%s "$OUT")
if [ "$size" -ge "$LIMIT" ]; then
  echo "maskin-launch-v2.mp4 is ${size} bytes, over the 25 MiB Pages limit" >&2
  exit 1
fi
