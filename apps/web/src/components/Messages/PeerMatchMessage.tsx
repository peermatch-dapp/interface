import MetaTags from '@components/Common/MetaTags';
import MessageHeader from '@components/Messages/MessageHeader';
import Loader from '@components/Shared/Loader';
import { useGetProfile } from '@components/utils/hooks/useMessageDb';
import { t } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
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

import scoreData from '../../../public/score.json';
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

  const fetchScore = async () => {
    const response = await axios({
      method: 'GET',
      url: '/api/score'
    });

    console.log(scoreData.scores);
    // return {
    //   scores: Object.values(scoreData.scores)
    // };
    return response.data;
  };

  const { data = {}, error } = useQuery(
    ['scoreData'],
    () => fetchScore().then((res) => res),
    {
      enabled: true
    }
  );

  const { scores } = data as any;

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

      if (!scores.length) {
        setMessages((state) => [
          {
            id: state.length + 1,
            messageVersion: 'v1',
            senderAddress: MATCH_BOT_ADDRESS,
            sent: Date.now(),
            content: "Sorry, couldn't find any matches"
          },
          ...state
        ]);

        return true;
      }

      const firstResult = scores[0] || {};

      console.log(firstResult);

      const { userDetails, commonNft, commonToken } = firstResult;

      const interests = userDetails.commonInterests.filter(
        (_: any, i: number) => i < 5
      );
      const nfts = Object.values(commonNft).filter((_, i) => i < 5);
      const tokens = Object.values(commonToken).filter((_, i) => i < 5);

      setMessages((state) => [
        {
          id: state.length + 3,
          messageVersion: 'v1',
          senderAddress: MATCH_BOT_ADDRESS,
          sent: Date.now(),
          content: 'Should I connect you with this profile?'
        },
        {
          id: state.length + 2,
          messageVersion: 'v1',
          senderAddress: MATCH_BOT_ADDRESS,
          sent: Date.now(),
          content: `**${userDetails.name.toLocaleUpperCase()}**
userDetails.bio
**Interests:** ${interests}
**Tokens:** ${tokens.map(({ name }: any) => name)}
**Nfts:** ${nfts.map(({ name }: any) => name)}
`
        },
        {
          id: state.length + 1,
          messageVersion: 'v1',
          senderAddress: MATCH_BOT_ADDRESS,
          sent: Date.now(),
          content: 'Think you might like:'
        },
        ...state
      ]);
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
