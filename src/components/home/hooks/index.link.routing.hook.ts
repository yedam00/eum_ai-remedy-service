import { useRouter } from 'next/navigation';
import { UrlKey, getUrlPath } from '@/commons/constants/url';

export const useLinkRouting = () => {
  const router = useRouter();

  const handleStartButtonClick = () => {
    const chatEntryPath = getUrlPath(UrlKey.CHAT_ENTRY);
    router.push(chatEntryPath);
  };

  return {
    handleStartButtonClick,
  };
};
