import { Component, Element, h, Host, Prop, Watch } from '@stencil/core';

@Component({
  tag: 'dashboard-nav',
  styleUrl: 'dashboard-nav.scss',
  shadow: true,
})
export class DashboardNav {
  @Element() element: HTMLDashboardNavElement;
  dashboard: HTMLCollapsibleDashboardElement;

  active = false;
  @Prop() class = '';
  @Prop({ mutable: true, reflect: true }) collapsed = false;
  @Prop({ mutable: true, reflect: true }) href;

  @Watch('class')
  watchClass(newVal) {
    this.active = newVal.split(/\s+/).includes('active');
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

  componentDidRender() {
    this.watchClass(this.class);
  }

  render() {
    return (
      <Host>
        <a href={this.href} class={`wrapper ${this.collapsed ? 'collapsed' : ''} ${this.active ? 'active' : ''}`}>
          <div class='container'>
            <div class='icon'>
              <div class='icon-container'>
                <slot name='icon' />
              </div>
            </div>
            <div class='text'>
              <slot />
            </div>
          </div>
        </a>
      </Host>
    );
  }
}
