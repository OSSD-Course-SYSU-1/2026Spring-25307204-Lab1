if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CardCalc_Params {
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
class CardCalc extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__result = new ObservedPropertySimplePU('', this, "result");
        this.__expression = new ObservedPropertySimplePU('', this, "expression");
        this.onInputValue = (value: string) => {
            // When a user clicks the C button, the expression and operation result return to 0.
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
    setInitiallyProvidedValue(params: CardCalc_Params) {
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
    updateStateVars(params: CardCalc_Params) {
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
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.End });
            Stack.padding(1);
            Stack.width('100%');
            Stack.height('20%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.expression);
            Text.maxLines(1);
            Text.opacity(0.38);
            Text.textAlign(TextAlign.Start);
            Text.fontSize('30');
        }, Text);
        Text.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.height('16%');
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithChild({ type: ButtonType.Normal });
                    Button.width('25%');
                    Button.borderRadius(20);
                    Button.backgroundColor(index < 3 ? '#33007DFF' : '#F0F0F0');
                    Button.onClick(() => {
                        this.onInputValue(item.value);
                    });
                }, Button);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Image.create(item.image);
                    Image.height('100%');
                    Image.aspectRatio(1);
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
            Row.padding(1);
            Row.width('100%');
            Row.height('16%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithChild({ type: ButtonType.Normal });
                    Button.width('25%');
                    Button.height('100%');
                    Button.borderRadius(20);
                    Button.backgroundColor(index < 3 ? '#33007DFF' : '#F0F0F0');
                    Button.onClick(() => {
                        this.onInputValue(item.value);
                    });
                }, Button);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Image.create(item.image);
                    Image.height('100%');
                    Image.aspectRatio(item.value === '0' ? 2.5 : 1);
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
            Row.padding(1);
            Row.width('100%');
            Row.height('16%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithChild({ type: ButtonType.Normal });
                    Button.width('25%');
                    Button.height('100%');
                    Button.borderRadius(20);
                    Button.backgroundColor(index < 3 ? '#33007DFF' : '#F0F0F0');
                    Button.onClick(() => {
                        this.onInputValue(item.value);
                    });
                }, Button);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Image.create(item.image);
                    Image.height('100%');
                    Image.aspectRatio(item.value === '0' ? 2.5 : 1);
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
            Row.padding(1);
            Row.width('100%');
            Row.height('16%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithChild({ type: ButtonType.Normal });
                    Button.width('25%');
                    Button.height('100%');
                    Button.borderRadius(20);
                    Button.backgroundColor(index < 3 ? '#33007DFF' : '#F0F0F0');
                    Button.onClick(() => {
                        this.onInputValue(item.value);
                    });
                }, Button);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Image.create(item.image);
                    Image.height('100%');
                    Image.aspectRatio(1);
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
            Row.padding(1);
            Row.width('100%');
            Row.height('16%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithChild({ type: ButtonType.Normal });
                    Button.width('100%');
                    Button.height('100%');
                    Button.borderRadius(20);
                    Button.backgroundColor(index < 3 ? '#33007DFF' : '#F0F0F0');
                    Button.align(Alignment.Center);
                    Button.onClick(() => {
                        this.onInputValue(item.value);
                    });
                }, Button);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Image.create(item.image);
                    Image.height('100%');
                    Image.aspectRatio(1);
                    Image.objectFit(ImageFit.Contain);
                }, Image);
                Button.pop();
            };
            this.forEachUpdateFunction(elmtId, calcButton5(), forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        Column.pop();
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
        return "CardCalc";
    }
}
interface ImageList {
    image: Resource;
    value: string;
}
function calcButton1(): Array<ImageList> {
    let list: Array<ImageList> = [
        { image: { "id": 16777229, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: 'C' },
        { image: { "id": 16777230, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '/' },
        { image: { "id": 16777236, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '*' },
        { image: { "id": 16777228, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '' },
    ];
    return list;
}
function calcButton2(): Array<ImageList> {
    let list: Array<ImageList> = [
        { image: { "id": 16777242, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '7' },
        { image: { "id": 16777231, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '8' },
        { image: { "id": 16777237, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '9' },
        { image: { "id": 16777235, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '-' },
    ];
    return list;
}
function calcButton3(): Array<ImageList> {
    let list: Array<ImageList> = [
        { image: { "id": 16777234, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '4' },
        { image: { "id": 16777233, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '5' },
        { image: { "id": 16777243, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '6' },
        { image: { "id": 16777240, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '+' },
    ];
    return list;
}
function calcButton4(): Array<ImageList> {
    let list: Array<ImageList> = [
        { image: { "id": 16777238, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '1' },
        { image: { "id": 16777245, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '2' },
        { image: { "id": 16777244, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '3' },
        { image: { "id": 16777246, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '0' },
    ];
    return list;
}
function calcButton5(): Array<ImageList> {
    let list: Array<ImageList> = [
        { image: { "id": 16777232, "type": 20000, params: [], "bundleName": "com.samples.arktscalc", "moduleName": "entry" }, value: '=' }
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
    const operatorStack: string[] = [];
    const suffixExpression: string[] = [];
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
    const numberStack: string[] = [];
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
ViewStackProcessor.StartGetAccessRecordingFor(ViewStackProcessor.AllocateNewElmetIdForNextComponent());
loadEtsCard(new CardCalc(undefined, {}, storage), "com.samples.arktscalc/entry/ets/calc/pages/CardCalc");
ViewStackProcessor.StopGetAccessRecording();
