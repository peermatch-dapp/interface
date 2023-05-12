import Title from '@components/Shared/Title';
import type { NextPage } from 'next';
import { Button, Card, GridItemEight, GridLayout } from 'ui';

import ProfileInterests from '../../Settings/Interests/Interests';

const Interests: NextPage = ({ nextStep }: any) => {
  return (
    <GridLayout>
      <GridItemEight className="m-auto flex max-w-4xl flex-col items-center gap-4">
        <Title>What are you interested in?</Title>

        <Card className="p-5">
          <ProfileInterests />
        </Card>

        <Button className="w-48" onClick={() => nextStep()}>
          Next
        </Button>
      </GridItemEight>
    </GridLayout>
  );
};

export default Interests;
