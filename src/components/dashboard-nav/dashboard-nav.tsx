import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'dashboard-nav',
  styleUrl: 'dashboard-nav.scss',
  shadow: true,
})
export class DashboardNav {
  render() {
    return (
      <Host>
        <slot name="icon"></slot>
      </Host>
    );
  }
}
