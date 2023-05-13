import Title from '@components/Shared/Title';
import type { NextPage } from 'next';
import { Button, Card, GridItemEight, GridLayout } from 'ui';

const ProfileType: NextPage = ({ nextStep }: any) => {
  return (
    <GridLayout>
      <GridItemEight>
        <Title>What kind of cofounder you are looking for?</Title>
        <Card className="my-4 grid gap-4 p-4">
          <Button className="w-48" onClick={() => nextStep()}>
            Technical
          </Button>
          <Button className="w-48" onClick={() => nextStep()}>
            Product
          </Button>
          <Button className="w-48" onClick={() => nextStep()}>
            GTM and marketing
          </Button>
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default ProfileType;
