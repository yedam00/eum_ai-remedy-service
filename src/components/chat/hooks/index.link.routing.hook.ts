import { useRouter } from 'next/navigation';
import { UrlKey, getUrlPath } from '@/commons/constants/url';

export const useLinkRouting = () => {
  const router = useRouter();

  const handleHeaderClick = () => {
    const homePath = getUrlPath(UrlKey.HOME);
    router.push(homePath);
  };

  return {
    handleHeaderClick,
  };
};
