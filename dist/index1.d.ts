import { WebTextMarkerOptions, SelectedMarkers, UserAgaent } from './interface';
/**
 * @class Marker
 * @param id: id, setuuid() 生成, 一个简单的按当前时间生成的字符串, 不需要太专业
 * @param parentClassName: 父节点className, 对应 selectedMarkers 中的 key,
 * @param childIndex: 在父节点中的索引
 * @param start: 标记开始位置
 * @param end: 标记结束位置
 */
export declare class Marker {
    id: string;
    childIndex: number;
    start: number;
    end: number;
    parentClassName?: string;
    constructor(id: string, parentClassName: string, childIndex: number, start: number, end: number);
}
/**
 * @class WebTextMarker
 * @param options.defaultMarkers: 初始标记数据
 * @param options.markedStyles: 标记文本样式
 * @param options.btnStyles: 操作框样式
 * @param options.focusMarkedStyles: 选中已标记文本样式
 * @param options.onSave: 标记后回调, 必填
 */
declare class WebTextMarker {
    MARKED_CLASSNAME: string;
    TEMP_MARKED_CLASSNAME: string;
    FOUCE_MARKED_CLASSNAME: string;
    options: WebTextMarkerOptions;
    btnWrapper: HTMLElement | null;
    selectedMarkers: SelectedMarkers;
    selectedText: any;
    tempMarkDom: HTMLElement | null;
    hasTempDom: boolean;
    tempMarkerInfo: Marker;
    currentId: string | null;
    isMarked: boolean;
    pageY: number;
    touch: any;
    userAgent: UserAgaent;
    arrow: HTMLElement;
    constructor(options: WebTextMarkerOptions);
    private init;
    private handleSelectionChange;
    private handleMouseDown;
    private handleMouseUp;
    private hide;
    private show;
    private resetMarker;
    private setDefaultMarkers;
    private checkSelectionCount;
    private checkNoSelectionText;
    private removeFocusStyle;
    mark(): void;
    del(): void;
    getCurrentId(): string;
    getAllMarkes(): SelectedMarkers;
}
export default WebTextMarker;
