import MetaTags from '@components/Common/MetaTags';
import NewPost from '@components/Composer/Post/New';
import ExploreFeed from '@components/Explore/Feed';
import Footer from '@components/Shared/Footer';
import { Mixpanel } from '@lib/mixpanel';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';
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
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [feedType, setFeedType] = useState<'TIMELINE' | 'HIGHLIGHTS'>(
    'TIMELINE'
  );

  useEffect(() => {
    Mixpanel.track(PAGEVIEW, { page: 'home' });
  }, []);

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
