import MetaTags from '@components/Common/MetaTags';
import MessageHeader from '@components/Messages/MessageHeader';
import Loader from '@components/Shared/Loader';
import { useGetProfile } from '@components/utils/hooks/useMessageDb';
import { t } from '@lingui/macro';
import { APP_NAME } from 'data/constants';
import formatHandle from 'lib/formatHandle';
import type { NextPage } from 'next';
import type { FC } from 'react';
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

// id: string;
// messageVersion: 'v1' | 'v2';
// senderAddress: string;
// recipientAddress?: string;
// sent: Date;
// contentTopic: string;
// conversation: Conversation;
// contentType: ContentTypeId;
// content: any;
// error?: Error;
// contentBytes: Uint8Array;
// constructor({ id, messageVersion, senderAddress, recipientAddress, conversation, contentBytes, contentType, contentTopic, content, sent, error, }: Omit<DecodedMessage, 'toBytes'>);
// toBytes(): Uint8Array;
// static fromBytes(data: Uint8Array, client: Client): Promise<DecodedMessage>;
// static fromV1Message(message: MessageV1, content: any, // eslint-disable-line @typescript-eslint/no-explicit-any
// contentType: ContentTypeId, contentBytes: Uint8Array, contentTopic: string, conversation: Conversation, error?: Error): DecodedMessage;
// static fromV2Message(message: MessageV2, content: any, // eslint-disable-line @typescript-eslint/no-explicit-any
// contentType: ContentTypeId, contentTopic: string, contentBytes: Uint8Array, conversation: Conversation, senderAddress: string, error?: Error): DecodedMessage;

const PeerMatchMessage: FC<MessageProps> = ({ conversationKey }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { profile } = useGetProfile(currentProfile?.id, conversationKey);

  const messages = [
    {
      id: '123',
      messageVersion: 'v1',
      senderAddress: MATCH_BOT_ADDRESS,
      sent: Date.now()
    }
  ];

  const sendMessage = async (message: string) => {
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
