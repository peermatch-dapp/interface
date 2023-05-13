import MetaTags from '@components/Common/MetaTags';
import MessageHeader from '@components/Messages/MessageHeader';
import Loader from '@components/Shared/Loader';
import { useGetProfile } from '@components/utils/hooks/useMessageDb';
import { t } from '@lingui/macro';
import axios from 'axios';
import { APP_NAME } from 'data/constants';
import formatHandle from 'lib/formatHandle';
import type { NextPage } from 'next';
import type { FC } from 'react';
import { useState } from 'react';
import { MATCH_BOT_ADDRESS } from 'src/constants';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { Card, GridItemEight, GridLayout } from 'ui';

import Composer from './Composer';
import MessagesList from './MessagesList';
import PreviewList from './PreviewList';

interface MessageProps {
  conversationKey: string;
}

const defaultMessages = [
  {
    id: 1,
    messageVersion: 'v1',
    senderAddress: MATCH_BOT_ADDRESS,
    sent: Date.now(),
    content:
      "Hey there, I'm PeerMatch Bot. I'm here to help you find your perfect peer match"
  }
];

const PeerMatchMessage: FC<MessageProps> = ({ conversationKey }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { profile } = useGetProfile(currentProfile?.id, conversationKey);

  const [messages, setMessages] = useState(defaultMessages);
  const [queryState, setQueryState] = useState({
    interests: [],
    notInterests: [],
    profession: '',
    userProfession: ''
  });

  const sendMessage = async (message: string) => {
    if (currentProfile) {
      setMessages((state) => [
        {
          id: state.length + 1,
          messageVersion: 'v1',
          senderAddress: currentProfile.ownedBy,
          sent: Date.now(),
          content: message
        },
        ...state
      ]);

      const response = await axios.post('/api/ai', {
        state: queryState,
        message
      });

      setQueryState(response.data);
    }

    return true;
  };

  if (!currentProfile) {
    return <Custom404 />;
  }

  const showLoading = false;

  const userNameForTitle = profile?.name ?? formatHandle(profile?.handle);
  const title = userNameForTitle
    ? `${userNameForTitle} • ${APP_NAME}`
    : APP_NAME;

  return (
    <GridLayout classNameChild="md:gap-8">
      <MetaTags title={title} />
      <PreviewList
        className="xs:hidden sm:hidden md:hidden lg:block"
        selectedConversationKey={conversationKey}
      />
      <GridItemEight className="xs:h-[85vh] xs:mx-2 mb-0 sm:mx-2 sm:h-[76vh] md:col-span-8 md:h-[80vh] xl:h-[84vh]">
        <Card className="flex h-full flex-col justify-between">
          {showLoading ? (
            <div className="flex h-full grow items-center justify-center">
              <Loader message={t`Loading messages`} />
            </div>
          ) : (
            <>
              <MessageHeader profile={profile} />
              <MessagesList
                currentProfile={currentProfile}
                profile={profile}
                fetchNextMessages={() => {}}
                messages={messages ?? []}
                hasMore={false}
                missingXmtpAuth={false}
              />
              <Composer
                sendMessage={sendMessage}
                conversationKey={conversationKey}
                disabledInput={false}
              />
            </>
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

const PeerMatchMessagePage: NextPage = () => {
  return <PeerMatchMessage conversationKey="peermatch" />;
};

export default PeerMatchMessagePage;
