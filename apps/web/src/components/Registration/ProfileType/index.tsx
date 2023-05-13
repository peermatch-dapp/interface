import Title from '@components/Shared/Title';
import type { NextPage } from 'next';
import { Button, Card, GridItemFull, GridLayout } from 'ui';

const ProfileType: NextPage = ({ nextStep }: any) => {
  return (
    <GridLayout>
      <GridItemFull className="m-auto flex w-full max-w-lg flex-col items-center gap-4">
        <Title>What kind of co-founder you are looking for?</Title>
        <Card className="my-4 grid w-full gap-4 p-4">
          <Button className="w-full" onClick={() => nextStep()}>
            Technical
          </Button>
          <Button className="w-full" onClick={() => nextStep()}>
            Product
          </Button>
          <Button className="w-full" onClick={() => nextStep()}>
            GTM and marketing
          </Button>
        </Card>
      </GridItemFull>
    </GridLayout>
  );
};

export default ProfileType;
