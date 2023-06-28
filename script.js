import 'https://cdn.skypack.dev/preact/debug';
import {render, h} from 'https://cdn.skypack.dev/preact';
import {useState, useReducer, useRef, useEffect} from 'https://cdn.skypack.dev/preact/hooks'; //braces?
import htm from 'https://cdn.skypack.dev/htm';

const ht = htm.bind(h);


const Tree = props => {
  const [closed, setClosed] = useState(!!props.closed);
  useEffect(() => {
    if (closed) props.onClose?.();
    else props.onOpen?.();
  }, [closed]);
  return ht`
    <div onclick=${() => setClosed(!closed)}>
      <b>
        ${closed ? '+ ' : '- '}
        ${props.title}
      <//>
    <//>
    <div
     class='tree-content'
     style=${closed ? `display: none` : ''}
     >
      ${props.children}
    <//>
  `;
}

const Ans = props => {
  //const input = useRef(null);
  const input = props.ansRef ?? {current: null};
  const [maskLen, setMaskLen] = useState(0);
  const updateMask = () => {
    const val = input.current.innerText;
    setMaskLen(val.length);
  }
  const f = e => {
    const key = e.key;
    const val = input.current.innerText;
    if (['Enter', 'Backspace', ' '].includes(e.key)) { 
      e.preventDefault();
      props.msg(['ans', val]);
      input.current.innerText = '';
      updateMask();
    }
  };
  return ht`
    <span>
    <span class='ans-line'>${'\u00a0'.repeat(5)}<//>
    <span class='ans-mask'>${'\u00a0'.repeat(maskLen)}<//>
    <span ref=${input} onkeydown=${f} oninput=${updateMask} class='ans' contenteditable />
    <//>
  `;
}


//message passing vs method calling

const randInt = (lo, hi) => lo + Math.floor((hi - lo + 1) * Math.random());


const taskGen = config => {
  const [first, ...rest] = Array.from(Array(config.numbers), () => randInt(Math.pow(10, config.digits-1), Math.pow(10, config.digits)-1));
  const q = `${first}${''.concat(...rest.map(n => ` + ${n}`))} = ???`;
  return {
    q: q,
    afn: ans => parseInt(ans) === rest.reduce((a, b) => a + b, first),
  }
};

const init = config => {
  return {
    streak: 0,
    task: taskGen(config),
    config: config,
  }
}

const update = (state, message) => {
  const [action, value] = message;
  const _state = {...state};
  if (action === 'ans') {
    if (state.task.afn(value)) {
      _state.streak++;
      _state.task = taskGen(state.config);
    }
    else {
      _state.streak = 0;
    }
  }
  if (action === 'config') {
    _state.config = value;
  }
  return _state;
};

const Game = props => {
  const [state, msg] = useReducer(update, init(props.config));
  const ansRef = {current: null};
  const focus = () => ansRef.current.focus();
  return ht`
    <${Tree} title='${props.title}' closed=${props.closed ?? true} onOpen=${focus}>
      <div style='margin-bottom: 0.6em' onclick=${focus}>
        Q: ${state.task.q}
        <br/>
        ${'A: '}
        <${Ans} msg=${msg} ansRef=${ansRef}/>
        <br/>
        <i>${`streak: ${state.streak}`}<//>
      <//>
    <//>
  `;
}
/*
        <p>
        The purpose of this tiny webapp is to help one train various mental tasks up to a level of
        mastery that a healthy adult posesses over walking.
        </p>
        <p>
        People can walk for hours, taking thousands of steps, never falling or stumbling;
        not having to be conscious of it.
        </p>
        <p>
        If after a 10 mile walk, you misplace your foot and fall over, you're not really good at walking,
        despite having taken tens of thousands of correct steps in succession.
        </>
*/

const App = props => {
  return ht`
    <${Tree} title='About' closed>
      <div class='desc'>
      <//>
    <//>
    <${Game}
      title='Single digit addition 1'
      closed=${false}
      config=${{
        numbers: 2,
        digits: 1
      }}
    />
    <${Game}
      title='Single digit addition 2'
      config=${{
        numbers: 11,
        digits: 1
      }}
    />
    <${Game}
      title='Two digit addition 1'
      config=${{
        numbers: 2,
        digits: 2
      }}
    />
    <${Game}
      title='Two digit addition 2'
      config=${{
        numbers: 11,
        digits: 2
      }}
    />
  `;
  //can state be passed as a prop?
  //does it update stuff needlessly?
  //  ^^ yes
  //  no?
  //    it's not "it"
}

render(ht`<${App}/>`, document.body);
