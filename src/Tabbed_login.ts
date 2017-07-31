import * as dojoDeclare from "dojo/_base/declare";
import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import * as dojoHtml from "dojo/html";
import * as dom from "dojo/dom";
import * as TabContainer from "dijit/layout/TabContainer";
import * as ContentPane from "dijit/layout/ContentPane";

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
        this.pane1.domNode.innerHTML = "<form target='_blank'><div>" +
            "<span>Have an account?</span><hr size='5' noshade />" +
            "<span>User name</span><br/>" +
            "<input type = 'text' placeholder = 'Usename' id = 'LogUserName'/><br/>" +
            "<span>Password</span><br/>" +
            "<input type='password' placeholder ='Password' id ='LogPassword' />" +
            "<br/><br/><input type='button' class='ButtonDiv' value='Log in' id='LoginID'/>" +
            "</div></form>";
        this.Tabcontainer.addChild(this.pane1);
        this.pane2 = new ContentPane({
            class: "Pane-class",
            title: "Sign up"
        });
        this.pane2.domNode.innerHTML = "<form target='_blank'" +
            "<span>Register for this site</span><br/>" +
            "<span>Sign up for the good stuff now</span><br/>" +
            "<span>User name</span><br/>" +
            "<input type='text' placeholder ='user name'  id='Regusername'/><br/>" +
            "<span>Password</span><br/>" +
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
            "<span>Lost your password</span><br/>" +
            "<span>Enter your user name or email to reset password</span><br/>" +
            "<span>Email</span><br/>" +
            "<input type='email' placeholder='e.g stanleeparker12@gmail.com' id='forgetID'/><br/>" +
            "<br/><br/><input type='button' value='Reset' id='RememberPassword'/>" +
            "</div></form>";
        this.Tabcontainer.addChild(this.pane3);
        this.Tabcontainer.startup();
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
                this.contextObject = obj;
                this.ExecuteMicroflow(this.LoginMicroflow, this.contextObject.getGuid());
            },
            entity: this.PersonData,
            error: (e) => {
                console.error("Could not commit object:", e);
            }
        });
    }

    private output() {
        mx.data.get({
            microflow: this.LoginMicroflow,
            callback: (objc: mendix.lib.MxContext) => {

            },
            error: (e) => {
                console.error("Could not get data from microflow:", e);
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
