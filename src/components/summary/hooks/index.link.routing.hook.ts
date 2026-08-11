import { useRouter } from 'next/navigation';
import { UrlKey, getUrlPath } from '@/commons/constants/url';

export const useLinkRouting = () => {
  const router = useRouter();

  const handleBackButtonClick = () => {
    const chatPath = getUrlPath(UrlKey.CHAT);
    router.push(chatPath);
  };

  const handleExitButtonClick = () => {
    const homePath = getUrlPath(UrlKey.HOME);
    router.push(homePath);
  };

  return {
    handleBackButtonClick,
    handleExitButtonClick,
  };
};
