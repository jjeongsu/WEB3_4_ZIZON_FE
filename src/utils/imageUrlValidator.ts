/**
 * 이미지 URL의 유효성을 검사하고 적절한 URL을 반환합니다.
 * @param url 검사할 이미지 URL
 * @param defaultImagePath 기본 이미지 경로 (기본값: '/images/DefaultImage.png')
 * @returns 유효한 이미지 URL
 */
export const validateImageUrl = (
  url: string | null | undefined,
  defaultImagePath = '/images/DefaultImage.png',
): string => {
  // URL이 없거나 'image.png'인 경우 기본 이미지 반환
  if (!url || url === 'image.png') {
    return defaultImagePath;
  }

  try {
    // 이미 절대 경로인 경우
    if (url.startsWith('/')) {
      return url;
    }

    // 외부 URL인 경우
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // 상대 경로인 경우 슬래시 추가
    return `/${url}`;
  } catch (error) {
    console.error('이미지 URL 처리 중 오류 발생:', error);
    return defaultImagePath;
  }
};
