import React from 'react';
import { NetworkAside } from '@custom/shared/components/Aside';
import { useUIState } from '@custom/shared/contexts/UIStateProvider';
import { PeopleAside } from './PeopleAside';
import { ChatAside } from '../shared/components/Aside/ChatAside';

export const Asides = () => {
  const { asides } = useUIState();

  return (
    <>
      <PeopleAside />
      <NetworkAside />
      <ChatAside />
      {asides.map((AsideComponent) => (
        <AsideComponent key={AsideComponent.name} />
      ))}
    </>
  );
};

export default Asides;