import {render, h} from 'https://cdn.skypack.dev/preact';
import {useState, useReducer} from 'https://cdn.skypack.dev/preact/hooks'; //braces?
import htm from 'https://cdn.skypack.dev/htm';

const ht = htm.bind(h);

const Tree = props => {
  const [collapse, setState] = useState(props.collapse); //hacky falsity
  return ht`
  <div class='tree'> 
    <div class='tree-header' onclick=${() => setState(!collapse)}>
      <b>${`${collapse ? '+' : '-'} ${props.title}`}</b>
    <//>
    <div class='tree-content' style=${collapse ? 'display: none' : ''}>
      ${props.children}
    <//>
  <//>
  `;
}


//update
const Foo = props => {
  const [state, setState] = useState(0);
  //first just wrap passed event
  const f = e => {
    props.onkeydown(e);
    const len = e.target.innerText.length;
    setState(len + ((e.key.length  == 1 && e.key != ' ') ? 1 : 0)); //same condition as below, but hackier
  }
  return ht`
    <span class='foo'>
      <span class='bar'>${'\u00a0'.repeat(5)}<//>
      <span class='baz'>${'\u00a0'.repeat(state)}<//>
      <span class='ans' onkeydown=${f} contenteditable spellcheck=${false}>
      <//>
    <//>
  `;
}

//closure around?
const Game = props => {
  const [state, setState] = useState({streak: 0, task: props.taskGen()});
  const keydown = e => {
    if (!(e.key == ' ' || e.key == 'Enter' || e.key == 'Backspace')) return; //abstract away?
    e.preventDefault();
    const ans = e.target.innerText;
    e.target.innerText = '';
    const {task, streak} = state;
    const passed = task.validate(ans);
    setState({
      streak: passed ? streak + 1 : 0,
      task: passed ? props.taskGen() : task
    });
  }
  //TODO floating underline
  return ht`
    <${Tree} title=${props.title}>
      Q: ${state.task.question}
      <div>
        ${'A: '} 
        <${Foo} onkeydown=${keydown}/>
      <//>
      streak: ${state.streak}

    <//>
  `;
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

const add1 = () => {
  const a = getRandomIntInclusive(0, 9);
  const b = getRandomIntInclusive(0, 9);
  return {
    question: `${a} + ${b} = ???`,
    validate: ans => parseInt(ans) === a + b
  }
}

//memoize game?
const App = props => {
  return ht`
    <${Tree} title=foobar>
      <div>foo<//>
      <${Tree} title='walbro'>
        bar
        <div>boom<//>
        <u>hello uriel<//>
        <${Game}
         title='Walprawn'
         taskGen=${add1}/>
      <//>
      <div>baz<//>
    <//>
  `;
}

render(ht`<${App}/>`, document.body);
