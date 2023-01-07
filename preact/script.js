import {render, h} from 'https://cdn.skypack.dev/preact';
import {useState, useReducer} from 'https://cdn.skypack.dev/preact/hooks'; //braces?
import htm from 'https://cdn.skypack.dev/htm';

const ht = htm.bind(h);

const Game = props => {
  const update = (state, answer) => {
    //const res = props.test
    return state;
  }
  const keydown = e => {
    if (e.key == ' ' || e.key == 'Enter') {
      e.preventDefault();
      const ans = e.target.innerText;
      dispatch(ans);
    }
  }
  const [state, dispatch] = useReducer(update, props.gen);
  return ht`
    <${Tree} title=${props.title}>
      Q:${state.q}
      <div>
        A:
        <span class='ans' onkeydown=${keydown} contenteditable>
        <//>
      <//>
    <//>
  `;
}

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
                q: 'what?',
                afn: ans => ans === 'none'}
               }
              }/>
      <//>
      <div>baz<//>
    <//>
  `;
}

render(ht`<${App}/>`, document.body);
