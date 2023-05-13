import MetaTags from '@components/Common/MetaTags';
import Hero from '@components/Home/Hero';
import Loading from '@components/Shared/Loading';
import LoginButton from '@components/Shared/Navbar/LoginButton';
import { t, Trans } from '@lingui/macro';
import { APP_NAME } from 'data/constants';
import type { FollowingRequest } from 'lens';
import { useFollowingQuery } from 'lens';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { MATCH_BOT_ADDRESS } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { Card, GridItemEight, GridLayout } from 'ui';

import PreviewList from './PreviewList';

const NoConversationSelected = () => {
  return (
    <div className="flex h-full flex-col text-center">
      <div className="m-auto">
        <span className="text-center text-5xl">👋</span>
        <h3 className="mb-2 mt-3 text-lg">
          <Trans>Select a conversation</Trans>
        </h3>
        <p className="text-md lt-text-gray-500 max-w-xs">
          <Trans>
            Choose an existing conversation or create a new one to start
            messaging
          </Trans>
        </p>
      </div>
    </div>
  );
};

const Messages: NextPage = () => {
  const { push } = useRouter();

  const currentProfile = useAppStore((state) => state.currentProfile);

  const request: FollowingRequest = {
    address: currentProfile?.ownedBy,
    limit: 30
  };

  const {
    data = {},
    loading
    // error,
    // fetchMore
  } = useFollowingQuery({
    variables: { request },
    skip: !currentProfile?.id
  });

  const redirectToRegistration = useCallback(async () => {
    const { following: { items = [] } = {} } = data as any;

    const isFirstLogin = !items.find(({ profile }: any) => {
      return profile.ownedBy === MATCH_BOT_ADDRESS;
    });

    if (currentProfile && isFirstLogin && !loading) {
      push('/registration');
    }
  }, [currentProfile, data, loading, push]);

  useEffect(() => {
    redirectToRegistration();
  }, [redirectToRegistration]);

  if (loading) {
    return <Loading />;
  }

  if (!currentProfile) {
    return (
      <div className="flex h-screen w-screen flex-col justify-center">
        <Hero />
        <div className="flex justify-center">
          <LoginButton />
        </div>
      </div>
    );
  }

  return (
    <GridLayout classNameChild="md:gap-8">
      <MetaTags title={t`Messages • ${APP_NAME}`} />
      <PreviewList />
      <GridItemEight className="xs:hidden xs:mx-2 mb-0 sm:mx-2 sm:hidden sm:h-[76vh] md:col-span-8 md:hidden md:h-[80vh] lg:block xl:h-[84vh]">
        <Card className="h-full">
          <NoConversationSelected />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Messages;
