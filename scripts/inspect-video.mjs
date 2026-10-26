import fs from "node:fs";

function boxes(buffer, start = 0, end = buffer.length) {
  const result = [];
  for (let offset = start; offset + 8 <= end;) {
    let size = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    let header = 8;
    if (size === 1) { size = Number(buffer.readBigUInt64BE(offset + 8)); header = 16; }
    if (size === 0) size = end - offset;
    if (size < header || offset + size > end) break;
    result.push({ type, offset, size, start: offset + header, end: offset + size });
    offset += size;
  }
  return result;
}

export function inspectMp4(buffer, file) {
  const top = boxes(buffer);
  const moov = top.find((box) => box.type === "moov");
  if (!moov) return { file, error: "No complete MP4 metadata atom in input" };
  const children = (box) => boxes(buffer, box.start, box.end);
  const find = (box, type) => children(box).find((item) => item.type === type);
  const tracks = children(moov).filter((box) => box.type === "trak").map((track) => {
    const mdia = find(track, "mdia");
    const header = find(mdia, "mdhd");
    const v1 = buffer[header.start] === 1;
    const scale = buffer.readUInt32BE(header.start + (v1 ? 20 : 12));
    const ticks = v1 ? Number(buffer.readBigUInt64BE(header.start + 24)) : buffer.readUInt32BE(header.start + 16);
    const duration = ticks / scale;
    const handler = find(mdia, "hdlr");
    const kind = buffer.toString("ascii", handler.start + 8, handler.start + 12);
    const stbl = find(find(mdia, "minf"), "stbl");
    const stsd = find(stbl, "stsd");
    const sample = boxes(buffer, stsd.start + 8, stsd.end)[0];
    if (kind !== "vide") return { kind, codec: sample?.type, duration };
    const width = buffer.readUInt16BE(sample.start + 24);
    const height = buffer.readUInt16BE(sample.start + 26);
    const avc = boxes(buffer, sample.start + 78, sample.end).find((box) => box.type === "avcC");
    let pixelFormat;
    if (avc) {
      const profile = buffer[avc.start + 1];
      if ([66, 77, 88].includes(profile)) pixelFormat = "yuv420p (8-bit H.264 profile)";
      else {
        const length = buffer.readUInt16BE(avc.start + 6);
        const sps = [...buffer.subarray(avc.start + 8, avc.start + 8 + length)].filter((byte, index, bytes) => !(byte === 3 && bytes[index - 1] === 0 && bytes[index - 2] === 0));
        let bit = 8;
        const read = (n) => { let value = 0; while (n--) { value = (value << 1) | ((sps[bit >> 3] >> (7 - (bit & 7))) & 1); bit++; } return value; };
        const ue = () => { let zeros = 0; while (!read(1) && zeros < 32) zeros++; return (2 ** zeros - 1) + read(zeros); };
        read(24); ue(); const chroma = ue(); if (chroma === 3) read(1); const depth = ue() + 8;
        pixelFormat = `yuv${["400", "420", "422", "444"][chroma] || "unknown"}${depth === 8 ? "p" : `p${depth}`}`;
      }
    }
    const stts = find(stbl, "stts");
    let samples = 0;
    for (let i = 0; i < buffer.readUInt32BE(stts.start + 4); i++) samples += buffer.readUInt32BE(stts.start + 8 + i * 8);
    return { kind, codec: sample.type, width, height, duration: Number(duration.toFixed(3)), fps: Number((samples / duration).toFixed(3)), pixelFormat };
  });
  const duration = Math.max(...tracks.map((track) => track.duration));
  return { file, bytes: buffer.length, bitrateMbps: Number((buffer.length * 8 / duration / 1e6).toFixed(3)), fastStart: top.findIndex((box) => box.type === "moov") < top.findIndex((box) => box.type === "mdat"), atoms: top.map((box) => box.type), tracks };
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replaceAll("\\", "/").split("/").pop())) {
  for (const file of process.argv.slice(2)) console.log(JSON.stringify(inspectMp4(fs.readFileSync(file), file)));
}
