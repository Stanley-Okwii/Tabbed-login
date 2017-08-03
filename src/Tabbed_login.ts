import * as dojoDeclare from "dojo/_base/declare";
import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import * as dojoHtml from "dojo/html";
import * as dom from "dojo/dom";
import * as dojoHas from "dojo/has";
import * as ContentPane from "dijit/layout/ContentPane";
//import * as dojoStyle from "dojo/dom-style";

import "./Tabbed_login.css";

class Tabbedlogin extends WidgetBase {

    // Parameters configured in modeler 
    PersonLogin: string;
    _UserName: string;
    _password: string;
    _password2: string;
    _Email: string;
    SignupMicroflow: string;
    ForgetPasswordMicroflow: string;

    // initializing parameters for Display category in the modeler
    userexample: string;
    passexample: string;
    showLabels: false;
    usernameLabel: string;
    emptytext: string;
    passwordLabel: string;
    logintext: string;
    tablabel1: string;
    tablabel2: string;
    tablabel3: string;

    // initializing parameters for Login Behaviour category in the modeler
    showprogress: false;
    clearPw: false;
    clearUn: false;
    dofocus: false;
    showLoginFailureWarning: false;
    loginFailureText: "Your account will be blocked for 5 minutes if login with the same username fails thrice!";
    autoComplete: false;
    // Mobile
    autoCorrect: false;
    autoCapitalize: false;
    private keyboardType: string;

    // Case Handling
    showTab: false;
    private convertCase: string;

    private contextObject: mendix.lib.MxObject;
    private indicator: number;
    private loginForm_FailedAttempts: number;
    private message: string;
    private LoginUserName: string;
    private LoginPassword: string;
    private PasswordShown: boolean;

    postCreate() {
        this.PasswordShown = false;
        this.loginForm_FailedAttempts = 0;
        this.message = "The username or password you entered is incorrect.";
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
            innerHTML: "<input id='tab1' type='radio' name='tabs' checked>" +
            "<label for='tab1'>Login</label>" +

            "<input id='tab2' type='radio' name='tabs'>" +
            "<label for='tab2'>Register</label>" +

            "<input id='tab3' type='radio' name='tabs'>" +
            "<label for='tab3' id='tablabel3'>Forgot password</label>" +

            "<section id='content1'>" +

            "<form target='_blank'><div>" +
            "<span><font size='3'>Have an account?</font></span><br/><hr style='border: 0px; height: 2px; background: #333; margin: 0px;margin-bottom: 10px; margin-top: 2px;'><div id='warningNode'></div><span id='userLabel'>User name</span><br/>" +
            "<input type = 'text' id = 'LogUserName'/><br/>" +
            "<span id='userPassword'>Password</span><br/>" +
            "<div style='display: inline-flex; width:100% '> <input type='password' id ='LogPassword' /> <img id= 'eye' style='color:black; padding: 5px 5px; margin: 8px 0' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAvVBMVEUAAAAAdOgAbfEAbvAAbe8Ab/EAbfAAbfAAbfAAbvEAbvAAbfAAcPUAbvAAbfAAbe8AbfAAbfAAbvAAa/IAbPIAbPAAbfAAbPAAbfAAbe8AbO8AbfEAa+0AbvAAbPAAbfAAbO8AAP8AbfAAbfAAbe8AVf8Abe8AbfAAbfAAbfAAbPAAbvAAgP8AbfAAbfEAZuYAbe8AbfAAbfAAbfAAb/EAbfEAauoAbfEAavEAbfAAbfAAbPAAbPEAbfAAAADVqeqmAAAAPXRSTlMACzZkkTWp3P4lqv0Zl/vE7vqHOTuG4Gj11U44KzPdv1ABiONiA7Tv7a8heQamsApw8OyWN6EMjyT28chcs98b0AAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfhBx8JNi1ohA/RAAAA+klEQVQ4y+VS11LDMBBcpSd2RImdAjhdxCU9AQJk//+3kC1sxhPPkGe4B2l0uzd7tyfg/4UolSuVckkUo9VavcEkGvVa9QJutgxqWYbTauZguy3Jm9u7+44QjivZJWXb/sF7fXLwgMcn8/SGo/GA7Pe+4cmUnM1VIvS88IMQnozUfEZOJ3FyuSLXG8Pdxvq7EO4e2KzJ1RJQ+j7o8uPLK2y8xYwADk8aOehKBX1GSR9S4f3jUzdLH8I6x7lI12aEsyXgGx/yhFTiRAeBIeQlsib3LsJdQZPZmJH0EAb+5ZipUePR0Cs2KrW6S+k6xVb/vqwr1n3Fh/nT8QWVEDP/c98IMQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0wNy0zMVQwOTo1NDo0NSswMjowMCs+z9cAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMDctMzFUMDk6NTQ6NDUrMDI6MDBaY3drAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg==' alt='showpassword' /></div>" +
            "<br/><input type='button' class='ButtonDiv' value='Log in' id='LoginID'/>" +
            "</div></form>" +

            "</section>" +

            "<section id='content2'>" +
            "<form target='_blank'>" +
            "<span><font size='3'>Register for this site</font></span><br/><hr style='border: 0px; height: 2px; background: #333; margin: 0px;margin-bottom: 10px; margin-top: 2px;'>" +
            "<span>Sign up for the good stuff now</span><br/>" +
            "<div id='warningNode2'></div></br><span>User name</span><br/>" +
            "<input type='text' placeholder ='user name'  id='Regusername'/><br/>" +
            "<span>Password</span><br/>" +
            "<input type='password' placeholder='Password'  id='Regpassword1'/><br/>" +
            "<span>Password again</span><br/>" +
            "<input type='password' placeholder='Password'  id='Regpassword2'/><br/>" +
            "<span>Email</span><br/>" +
            "<input type='email' placeholder ='example@gmail.com'  id='RegEmail'/><br/>" +
            "<input type='button' value ='sign up' id='signup'/>" +
            "</div></form>" +
            "</section>" +

            "<section id='content3'>" +
            "<form target='_blank' ><div>" +
            "<span><font size='3'>Lost your password</font></span><br/><hr style='border: 0px; height: 2px; background: #333; margin: 0px;margin-bottom: 10px; margin-top: 2px;'>" +
            "<div id='warningNode3'></div></br><span>Enter your user email to reset password</span><br/>" +
            "<span>Email</span><br/>" +
            "<input type='email' placeholder='example@gmail.com' id='forgetID'/><br/>" +
            "<input type='button' value='Reset' id='RememberPassword'/>" +
            "</div></form>" +
            "</section>"
        }, this.domNode);
        dom.byId("LogUserName").setAttribute("placeholder", this.userexample);
        dom.byId("LogPassword").setAttribute("placeholder", this.passexample);
        dom.byId("LoginID").setAttribute("value", this.logintext);

    }
    private updateRendering() {
        this.DisplayText();
        this.DisplayLabels();
        this.displayTab3();
        if (this.dofocus) {
            this.focusNode();
        }
        dom.byId("LoginID").addEventListener("click", () => {
            this.LoginMethod();
        }, false);
        dom.byId("signup").addEventListener("click", () => {
            this.SignUpMethod();
        }, false);
        dom.byId("RememberPassword").addEventListener("click", () => {
            this.RecoverPassword();
        }, false);

        let isUnMask = false;
        dom.byId("eye").addEventListener("click", () => {
            function ShowPassword1() {
                dom.byId("LogPassword").setAttribute("type", "text");
            }

            function HidePassword1() {
                dom.byId("LogPassword").setAttribute("type", "password");
            }

            if (isUnMask === false) {
                isUnMask = true;
                ShowPassword1();
            } else {
                isUnMask = false;
                HidePassword1();
            }
        }, false)

        this.setUsernameInputAttributes();
        if (this.autoComplete) {
            dom.byId("LogUserName").setAttribute("autocomplete", "on");
            dom.byId("forgetID").setAttribute("autocomplete", "on");
            dom.byId("RegEmail").setAttribute("autocomplete", "on");
            dom.byId("Regusername").setAttribute("autocomplete", "on");
        }
        this.addMobileOptions();
    }

    private DisplayLabels(): void {
        if (this.showLabels) {
            dom.byId("userLabel").innerHTML = this.usernameLabel;
            dom.byId("userPassword").innerHTML = this.passwordLabel;
            dom.byId("tab1").innerHTML = this.tablabel1;
            dom.byId("tab2").innerHTML = this.tablabel2;
            dom.byId("tab3").innerHTML = this.tablabel3;
        }
    }

    private displayTab3(): void {
        if (this.showTab) {
            dom.byId("tablabel3").setAttribute("style", "display: none");
        }
    }
    private addMobileOptions(): void {
        if (dojoHas("ios") || dojoHas("android") || dojoHas("bb")) {
            dom.byId("LogUserName").setAttribute("type", this.keyboardType);
        }
    }

    private ValidateEmail(mail: string): boolean {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return (true);
        } else {
            return (false);
        }
    }
    private SignUpMethod(): void {
        if (this.ValidateEmail(dom.byId("RegEmail").value)) {
            mx.data.create({
                callback: (obj: mendix.lib.MxObject) => {
                    obj.set(this._UserName, dom.byId("Regusername").value);
                    obj.set(this._Email, dom.byId("RegEmail").value);
                    obj.set(this._password, dom.byId("Regpassword1").value);
                    obj.set(this._password, dom.byId("Regpassword2").value);
                    this.contextObject = obj;
                    this.ExecuteMicroflowSignup(this.SignupMicroflow, this.contextObject.getGuid());
                    console.log("Object created on server");
                },
                entity: this.PersonLogin,
                error: (e) => {
                    console.error("Could not commit object:", e);
                }
            });
        } else {
            dom.byId("warningNode2").innerHTML = "<div style='color:red; display: block;'>" +
                "The Email address you entered is invalid.<br/></div>";
        }
    }
    private LoginMethod(): void {
        const UserNameN = dom.byId("LogUserName").value;
        const PasswordN = dom.byId("LogPassword").value;
        if (this.showprogress) {
            this.indicator = mx.ui.showProgress();
        }
        mx.login(UserNameN, PasswordN,
            () => {
                if (this.indicator) {
                    mx.ui.hideProgress(this.indicator);
                }
                console.log("successful login");
            },
            () => {

                if ((dom.byId("LogUserName").value !== "") || (dom.byId("LogPassword").value !== "")) {

                    if (this.showLoginFailureWarning) {
                        if (this.loginForm_FailedAttempts === 1) {
                            this.message += "</br>" + this.loginFailureText;
                        }
                        this.loginForm_FailedAttempts = this.loginForm_FailedAttempts + 1;
                    }
                    dom.byId("warningNode").innerHTML = "<div style='color:red; display: block;'>" +
                        this.message + "<br/></div>";

                    console.log("Error in login");
                } else {
                    dom.byId("warningNode").innerHTML = "<div style='color:red; display: block;'>" +
                        this.emptytext + "<br/></div>"; //display warning
                }
                if (this.clearPw) {
                    dom.byId("LogUserName").setAttribute("value", "");
                }
                if (this.clearUn) {
                    dom.byId("LogPassword").setAttribute("value", "");
                }
            });
    }
    private focusNode() {
        //Even with timeout set to 0, function code is made asynchronous
        setTimeout(() => {
            dom.byId("LogUserName").focus();
        }, 100);
    }
    private setUsernameInputAttributes(): void {
        if (this.autoCorrect) {
            dom.byId("LogUserName").setAttribute("autocorrect", "on");
            dom.byId("LogUserName").setAttribute("autocorrect", "on");

        }
        if (this.autoCapitalize && this.convertCase !== "none") {
            dom.byId("LogUserName").setAttribute("autocapitalize", "on");
        }
        if (this.autoComplete) {
            dom.byId("LogUserName").setAttribute("autocomplete", "on");
            dom.byId("LogPassword").setAttribute("autocomplete", "on");
        }
        if (this.convertCase !== "none") {
            dom.byId("LogUserName").setAttribute("autocapitalize", "on");
        }
        if (this.convertCase === "toLowerCase") {
            dom.byId("LogUserName").setAttribute("text-transform", "lowercase");
        } else if (this.convertCase === "toUpperCase") {
            dom.byId("LogUserName").setAttribute("text-transform", "uppercase");
        }
    }
    private RecoverPassword(): void {
        if (this.ValidateEmail(dom.byId("forgetID").value)) {
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
            dom.byId("warningNode3").innerHTML = "<div style='color:red; display: none;'>" +
                "<br/></div>";
        }
        else {
            dom.byId("warningNode3").innerHTML = "<div style='color:red; display: block;'>" +
                "The Email address you entered is invalid.<br/></div>";
        }
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
    private ExecuteMicroflowSignup(mf: string, guid: string, cb?: (obj: mendix.lib.MxObject) => void) {
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
                    if (objs) {
                        mx.login(dom.byId("Regusername").value, dom.byId("Regpassword1").value,
                            () => {
                                if (this.indicator) {
                                    mx.ui.hideProgress(this.indicator);
                                }
                                console.log("successful login");
                            },
                            () => {

                                if ((dom.byId("LogUserName").value !== "") || (dom.byId("LogPassword").value !== "")) {

                                    if (this.showLoginFailureWarning) {
                                        if (this.loginForm_FailedAttempts === 1) {
                                            this.message += "</br>" + this.loginFailureText;
                                        }
                                        this.loginForm_FailedAttempts = this.loginForm_FailedAttempts + 1;
                                    }
                                    dom.byId("warningNode").innerHTML = "<div style='color:red; display: block;'>" +
                                        this.message + "<br/></div>";

                                    console.log("Error in login");
                                } else {
                                    dom.byId("warningNode").innerHTML = "<div style='color:red; display: block;'>" +
                                        this.emptytext + "<br/></div>"; //display warning
                                }
                                if (this.clearPw) {
                                    dom.byId("LogUserName").setAttribute("value", "");
                                }
                                if (this.clearUn) {
                                    dom.byId("LogPassword").setAttribute("value", "");
                                }
                            });
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
