import * as dojoDeclare from "dojo/_base/declare";
import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import * as dom from "dojo/dom";
import * as dojoHas from "dojo/has";
import "./Tabbed_login.css";

class TabbedloginNocontext extends WidgetBase {
    // initializing parameters for Display category in the modeler
    userexample1: string;
    passexample1: string;
    showLabels1: false;
    usernameLabel1: string;
    emptytext1: string;
    passwordLabel1: string;
    logintext1: string;
    LoginTab1: string;

    // initializing parameters for Login Behaviour category in the modeler
    showprogress1: false;
    clearPw1: false;
    clearUn1: false;
    dofocus1: false;
    showLoginFailureWarning1: false;
    loginFailureText1: string;
    autoComplete1: false;
    // Mobile
    autoCorrect1: false;
    autoCapitalize1: false;
    keyboardType1: string;

    // Case Handling
    convertCase1: string;

    private contextObject: mendix.lib.MxObject;
    private indicator: number;
    private loginForm_FailedAttempts: number;
    private message: string;;

    postCreate() {
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
            innerHTML: "<input id='tab11' type='radio' name='tabs'>" +
            "<label for='tab11' id='domtablabel11' >Login</label>" +

            "<section id='content11'>" +

            "<form target='_blank'><div>" +
            "<div id='warningNode'></div><span id='userLabel1'>User name</span><br/>" +
            "<input type = 'text' id = 'LogUserName1'/><br/>" +
            "<span id='userPassword1'>Password</span><br/>" +
            "<div style='display: inline-flex; width:100% '> <input type='password' id ='LogPassword1' /> <img id= 'eye' style='color:black; padding: 5px 5px; margin: 8px 0' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAvVBMVEUAAAAAdOgAbfEAbvAAbe8Ab/EAbfAAbfAAbfAAbvEAbvAAbfAAcPUAbvAAbfAAbe8AbfAAbfAAbvAAa/IAbPIAbPAAbfAAbPAAbfAAbe8AbO8AbfEAa+0AbvAAbPAAbfAAbO8AAP8AbfAAbfAAbe8AVf8Abe8AbfAAbfAAbfAAbPAAbvAAgP8AbfAAbfEAZuYAbe8AbfAAbfAAbfAAb/EAbfEAauoAbfEAavEAbfAAbfAAbPAAbPEAbfAAAADVqeqmAAAAPXRSTlMACzZkkTWp3P4lqv0Zl/vE7vqHOTuG4Gj11U44KzPdv1ABiONiA7Tv7a8heQamsApw8OyWN6EMjyT28chcs98b0AAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfhBx8JNi1ohA/RAAAA+klEQVQ4y+VS11LDMBBcpSd2RImdAjhdxCU9AQJk//+3kC1sxhPPkGe4B2l0uzd7tyfg/4UolSuVckkUo9VavcEkGvVa9QJutgxqWYbTauZguy3Jm9u7+44QjivZJWXb/sF7fXLwgMcn8/SGo/GA7Pe+4cmUnM1VIvS88IMQnozUfEZOJ3FyuSLXG8Pdxvq7EO4e2KzJ1RJQ+j7o8uPLK2y8xYwADk8aOehKBX1GSR9S4f3jUzdLH8I6x7lI12aEsyXgGx/yhFTiRAeBIeQlsib3LsJdQZPZmJH0EAb+5ZipUePR0Cs2KrW6S+k6xVb/vqwr1n3Fh/nT8QWVEDP/c98IMQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0wNy0zMVQwOTo1NDo0NSswMjowMCs+z9cAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMDctMzFUMDk6NTQ6NDUrMDI6MDBaY3drAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg==' alt='showpassword' /></div>" +
            "<br/><input type='button' class='ButtonDiv' value='Log in' id='LoginID1'/>" +
            "</div></form>" +
            "</section>"
        }, this.domNode);
        dom.byId("LogUserName1").setAttribute("placeholder", this.userexample1);
        dom.byId("LogPassword1").setAttribute("placeholder", this.passexample1);
        dom.byId("LoginID1").setAttribute("value", this.logintext1);
    }
    private updateRendering() {
        this.DisplayText();
        this.DisplayLabels();
        if (this.dofocus1) {
            this.focusNode();
        }
        dom.byId("LoginID1").addEventListener("click", () => {
            this.LoginMethod();
        }, false);

        let isUnMask = false;
        dom.byId("eye").addEventListener("click", () => {
            function ShowPassword1() {
                dom.byId("LogPassword1").setAttribute("type", "text");
            }

            function HidePassword1() {
                dom.byId("LogPassword1").setAttribute("type", "password");
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
        if (this.autoComplete1) {
            dom.byId("LogUserName1").setAttribute("autocomplete", "on");
        }
        this.addMobileOptions();
    }

    private DisplayLabels(): void {
        if (this.showLabels1) {
            dom.byId("userLabel1").innerHTML = this.usernameLabel1;
            dom.byId("userPassword1").innerHTML = this.passwordLabel1;
            dom.byId("tab11").innerHTML = this.LoginTab1;
        }
    }

    private addMobileOptions(): void {
        if (dojoHas("ios") || dojoHas("android") || dojoHas("bb")) {
            dom.byId("LogUserName1").setAttribute("type", this.keyboardType1);
        }
    }

    private LoginMethod(): void {
        const UserNameN = this.changeCase(dom.byId("LogUserName1").value);
        const PasswordN = dom.byId("LogPassword1").value;
        if (this.showprogress1) {
            this.indicator = mx.ui.showProgress();
        }
        setTimeout(() => {
            if (this.showprogress1) {
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

                if ((dom.byId("LogUserName1").value !== "") || (dom.byId("LogPassword1").value !== "")) {

                    if (this.showLoginFailureWarning1) {
                        if (this.loginForm_FailedAttempts === 1) {
                            this.message += "</br>" + this.loginFailureText1;
                        }
                        this.loginForm_FailedAttempts = this.loginForm_FailedAttempts + 1;
                    }
                    dom.byId("warningNode").innerHTML = "<div style='color:red; display: block;'>" +
                        this.message + "<br/></div>";

                    console.log("Error in login");
                } else {
                    dom.byId("warningNode").innerHTML = "<div style='color:red; display: block;'>" +
                        this.emptytext1 + "<br/></div>";
                }
                if (this.clearPw1) {
                    dom.byId("LogUserName1").setAttribute("value", "");
                }
                if (this.clearUn1) {
                    dom.byId("LogPassword1").setAttribute("value", "");
                }
            });

    }
    private focusNode() {
        setTimeout(() => {
            dom.byId("LogUserName1").focus();
        }, 100);
    }
    private changeCase(username: string): string {
        if (this.convertCase1 === "toUpperCase") {
            return username.toUpperCase();
        }
        if (this.convertCase1 === "toLowerCase") {
            return username.toLowerCase();
        }
        return username;
    }
    private setUsernameInputAttributes(): void {
        if (this.autoCorrect1) {
            dom.byId("LogUserName1").setAttribute("autocorrect", "on");
            dom.byId("LogUserName1").setAttribute("autocorrect", "on");

        }
        if (this.autoCapitalize1 && this.convertCase1 !== "none") {
            dom.byId("LogUserName1").setAttribute("autocapitalize", "on");
        }
        if (this.autoComplete1) {
            dom.byId("LogUserName1").setAttribute("autocomplete", "on");
            dom.byId("LogPassword1").setAttribute("autocomplete", "on");
        }
        if (this.convertCase1 !== "none") {
            dom.byId("LogUserName1").setAttribute("autocapitalize", "on");
        }
        if (this.convertCase1 === "toLowerCase") {
            dom.byId("LogUserName1").setAttribute("text-transform", "lowercase");
        } else if (this.convertCase1 === "toUpperCase") {
            dom.byId("LogUserName1").setAttribute("text-transform", "uppercase");
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
