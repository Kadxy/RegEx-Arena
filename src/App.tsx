import { useAppStore } from './store';
import { Portal } from './components/Portal/Portal';
import { Arena } from './components/Arena/Arena';
import { Workbench } from './components/Workbench/Workbench';

function App() {
  const stage = useAppStore((state) => state.stage);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {stage === 'portal' && <Portal />}
      {stage === 'arena' && <Arena />}
      {stage === 'workbench' && <Workbench />}
    </div>
  );
}

export default App;
