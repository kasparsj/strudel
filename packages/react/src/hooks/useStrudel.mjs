import { useRef, useCallback, useEffect, useMemo, useState } from 'react';
import { repl } from '@strudel.cycles/core/repl.mjs';
import { transpiler } from '@strudel.cycles/transpiler';

function useStrudel({ defaultOutput, interval, getTime, code, evalOnMount = false }) {
  // scheduler
  const [schedulerError, setSchedulerError] = useState();
  const [evalError, setEvalError] = useState();
  const [activeCode, setActiveCode] = useState(code);
  const [pattern, setPattern] = useState();
  const isDirty = code !== activeCode;
  const { scheduler, evaluate: _evaluate } = useMemo(
    () =>
      repl({
        interval,
        defaultOutput,
        onSchedulerError: setSchedulerError,
        onEvalError: setEvalError,
        getTime,
        transpiler,
        onEval: ({ pattern: _pattern, code }) => {
          setActiveCode(code);
          setPattern(_pattern);
          setEvalError();
        },
        onEvalError: setEvalError,
      }),
    [defaultOutput, interval, getTime],
  );
  const evaluate = useCallback(() => _evaluate(code), [_evaluate, code]);

  const inited = useRef();
  useEffect(() => {
    if (!inited.current && evalOnMount && code) {
      inited.current = true;
      evaluate();
    }
  }, [evaluate, evalOnMount, code]);

  return { schedulerError, scheduler, evalError, evaluate, activeCode, isDirty, pattern };
}

export default useStrudel;