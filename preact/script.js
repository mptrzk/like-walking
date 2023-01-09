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

//closure around?

const Game = props => {
  const [state, setState] = useState({streak: 0, task: props.gen()});
  const keydown = e => {
    if (!(e.key == ' ' || e.key == 'Enter')) return;
    e.preventDefault();
    const ans = e.target.innerText;
    e.target.innerText = '';
    const {task, streak} = state;
    const passed = task.validate(ans);
    setState({
      streak: passed ? streak + 1 : 0,
      task: passed ? props.gen() : task
    });
  }
  //state instead of reducer?
  //TODO floating underline
  return ht`
    <${Tree} title=${props.title}>
      Q:${state.task.question}
      <div>
        A:
        <span class='ans' onkeydown=${keydown} contenteditable spellcheck=${false}>
        <//>
      <//>
      streak: ${state.streak}

    <//>
  `;
}


//Variant1 - game from props

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
         gen=${() => {
                return {
                question: 'what?',
                validate: ans => (ans === 'none')}
               }
              }/>
      <//>
      <div>baz<//>
    <//>
  `;
}

render(ht`<${App}/>`, document.body);
