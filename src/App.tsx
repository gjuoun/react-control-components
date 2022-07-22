import React, { Children } from "react";

const For = <T extends unknown, U extends React.ReactElement>({
  each,
  children,
  fallback,
}: {
  each: T[];
  children: (item: T, index: number) => U;
  fallback?: React.ReactElement;
}) => {
  if (each && each.length > 0 && typeof children === "function") {
    return (
      <>
        {each.map((item, index) => {
          return children(item, index);
        })}
      </>
    );
  } else {
    return fallback || null;
  }
};
const Show = <T extends unknown, U extends React.ReactElement>({
  when,
  children,
  fallback,
}: {
  when: T;
  children: ((item: T) => U) | U;
  fallback?: React.ReactElement;
}) => {
  if (when && typeof children === "function") {
    return (children as (item: T) => U)(when);
  } else if (when) {
    return children as U;
  } else {
    return fallback || null;
  }
};

const Switch = ({
  children,
  fallback,
}: {
  children: React.ReactElement<MatchProps<unknown>>[];
  fallback?: React.ReactElement;
}) => {
  const component = children.find((child) => {
    return child.props.when;
  });

  if (component) {
    return component;
  } else {
    return fallback || null;
  }
};

type MatchProps<T> = {
  when: T;
  children: React.ReactElement;
};

const Match = <T extends unknown>({ when, children }: MatchProps<T>) => {
  return children;
};

interface Props {
  children?: React.ReactNode;
  fallback?: React.ReactElement;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }

    return this.props.children;
  }
}

const list = [1, 2, 3, 4, 5];

const ButtonComponent = () => {
  throw Error("error!");
  return <></>;
};

export function App() {
  return (
    <div>
      <h1>Hello StackBlitz!</h1>
      <p>Start editing to see some magic happen :)</p>

      <For each={list}>{(item) => <div key={item}>{item}</div>}</For>

      <Show when={list[0]}>{(item) => <div>{item}</div>}</Show>

      <Switch>
        <Match when={true}>
          <div>hey ho yoyo1</div>
        </Match>
        <Match when={list[0]}>
          <div>hey ho yoyo2</div>
        </Match>
      </Switch>

      <ErrorBoundary>
        <ButtonComponent />
      </ErrorBoundary>
    </div>
  );
}
