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
    SignupMicroflow: string;
    LoginMicroflow: string;
    ForgetPasswordMicroflow: string;

    // Internal variables
    private contextObject: mendix.lib.MxObject;
    private Tabcontainer: any;
    private pane1: any;
    private pane2: any;
    private pane3: any;
    private LoginUserName: string;
    private LoginPassword: string;
    pwShown:number = 0;

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
            style: "height: 100%; width: 100%;"
        }, this.domNode);
        this.Tabcontainer = new TabContainer({
            doLayout: false,
            style: "height: 100%; width: 100%; padding: 10px",
            id: "tab_container"
        }, dom.byId("parent_div"));

        this.pane1 = new ContentPane({
            class: "Pane-class",
            title: "Login"
        });
        
        this.Tabcontainer.addChild(this.pane1);
        this.pane2 = new ContentPane({
            class: "Pane-class",
            title: "Sign up"
        });
        this.pane2.domNode.innerHTML = "<form target='_blank'" +
            "<span>User name</span><br/>" +
            "<input type='text' placeholder ='user name'  id='Regusername'/><br/>" +
            "<span>Password</span><br/>" +
            "<input type='password' placeholder='Password'  id='Regpassword1'/><img id= 'eye'src='data:image/png;base64,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' alt='showpassword' /><br/>" +
            "<span>Email</span><br/>" +
            "<input type='email' placeholder ='e.g stanleeparker12@gmail.com'  id='RegEmail'/><br/>" +
            "<br/><br/><input type='button' value ='sign up' id='signup'/>" +
            "</div></form>";

            this.pane2.domNode.innerHTML = "<form target='_blank'" +
            "<span>User name</span><br/>" +
            "<input type='text' placeholder ='user name'  id='Regusername'/><br/>" +
            "<span>Password</span><img id= 'eye'src='data:image/png;base64,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' alt='showpassword' /><br/>" +
            "<input type='password' placeholder='Password'  id='Regpassword1'/><br/>" +
            "<span>Email</span><br/>" +
            "<input type='email' placeholder ='e.g stanleeparker12@gmail.com'  id='RegEmail'/><br/>" +
            "<br/><br/><input type='button' value ='sign up' id='signup'/>" +
            "</div></form>";
        this.Tabcontainer.addChild(this.pane2);
        this.pane3 = new ContentPane({
            class: "Pane-class",
            title: "Forgot password"
        });
        this.pane3.domNode.innerHTML = "<form target='_blank' ><div>" +
            "<span>Email</span><br/>" +
            "<input type='email' placeholder='e.g stanleeparker12@gmail.com' id='forgetID'/><br/>" +
            "<br/><br/><input type='button' value='submit' id='RememberPassword'/>" +
            "</div></form>";
        this.Tabcontainer.addChild(this.pane3);
        this.Tabcontainer.startup();

        dom.byId("eye").addEventListener("click", () => {
            function show() {
                dom.byId('LogPassword').setAttribute('type', 'text');
            }

            function hide(){
                dom.byId('LogPassword').setAttribute('type', 'password');
            }

            this.pwShown;

            if (this.pwShown === 0) {
                this.pwShown = 1;
                show();
            } else {
                this.pwShown = 0;
                hide();
            }
    
        }, false);
    }

    private updateRendering() {
        this.DisplayText();
        dom.byId("LoginID").addEventListener("click", () => {
            this.LoginMethod();
        }, false);
        dom.byId("signup").addEventListener("click", () => {
            this.SignUpMethod();
        }, false);
        dom.byId("RememberPassword").addEventListener("click", () => {
            this.RecoverPassword();
        }, false);
    }


    private SignUpMethod(): void {
        mx.data.create({
            callback: (obj: mendix.lib.MxObject) => {
                obj.set(this._UserName, dom.byId("Regusername").value);
                obj.set(this._Email, dom.byId("RegEmail").value);
                obj.set(this._password, dom.byId("Regpassword1").value);
                this.contextObject = obj;
                this.ExecuteMicroflow(this.SignupMicroflow, this.contextObject.getGuid());
                console.log("Object created on server");
            },
            entity: this.PersonData,
            error: (e) => {
                console.error("Could not commit object:", e);
            }
        });
    }
    private LoginMethod(): void {
        mx.data.create({
            callback: (obj: mendix.lib.MxObject) => {
                obj.set(this._UserName, dom.byId("LogUserName").value);
                obj.set(this._password, dom.byId("LogPassword").value);
                this.ExecuteMicroflow(this.LoginMicroflow, obj.getGuid());
            },
            entity: this.PersonData,
            error: (e) => {
                console.error("Could not commit object:", e);
            }
        });
    }
    private RecoverPassword(): void {
        mx.data.create({
            callback: (obj: mendix.lib.MxObject) => {
                obj.set(this._Email, dom.byId("forgetID").value);
                this.ExecuteMicroflow(this.ForgetPasswordMicroflow, obj.getGuid());
            },
            entity: this.PersonData,
            error: (e) => {
                console.error("Could not commit object:", e);
            }
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

dojoDeclare("widget.Tabbed_login", [WidgetBase], function (Source: any) {
    const result: any = {};
    for (const i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;

}(Tabbedlogin));
