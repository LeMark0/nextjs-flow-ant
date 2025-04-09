// Based on https://gist.github.com/LeMark0/28c7c8d0edcafb76ea77f4a0948d88fc

import { createContext, type ReactElement, type ReactNode, useContext } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HookType = (...args: any) => any

type ContextProviderProps<T extends HookType> = {
  Context: React.Context<ReturnType<T> | undefined>
  children: ReactElement | ReactNode
  stateHook: T
} & { stateHookProps: Parameters<T>[0] }

function ContextProvider<T extends HookType>({
  Context,
  children,
  stateHook,
  stateHookProps,
}: ContextProviderProps<T>) {
  const context = stateHook(stateHookProps)

  return <Context.Provider value={context}>{children}</Context.Provider>
}

function getUseContext<T extends HookType>(
  Context: React.Context<ReturnType<T> | undefined>,
) {
  return () => {
    const context = useContext<ReturnType<T> | undefined>(Context)

    if (context === undefined) {
      throw new Error('useContext must be used within a ContextProvider')
    }

    return context
  }
}

export function buildContext<T extends HookType>(stateHook: T) {
  const Context = createContext<ReturnType<T> | undefined>(undefined)

  return {
    Context,
    ContextProvider: ({
      children,
      ...stateHookProps
    }: (Parameters<T>[0] extends undefined ? object : Parameters<T>[0]) & {
      children: ReactElement | ReactNode
    }) => (
      <ContextProvider<T>
        Context={Context}
        stateHook={stateHook}
        stateHookProps={stateHookProps}
      >
        {children}
      </ContextProvider>
    ),
    useContext: getUseContext<T>(Context),
  }
}
