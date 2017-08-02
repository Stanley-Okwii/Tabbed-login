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
    PersonLogin: string;
    Account: string;
    _UserName: string;
    _password: string;
    _password2: string;
    _Email: string;
    SignupMicroflow: string;
    ForgetPasswordMicroflow: string;

    // Internal variables
    private contextObject: mendix.lib.MxObject;
    private Tabcontainer: any;
    private pane1: any;
    private pane2: any;
    private pane3: any;
    private LoginUserName: string;
    private LoginPassword: string;
    private PasswordShown: boolean;

    postCreate() {
        this.PasswordShown = false;
        //this.DisplayText();
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
            style: "height: 100%; width: 100%; border: 1px solid #DDDDDD;",
            innerHTML: "<input id='tab1' type='radio' name='tabs' checked>"+
        "<label for='tab1'>Login</label>"+

        "<input id='tab2' type='radio' name='tabs'>"+
        "<label for='tab2'>Register</label>"+

        "<input id='tab3' type='radio' name='tabs'>"+
        "<label for='tab3'>Forgot password</label>"+

        "<section id='content1'>"+

            "<form target='_blank'><div>"+
            "<span><font size='3'>Have an account?</font></span><br/><hr style='border: 0px; height: 2px; background: #333; margin: 0px;margin-bottom: 10px; margin-top: 2px;'><div id='warningNode'></div><span>User name</span><br/>"+
            "<input type = 'text' placeholder = 'Usename' id = 'LogUserName'/><br/>"+
            "<span>Password</span><br/>"+
           "<div> <input type='password' placeholder ='Password' id ='LogPassword' /></div>"+
            "<br/><input type='button' class='ButtonDiv' value='Log in' id='LoginID'/>"+
            "</div></form>"+

        "</section>"+

        "<section id='content2'>"+
            "<form target='_blank'>"+
            "<span><font size='3'>Register for this site</font></span><br/><hr style='border: 0px; height: 2px; background: #333; margin: 0px;margin-bottom: 10px; margin-top: 2px;'>"+
            "<span>Sign up for the good stuff now</span><br/>"+
            "<span>User name</span><br/>"+
            "<input type='text' placeholder ='user name'  id='Regusername'/><br/>"+
            "<span>Password</span><br/>"+
            "<input type='password' placeholder='Password'  id='Regpassword1'/><br/>"+
            "<span>Password again</span><br/>"+
            "<input type='password' placeholder='Password'  id='Regpassword2'/><br/>"+
            "<span>Email</span><br/>"+
            "<input type='email' placeholder ='e.g stanleeparker12@gmail.com'  id='RegEmail'/><br/>"+
            "<input type='button' value ='sign up' id='signup'/>"+
            "</div></form>"+
        "</section>"+

        "<section id='content3'>"+
            "<form target='_blank' ><div>"+
            "<span><font size='3'>Lost your password</font></span><br/><hr style='border: 0px; height: 2px; background: #333; margin: 0px;margin-bottom: 10px; margin-top: 2px;'>"+
            "<span>Enter your user name or email to reset password</span><br/>"+
            "<span>Email</span><br/>"+
            "<input type='email' placeholder='e.g stanleeparker12@gmail.com' id='forgetID'/><br/>"+
            "<input type='button' value='submit' id='RememberPassword'/>"+
            "</div></form>"+
        "</section>"
        }, this.domNode);

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
        // dom.byId("eye").addEventListener("click", () => {
        //     function ShowPassword1() {
        //         dom.byId("LogPassword").setAttribute("type", "text");
        //     }

        //     function HidePassword1() {
        //         dom.byId("LogPassword").setAttribute("type", "password");
        //     }

        //     if (this.PasswordShown === false) {
        //         this.PasswordShown = true;
        //         ShowPassword1();
        //     } else {
        //         this.PasswordShown = false;
        //         HidePassword1();
        //     }

        // }, false);

        // dom.byId("eye2").addEventListener("click", () => {
        //     function ShowPassword() {
        //         dom.byId("Regpassword1").setAttribute("type", "text");
        //     }

        //     function HidePassword() {
        //         dom.byId("Regpassword1").setAttribute("type", "password");
        //     }

        //     if (this.PasswordShown === false) {
        //         this.PasswordShown = true;
        //         ShowPassword();
        //     } else {
        //         this.PasswordShown = false;
        //         HidePassword();
        //     }

        // }, false);
    }


    private SignUpMethod(): void {
        // username, password (enter twice), email.
        // use a non-persistent entity to create a mx object for signupuser.
        // then send this entity to a microflow.
        mx.data.create({
            callback: (obj: mendix.lib.MxObject) => {
                obj.set(this._UserName, dom.byId("Regusername").value);
                obj.set(this._Email, dom.byId("RegEmail").value);
                obj.set(this._password, dom.byId("Regpassword1").value);
                obj.set(this._password, dom.byId("Regpassword2").value);
                this.contextObject = obj;
                this.ExecuteMicroflow(this.SignupMicroflow, this.contextObject.getGuid());
                console.log("Object created on server");
            },
            entity: this.PersonLogin,
            error: (e) => {
                console.error("Could not commit object:", e);
            }
        });
    }
    private LoginMethod(): void {
        const UserNameN = dom.byId("LogUserName").value;
        const PasswordN = dom.byId("LogPassword").value;
        mx.login(UserNameN, PasswordN, () => { console.log("successful login"); },
            () => {
                dom.byId("warningNode").innerHTML = "<div style='color:red; display: block;'>" +
                    "The username or password you entered is incorrect.<br/></div>"; //display warning
                console.log("Error in login");
            });
    }

    private output() {
        mx.data.create({
            callback: (obj: mendix.lib.MxObject) => {
                obj.set(this._UserName, dom.byId("Regusername").value);
                obj.set(this._Email, dom.byId("RegEmail").value);
                obj.set(this._password, dom.byId("Regpassword1").value);
                this.contextObject = obj;
                this.ExecuteMicroflow(this.SignupMicroflow, this.contextObject.getGuid());
                console.log("Object created on server");
            },
            entity: this.PersonLogin,
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
            entity: this.PersonLogin,
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
