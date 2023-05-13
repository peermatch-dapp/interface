import Title from '@components/Shared/Title';
import type { NextPage } from 'next';
import { Button, Card, GridItemEight, GridLayout } from 'ui';

const Goal: NextPage = ({ nextStep }: any) => {
  return (
    <GridLayout>
      <GridItemEight>
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
      </GridItemEight>
    </GridLayout>
  );
};

export default Goal;
