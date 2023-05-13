import Follow from '@components/Shared/Follow';
import Title from '@components/Shared/Title';
import { Trans } from '@lingui/macro';
import type { NextPage } from 'next';
import { useState } from 'react';
import { FollowSource } from 'src/tracking';
import { GridItemFull, GridLayout } from 'ui';

import { MATCH_BOT_ID } from '../../../constants';

const Success: NextPage = () => {
  const [following, setFollowing] = useState<boolean | null>(null);

  return (
    <GridLayout>
      <GridItemFull className="m-auto flex w-full max-w-lg flex-col items-center gap-4">
        <Title>Congratulations</Title>

        <Trans>
          Your profile has been created and you can start your journey to find a
          peer.
        </Trans>

        <Follow
          profileId={MATCH_BOT_ID}
          setFollowing={() => setFollowing(true)}
          followSource={FollowSource.ONBOARDING}
          showText
        />
      </GridItemFull>
    </GridLayout>
  );
};

export default Success;
