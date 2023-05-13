import MetaTags from '@components/Common/MetaTags';
import NewPost from '@components/Composer/Post/New';
import ExploreFeed from '@components/Explore/Feed';
import Footer from '@components/Shared/Footer';
import Loading from '@components/Shared/Loading';
import type { FollowingQuery, FollowingRequest } from 'lens';
import { useFollowingQuery } from 'lens';
import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MATCH_BOT_ADDRESS } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { GridItemEight, GridItemFour, GridLayout } from 'ui';

import LoginButton from '../Shared/Navbar/LoginButton';
import EnableDispatcher from './EnableDispatcher';
import EnableMessages from './EnableMessages';
import FeedType from './FeedType';
import Hero from './Hero';
import Highlights from './Highlights';
import RecommendedProfiles from './RecommendedProfiles';
import SetDefaultProfile from './SetDefaultProfile';
import SetProfile from './SetProfile';
import Timeline from './Timeline';

const Home: NextPage = () => {
  const { push } = useRouter();

  const currentProfile = useAppStore((state) => state.currentProfile);
  const [feedType, setFeedType] = useState<'TIMELINE' | 'HIGHLIGHTS'>(
    'TIMELINE'
  );

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

  const { following: { items = [] } = {} } = data as FollowingQuery;

  const isFirstLogin = !items.find(({ profile }) => {
    return profile.ownedBy === MATCH_BOT_ADDRESS;
  });

  useEffect(() => {
    if (currentProfile && isFirstLogin && !loading) {
      push('/registration');
    }
  }, [currentProfile, isFirstLogin, loading, push]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <MetaTags />
      {currentProfile ? (
        <GridLayout>
          <GridItemEight className="space-y-5">
            {currentProfile ? (
              <>
                <NewPost />
                <FeedType feedType={feedType} setFeedType={setFeedType} />
                {feedType === 'TIMELINE' ? <Timeline /> : <Highlights />}
              </>
            ) : (
              <ExploreFeed />
            )}
          </GridItemEight>
          <GridItemFour>
            {currentProfile ? (
              <>
                <EnableDispatcher />
                <EnableMessages />
                <SetDefaultProfile />
                <SetProfile />
                <RecommendedProfiles />
              </>
            ) : null}
            <Footer />
          </GridItemFour>
        </GridLayout>
      ) : (
        <div className="flex h-screen w-screen flex-col justify-center">
          <Hero />
          <div className="flex justify-center">
            <LoginButton />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
