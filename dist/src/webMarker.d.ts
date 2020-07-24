import { WebMarkerOptions, SelectedMarkers, UserAgaent, IMarker, IWebMarker } from './interface';
/**
 * @class Marker, 单个标记 信息
 * @param id: id, setuuid() 生成, 一个简单的按当前时间生成的字符串, 不需要太专业
 * @param parentClassName: 父节点className, 对应 selectedMarkers 中的 key,
 * @param childIndex: 在父节点中的索引
 * @param start: 标记开始位置
 * @param end: 标记结束位置
 */
declare class Marker implements IMarker {
    id: string;
    childIndex: number;
    start: number;
    end: number;
    parentClassName?: string;
    constructor(id: string, parentClassName: string, childIndex: number, start: number, end: number);
}
/**
 * @class WebMarker
 * @param options.defaultMarkers: 初始标记数据
 * @param options.markedClassName: 标记 className
 * @param options.focusMarkedClassName: 选中已经标记 className
 * @param options.selectedClassName: 选中后 className
 * @param options.btnWrapperID: 弹框 ID
 * @param options.btnMarkID: 标记按钮 ID, 主要用于隐藏和显示, 删除按钮一样
 * @param options.btnDeleteID: 删除按钮 ID
 */
declare class WebMarker implements IWebMarker {
    MARKED_CLASSNAME: string;
    TEMP_MARKED_CLASSNAME: string;
    FOUCE_MARKED_CLASSNAME: string;
    options: WebMarkerOptions;
    userAgent: UserAgaent;
    arrow: HTMLElement;
    btnWrapper: HTMLElement | null;
    selectedMarkers: SelectedMarkers;
    tempMarkerInfo: Marker;
    tempMarkDom: HTMLElement | null;
    selectedText: any;
    hasTempDom: boolean;
    currentId: string | null;
    isMarked: boolean;
    pageY: number;
    touch: any;
    constructor(options: WebMarkerOptions);
    private init;
    private handleSelectionChange;
    private handleMouseDown;
    private handleMouseUp;
    private hide;
    private show;
    private resetMarker;
    private setDefaultMarkers;
    /**
     * 划重点, 这里是判断当前选中的内容节点数量, 本来超过一个节点就不处理, 如果要实现选中多个;
     * 那就在这里作文章,
     */
    private checkSelectionCount;
    private checkNoSelectionText;
    private removeFocusStyle;
    mark(): void;
    del(): void;
    getCurrentId(): string;
    getAllMarkes(): SelectedMarkers;
    getSelectedText(): any;
}
export default WebMarker;
