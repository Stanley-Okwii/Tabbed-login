import * as dojoDeclare from "dojo/_base/declare";
import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import * as dom from "dojo/dom";
import * as dojoHas from "dojo/has";
import * as dojoEvent from "dojo/_base/event";

import "./Tabbed_login.css";

class TabbedloginNocontext extends WidgetBase {
    // initializing parameters for Display category in the modeler
    userexample: string;
    passexample: string;
    showLabels: false;
    usernameLabel: string;
    emptytext: string;
    passwordLabel: string;
    logintext: string;
    LoginTab: string;

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
            style: "height: 100%; width: 100%; border: 1px solid #DDDDDD; border-radius: 10px;",
            innerHTML: "<input id='tab1' type='radio' name='tabs' checked>" +
            "<label for='tab1' id='domtablabel1' >Login</label>" +

            "<section id='content1'>" +

            "<form target='_blank'><div>" +
            "<div id='warningNode'></div><span id='userLabel'>User name</span><br/>" +
            "<input type = 'text' id = 'LogUserName'/><br/>" +
            "<span id='userPassword'>Password</span><br/>" +
            "<div style='display: inline-flex; width:100% '> <input type='password' id ='LogPassword' /> <img id= 'eye' style='color:black; padding: 5px 5px; margin: 8px 0' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAvVBMVEUAAAAAdOgAbfEAbvAAbe8Ab/EAbfAAbfAAbfAAbvEAbvAAbfAAcPUAbvAAbfAAbe8AbfAAbfAAbvAAa/IAbPIAbPAAbfAAbPAAbfAAbe8AbO8AbfEAa+0AbvAAbPAAbfAAbO8AAP8AbfAAbfAAbe8AVf8Abe8AbfAAbfAAbfAAbPAAbvAAgP8AbfAAbfEAZuYAbe8AbfAAbfAAbfAAb/EAbfEAauoAbfEAavEAbfAAbfAAbPAAbPEAbfAAAADVqeqmAAAAPXRSTlMACzZkkTWp3P4lqv0Zl/vE7vqHOTuG4Gj11U44KzPdv1ABiONiA7Tv7a8heQamsApw8OyWN6EMjyT28chcs98b0AAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfhBx8JNi1ohA/RAAAA+klEQVQ4y+VS11LDMBBcpSd2RImdAjhdxCU9AQJk//+3kC1sxhPPkGe4B2l0uzd7tyfg/4UolSuVckkUo9VavcEkGvVa9QJutgxqWYbTauZguy3Jm9u7+44QjivZJWXb/sF7fXLwgMcn8/SGo/GA7Pe+4cmUnM1VIvS88IMQnozUfEZOJ3FyuSLXG8Pdxvq7EO4e2KzJ1RJQ+j7o8uPLK2y8xYwADk8aOehKBX1GSR9S4f3jUzdLH8I6x7lI12aEsyXgGx/yhFTiRAeBIeQlsib3LsJdQZPZmJH0EAb+5ZipUePR0Cs2KrW6S+k6xVb/vqwr1n3Fh/nT8QWVEDP/c98IMQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0wNy0zMVQwOTo1NDo0NSswMjowMCs+z9cAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMDctMzFUMDk6NTQ6NDUrMDI6MDBaY3drAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg==' alt='showpassword' /></div>" +
            "<br/><input type='button' class='ButtonDiv' value='Log in' id='LoginID'/>" +
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
        if (this.dofocus) {
            this.focusNode();
        }
        dom.byId("LoginID").addEventListener("click", () => {
            this.LoginMethod();
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
        }
        this.addMobileOptions();
    }

    private DisplayLabels(): void {
        if (this.showLabels) {
            dom.byId("userLabel").innerHTML = this.usernameLabel;
            dom.byId("userPassword").innerHTML = this.passwordLabel;
        }
    }

    private addMobileOptions(): void {
        if (dojoHas("ios") || dojoHas("android") || dojoHas("bb")) {
            dom.byId("LogUserName").setAttribute("type", this.keyboardType);
        }
    }

    private LoginMethod(): void {
        const UserNameN = dom.byId("LogUserName").value;
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
    private focusNode() {
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
}

dojoDeclare("widget.Tabbed_loginNoContext", [WidgetBase], function (Source: any) {
    const result: any = {};
    for (const i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;

}(TabbedloginNocontext));