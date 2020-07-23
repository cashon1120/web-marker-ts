export interface IMarker {
    id: string;
    childIndex: number;
    start: number;
    end: number;
    parentClassName?: string;
}
export interface Styles {
    [key: string]: any;
}
export interface WebMarkerOptions {
    defaultMarkers: SelectedMarkers;
    markedClassName: string;
    selectedClassName: string;
    focusMarkedClassName: string;
    btnMarkID?: string;
    btnDeleteID?: string;
    btnWrapperID?: string;
    btnArrowID?: string;
    disabledEle?: string[];
}
export interface SelectedMarkers {
    [key: string]: any;
}
export interface EventName {
    mousedown: 'mousedown' | 'touchstart';
    mouseup: 'mouseup' | 'touchend';
    mousemove: 'mousemove' | 'touchmove';
}
export interface UserAgaent {
    isAndroid: boolean;
    isiOS: boolean;
    isPC: boolean;
    eventName: EventName;
}
export interface IWebMarker {
    getSelectedText: () => string;
    getCurrentId: () => string;
    mark: () => void;
    getAllMarkes: () => SelectedMarkers;
    del: () => void;
    userAgent: UserAgaent;
}
