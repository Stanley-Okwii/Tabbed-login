import * as dojoDeclare from "dojo/_base/declare";
import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import * as dojoClass from "dojo/dom-class";
import * as dojoStyle from "dojo/dom-style";
import * as dojoHtml from "dojo/html";
import * as dom from "dojo/dom";
import * as TabContainer from "dijit/layout/TabContainer";
import * as ContentPane from "dijit/layout/ContentPane";
import * as Container from "dijit/_Container";
import * as Dbutton from "dijit/form/Button";

class Tabbedlogin extends WidgetBase {

    // Parameters configured in modeler
    StudentData: string;
    nameProperty: string;
    MicroflowToRun: string;

    // Internal variables
    private contextObject: mendix.lib.MxObject;
    private ReverseText: string;
    private InputNode: any;
    private Tabcontainer: any;
    private pane1: any;
    private pane2: any;
    private pane3: any;

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
            id: "addButton"
        }, this.domNode);
        this.Tabcontainer = new TabContainer({
            style: "height: 100%; width: 100%;"
        }, dom.byId("addButton"));

        this.pane1 = new ContentPane({
            title: "Login",
            content: "This will be our login"
        }
        );
        this.Tabcontainer.addChild(this.pane1);
        this.pane2 = new ContentPane({
            title: "Sign up",
            content: "This will be used for sign up"
        }
        );
        this.Tabcontainer.addChild(this.pane2);
        this.pane3 = new ContentPane({
            title: "Forget password",
            content: "This will be used for sending emails"
        }
        );
        this.Tabcontainer.addChild(this.pane3);
        this.Tabcontainer.startup();
    }

    private updateRendering() {
        
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
                    guids: [guid]
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

}(Tabbedlogin));
