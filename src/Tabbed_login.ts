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
    PersonData: string;
    _FirstName: string;
    _LastName: string;
    _UserName: string;
    _password: string;
    _Email: string;
    _Mobile: string;
    MicroflowToRun: string;

    // Internal variables
    private contextObject: mendix.lib.MxObject;
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
            class: "city",
            id: "MyTabContainer"
        }, this.domNode);
        this.Tabcontainer = new TabContainer({
            style: "height: 250%; width: 100%;",
            class: "city",
            doLayout: false
        }, dom.byId("MyTabContainer"));

        this.pane1 = new ContentPane({
            title: "Login", class: "city"
        });
        this.pane1.domNode.innerHTML = "<form><div>" +
            "<span>Enter user name</span>" +
            "&nbsp <input type='text' placeholder='User Name'/><br/>" +
            "<span>Enter password</span>" +
            "&nbsp <input type='password' placeholder='Password'/>" +
            "<br/><br/><input type='button' value='Log in' id='submitter'/>" +
            "</div></form>";
        this.Tabcontainer.addChild(this.pane1);
        this.pane2 = new ContentPane({
            title: "Sign up"
        });
        this.pane2.domNode.innerHTML = "<form><div>" +
            "<span>Enter your first name</span>" +
            "&nbsp <input type='text' placeholder ='first name' id='Regfirstname'/><br/>" +
            "<span>Enter your last name</span>" +
            "&nbsp<input type='text' placeholder ='last name' id='Reglastname'/><br/>" +
            "<span>Preferred user name</span>" +
            "&nbsp<input type='text' placeholder ='user'  id='Regusername'/><br/>" +
            "<span>Enter password</span>" +
            "&nbsp <input type='password' placeholder='Password'  id='Regpassword1'/><br/>" +
            "<span>Enter password again</span>" +
            "&nbsp <input type='password' placeholder='Password'  id='Regpassword2'/><br/>" +
            "<span>Email</span>" +
            "&nbsp <input type='email' placeholder ='e.g stanleeparker12@gmail.com'  id='RegEmail'/><br/>" +
            "<span>Mobile number</span>" +
            "&nbsp <input type='text' placeholder ='e.g 0785041234'  id='RegMobile'/>" +
            "<br/><br/><input type='button' value ='sign up' id='signup'/>" +
            "</div></form>";
        this.Tabcontainer.addChild(this.pane2);
        this.pane3 = new ContentPane({
            title: "Forgot password"
        });
        this.pane3.domNode.innerHTML = "<form><div>" +
            "<span>Email</span>" +
            "&nbsp <input type='email' placeholder='e.g stanleeparker12@gmail.com'/><br/>" +
            "<br/><br/><input type='button' value='submit' id='RememberPassword'/>" +
            "</div></form>";
        this.Tabcontainer.addChild(this.pane3);
        this.Tabcontainer.startup();

    }

    private updateRendering() {
        dom.byId("submitter").addEventListener("click", () => {
            alert("This is working");
        }, false);
        dom.byId("signup").addEventListener("click", () => {
            this.createObject();
        }, false);
    }

    private createObject(): void {
        mx.data.create({
            callback: (obj: mendix.lib.MxObject) => {
                this.InputNode = dom.byId("Regfirstname");
                obj.set(this._FirstName, this.InputNode.value);
                obj.set(this._LastName, dom.byId("Reglastname").value);
                this.SaveObject(obj);
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
