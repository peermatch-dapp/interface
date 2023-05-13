import Title from '@components/Shared/Title';
import { Trans } from '@lingui/macro';
import type { NextPage } from 'next';
import { GridItemFull, GridLayout } from 'ui';

const Success: NextPage = () => {
  return (
    <GridLayout>
      <GridItemFull>
        <Title>Congratulations</Title>

        <Trans>
          Your profile has been created and you can start your journey to find a
          peer.
        </Trans>

        {/* <Button className="w-48" onClick={() => nextStep()}>
          Next
        </Button> */}
      </GridItemFull>
    </GridLayout>
  );
};

export default Success;
