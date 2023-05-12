import type { NextPage } from 'next';
import { useMemo, useState } from 'react';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';

import About from './About';
import Goal from './Goal';
import Interests from './Interests';
import ProfileType from './ProfileType';
import Success from './Success';

const Registration: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  const [currentStep, setCurrentStep] = useState(0);

  const flow = useMemo(
    () => [/* Verify, */ About, Interests, Goal, ProfileType, Success],
    []
  );

  const nextStep = () =>
    setCurrentStep((step) => (step + 1 >= flow.length ? step : step + 1));

  const Component: any = flow[currentStep];

  if (!currentProfile) {
    return <Custom404 />;
  }

  return <Component nextStep={nextStep} />;
};

export default Registration;
