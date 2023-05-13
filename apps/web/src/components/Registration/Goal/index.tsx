import Title from '@components/Shared/Title';
import type { NextPage } from 'next';
import { Button, Card, GridItemFull, GridLayout } from 'ui';

const Goal: NextPage = ({ nextStep }: any) => {
  return (
    <GridLayout>
      <GridItemFull className="m-auto flex w-full max-w-lg flex-col items-center gap-4">
        <Title>What is your primary goal?</Title>
        <Card className="my-4 grid w-full gap-4 p-4">
          <Button className="w-full" onClick={() => nextStep()}>
            Connect with peer
          </Button>
          <Button className="w-full" onClick={() => nextStep()}>
            Find co-founder
          </Button>
          <Button className="w-full" onClick={() => nextStep()}>
            Find a mentor
          </Button>
          <Button className="w-full" onClick={() => nextStep()}>
            Find your teammates
          </Button>
        </Card>
      </GridItemFull>
    </GridLayout>
  );
};

export default Goal;
