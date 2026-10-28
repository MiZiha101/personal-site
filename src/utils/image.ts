/**
 * 图片处理工具：把用户选的照片压成 data URL 存进 localStorage。
 * 目的：手机直出的照片动辄 3~5MB，localStorage 一般只有 5MB 左右，
 * 所以统一缩放到指定尺寸并降质，避免写满配额。
 */

export type CompressOptions = {
  /** 长边最大像素，默认 512（头像够用） */
  maxSize?: number;
  /** JPEG 质量，0~1，默认 0.85 */
  quality?: number;
  /** 压缩后 data URL 的最大长度（字符数），超过就继续降质 */
  maxLength?: number;
};

const DEFAULT_OPTIONS: Required<CompressOptions> = {
  maxSize: 512,
  quality: 0.85,
  maxLength: 260_000,
};

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('图片解码失败，换一张试试'));
    image.src = src;
  });
}

export async function fileToCompressedDataUrl(file: File, options: CompressOptions = {}): Promise<string> {
  const { maxSize, quality, maxLength } = { ...DEFAULT_OPTIONS, ...options };

  if (!file.type.startsWith('image/')) {
    throw new Error('请选择图片文件（jpg / png / webp）');
  }
  if (file.size > 20 * 1024 * 1024) {
    throw new Error('图片太大了（超过 20MB），先压缩一下再传');
  }

  const source = await readAsDataUrl(file);
  const image = await loadImage(source);

  const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('当前浏览器不支持图片处理');

  // 透明 PNG 转 JPEG 时先铺白底，否则透明区域会变黑
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  let qualityNow = quality;
  let output = canvas.toDataURL('image/jpeg', qualityNow);

  while (output.length > maxLength && qualityNow > 0.4) {
    qualityNow = Math.max(0.4, qualityNow - 0.1);
    output = canvas.toDataURL('image/jpeg', qualityNow);
  }

  if (output.length > maxLength) {
    throw new Error('这张图压缩后还是偏大，换一张小一点的试试');
  }

  return output;
}
