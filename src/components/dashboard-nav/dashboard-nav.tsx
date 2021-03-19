import { Component, Element, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'dashboard-nav',
  styleUrl: 'dashboard-nav.scss',
  shadow: true,
})
export class DashboardNav {
  @Element() element: HTMLDashboardNavElement;
  dashboard: HTMLCollapsibleDashboardElement;

  @Prop({ mutable: true, reflect: true }) active = false;
  @Prop({ mutable: true, reflect: true }) collapsed = false;
  @Prop({ mutable: true, reflect: true }) href;

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
      this.dashboard.addEventListener('panelCollapse', (collapse: CustomEvent<boolean>) => {
        this.collapsed = collapse.detail;
      });
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
