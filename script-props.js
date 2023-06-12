import 'https://cdn.skypack.dev/preact/debug';
import {render, h} from 'https://cdn.skypack.dev/preact';
import {useState, useReducer, useRef, useEffect} from 'https://cdn.skypack.dev/preact/hooks'; //braces?
import htm from 'https://cdn.skypack.dev/htm';

const ht = htm.bind(h);


const Tree = props => {
  const [closed, setClosed] = useState(!!props.closed);
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
  const input = useRef(null);
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

//this feels inconvenient
//it's because its generalized
//or maybe it's easy, but I'm overthinking
//it might come in handy later
//I might do it again eventually
//on the other hand I can delete it for shits and giggles and maybe something good will come out of it in the end
//whatever, just code more


const taskGen = config => {
  const [first, ...rest] = Array.from(Array(config.numbers), () => randInt(0, Math.pow(10, config.digits)-1));
  const q = `${first}${''.concat(...rest.map(n => ` + ${n}`))} = ???`;
  return {
    q: q,
    afn: ans => parseInt(ans) === rest.reduce((a, b) => a + b, first),
  }
};

const init = () => {
  const config = {
    /*
    */
    numbers: 2,
    digits: 1,
    /*
    numbers: 11,
    digits: 1,
    numbers: 11,
    digits: 2,
    numbers: 2,
    digits: 6,
    */
  }
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

const App = props => {
  const [state, msg] = useReducer(update, init())
  return ht`
    <${Tree} title='About' closed>
      foo <br/>
      bar baz <br/>
    <//>
    <${Tree} title='baz'>
      Q: ${state.task.q}
      <br/>
      ${'A: '}
      <${Ans} msg=${msg} />
      <br/>
      <i>${`streak: ${state.streak}`}<//>
    <//>
  `;
  //can state be passed as a prop?
  //does it update stuff needlessly?
  //  ^^ yes
  //  no?
  //    it's not "it"
}

render(ht`<${App}/>`, document.body);
