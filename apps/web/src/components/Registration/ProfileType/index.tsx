import Title from '@components/Shared/Title';
import type { NextPage } from 'next';
import { Button, Card, GridItemFull, GridLayout } from 'ui';

const ProfileType: NextPage = ({ nextStep }: any) => {
  return (
    <GridLayout>
      <GridItemFull>
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
      </GridItemFull>
    </GridLayout>
  );
};

export default ProfileType;
