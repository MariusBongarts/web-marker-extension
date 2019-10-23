import { css, customElement, html, LitElement, property, unsafeCSS, query } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

const componentCSS = require('./tree-view.component.scss');

@customElement('tree-view')
export class TreeViewComponent extends LitElement {

  static styles = css`${unsafeCSS(componentCSS)}`;

  @property()
  activeDirectory = '';

  firstUpdated() {

  }


  render() {
    return html`
<ul id="compositions-list" class="pure-tree main-tree">
  <li>
    <input type="checkbox" id="trigger-views" checked="checked">
    <label for="trigger-views">views</label>
    <ul class="pure-tree">
      <li class="pure-tree_link"><a href="" title="index.jade" target="_blank">index.html</a></li>
      <li>
        <input type="checkbox" id="trigger-layout">
        <label for="trigger-layout">layout</label>
        <ul class="pure-tree">
          <li>
            <input type="checkbox" id="trigger-base">
            <label for="trigger-base">base</label>
            <ul class="pure-tree">
              <li class="pure-tree_link"><a href="" title="index.jade" target="_blank">index.html</a></li>
            </ul>
          </li>
          <li>
            <input type="checkbox" id="trigger-footer">
            <label for="trigger-footer">footer</label>
            <ul class="pure-tree">
              <li class="pure-tree_link"><a href="" title="index.jade" target="_blank">index.html</a></li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        <input type="checkbox" id="trigger-partials">
        <label for="trigger-partials">partials</label>
        <ul class="pure-tree">
          <li>
            <input type="checkbox" id="trigger-header">
            <label for="trigger-header">header</label>
            <ul class="pure-tree">
              <li class="pure-tree_link"><a href="" title="index.jade" target="_blank">index.html</a></li>
            </ul>
          </li>
          <li>
            <input type="checkbox" id="trigger-list">
            <label for="trigger-list">list</label>
            <ul class="pure-tree">
              <li class="pure-tree_link"><a href="" title="index.jade" target="_blank">index.html</a></li>
            </ul>
          </li>
          <li>
            <input type="checkbox" id="trigger-message">
            <label for="trigger-message">message</label>
            <ul class="pure-tree">
              <li class="pure-tree_link"><a href="" title="index.jade" target="_blank">index.html</a></li>
            </ul>
          </li>
          <li>
            <input type="checkbox" id="trigger-panel">
            <label for="trigger-panel">panel</label>
            <ul class="pure-tree">
              <li class="pure-tree_link"><a href="" title="index.jade" target="_blank">index.html</a></li>
            </ul>
          </li>
          <li>
            <input type="checkbox" id="trigger-prompt">
            <label for="trigger-prompt">prompt</label>
            <ul class="pure-tree">
              <li class="pure-tree_link"><a href="" title="index.jade" target="_blank">index.html</a></li>
            </ul>
          </li>
          <li>
            <input type="checkbox" id="trigger-sub-header">
            <label for="trigger-sub-header">sub-header</label>
            <ul class="pure-tree">
              <li class="pure-tree_link"><a href="" title="index.jade" target="_blank">index.html</a></li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        <input type="checkbox" id="trigger-ui">
        <label for="trigger-ui">ui</label>
        <ul class="pure-tree">
          <li>
            <input type="checkbox" id="trigger-box-color">
            <label for="trigger-box-color">box-color</label>
            <ul class="pure-tree">
              <li class="pure-tree_link"><a href="" title="index.jade" target="_blank">index.html</a></li>
            </ul>
          </li>
          <li>
            <input type="checkbox" id="trigger-button">
            <label for="trigger-button">button</label>
            <ul class="pure-tree">
              <li class="pure-tree_link"><a href="" title="index.jade" target="_blank">index.html</a></li>
            </ul>
          </li>
          <li>
            <input type="checkbox" id="trigger-charts">
            <label for="trigger-charts">charts</label>
            <ul class="pure-tree">
              <li>
                <input type="checkbox" id="trigger-border">
                <label for="trigger-border">border</label>
                <ul class="pure-tree">
                  <li class="pure-tree_link"><a href="" title="index.jade" target="_blank">index.html</a></li>
                </ul>
              </li>
              <li>
                <input type="checkbox" id="trigger-progress">
                <label for="trigger-progress">progress</label>
                <ul class="pure-tree">
                  <li class="pure-tree_link"><a href="" title="index.jade" target="_blank">index.html</a></li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            <input type="checkbox" id="trigger-check">
            <label for="trigger-check">check</label>
            <ul class="pure-tree">
              <li class="pure-tree_link"><a href="" title="index.jade" target="_blank">index.html</a></li>
            </ul>
          </li>
          <li>
            <input type="checkbox" id="trigger-dropdown">
            <label for="trigger-dropdown">dropdown</label>
            <ul class="pure-tree">
              <li class="pure-tree_link"><a href="" title="index.jade" target="_blank">index.html</a></li>
            </ul>
          </li>
          <li>
            <input type="checkbox" id="trigger-input">
            <label for="trigger-input">input</label>
            <ul class="pure-tree">
              <li class="pure-tree_link"><a href="" title="index.jade" target="_blank">index.html</a></li>
            </ul>
          </li>
          <li>
            <input type="checkbox" id="trigger-radio">
            <label for="trigger-radio">radio</label>
            <ul class="pure-tree">
              <li class="pure-tree_link"><a href="" title="index.jade" target="_blank">index.html</a></li>
            </ul>
          </li>
          <li>
            <input type="checkbox" id="trigger-rating-stars">
            <label for="trigger-rating-stars">rating-stars</label>
            <ul class="pure-tree">
              <li class="pure-tree_link"><a href="" title="index.jade" target="_blank">index.html</a></li>
            </ul>
          </li>
          <li>
            <input type="checkbox" id="trigger-textarea">
            <label for="trigger-textarea">textarea</label>
            <ul class="pure-tree">
              <li class="pure-tree_link"><a href="" title="index.jade" target="_blank">index.html</a></li>
            </ul>
          </li>
          <li>
            <input type="checkbox" id="trigger-toggle">
            <label for="trigger-toggle">toggle</label>
            <ul class="pure-tree">
              <li class="pure-tree_link"><a href="" title="index.jade" target="_blank">index.html</a></li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </li>
</ul>
`;
  }

}
