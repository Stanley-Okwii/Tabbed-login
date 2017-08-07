import * as dojoDeclare from "dojo/_base/declare";
import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import * as dom from "dojo/dom";
import * as dojoHas from "dojo/has";
import * as dojoEvent from "dojo/_base/event";
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
    emailexample: string;
    showLabels: false;
    EmailLabel: string;
    usernameLabel: string;
    emptytext: string;
    passwordLabel: string;
    logintext: string;
    Signuptext: string;
    ResetPasswordtext: string;
    LoginTab: string;
    SignupTab: string;
    ForgotTab: string;

    // initializing parameters for Login Behaviour category in the modeler
    showprogress: false;
    clearPw: false;
    clearUn: false;
    dofocus: false;
    showLoginFailureWarning: false;
    loginFailureText: string;
    autoComplete: false;
    // Mobile
    autoCorrect: false;
    autoCapitalize: false;
    private keyboardType: string;

    // Case Handling
    private showForgotTab: boolean;
    private showSignupTab: boolean;
    private convertCase: string;

    private contextObject: mendix.lib.MxObject;
    private indicator: number;
    private loginForm_FailedAttempts: number;
    private message: string;
    private LoginUserName: string;
    private LoginPassword: string;
    private isUnMask: boolean;

    private eye: string;
    private r: " <img id= 'eye' style='color:black; padding: 5px 5px; margin: 8px 0' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAvVBMVEUAAAAAdOgAbfEAbvAAbe8Ab/EAbfAAbfAAbfAAbvEAbvAAbfAAcPUAbvAAbfAAbe8AbfAAbfAAbvAAa/IAbPIAbPAAbfAAbPAAbfAAbe8AbO8AbfEAa+0AbvAAbPAAbfAAbO8AAP8AbfAAbfAAbe8AVf8Abe8AbfAAbfAAbfAAbPAAbvAAgP8AbfAAbfEAZuYAbe8AbfAAbfAAbfAAb/EAbfEAauoAbfEAavEAbfAAbfAAbPAAbPEAbfAAAADVqeqmAAAAPXRSTlMACzZkkTWp3P4lqv0Zl/vE7vqHOTuG4Gj11U44KzPdv1ABiONiA7Tv7a8heQamsApw8OyWN6EMjyT28chcs98b0AAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfhBx8JNi1ohA/RAAAA+klEQVQ4y+VS11LDMBBcpSd2RImdAjhdxCU9AQJk//+3kC1sxhPPkGe4B2l0uzd7tyfg/4UolSuVckkUo9VavcEkGvVa9QJutgxqWYbTauZguy3Jm9u7+44QjivZJWXb/sF7fXLwgMcn8/SGo/GA7Pe+4cmUnM1VIvS88IMQnozUfEZOJ3FyuSLXG8Pdxvq7EO4e2KzJ1RJQ+j7o8uPLK2y8xYwADk8aOehKBX1GSR9S4f3jUzdLH8I6x7lI12aEsyXgGx/yhFTiRAeBIeQlsib3LsJdQZPZmJH0EAb+5ZipUePR0Cs2KrW6S+k6xVb/vqwr1n3Fh/nT8QWVEDP/c98IMQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0wNy0zMVQwOTo1NDo0NSswMjowMCs+z9cAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMDctMzFUMDk6NTQ6NDUrMDI6MDBaY3drAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg==' alt='showpassword' />";

    postCreate() {
        this.isUnMask = false;
        this.loginForm_FailedAttempts = 0;
        // this.eye = "<img id= 'eye' style='color:black; padding: 5px 5px; margin: 8px 0' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAvVBMVEUAAAAAdOgAbfEAbvAAbe8Ab/EAbfAAbfAAbfAAbvEAbvAAbfAAcPUAbvAAbfAAbe8AbfAAbfAAbvAAa/IAbPIAbPAAbfAAbPAAbfAAbe8AbO8AbfEAa+0AbvAAbPAAbfAAbO8AAP8AbfAAbfAAbe8AVf8Abe8AbfAAbfAAbfAAbPAAbvAAgP8AbfAAbfEAZuYAbe8AbfAAbfAAbfAAb/EAbfEAauoAbfEAavEAbfAAbfAAbPAAbPEAbfAAAADVqeqmAAAAPXRSTlMACzZkkTWp3P4lqv0Zl/vE7vqHOTuG4Gj11U44KzPdv1ABiONiA7Tv7a8heQamsApw8OyWN6EMjyT28chcs98b0AAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfhBx8JNi1ohA/RAAAA+klEQVQ4y+VS11LDMBBcpSd2RImdAjhdxCU9AQJk//+3kC1sxhPPkGe4B2l0uzd7tyfg/4UolSuVckkUo9VavcEkGvVa9QJutgxqWYbTauZguy3Jm9u7+44QjivZJWXb/sF7fXLwgMcn8/SGo/GA7Pe+4cmUnM1VIvS88IMQnozUfEZOJ3FyuSLXG8Pdxvq7EO4e2KzJ1RJQ+j7o8uPLK2y8xYwADk8aOehKBX1GSR9S4f3jUzdLH8I6x7lI12aEsyXgGx/yhFTiRAeBIeQlsib3LsJdQZPZmJH0EAb+5ZipUePR0Cs2KrW6S+k6xVb/vqwr1n3Fh/nT8QWVEDP/c98IMQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0wNy0zMVQwOTo1NDo0NSswMjowMCs+z9cAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMDctMzFUMDk6NTQ6NDUrMDI6MDBaY3drAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg==' alt='showpassword' />";
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
            style: "height: 100%; width: 100%; border: 1px solid #DDDDDD; border-radius: 10px;",
            innerHTML: "<input id='tab1' type='radio' name='tabs' checked>" +
            "<label for='tab1' id='domtablabel1' style='font-size: 100%;' >Login</label>" +

            "<input id='tab2' type='radio' name='tabs'>" +
            "<label for='tab2' id='domtablabel2' style='font-size: 100%;'>Register</label>" +

            "<input id='tab3' type='radio' name='tabs'>" +
            "<label for='tab3' id='domtablabel3' style='font-size: 100%;'>Forgot password</label>" +

            "<section id='content1'>" +

            "<form target='_blank'><div>" +
            "<div id='warningNode'></div><span id='userLabel'>User name</span><br/>" +
            "<input type = 'text' id = 'LogUserName'/><br/>" +
            "<span id='userPassword'>Password</span><br/>" +
            "<div style='display: inline-flex; width:100% '> <input type='password' id ='LogPassword' />" +
            "<img id= 'eye' style='color:black; padding: 5px 5px; margin: 8px 0' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAvVBMVEUAAAAAdOgAbfEAbvAAbe8Ab/EAbfAAbfAAbfAAbvEAbvAAbfAAcPUAbvAAbfAAbe8AbfAAbfAAbvAAa/IAbPIAbPAAbfAAbPAAbfAAbe8AbO8AbfEAa+0AbvAAbPAAbfAAbO8AAP8AbfAAbfAAbe8AVf8Abe8AbfAAbfAAbfAAbPAAbvAAgP8AbfAAbfEAZuYAbe8AbfAAbfAAbfAAb/EAbfEAauoAbfEAavEAbfAAbfAAbPAAbPEAbfAAAADVqeqmAAAAPXRSTlMACzZkkTWp3P4lqv0Zl/vE7vqHOTuG4Gj11U44KzPdv1ABiONiA7Tv7a8heQamsApw8OyWN6EMjyT28chcs98b0AAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfhBx8JNi1ohA/RAAAA+klEQVQ4y+VS11LDMBBcpSd2RImdAjhdxCU9AQJk//+3kC1sxhPPkGe4B2l0uzd7tyfg/4UolSuVckkUo9VavcEkGvVa9QJutgxqWYbTauZguy3Jm9u7+44QjivZJWXb/sF7fXLwgMcn8/SGo/GA7Pe+4cmUnM1VIvS88IMQnozUfEZOJ3FyuSLXG8Pdxvq7EO4e2KzJ1RJQ+j7o8uPLK2y8xYwADk8aOehKBX1GSR9S4f3jUzdLH8I6x7lI12aEsyXgGx/yhFTiRAeBIeQlsib3LsJdQZPZmJH0EAb+5ZipUePR0Cs2KrW6S+k6xVb/vqwr1n3Fh/nT8QWVEDP/c98IMQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0wNy0zMVQwOTo1NDo0NSswMjowMCs+z9cAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMDctMzFUMDk6NTQ6NDUrMDI6MDBaY3drAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg==' alt='showpassword' />" +
            "</div>" +
            "<br/><input type='button' class='ButtonDiv' value='Log in' id='LoginID'/>" +
            "</div></form>" +

            "</section>" +

            "<section id='content2'>" +
            "<form target='_blank'>" +
            "<div id='warningNode2'></div><span id='userLabel1'>User name</span><br/>" +
            "<input type='text' placeholder ='user name'  id='Regusername'/><br/>" +
            "<span  id='userPassword1'>Password</span><br/>" +
            "<input type='password' placeholder='Password'  id='Regpassword1'/><br/>" +
            "<span id='userPassword2'>Password again</span><br/>" +
            "<input type='password' placeholder='Password'  id='Regpassword2'/><br/>" +
            "<span id='EmailLabel'>Email</span><br/>" +
            "<input type='email' placeholder ='example@gmail.com'  id='RegEmail'/><br/>" +
            "<input type='button' value ='sign up' id='signup'/>" +
            "</div></form>" +
            "</section>" +

            "<section id='content3'>" +
            "<form target='_blank' ><div>" +
            "<div id='warningNode3'></div>" +
            "<span id='EmailLabel1'>Email</span><br/>" +
            "<input type='email' placeholder='example@gmail.com' id='forgetID'/><br/>" +
            "<input type='button' value='Reset' id='RememberPassword'/>" +
            "</div></form>" +
            "</section>"
        }, this.domNode);
        dom.byId("LogUserName").setAttribute("placeholder", this.userexample);
        dom.byId("Regusername").setAttribute("placeholder", this.userexample);
        dom.byId("LogPassword").setAttribute("placeholder", this.passexample);
        dom.byId("Regpassword1").setAttribute("placeholder", this.passexample);
        dom.byId("Regpassword2").setAttribute("placeholder", this.passexample);
        dom.byId("forgetID").setAttribute("placeholder", this.emailexample);
        dom.byId("RegEmail").setAttribute("placeholder", this.emailexample);

        dom.byId("LoginID").setAttribute("value", this.logintext);
        dom.byId("signup").setAttribute("value", this.Signuptext);
        dom.byId("RememberPassword").setAttribute("value", this.ResetPasswordtext);
    }
    private updateRendering() {
        this.DisplayText();
        this.DisplayLabels();
        this.displayTabs();
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
        dom.byId("Regpassword2").addEventListener("blur", () => {
            this.validatePasswordFields();
        }, false);
        dom.byId("eye").addEventListener("click", () => {
            function ShowPassword1() {
                dom.byId("LogPassword").setAttribute("type", "text");
            }
            function HidePassword1(): void {
                dom.byId("LogPassword").setAttribute("type", "password");
            }git 

            if (this.isUnMask === false) {
                this.isUnMask = true;
                ShowPassword1();

            } else {
                this.isUnMask = false;
                HidePassword1();
            }
        }, false);

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
            dom.byId("EmailLabel").innerHTML = this.EmailLabel;
            dom.byId("EmailLabel1").innerHTML = this.EmailLabel;
            dom.byId("userPassword2").innerHTML = this.passwordLabel;
            dom.byId("userPassword1").innerHTML = this.passwordLabel;
            dom.byId("userLabel1").innerHTML = this.usernameLabel;
            dom.byId("tab1").innerHTML = this.LoginTab;
            dom.byId("tab2").innerHTML = this.SignupTab;
            dom.byId("tab3").innerHTML = this.ForgotTab;
            dom.byId("domtablabel1").innerHTML = this.LoginTab;
            dom.byId("domtablabel2").innerHTML = this.SignupTab;
            dom.byId("domtablabel3").innerHTML = this.ForgotTab;
        }
    }




    private displayTabs(): void {
        if (this.showForgotTab === false) {
            dom.byId("domtablabel2").setAttribute("style", "display: none");
        }
        if (this.showSignupTab === false) {
            dom.byId("domtablabel3").setAttribute("style", "display: none");
        }
    }
    private addMobileOptions(): void {
        if (dojoHas("ios") || dojoHas("android") || dojoHas("bb")) {
            dom.byId("LogUserName").setAttribute("type", this.keyboardType);
        }
    }

    private validateEmail(mail: string): boolean {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return (true);
        } else {
            return (false);
        }
    }
    private validatePasswordFields(): void {
        if (dom.byId("Regpassword1").value !== dom.byId("Regpassword2").value) {
            dom.byId("warningNode2").innerHTML = "<div style='color:red; display: block;'>" +
                "Passwords dont match. Please check and try again.<br/></div>"
        } else {
            dom.byId("warningNode2").innerHTML = "<div style='display: none;'>" +
                "<br/></div>"
        }
    }

    private SignUpMethod(): void {
        if (this.validateEmail(dom.byId("RegEmail").value)) {
            mx.data.create({
                callback: (obj: mendix.lib.MxObject) => {
                    obj.set(this._UserName, this.changeCase(dom.byId("Regusername").value));
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
        const UserNameN = this.changeCase(dom.byId("LogUserName").value);
        const PasswordN = dom.byId("LogPassword").value;
        if (this.showprogress) {
            this.indicator = mx.ui.showProgress();
        }
        setTimeout(() => {
            if (this.showprogress) {
                this.indicator = mx.ui.showProgress();
            }
        }, 5);
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
                        this.emptytext + "<br/></div>";
                }
                if (this.clearPw) {
                    dom.byId("LogUserName").setAttribute("value", "");
                }
                if (this.clearUn) {
                    dom.byId("LogPassword").setAttribute("value", "");
                }
            });

    }
    private focusNode(): void {
        setTimeout(() => {
            dom.byId("LogUserName").focus();
        }, 100);
    }
    private OpenCloseEye(): void {
        // if ()
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
            dom.byId("Regusername").setAttribute("autocapitalize", "on");
        }
        if (this.convertCase === "toLowerCase") {
            dom.byId("LogUserName").setAttribute("text-transform", "lowercase");
            dom.byId("Regusername").setAttribute("text-transform", "lowercase");
        } else if (this.convertCase === "toUpperCase") {
            dom.byId("LogUserName").setAttribute("text-transform", "uppercase");
            dom.byId("Regusername").setAttribute("text-transform", "uppercase");
        }
    }
    private RecoverPassword(): void {
        if (this.validateEmail(dom.byId("forgetID").value)) {
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
    private changeCase(username: string): string {
        if (this.convertCase === "toUpperCase") {
            return username.toUpperCase();
        }
        if (this.convertCase === "toLowerCase") {
            return username.toLowerCase();
        }
        return username;
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
                        mx.login(this.changeCase(dom.byId("Regusername").value), dom.byId("Regpassword1").value,
                            () => {
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
