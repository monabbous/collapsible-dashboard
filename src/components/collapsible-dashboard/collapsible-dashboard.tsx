import { Component, Element, Event, EventEmitter, h, Host, Listen, Prop, Watch } from '@stencil/core';
import { Color } from '../../utils/utils';

@Component({
  tag: 'collapsible-dashboard',
  styleUrl: 'collapsible-dashboard.scss',
  shadow: true,
})
export class CollapsibleDashboard {
  @Element() element: HTMLCollapsibleDashboardElement;

  @Prop({ attribute: 'dir', mutable: true }) direction: 'rtl' | 'ltr' = 'ltr';

  @Prop({ reflect: true, mutable: true }) collapse: boolean = false;
  @Prop({ reflect: true, mutable: true }) open: boolean = false;

  @Prop({ mutable: true }) sidePanelBgColor: string;
  private sidePanelBgColorObject: Color = new Color('#e5e5e5');
  @Prop({ mutable: true }) sidePanelColor: string;
  private sidePanelColorObject: Color = new Color('#232323');

  @Prop({ mutable: true }) mobileNavBgColor: string;
  private mobileNavBgColorObject: Color = new Color('#232323');
  @Prop({ mutable: true }) mobileNavColor: string;
  private mobileNavColorObject: Color = new Color('#e5e5e5');

  private dashboardWrapper: HTMLDivElement;
  private sidePanel: HTMLElement;
  private mobileNav: HTMLElement;


  @Event() panelCollapse: EventEmitter<boolean>;
  panelCollapseHandler(collapse: boolean) {
    this.panelCollapse.emit(collapse);
  }

  @Watch('collapse')
  setCollapse(newVal) {
    this.panelCollapseHandler(newVal);
  }

  componentWillLoad() {
    this.direction = window.getComputedStyle(this.element).direction as 'rtl' | 'ltr';
    this.setSidePanelBgColor(this.sidePanelBgColor);
    this.setMobileNavBgColor(this.mobileNavBgColor);
  }

  componentDidRender() {
    this.dashboardWrapper = (this.element.shadowRoot ?? this.element).querySelector('.dashboard-wrapper');
    this.sidePanel = (this.element.shadowRoot ?? this.element).querySelector('.side-panel');
    this.mobileNav = (this.element.shadowRoot ?? this.element).querySelector('.mobile-nav');
    this.updateCssVariables();
  }

  @Watch('sidePanelBgColor')
  setSidePanelBgColor(newVal) {
    if (newVal) {
      this.sidePanelBgColorObject.parse(newVal);
    }
    this.sidePanelBgColor = this.sidePanelBgColorObject.toRGBString();
    this.updateCssVariables();
  }

  @Watch('sidePanelColor')
  setSidePanelColor(newVal) {
    if (newVal) {
      this.sidePanelColorObject.parse(newVal);
      this.sidePanelColor = this.sidePanelColorObject.toRGBString();
    }
    this.updateCssVariables();
  }

  @Watch('mobileNavBgColor')
  setMobileNavBgColor(newVal) {
    if (newVal) {
      this.mobileNavBgColorObject.parse(newVal);
    }
    this.mobileNavBgColor = this.mobileNavBgColorObject.toRGBString();
    this.updateCssVariables();
  }

  @Watch('mobileNavColor')
  setMobileNavColor(newVal) {
    if (newVal) {
      this.mobileNavColorObject.parse(newVal);
      this.mobileNavColor = this.mobileNavColorObject.toRGBString();
    }
    this.updateCssVariables();
  }

  private updateCssVariables() {
    if (this.dashboardWrapper) {
      const mobileNavColor = new Color(this.getMobileNavColor());
      const mobileNavBg = new Color(this.getMobileNavBgColor());
      const sidePanelColor = new Color(this.getSidePanelColor());
      const sidePanelBg = new Color(this.getSidePanelBgColor());

      const mobileNavColorRGBA = mobileNavColor.getRGBA();
      const mobileNavBgRGBA = mobileNavBg.getRGBA();
      const sidePanelColorRGBA = sidePanelColor.getRGBA();
      const sidePanelBgRGBA = sidePanelBg.getRGBA();

      // const diff: {r?: number; g?: number, b?: number} = {};

      for (const key of ['r', 'g', 'b', 'a']) {
        this.dashboardWrapper.style.setProperty(`--mobile-nav-color-${key}`, mobileNavColorRGBA[key]);
        this.dashboardWrapper.style.setProperty(`--mobile-nav-bg-${key}`, mobileNavBgRGBA[key]);
        this.dashboardWrapper.style.setProperty(`--side-panel-color-${key}`, sidePanelColorRGBA[key]);
        this.dashboardWrapper.style.setProperty(`--side-panel-bg-${key}`, sidePanelBgRGBA[key]);
        this.dashboardWrapper.style.setProperty(`--color-diff-${key}`, (sidePanelColorRGBA[key] - mobileNavColorRGBA[key]).toFixed(0));
      }

    }
  }

  getSidePanelBgColor() {
    return this.sidePanelBgColor;
  }
  getDefaultSidePanelColor() {
    return this.sidePanelBgColorObject.isDark() ? '#efefef' : '#232323';
  }

  getSidePanelColor() {
    return this.sidePanelColor ?? this.getDefaultSidePanelColor();
  }

  getMobileNavBgColor() {
    return this.mobileNavBgColor;
  }
  getDefaultMobileNavColor() {
    return this.mobileNavBgColorObject.isDark() ? '#efefef' : '#232323';
  }

  getMobileNavColor() {
    return this.mobileNavColor ?? this.getDefaultMobileNavColor();
  }

  private touchX: number;
  private touchY: number;
  private factor: number;
  private width: number;
  private deltaX: number;
  private deltaY: number;
  @Listen('touchstart', { capture: true, passive: false, target: 'window' })
  touchstart(event: TouchEventInit) {
    this.touchX = event.touches[0]?.clientX;
    this.touchY = event.touches[0]?.clientY;
    this.width = this.sidePanel.clientWidth;
    this.factor = (this.direction === 'ltr' ? 1 : -1) / this.width;

    if (this.open) {
      return;
    }
    if ((this.touchX >= 20 && this.direction === 'ltr') || (this.touchX <= this.dashboardWrapper.clientWidth - 20 && this.direction === 'rtl')) {
      this.touchX = null;
    }
  }

  @Listen('touchmove', { capture: true, passive: false, target: 'window' })
  touchmove(event: TouchEvent) {
    if (!isFinite(this.touchX)) {
      return;
    }

    this.deltaY = this.touchY - event.touches[0]?.clientY;
    this.deltaX = Math.max(0, Math.min(1, (this.touchX - event.touches[0]?.clientX) * this.factor + +!this.open));
    if (Math.abs(this.deltaY) > 50) {
      this.dashboardWrapper.classList.remove('dragging');
      this.dashboardWrapper.style.removeProperty('--progression');
      this.touchX = Infinity;
      this.deltaX = Infinity;
    } else if (Math.abs(this.deltaX) > 0.05) {
      this.dashboardWrapper.classList.add('dragging');
      this.dashboardWrapper.style.setProperty('--progression', this.deltaX.toString());
      event.preventDefault();
    }
  }

  @Listen('touchend', { capture: true, passive: false, target: 'window' })
  touchend() {
    this.touchX = Infinity;
    this.dashboardWrapper.classList.remove('dragging');
    this.dashboardWrapper.style.removeProperty('--progression');

    if (isFinite(this.deltaX)) {
      if (Math.abs(this.deltaX) > 0.5 && this.open) {
        this.open = false;
      } else if (Math.abs(this.deltaX) < 0.5 && !this.open) {
        this.open = true;
      }
    }

    this.deltaX = Infinity;
  }

  @Listen('resize', {target: 'window', passive: true})
  windowResize() {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.1}px`);
  }



  @Watch('direction')
  watchDir(newVal) {
    this.direction = newVal;
  }

  private chevronLeft() {
    return (
      <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="chevron-left"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 512"
        class="svg-inline--fa fa-chevron-left fa-w-10 fa-7x"
      >
        <path
          fill={this.getSidePanelColor()}
          d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"
          class=""
        ></path>
      </svg>
    );
  }

  private chevronRight() {
    return (
      <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="chevron-right"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 512"
        class="svg-inline--fa fa-chevron-right fa-w-10 fa-7x"
      >
        <path
          fill={this.getSidePanelColor()}
          d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"
          class=""
        ></path>
      </svg>
    );
  }

  private menuIcon() {
    return (
      <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="minus"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        class={`svg-inline--fa fa-menu fa-w-14 fa-7x`}
      >
        <g>
          <path
            fill={this.open ? this.getSidePanelColor() : this.getSidePanelBgColor()}
            d="M448,64H64c-17.7,0-32,14.3-32,32v32c0,17.7,14.3,32,32,32h384c17.7,0,32-14.3,32-32V96C480,78.3,465.7,64,448,64z"
          />
        </g>
        <g>
          <path
            fill={this.open ? this.getSidePanelColor() : this.getSidePanelBgColor()}
            d="M447.5,208.1h-384c-17.7,0-32,14.3-32,32v32c0,17.7,14.3,32,32,32h384c17.7,0,32-14.3,32-32v-32 C479.5,222.4,465.2,208.1,447.5,208.1z"
          />
        </g>
        <g>
          <path
            fill={this.open ? this.getSidePanelColor() : this.getSidePanelBgColor()}
            d="M448,350H64c-17.7,0-32,14.3-32,32v32c0,17.7,14.3,32,32,32h384c17.7,0,32-14.3,32-32v-32C480,364.3,465.7,350,448,350z"
          />
        </g>
      </svg>
    );
  }

  render() {
    return (
      <Host>
        <div class={`dashboard-wrapper ${this.collapse ? ' collapse-panel ' : ''}${this.open ? ' open ' : ''}`} dir={this.direction === 'ltr' ? 'ltr' : 'rtl'}>
          <div class="dashboard-container">
            <nav class={`side-panel`} style={{ 'background-color': this.getSidePanelBgColor(), 'color': this.getSidePanelColor() }}>
              <div class="side-panel-header">
                <div class="side-panel-header-container">
                  <slot name="side-panel-header"></slot>
                </div>
                <button class={`menu-button ${this.open ? 'open' : ''}`} onClick={() => (this.open = !this.open)}>
                  {this.menuIcon()}
                </button>
              </div>
              <div class="side-panel-content">
                <slot name="side-panel-content"></slot>
              </div>
              <div class={`collapse-panel-button ${this.sidePanelBgColorObject.isDark() ? 'dark' : 'light'}`}>
                <button onClick={() => (this.collapse = !this.collapse)}>{this.direction === 'ltr' ? this.chevronLeft() : this.chevronRight()}</button>
              </div>
            </nav>
            <main class="main">
              <nav class="mobile-nav" style={{ 'background-color': this.getMobileNavBgColor(), 'color': this.getMobileNavColor() }}>
                <div class="mobile-nav-container">
                  <slot name="mobile-nav"></slot>
                </div>
              </nav>
              <slot></slot>
            </main>
          </div>
        </div>
      </Host>
    );
  }
}
