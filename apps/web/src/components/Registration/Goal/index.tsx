import Title from '@components/Shared/Title';
import type { NextPage } from 'next';
import { Button, Card, GridItemFull, GridLayout } from 'ui';

const Goal: NextPage = ({ nextStep }: any) => {
  return (
    <GridLayout>
      <GridItemFull>
        <Title>What is your primary goal?</Title>
        <Card className="my-4 grid gap-4 p-4">
          <Button className="w-48" onClick={() => nextStep()}>
            Connect with peer
          </Button>
          {/* <Button className="w-48" onClick={() => nextStep()}>
            Find cofounder
          </Button>
          <Button className="w-48" onClick={() => nextStep()}>
            Find a mentor
          </Button>
          <Button className="w-48" onClick={() => nextStep()}>
            Find your teammates
          </Button> */}
        </Card>
      </GridItemFull>
    </GridLayout>
  );
};

export default Goal;
