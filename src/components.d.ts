/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface CollapsibleDashboard {
        "collapse": boolean;
        "direction": 'rtl' | 'ltr';
        "getMobileNavBgColorPromise": () => Promise<string>;
        "getMobileNavColorPromise": () => Promise<string>;
        "getSidePanelBgColorPromise": () => Promise<string>;
        "getSidePanelColorPromise": () => Promise<string>;
        "mobileNavBgColor": string;
        "mobileNavColor": string;
        "open": boolean;
        "sidePanelBgColor": string;
        "sidePanelColor": string;
    }
    interface DashboardNav {
        "active": boolean;
        "class": string;
        "collapsed": boolean;
        "href": any;
    }
}
declare global {
    interface HTMLCollapsibleDashboardElement extends Components.CollapsibleDashboard, HTMLStencilElement {
    }
    var HTMLCollapsibleDashboardElement: {
        prototype: HTMLCollapsibleDashboardElement;
        new (): HTMLCollapsibleDashboardElement;
    };
    interface HTMLDashboardNavElement extends Components.DashboardNav, HTMLStencilElement {
    }
    var HTMLDashboardNavElement: {
        prototype: HTMLDashboardNavElement;
        new (): HTMLDashboardNavElement;
    };
    interface HTMLElementTagNameMap {
        "collapsible-dashboard": HTMLCollapsibleDashboardElement;
        "dashboard-nav": HTMLDashboardNavElement;
    }
}
declare namespace LocalJSX {
    interface CollapsibleDashboard {
        "collapse"?: boolean;
        "direction"?: 'rtl' | 'ltr';
        "mobileNavBgColor"?: string;
        "mobileNavColor"?: string;
        "onCollapseChange"?: (event: CustomEvent<boolean>) => void;
        "open"?: boolean;
        "sidePanelBgColor"?: string;
        "sidePanelColor"?: string;
    }
    interface DashboardNav {
        "active"?: boolean;
        "class"?: string;
        "collapsed"?: boolean;
        "href"?: any;
    }
    interface IntrinsicElements {
        "collapsible-dashboard": CollapsibleDashboard;
        "dashboard-nav": DashboardNav;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "collapsible-dashboard": LocalJSX.CollapsibleDashboard & JSXBase.HTMLAttributes<HTMLCollapsibleDashboardElement>;
            "dashboard-nav": LocalJSX.DashboardNav & JSXBase.HTMLAttributes<HTMLDashboardNavElement>;
        }
    }
}
