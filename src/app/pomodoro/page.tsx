'use client';

import type { PomodoroSettings } from '@/modules/database/schema/pomodoro';
import { usePomodoroManager } from '@/modules/pomodoro/hooks/use-pomodoro-manager';
import { formatTimer } from '@/modules/pomodoro/lib/format-timer';
import { pomodoroSessionStateLabels, type PomodoroTimerState } from '@/modules/pomodoro/types/pomodoro';
import { useTodosManager } from '@/modules/todo/hooks/use-todos-manager';
import { useSyncLocalData } from '@/modules/tools/hooks/use-sync-local-data';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Switch } from '@/shared/components/ui/switch';
import { cn } from '@/shared/utils/cn';
import { motion } from 'framer-motion';
import { LucideLoaderCircle, LucideX } from 'lucide-react';
import { memo, useEffect, useState } from 'react';

const castNumber = (value: unknown): number => {
  const n = Number(value);

  if (typeof n === 'number' && !Number.isNaN(n)) {
    return n;
  }

  return 0;
};

const ensureNotZero = (value: unknown): number => {
  const n = castNumber(value);
  return n > 0 ? n : 1;
};

export default function PomodoroPage() {
  const {
    timerState,
    isLoadingSettings,
    settings,
    toggleTimer,
    resetTimer,
    skipTimer,
    updateSettings,
  } = usePomodoroManager();

  const {
    newTodo,
    setNewTodo,
    isLoadingTodos,
    todos,
    handleCreateTodo,
    handleToggleTodo,
    handleDeleteTodo,
  } = useTodosManager()

  // Sync local data when logging in
  useSyncLocalData();

  if (isLoadingSettings || isLoadingTodos) {
    return (
      <div className="fixed z-[9999] flex h-[--view-height] w-full items-center justify-center bg-background/50 backdrop-blur-lg">
        <LucideLoaderCircle className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto h-[--view-height] space-y-8 p-4">
      <div className="grid h-full grid-cols-1 gap-8 md:grid-cols-2">
        {/* Timer Section */}
        <Card>
          <CardHeader>
            <CardTitle>Pomodoro</CardTitle>
            <CardDescription>Foque em suas tarefas usando a técnica pomodoro</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <TimerGraph
                pomodoroDuration={settings.pomodoroDuration}
                timerStateTimeRemaining={timerState.timeRemaining}
                timerStateType={timerState.type}
              />

              <div className="flex space-x-4">
                <Button onClick={toggleTimer} disabled={castNumber(settings.pomodoroDuration) === 0}>
                  {pomodoroSessionStateLabels[timerState.state]}
                </Button>
                <Button variant="outline" onClick={resetTimer} disabled={timerState.state === 'idle'}>
                  Reiniciar
                </Button>
                <Button variant="outline" onClick={skipTimer} disabled={timerState.state !== 'running'}>
                  Pular
                </Button>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Configurações</h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="pomodoroDuration">Duração do pomodoro (minutos)</Label>
                  <Input
                    id="pomodoroDuration"
                    type="number"
                    min="1"
                    max="60"
                    defaultValue={ensureNotZero(Math.floor(settings.pomodoroDuration / 60))}
                    onChange={e => {
                      console.log('e.target.value', ensureNotZero(e.target.value) * 60);
                      updateSettings({
                        ...settings!,
                        pomodoroDuration: ensureNotZero(e.target.value) * 60,
                      });
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="shortBreakDuration">Duração da pause curta (minutos)</Label>
                  <Input
                    id="shortBreakDuration"
                    type="number"
                    min="1"
                    max="30"
                    defaultValue={ensureNotZero(Math.floor(settings.shortBreakDuration / 60))}
                    onChange={e =>
                      updateSettings({
                        ...settings!,
                        shortBreakDuration: ensureNotZero(e.target.value) * 60,
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="longBreakDuration">Duração da pause longa (minutos)</Label>
                  <Input
                    id="longBreakDuration"
                    type="number"
                    min="1"
                    max="60"
                    defaultValue={ensureNotZero(Math.floor(settings.longBreakDuration / 60))}
                    onChange={e =>
                      updateSettings({
                        ...settings!,
                        longBreakDuration: ensureNotZero(e.target.value) * 60,
                      })
                    }
                  />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex h-10 w-full items-center gap-2 rounded-2xl bg-secondary/50 p-2">
                    <Switch
                      id="autoStartBreaks"
                      checked={settings.autoStartBreaks}
                      onCheckedChange={(checked: boolean) =>
                        updateSettings({
                          ...settings!,
                          autoStartBreaks: checked,
                        })
                      }
                    />
                    <Label htmlFor="autoStartBreaks">Início Automático de Pausas</Label>
                  </div>
                  <div className="flex h-10 w-full items-center gap-2 rounded-2xl bg-secondary/50 p-2">
                    <Switch
                      id="autoStartPomodoros"
                      checked={settings.autoStartPomodoros}
                      onCheckedChange={(checked: boolean) =>
                        updateSettings({
                          ...settings!,
                          autoStartPomodoros: checked,
                        })
                      }
                    />
                    <Label htmlFor="autoStartPomodoros">Início Automático de pomodoros</Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Todo List Section */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de tarefas</CardTitle>
            <CardDescription>Gerencie suas tarefas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleCreateTodo} className="flex space-x-2">
              <Input
                placeholder="Adicione um novo item..."
                value={newTodo}
                onChange={e => setNewTodo(e.target.value)}
              />
              <Button type="submit">Adicionar</Button>
            </form>
            <ScrollArea className="h-[400px]">
              <ol className="flex flex-col divide-y">
                {todos?.map(todo => (
                  <li key={todo.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`todo-${todo.id}`}
                      checked={todo.completed}
                      onCheckedChange={(checked: boolean) => handleToggleTodo(todo.id, checked)}
                    />
                    <Label
                      htmlFor={`todo-${todo.id}`}
                      className={cn(
                        'flex-1 cursor-pointer py-3',
                        todo.completed && 'text-muted-foreground line-through',
                      )}
                    >
                      {todo.text} {todo.completed && '(Concluído)'}
                    </Label>
                    <Button
                      title="Remover"
                      aria-label="Remover"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="h-8 w-8"
                    >
                      <LucideX />
                    </Button>
                  </li>
                ))}
              </ol>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type TimerGraphProps = {
  timerStateType: PomodoroTimerState['type'];
  timerStateTimeRemaining: PomodoroTimerState['timeRemaining'];
  pomodoroDuration: PomodoroSettings['pomodoroDuration'];
};

const TimerGraph = memo(({ pomodoroDuration, timerStateTimeRemaining, timerStateType }: TimerGraphProps) => {
  const [firstTime, setFirstTime] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    timeout = setTimeout(() => {
      setFirstTime(false);
    }, 500);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    }
  }, []);

  if (firstTime) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ duration: 0.5 }}
        className="relative h-64 w-64 flex items-center justify-center"
      >
        <LucideLoaderCircle className="h-8 w-8 animate-spin" />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{ duration: 0.5 }}
      key={timerStateType}
      className="relative h-64 w-64"
    >
      <svg className="h-full w-full" viewBox="0 0 100 100">
        <circle
          className="text-gray-200"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r="42"
          cx="50"
          cy="50"
        />
        <circle
          className={cn(
            'text-primary transition-all duration-1000',
            timerStateType === 'pomodoro' && 'text-red-500',
            timerStateType === 'short_break' && 'text-green-500',
            timerStateType === 'long_break' && 'text-blue-500',
          )}
          strokeWidth="8"
          strokeDasharray={264}
          strokeDashoffset={
            264 - (264 * castNumber(timerStateTimeRemaining)) / (castNumber(pomodoroDuration) || 25 * 60)
          }
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="42"
          cx="50"
          cy="50"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl font-bold">{formatTimer(castNumber(timerStateTimeRemaining))}</span>
      </div>
    </motion.div>
  );
});

TimerGraph.displayName = 'TimerGraph';
