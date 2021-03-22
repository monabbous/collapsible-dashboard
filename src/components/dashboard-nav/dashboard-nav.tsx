import { Component, Element, h, Host, Prop, Watch } from '@stencil/core';

@Component({
  tag: 'dashboard-nav',
  styleUrl: 'dashboard-nav.scss',
  shadow: true,
})
export class DashboardNav {
  @Element() element: HTMLDashboardNavElement;
  dashboard: HTMLCollapsibleDashboardElement;

  private run = 0;

  @Prop({ mutable: true, reflect: true }) active = false;
  @Prop({ mutable: true, reflect: true }) class = '';
  @Prop({ mutable: true, reflect: true }) collapsed = false;
  @Prop({ mutable: true, reflect: true }) href;

  @Watch('class')
  watchClass(newVal) {
    const classExist = newVal.split(/\s+/).includes('active');
    if (!classExist && this.run++ < 1) {
      return;
    }

    this.active = classExist;
  }

  @Watch('active')
  watchActive(newVal) {
    const classes = this.class.split(/\s+/).reduce((a, v) => {
      a[v] = true;
      return a;
    }, {});
    const active = ['true', 'active', true, ''].includes(newVal);
    if (!active && this.run++ < 1) {
      return;
    }
    if (active) {
      classes['active'] = true;
    } else {
      delete classes['active'];
    }

    this.class = Object.keys(classes).join(' ');

    console.log(this.class, active);
  }

  componentWillLoad() {
    let dashboard: HTMLElement | HTMLCollapsibleDashboardElement | null = this.element;
    while ((dashboard = dashboard.parentElement)) {
      if (dashboard.tagName.toLowerCase() === 'collapsible-dashboard') {
        break;
      }
    }

    this.dashboard = dashboard as HTMLCollapsibleDashboardElement;
    if (dashboard) {
      //@ts-ignore
      dashboard?.getSidePanelColorPromise()
        .then(color => ((this.element.shadowRoot ?? this.element).querySelector('.wrapper') as HTMLElement).style.setProperty('--passive-color', color));
      //@ts-ignore
      dashboard?.getSidePanelBgColorPromise()
        .then(color => ((this.element.shadowRoot ?? this.element).querySelector('.wrapper') as HTMLElement).style.setProperty('--active-color', color));
      this.dashboard.addEventListener('collapseChange', (collapse: CustomEvent<boolean>) => {
        this.collapsed = collapse.detail;
      });

      this.collapsed = this.dashboard.collapse;
    }
  }

  render() {
    return (
      <Host>
        <a href={this.href} class={`wrapper ${this.collapsed ? 'collapsed' : ''} ${this.active ? 'active' : ''}`}>
          <div class="container">
            <div class="icon">
              <slot name="icon"></slot>
            </div>
            <div class="text">
              <slot></slot>
            </div>
          </div>
        </a>
      </Host>
    );
  }
}
