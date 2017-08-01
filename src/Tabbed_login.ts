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
    private PasswordShown: boolean;

    postCreate() {
        this.PasswordShown = false;
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
            id: "LoginTabID",
            title: "Login"
        });
        this.pane1.domNode.innerHTML = "<form target='_blank'><div>" +
            "<span><font size='3'>Have an account?</font></span><br/><hr style='border: 0px; height: 2px; background: #333; margin: 0px;margin-bottom: 10px; margin-top: 2px;'><div id='warningNode'>dispaly</div>"+"<span>User name</span><br/>" +
            "<input type = 'text' placeholder = 'Usename' id = 'LogUserName'/><br/>" +
            "<span>Password</span><br/>" +
            "<input type='password' placeholder ='Password' id ='LogPassword' /><img id= 'eye2' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAvVBMVEUAAAAAdOgAbfEAbvAAbe8Ab/EAbfAAbfAAbfAAbvEAbvAAbfAAcPUAbvAAbfAAbe8AbfAAbfAAbvAAa/IAbPIAbPAAbfAAbPAAbfAAbe8AbO8AbfEAa+0AbvAAbPAAbfAAbO8AAP8AbfAAbfAAbe8AVf8Abe8AbfAAbfAAbfAAbPAAbvAAgP8AbfAAbfEAZuYAbe8AbfAAbfAAbfAAb/EAbfEAauoAbfEAavEAbfAAbfAAbPAAbPEAbfAAAADVqeqmAAAAPXRSTlMACzZkkTWp3P4lqv0Zl/vE7vqHOTuG4Gj11U44KzPdv1ABiONiA7Tv7a8heQamsApw8OyWN6EMjyT28chcs98b0AAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfhBx8JNi1ohA/RAAAA+klEQVQ4y+VS11LDMBBcpSd2RImdAjhdxCU9AQJk//+3kC1sxhPPkGe4B2l0uzd7tyfg/4UolSuVckkUo9VavcEkGvVa9QJutgxqWYbTauZguy3Jm9u7+44QjivZJWXb/sF7fXLwgMcn8/SGo/GA7Pe+4cmUnM1VIvS88IMQnozUfEZOJ3FyuSLXG8Pdxvq7EO4e2KzJ1RJQ+j7o8uPLK2y8xYwADk8aOehKBX1GSR9S4f3jUzdLH8I6x7lI12aEsyXgGx/yhFTiRAeBIeQlsib3LsJdQZPZmJH0EAb+5ZipUePR0Cs2KrW6S+k6xVb/vqwr1n3Fh/nT8QWVEDP/c98IMQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0wNy0zMVQwOTo1NDo0NSswMjowMCs+z9cAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMDctMzFUMDk6NTQ6NDUrMDI6MDBaY3drAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg==' alt='showpassword' />" +
            "<br/><input type='button' class='ButtonDiv' value='Log in' id='LoginID'/>" +
            "</div></form>";

        this.Tabcontainer.addChild(this.pane1);
        this.pane2 = new ContentPane({
            class: "Pane-class",
            title: "Sign up"
        });
        this.pane2.domNode.innerHTML = "<form target='_blank'" +
            "<span><font size='3'>Register for this site</font></span><br/><hr style='border: 0px; height: 2px; background: #333; margin: 0px;margin-bottom: 10px; margin-top: 2px;'>" +
            "<span>Sign up for the good stuff now</span><br/>" +
            "<span>User name</span><br/>" +
            "<input type='text' placeholder ='user name'  id='Regusername'/><br/>" +
            "<span>Password</span><br/>" +
            "<input type='password' placeholder='Password'  id='Regpassword1'/><img id= 'eye' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAvVBMVEUAAAAAdOgAbfEAbvAAbe8Ab/EAbfAAbfAAbfAAbvEAbvAAbfAAcPUAbvAAbfAAbe8AbfAAbfAAbvAAa/IAbPIAbPAAbfAAbPAAbfAAbe8AbO8AbfEAa+0AbvAAbPAAbfAAbO8AAP8AbfAAbfAAbe8AVf8Abe8AbfAAbfAAbfAAbPAAbvAAgP8AbfAAbfEAZuYAbe8AbfAAbfAAbfAAb/EAbfEAauoAbfEAavEAbfAAbfAAbPAAbPEAbfAAAADVqeqmAAAAPXRSTlMACzZkkTWp3P4lqv0Zl/vE7vqHOTuG4Gj11U44KzPdv1ABiONiA7Tv7a8heQamsApw8OyWN6EMjyT28chcs98b0AAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfhBx8JNi1ohA/RAAAA+klEQVQ4y+VS11LDMBBcpSd2RImdAjhdxCU9AQJk//+3kC1sxhPPkGe4B2l0uzd7tyfg/4UolSuVckkUo9VavcEkGvVa9QJutgxqWYbTauZguy3Jm9u7+44QjivZJWXb/sF7fXLwgMcn8/SGo/GA7Pe+4cmUnM1VIvS88IMQnozUfEZOJ3FyuSLXG8Pdxvq7EO4e2KzJ1RJQ+j7o8uPLK2y8xYwADk8aOehKBX1GSR9S4f3jUzdLH8I6x7lI12aEsyXgGx/yhFTiRAeBIeQlsib3LsJdQZPZmJH0EAb+5ZipUePR0Cs2KrW6S+k6xVb/vqwr1n3Fh/nT8QWVEDP/c98IMQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0wNy0zMVQwOTo1NDo0NSswMjowMCs+z9cAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMDctMzFUMDk6NTQ6NDUrMDI6MDBaY3drAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg==' alt='showpassword' /><br/>" +
            "<span>Email</span><br/>" +
            "<input type='email' placeholder ='e.g stanleeparker12@gmail.com'  id='RegEmail'/><br/>" +
            "<input type='button' value ='sign up' id='signup'/>" +
            "</div></form>";

        this.Tabcontainer.addChild(this.pane2);
        this.pane3 = new ContentPane({
            class: "Pane-class",
            selected: true,
            title: "Forgot password"
        });
        this.pane3.domNode.innerHTML = "<form target='_blank' ><div>" +
            "<span><font size='3'>Lost your password</font></span><br/><hr style='border: 0px; height: 2px; background: #333; margin: 0px;margin-bottom: 10px; margin-top: 2px;'>" +
            "<span>Enter your user name or email to reset password</span><br/>" +
            "<span>Email</span><br/>" +
            "<input type='email' placeholder='e.g stanleeparker12@gmail.com' id='forgetID'/><br/>" +
            "<input type='button' value='submit' id='RememberPassword'/>" +
            "</div></form>";
        this.Tabcontainer.addChild(this.pane3);
        this.Tabcontainer.startup();

        dom.byId("eye").addEventListener("click", () => {
            function ShowPassword() {
                dom.byId("LogPassword").setAttribute("type", "text");
            }

            function HidePassword() {
                dom.byId("LogPassword").setAttribute("type", "password");
            }

            if (this.PasswordShown === false) {
                this.PasswordShown = true;
                ShowPassword();
            } else {
                this.PasswordShown = false;
                HidePassword();
            }

        }, false);

        dom.byId("eye2").addEventListener("click", () => {
            function ShowPassword() {
                dom.byId("Regpassword1").setAttribute("type", "text");
            }

            function HidePassword() {
                dom.byId("Regpassword1").setAttribute("type", "password");
            }

            if (this.PasswordShown === false) {
                this.PasswordShown = true;
                ShowPassword();
            } else {
                this.PasswordShown = false;
                HidePassword();
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
            function SwitchTab() {
                dom.byId("LoginTabID").setAttribute("selected", true);
            }
            SwitchTab();
        }, false);
        dom.byId("RememberPassword").addEventListener("click", () => {
            this.RecoverPassword();
        }, false);
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
        const UserNameN = dom.byId("LogUserName").value;
        const PasswordN = dom.byId("LogPassword").value;
        mx.login(UserNameN, PasswordN, () => { console.log("successful login"); },
         () => {
             dom.byId("warningNode").innerHTML= "<div style='color:red; display: block;'>The username or password you entered is incorrect.<br/></div>"; //display warning
             console.log("Error in login"); });
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
