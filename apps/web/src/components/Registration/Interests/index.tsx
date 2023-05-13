import Title from '@components/Shared/Title';
import type { NextPage } from 'next';
import { Button, Card, GridItemFull, GridLayout } from 'ui';

import ProfileInterests from '../../Settings/Interests/Interests';

const Interests: NextPage = ({ nextStep }: any) => {
  return (
    <GridLayout>
      <GridItemFull className="m-auto flex w-full max-w-lg flex-col items-center gap-4">
        <Title>What are you interested in?</Title>

        <Card className="p-5">
          <ProfileInterests />
        </Card>

        <Button className="w-48" onClick={() => nextStep()}>
          Next
        </Button>
      </GridItemFull>
    </GridLayout>
  );
};

export default Interests;
