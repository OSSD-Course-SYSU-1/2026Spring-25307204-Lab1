if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    result?: string;
    expression?: string;
    onInputValue?;
}
/*
 * Copyright (c) 2023 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let storage = new LocalStorage();
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__result = new ObservedPropertySimplePU('', this, "result");
        this.__expression = new ObservedPropertySimplePU('', this, "expression");
        this.onInputValue = (value: string) => {
            if (value === 'C') {
                this.expression = '';
                this.result = '';
                return;
            }
            else if (value === '') {
                this.expression = this.expression.substring(0, this.expression.length - 1);
                this.result = this.result = calc(this.expression);
                if (!this.expression.length) {
                    this.result = '';
                }
            }
            else if (value === 'sqrt') {
                if (this.expression.length > 0) {
                    const num = Number.parseFloat(calc(this.expression));
                    if (num >= 0) {
                        const sqrtResult = Math.sqrt(num);
                        this.expression = sqrtResult.toFixed(10).replace(/\.?0+$/, '');
                        this.result = '';
                    }
                    else {
                        this.result = 'Error';
                    }
                }
            }
            else if (value === 'ln') {
                if (this.expression.length > 0) {
                    const num = Number.parseFloat(calc(this.expression));
                    if (num > 0) {
                        const lnResult = Math.log(num);
                        this.expression = lnResult.toFixed(10).replace(/\.?0+$/, '');
                        this.result = '';
                    }
                    else {
                        this.result = 'Error';
                    }
                }
            }
            else if (value === 'pi') {
                this.expression += Math.PI.toFixed(10).replace(/\.?0+$/, '');
                this.result = calc(this.expression);
            }
            else if (isOperator(value)) {
                let size = this.expression.length;
                if (size) {
                    const last = this.expression.charAt(size - 1);
                    if (isOperator(last)) {
                        this.expression = this.expression.substring(0, this.expression.length - 1);
                    }
                }
                if (!this.expression && (value === '*' || value === '/')) {
                    return;
                }
                this.expression += value;
            }
            else if (value === '=') {
                this.result = calc(this.expression);
                if (this.result !== '' && this.result !== undefined) {
                    this.expression = this.result;
                    this.result = '';
                }
            }
            else {
                this.expression += value;
                this.result = calc(this.expression);
            }
        };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.result !== undefined) {
            this.result = params.result;
        }
        if (params.expression !== undefined) {
            this.expression = params.expression;
        }
        if (params.onInputValue !== undefined) {
            this.onInputValue = params.onInputValue;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__result.purgeDependencyOnElmtId(rmElmtId);
        this.__expression.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__result.aboutToBeDeleted();
        this.__expression.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __result: ObservedPropertySimplePU<string>;
    get result() {
        return this.__result.get();
    }
    set result(newValue: string) {
        this.__result.set(newValue);
    }
    private __expression: ObservedPropertySimplePU<string>;
    get expression() {
        return this.__expression.get();
    }
    set expression(newValue: string) {
        this.__expression.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('18%');
            Column.justifyContent(FlexAlign.End);
            Column.padding({ bottom: 10 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.expression);
            Text.width('100%');
            Text.height(50);
            Text.fontSize(28);
            Text.fontColor('#333333');
            Text.textAlign(TextAlign.End);
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.padding({ right: 20 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.layoutWeight(1);
            Column.justifyContent(FlexAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(60);
            Row.justifyContent(FlexAlign.SpaceEvenly);
            Row.margin({ top: 8, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithChild({ type: ButtonType.Normal });
                    Button.width(60);
                    Button.height(60);
                    Button.borderRadius(12);
                    Button.backgroundColor(this.getButtonColor(index, 1));
                    Button.onClick(() => {
                        this.onInputValue(item.value);
                    });
                }, Button);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Image.create(item.image);
                    Image.width(40);
                    Image.height(40);
                    Image.objectFit(ImageFit.Contain);
                }, Image);
                Button.pop();
            };
            this.forEachUpdateFunction(elmtId, calcButton1(), forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(60);
            Row.justifyContent(FlexAlign.SpaceEvenly);
            Row.margin({ top: 8, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithChild({ type: ButtonType.Normal });
                    Button.width(60);
                    Button.height(60);
                    Button.borderRadius(12);
                    Button.backgroundColor(this.getButtonColor(index, 2));
                    Button.onClick(() => {
                        this.onInputValue(item.value);
                    });
                }, Button);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Image.create(item.image);
                    Image.width(40);
                    Image.height(40);
                    Image.objectFit(ImageFit.Contain);
                }, Image);
                Button.pop();
            };
            this.forEachUpdateFunction(elmtId, calcButton2(), forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(60);
            Row.justifyContent(FlexAlign.SpaceEvenly);
            Row.margin({ top: 8, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithChild({ type: ButtonType.Normal });
                    Button.width(60);
                    Button.height(60);
                    Button.borderRadius(12);
                    Button.backgroundColor(this.getButtonColor(index, 3));
                    Button.onClick(() => {
                        this.onInputValue(item.value);
                    });
                }, Button);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Image.create(item.image);
                    Image.width(40);
                    Image.height(40);
                    Image.objectFit(ImageFit.Contain);
                }, Image);
                Button.pop();
            };
            this.forEachUpdateFunction(elmtId, calcButton3(), forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(60);
            Row.justifyContent(FlexAlign.SpaceEvenly);
            Row.margin({ top: 8, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithChild({ type: ButtonType.Normal });
                    Button.width(60);
                    Button.height(60);
                    Button.borderRadius(12);
                    Button.backgroundColor(this.getButtonColor(index, 4));
                    Button.onClick(() => {
                        this.onInputValue(item.value);
                    });
                }, Button);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Image.create(item.image);
                    Image.width(40);
                    Image.height(40);
                    Image.objectFit(ImageFit.Contain);
                }, Image);
                Button.pop();
            };
            this.forEachUpdateFunction(elmtId, calcButton4(), forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 16, right: 16 });
            Row.margin({ top: 8, bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild({ type: ButtonType.Normal });
            Button.width('100%');
            Button.height(60);
            Button.borderRadius(12);
            Button.backgroundColor('#007DFF');
            Button.onClick(() => {
                this.onInputValue('=');
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777232, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" });
            Image.width(40);
            Image.height(40);
            Image.objectFit(ImageFit.Contain);
        }, Image);
        Button.pop();
        Row.pop();
        Column.pop();
        Column.pop();
    }
    getButtonColor(index: number, row: number): string {
        if (index === 0) {
            return '#FF9500';
        }
        if (row === 4) {
            return '#333333';
        }
        if (index < 4) {
            return '#505050';
        }
        return '#007DFF';
    }
    aboutToAppear() {
        console.error("ArkTSForm aboutToAppear");
    }
    aboutToDisappear() {
        console.error("ArkTSForm aboutToDisappear");
    }
    onPageShow() {
        console.error("ArkTSForm onPageShow");
    }
    onPageHide() {
        console.error("ArkTSForm onPageHide");
    }
    onBackPress() {
        console.error("ArkTSForm onBackPress");
    }
    private onInputValue;
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
interface ImageList {
    image: Resource;
    value: string;
}
function calcButton1(): Array<ImageList> {
    let list: Array<ImageList> = [
        { image: { "id": 16777246, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: 'sqrt' },
        { image: { "id": 16777229, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: 'C' },
        { image: { "id": 16777230, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '/' },
        { image: { "id": 16777237, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '*' },
        { image: { "id": 16777228, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '' },
    ];
    return list;
}
function calcButton2(): Array<ImageList> {
    let list: Array<ImageList> = [
        { image: { "id": 16777235, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: 'ln' },
        { image: { "id": 16777244, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '7' },
        { image: { "id": 16777231, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '8' },
        { image: { "id": 16777238, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '9' },
        { image: { "id": 16777236, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '-' },
    ];
    return list;
}
function calcButton3(): Array<ImageList> {
    let list: Array<ImageList> = [
        { image: { "id": 16777241, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: 'pi' },
        { image: { "id": 16777234, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '4' },
        { image: { "id": 16777233, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '5' },
        { image: { "id": 16777245, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '6' },
        { image: { "id": 16777242, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '+' },
    ];
    return list;
}
function calcButton4(): Array<ImageList> {
    let list: Array<ImageList> = [
        { image: { "id": 16777239, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '1' },
        { image: { "id": 16777248, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '2' },
        { image: { "id": 16777247, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '3' },
        { image: { "id": 16777249, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '0' },
        { image: { "id": 16777243, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '.' },
    ];
    return list;
}
export function calc(inputContent: string): string {
    const infixExpression: string[] = parseInfixExpression(inputContent);
    const suffixExpression: string[] = toSuffixExpression(infixExpression);
    return calcSuffixExpression(suffixExpression);
}
function parseInfixExpression(inputContent: string) {
    const size: number = inputContent.length;
    const lastIndex = size - 1;
    let singleChar = '';
    const expression: Array<string> = [];
    for (let index = 0; index < size; index++) {
        const element: string = inputContent[index];
        if (isGrouping(element)) {
            if (singleChar !== '') {
                expression.push(singleChar);
                singleChar = '';
            }
            expression.push(element);
        }
        else if (isOperator(element)) {
            if (isSymbol(element) && (index === 0 || inputContent[index - 1] === '(')) {
                singleChar += element;
            }
            else {
                if (singleChar !== '') {
                    expression.push(singleChar);
                    singleChar = '';
                }
                if (index !== lastIndex) {
                    expression.push(element);
                }
            }
        }
        else {
            singleChar += element;
        }
        if (index === lastIndex && singleChar !== '') {
            expression.push(singleChar);
        }
    }
    return expression;
}
function toSuffixExpression(expression: string[]) {
    const operatorStack: Array<string> = [];
    const suffixExpression: Array<string> = [];
    let topOperator: string;
    for (let index = 0, size: number = expression.length; index < size; ++index) {
        const element: string = expression[index];
        if (element === '(') {
            operatorStack.push(element);
            continue;
        }
        if (element === ')') {
            if (operatorStack.length) {
                let operator: string | undefined = operatorStack.pop();
                while (operator !== '(') {
                    suffixExpression.push(operator as string);
                    operator = operatorStack.pop();
                }
            }
            continue;
        }
        if (isOperator(element)) {
            if (!operatorStack.length) {
                operatorStack.push(element);
            }
            else {
                topOperator = operatorStack[operatorStack.length - 1];
                if (!isGrouping(topOperator) && !isPrioritized(element, topOperator)) {
                    while (operatorStack.length) {
                        suffixExpression.push(operatorStack.pop() as string);
                    }
                }
                operatorStack.push(element);
            }
            continue;
        }
        suffixExpression.push(element);
    }
    while (operatorStack.length) {
        suffixExpression.push(operatorStack.pop() as string);
    }
    return suffixExpression;
}
function calcSuffixExpression(expression: string[]) {
    const numberStack: Array<string> = [];
    while (expression.length) {
        let element: string | undefined = expression.shift();
        if (!isOperator(element as string)) {
            numberStack.push(element as string);
        }
        else {
            const firstStackElement: string | undefined = numberStack.pop();
            const secondStackElement: string | undefined = numberStack.pop();
            const result: string = OPERATORHANDLERS[element as string](secondStackElement, firstStackElement);
            if (result.length > 15) {
                numberStack.push((Number.parseFloat(result).toExponential()) as string);
            }
            else {
                numberStack.push(result);
            }
        }
    }
    return numberStack[0];
}
function isOperator(operator: string) {
    return (operator === '+' || operator === '-' || operator === '*' || operator === '/');
}
function isGrouping(operator: string) {
    return operator === '(' || operator === ')';
}
function isSymbol(symbol: string) {
    return symbol === '+' || symbol === '-';
}
function isPrioritized(firstOperator: string, secondOperator: string) {
    return OPERATORLEVELS[firstOperator] > OPERATORLEVELS[secondOperator];
}
const OPERATORLEVELS: Record<string, number> = {
    '+': 0,
    '-': 0,
    '*': 1,
    '/': 1,
};
const OPERATORHANDLERS: Record<string, Function> = {
    '+': (firstOperand: string, secondOperand: string) => (Number.parseFloat(firstOperand) + Number.parseFloat(secondOperand)).toFixed(getFloatNum(Number(firstOperand), Number(secondOperand), '+')),
    '-': (firstOperand: number, secondOperand: number) => (firstOperand - secondOperand).toFixed(getFloatNum(firstOperand, secondOperand, '-')),
    '*': (firstOperand: number, secondOperand: number) => (firstOperand * secondOperand).toFixed(getFloatNum(firstOperand, secondOperand, '*')),
    '/': (firstOperand: number, secondOperand: number) => (firstOperand / secondOperand).toFixed(getFloatNum(firstOperand, secondOperand, '/')),
};
function getFloatNum(firstOperand: number, secondOperand: number, oprate: string) {
    let result = 0;
    let oneString = (new String(firstOperand)).toString();
    let otherString = (new String(secondOperand)).toString();
    let firstNum = 0;
    if (oneString.indexOf('.') !== -1) {
        firstNum = oneString.split('.')[1].length;
    }
    let secondNum = 0;
    if (otherString.indexOf('.') !== -1) {
        secondNum = otherString.split('.')[1].length;
    }
    if (oprate === '+' || oprate === '-') {
        result = Math.max(firstNum, secondNum);
    }
    if (oprate === '*') {
        result = firstNum + secondNum;
    }
    if (oprate === '/') {
        result = (firstNum + otherString.length) > 3 ? (firstNum + otherString.length) : 3;
    }
    return result;
}
if (storage && storage.routeName != undefined && storage.storage != undefined) {
    registerNamedRoute(() => new Index(undefined, {}, storage.useSharedStorage ? LocalStorage.getShared() : storage.storage), storage.routeName, { bundleName: "com.samples.arktscalc", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
}
else if (storage && storage.routeName != undefined && storage.storage == undefined) {
    registerNamedRoute(() => new Index(undefined, {}, storage.useSharedStorage ? LocalStorage.getShared() : storage.storage), storage.routeName, { bundleName: "com.samples.arktscalc", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
}
else if (storage && storage.routeName == undefined && storage.storage != undefined) {
    registerNamedRoute(() => new Index(undefined, {}, storage.useSharedStorage ? LocalStorage.getShared() : storage.storage), "", { bundleName: "com.samples.arktscalc", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
}
else if (storage && storage.useSharedStorage != undefined) {
    registerNamedRoute(() => new Index(undefined, {}, storage.useSharedStorage ? LocalStorage.getShared() : undefined), "", { bundleName: "com.samples.arktscalc", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
}
else {
    registerNamedRoute(() => new Index(undefined, {}, storage), "", { bundleName: "com.samples.arktscalc", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
}
