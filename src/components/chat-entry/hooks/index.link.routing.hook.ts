import { useRouter } from 'next/navigation';
import { UrlKey, getUrlPath } from '@/commons/constants/url';

export const useLinkRouting = () => {
  const router = useRouter();

  const handleBackToHome = () => {
    const homePath = getUrlPath(UrlKey.HOME);
    router.push(homePath);
  };

  return {
    handleBackToHome,
  };
};
