import MetaTags from '@components/Common/MetaTags';
import MessageHeader from '@components/Messages/MessageHeader';
import Loader from '@components/Shared/Loader';
import { useGetProfile } from '@components/utils/hooks/useMessageDb';
import errorToast from '@lib/errorToast';
import { t } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import { LensHub } from 'abis';
import axios from 'axios';
import { APP_NAME, LENSHUB_PROXY } from 'data/constants';
import {
  useBroadcastMutation,
  useCreateFollowTypedDataMutation,
  useProxyActionMutation
} from 'lens';
import formatHandle from 'lib/formatHandle';
import getSignature from 'lib/getSignature';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { MATCH_BOT_ADDRESS } from 'src/constants';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { useNonceStore } from 'src/store/nonce';
import { Card, GridItemEight, GridLayout } from 'ui';
import { useContractWrite, useSignTypedData } from 'wagmi';

// import scoreData from '../../../public/score.json';
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
  const userSigNonce = useNonceStore((state) => state.userSigNonce);
  const { push } = useRouter();

  const setUserSigNonce = useNonceStore((state) => state.setUserSigNonce);

  const scoreRef = useRef(0);

  const [currentSuggestion, setCurrentSuggestion] = useState<any>(null);
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

    // return {
    //   scores: Object.values(scoreData.scores)
    // };
    return response.data;
  };

  const { data = {}, error } = useQuery(['scoreData'], () => fetchScore());
  const { scores } = data as any;

  const onError = (error: any) => {
    errorToast(error);
  };

  const onCompleted = (prop?: any) => {
    if (currentProfile) {
      console.log(currentSuggestion);
      push(
        `/messages/${currentSuggestion.userDetails.address.toLowerCase()}/lens.dev/dm/${
          currentSuggestion.userDetails.id
        }-${currentProfile.id}`
      );
      toast.success('Followed successfully!');
    }
  };

  const [broadcast] = useBroadcastMutation({
    onCompleted: ({ broadcast }) => onCompleted(broadcast.__typename)
  });

  const { signTypedDataAsync } = useSignTypedData({ onError });
  const { write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: 'follow',
    onSuccess: () => onCompleted(),
    onError
  });

  const [createFollowTypedData] = useCreateFollowTypedDataMutation({
    onCompleted: async ({ createFollowTypedData }) => {
      const { id, typedData } = createFollowTypedData;
      // TODO: Replace deep clone with right helper
      const signature = await signTypedDataAsync(
        getSignature(JSON.parse(JSON.stringify(typedData)))
      );
      setUserSigNonce(userSigNonce + 1);
      const { data } = await broadcast({
        variables: { request: { id, signature } }
      });
      if (data?.broadcast.__typename === 'RelayError') {
        const { profileIds, datas } = typedData.value;
        return write?.({ args: [profileIds, datas] });
      }
    },
    onError
    // update: updateCache
  });

  const [createFollowProxyAction] = useProxyActionMutation({
    onCompleted: () => onCompleted(),
    onError
    // update: updateCache
  });

  const createViaProxyAction = async (variables: any) => {
    const { data } = await createFollowProxyAction({
      variables
    });
    if (!data?.proxyAction) {
      return await createFollowTypedData({
        variables: {
          request: { follow: [{ profile: profile?.id }] },
          options: { overrideSigNonce: userSigNonce }
        }
      });
    }
  };

  const createFollow = async (id: string) => {
    try {
      return await createViaProxyAction({
        request: {
          follow: { freeFollow: { profileId: id } }
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  const sendMessage = async (message: string) => {
    if (currentProfile) {
      // User message
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

      const isPositive = message.toLocaleLowerCase().includes('yes');

      if (isPositive) {
        if (currentSuggestion) {
          createFollow(currentSuggestion.userDetails.id);
        }
        return true;
      }

      // AI request
      const aiResponse = await axios.post('/api/ai', {
        state: queryState,
        message
      });

      // Store query state
      setQueryState(aiResponse.data);

      if (!scores?.length) {
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

      const { interests: aiInterests } = aiResponse.data as any;

      const filteredScores = scores.filter(({ commonNft }: any) => {
        const nftArr = Object.values(commonNft).map(({ name }: any) => name);

        let valid = false;
        for (const nft of nftArr) {
          for (const aiInterest of aiInterests) {
            if (
              nft.toLowerCase().includes(aiInterest.toLowerCase()) ||
              aiInterest.toLowerCase().includes(nft.toLowerCase())
            ) {
              valid = true;
            }
          }
        }
        return valid;
      });

      const suggestion = filteredScores[scoreRef.current];
      setCurrentSuggestion(suggestion);

      if (!suggestion) {
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

      const { userDetails, commonNft, commonToken, totalCommonPoaps } =
        suggestion;

      const interests = userDetails.commonInterests.filter(
        (_: any, i: number) => i < 5
      );
      const nfts = Object.values(commonNft).filter((_, i) => i < 5);
      const tokens = Object.values(commonToken).filter((_, i) => i < 5);

      // **Interests:** ${interests}

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
${userDetails.bio}
**Tokens:** ${tokens.map(({ name }: any) => name)}
**Nfts:** ${nfts.map(({ name }: any) => name)}
**Poaps:** You have ${totalCommonPoaps} in common
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
