import React from 'react';

import App from '@custom/basic-call/pages/_app';
import AppWithBreakoutRooms from '../components/App';

import BreakoutRoomModal from '../components/BreakoutRoomModal';
import BroadcastModal from '../components/BroadcastModal';
import Tray from '../components/Tray';

App.customTrayComponent = <Tray />;
App.modals = [BreakoutRoomModal, BroadcastModal];
App.customAppComponent = <AppWithBreakoutRooms />;

export default App;
