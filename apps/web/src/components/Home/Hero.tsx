import { Trans } from '@lingui/macro';
import { APP_NAME } from 'data/constants';
import type { FC } from 'react';

const Hero: FC = () => {
  return (
    <div data-testid="home-hero">
      <div className="mx-auto flex w-full max-w-screen-xl items-stretch px-5 py-8 text-center sm:py-12 sm:text-left">
        <div className="flex-1 space-y-3">
          <div className="text-center font-serif text-2xl font-extrabold sm:text-4xl">
            <Trans>Welcome to {APP_NAME} 👋</Trans>
          </div>
          <div className="text-center leading-7 text-gray-700 dark:text-gray-300">
            <Trans>
              Find your new business partner in a decentralized and
              permissionless way.
            </Trans>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
