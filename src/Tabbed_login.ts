import * as dojoDeclare from "dojo/_base/declare";
import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import * as dojoClass from "dojo/dom-class";
import * as dojoStyle from "dojo/dom-style";
import * as dojoHtml from "dojo/html";
import * as dom from "dojo/dom";

class Tabbed_login extends WidgetBase {

    // Parameters configured in modeler
    StudentData: string;
    nameProperty: string;
    MicroflowToRun: string;

    // Internal variables
    private contextObject: mendix.lib.MxObject;
    private ReverseText: string;
    private InputNode: any;

    postCreate() {
        this.DisplayText();
    }

    update(object: mendix.lib.MxObject, callback?: () => void) {
        this.contextObject = object;
        this.updateRendering();

        if (callback) {
            callback();
        }
    }

    private DisplayText() {
        domConstruct.create("div", {
            innerHTML: "<br/>"
        }, this.domNode);

        domConstruct.create("input", {
            placeholder: "Enter your Text!",
            type: "text",
            id: "myName"
        }, this.domNode).addEventListener("mouseleave", () => {
            if (this.MicroflowToRun !== "") {
                this.ExecuteMicroflow(this.MicroflowToRun, this.contextObject.getGuid());
            }
        });

        domConstruct.create("div", {
            innerHTML: "&nbsp<span></span>"
        }, this.domNode);

        domConstruct.create("input", {
            class: "ButtonDiv",
            type: "button",
            value: "Add"
        }, this.domNode).addEventListener("click", () => {
            this.createObject();
        }, false);
    }

    private updateRendering() {
        if (this.contextObject) {
            domConstruct.empty(this.domNode);
            this.ReverseText = this.contextObject.get(this.StudentData) as string;
            dojoHtml.set(this.domNode, this.ReverseName(this.ReverseText));
            this.DisplayText();
        } else {
        }
    }

    private createObject(): void {
        mx.data.create({
            callback: (obj: mendix.lib.MxObject) => {
                this.InputNode = dom.byId("myName");
                obj.set(this.StudentData, this.InputNode.value);
                this.SaveObject(obj);
                console.log("Object created on server");
            },
            entity: this.nameProperty,
            error: (e) => {
                console.error("Could not commit object:", e);
            }
        });
    }

    private SaveObject(contextObject: any, callback?: () => void) {
        mx.data.commit({
            callback: () => {
                console.log("Success");
            },
            mxobj: contextObject
        });
    }

    public ReverseName(TextToReverse: string): string {
        return TextToReverse.split("").reverse().join("");
    }

    private ExecuteMicroflow(mf: string, guid: string, cb?: (obj: mendix.lib.MxObject) => void) {
        if (mf && guid) {
            mx.ui.action(mf, {
                params: {
                    applyto: "selection",
                    guids: [ guid ]
                },
                callback: (objs: mendix.lib.MxObject) => {
                    if (cb && typeof cb === "function") {
                        cb(objs);
                    }
                },
                error: (error) => {
                    // console.debug(error.description);
                }
            }, this);
        }
    }
}

dojoDeclare("widget.Tabbed_login", [WidgetBase], function (Source: any) {
    const result: any = {};
    for (const i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
}(Tabbed_login));
