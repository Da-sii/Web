/**
 * 리뷰 사진 자리에 그리는 가짜 블러 타일.
 *
 * 웹에서는 리뷰 원본을 아예 내려받지 않는다. 원본이 iOS 촬영본 그대로인 .heic 라
 * 크롬·파이어폭스가 디코딩하지 못하고(=깨진 이미지), sharp도 HEIC를 못 읽어
 * /_next/image 가 최적화를 포기하고 1~2MB 원본을 그대로 통과시키기 때문이다.
 * 사진은 앱에서만 보여주고, 웹에는 "가려진 사진이 여기 있다"는 표시만 남긴다.
 *
 * 명암은 이미지 키를 해시해서 뽑으므로 같은 사진은 항상 같은 무늬가 된다.
 * (난수를 쓰면 서버·클라이언트 렌더 결과가 달라져 하이드레이션이 깨진다.)
 */

/** 타일 하나에 겹쳐 그릴 얼룩 수. */
const BLOB_COUNT = 10;

/** 문자열 → 32bit 정수 해시. */
function hashCode(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  }
  return h;
}

/** 해시에서 index 번째 난수 비트를 뽑는다. */
function noiseAt(seedHash: number, index: number): number {
  return Math.imul(seedHash ^ (index + 1), 0x9e3779b1) >>> 0;
}

/**
 * 얼룩 하나. 색조는 주지 않아 회색으로만 남는다.
 *
 * 밝은 얼룩과 어두운 얼룩을 번갈아 놓는 게 핵심이다. 명도 폭이 좁으면
 * 블러를 먹인 뒤 전부 뭉개져 그냥 회색 판때기로 보인다.
 * (CSS blur(Npx) 의 N 은 반지름이 아니라 표준편차라 생각보다 훨씬 세게 뭉갠다.)
 *
 * 바깥쪽은 transparent(=투명한 검정) 대신 같은 회색의 알파 0 으로 빼야
 * 가장자리에 검은 기가 돌지 않는다.
 */
function grayBlob(seedHash: number, index: number): string {
  const noise = noiseAt(seedHash, index);
  const x = 4 + ((noise >>> 3) % 92);
  const y = 4 + ((noise >>> 9) % 92);
  const lightness =
    index % 2 === 0
      ? 80 + ((noise >>> 15) % 18) // 밝은 얼룩 80~97%
      : 16 + ((noise >>> 15) % 26); // 어두운 얼룩 16~41%
  // 크기를 넓게 흩어야 물방울무늬가 아니라 초점 나간 사진처럼 보인다
  const radius = 10 + ((noise >>> 21) % 38);
  return (
    `radial-gradient(circle at ${x}% ${y}%, ` +
    `hsl(0 0% ${lightness}%) 0%, hsl(0 0% ${lightness}% / 0) ${radius}%)`
  );
}

interface ReviewPhotoMosaicProps {
  /** 이미지 키 등 사진마다 고유한 문자열. 같은 값이면 같은 무늬가 나온다. */
  seed: string;
}

export function ReviewPhotoMosaic({ seed }: ReviewPhotoMosaicProps) {
  const seedHash = hashCode(seed);
  const blobs = Array.from({ length: BLOB_COUNT }, (_, i) => grayBlob(seedHash, i));
  const base = 52 + (Math.abs(seedHash) % 14);

  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        backgroundColor: `hsl(0 0% ${base}%)`,
        backgroundImage: blobs.join(", "),
        // 얼룩 경계를 뭉개 초점이 나간 사진처럼 만든다.
        // blur가 타일 가장자리를 투명하게 만들므로 조금 키워서 덮는다.
        filter: "blur(5px)",
        transform: "scale(1.2)",
      }}
    />
  );
}
