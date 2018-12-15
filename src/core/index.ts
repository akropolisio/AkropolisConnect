import AuthModule from 'modules/Auth';
import { IModule, IModules } from 'shared/types/app';

import makeMainNavigator from './MakeNavigator';
import configureStore from './configureStore';

export default function initializeCore() {
  const modules: IModules = {
    Auth: new AuthModule(),
  };

  const MainNavigator = makeMainNavigator(modules);

  const modulesArray: IModule[] = Object.values(modules);

  const store = configureStore(modulesArray, []);

  return { store, MainNavigator };
}
