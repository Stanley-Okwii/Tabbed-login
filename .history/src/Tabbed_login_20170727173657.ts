import * as dojoDeclare from "dojo/_base/declare";
import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import * as domprop from "dojo/dom-prop";
import * as dojoStyle from "dojo/dom-style";
import * as dojoHtml from "dojo/html";
import * as dom from "dojo/dom";
import * as TabContainer from "dijit/layout/TabContainer";
import * as ContentPane from "dijit/layout/ContentPane";
import * as Registry from "dijit/registry";
import * as domAttr from "dojo/dom-attr";

import "./Tabbed_login.css";

class Tabbedlogin extends WidgetBase {

    // Parameters configured in modeler
    PersonData: string;
    _UserName: string;
    _password: string;
    _Email: string;
    MicroflowToRun: string;

    // Internal variables
    private contextObject: mendix.lib.MxObject;
    private Tabcontainer: any;
    private pane1: any;
    private pane2: any;
    private pane3: any;
    private LoginUserName: string;
    private LoginPassword: string;

    postCreate() {

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
            id: "parent_div",
            class: "Widget_div"
        }, this.domNode);
        this.Tabcontainer = new TabContainer({
            doLayout: false,
            style: "height: 100%; width: 100%; padding: 10px",
            id: "tab_container",
            class: "tab-container"
        }, dom.byId("parent_div"));

        this.pane1 = new ContentPane({
            class:"Pane-class",
            title: "Login",
            id: "logintab"
        });
        this.pane1.domNode.innerHTML = "<form target='_blank'><div>" +
            "<span>Enter user name</span><br/>" +
            "&nbsp <input type = 'text' placeholder = 'User Name' id = 'LogUserName'/><br/>" +
            "<span>Enter password</span><br/>" +
            "<input type='password' placeholder ='Password' id ='LogPassword' />" +
            "<br/><br/><input type='button' class='ButtonDiv' value='Log in' id='submitter'/>" +
            "</div></form>";
        this.Tabcontainer.addChild(this.pane1);
        this.pane2 = new ContentPane({
             class:"Pane-class",
            title: "Sign up"
        });
        this.pane2.domNode.innerHTML = "<form target='_blank'" +
            "<span>Preferred user name</span>" +
            "&nbsp<input type='text' placeholder ='user name'  id='Regusername'/><br/>" +
            "<span>Enter password</span><br/>" +
            "&nbsp <input type='password' placeholder='Password'  id='Regpassword1'/><br/>" +
            "<span>Enter password again</span>" +
            "&nbsp <input type='password' placeholder='Password'  id='Regpassword2'/><br/>" +
            "<span>Email</span><br/>" +
            "&nbsp <input type='email' placeholder ='e.g stanleeparker12@gmail.com'  id='RegEmail'/><br/>" +
            "<br/><br/><input type='button' value ='sign up' id='signup'/>" +
            "</div></form>";
        this.Tabcontainer.addChild(this.pane2);
        this.pane3 = new ContentPane({
             class:"Pane-class",
            title: "Forgot password"
        });
        this.pane3.domNode.innerHTML = "<form target='_blank' ><div>" +
            "<span>Email</span><br/>" +
            "&nbsp <input type='email' placeholder='e.g stanleeparker12@gmail.com'/><br/>" +
            "<br/><br/><input type='button' value='submit' id='RememberPassword'/>" +
            "</div></form>";
        this.Tabcontainer.addChild(this.pane3);
        this.Tabcontainer.startup();
    }

    private updateRendering() {
        this.DisplayText();
        dom.byId("submitter").addEventListener("click", () => {
            alert("This is working");
        }, false);
        dom.byId("signup").addEventListener("click", () => {
            //this.pane1.set("selected", true);
            //domprop.set(dom.byId("logintab"),"selected","true");
            this.createObject();
        }, false);
    }

    private LoginMethod(): void {
    }

    private createObject(): void {
        mx.data.create({
            callback: (obj: mendix.lib.MxObject) => {
                obj.set(this._UserName, dom.byId("Regusername").value);
                obj.set(this._Email, dom.byId("RegEmail").value);
                obj.set(this._password, dom.byId("Regpassword1").value);
                this.contextObject = obj;
                this.ExecuteMicroflow(this.MicroflowToRun, this.contextObject.getGuid());
                console.log("Object created on server");
            },
            entity: this.PersonData,
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

dojoDeclare("widget.Tabbed_login", [WidgetBase], function(Source: any) {
    const result: any = {};
    for (const i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;

}(Tabbedlogin));
