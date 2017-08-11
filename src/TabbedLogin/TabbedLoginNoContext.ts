import * as dojoDeclare from "dojo/_base/declare";
import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import * as dom from "dojo/dom";
import * as dojoHas from "dojo/has";
import "../ui/TabbedLogin.css";

class TabbedLoginNoContext extends WidgetBase {
    // initializing parameters for Display category in the modeler
    userExample1: string;
    passExample1: string;
    showLabels1: false;
    userNameLabel1: string;
    emptyText1: string;
    passwordLabel1: string;
    loginText1: string;
    loginTab1: string;

    // initializing parameters for Login Behaviour category in the modeler
    showProgress1: false;
    clearPassword1: false;
    clearUserName1: false;
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
    private message: string;

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

    private displayText() {
        const temp = require("../Template/TabbedLoginNoContext.html");
        domConstruct.place(domConstruct.toDom(temp), this.domNode);
        dom.byId("LogUserName1").setAttribute("placeholder", this.userExample1);
        dom.byId("LogPassword1").setAttribute("placeholder", this.passExample1);
        dom.byId("LoginID1").setAttribute("value", this.loginText1);
    }

    private updateRendering() {
        this.displayText();
        this.displayLabels();
        if (this.dofocus1) {
            this.focusNode();
        }
        dom.byId("LoginID1").addEventListener("click", () => {
            this.loginMethod();
        }, false);

        let isUnMask = false;
        dom.byId("eyeIdNoContext").addEventListener("click", () => {
            function ShowPassword1() {
                dom.byId("LogPassword1").setAttribute("type", "text");
                dom.byId("eyeIdNoContext").innerHTML = "Hide";
            }
            function HidePassword1() {
                dom.byId("LogPassword1").setAttribute("type", "password");
                dom.byId("eyeIdNoContext").innerHTML = "Show";
            }

            if (isUnMask === false) {
                isUnMask = true;
                ShowPassword1();
            } else {
                isUnMask = false;
                HidePassword1();
            }
        }, false);

        this.setUsernameInputAttributes();
        if (this.autoComplete1) {
            dom.byId("LogUserName1").setAttribute("autocomplete", "on");
        }
        this.addMobileOptions();
    }

    private displayLabels() {
        if (this.showLabels1) {
            dom.byId("userLabel1").innerHTML = this.userNameLabel1;
            dom.byId("userPassword1").innerHTML = this.passwordLabel1;
            dom.byId("tab11").innerHTML = this.loginTab1;
        }
    }

    private addMobileOptions() {
        if (dojoHas("ios") || dojoHas("android") || dojoHas("bb")) {
            dom.byId("LogUserName1").setAttribute("type", this.keyboardType1);
        }
    }

    private displayWarning1(WarningText: string) {
        const WarningTextSample = "<div style='color:red; display: block;'>" +
            WarningText +
            "<br/></div>";
        return WarningTextSample;
    }

    private loginMethod() {
        const UserNameN = this.changeCase(dom.byId("LogUserName1").value);
        const PasswordN = dom.byId("LogPassword1").value;
        if (this.showProgress1) {
            this.indicator = mx.ui.showProgress();
        }
        setTimeout(() => {
            if (this.showProgress1) {
                this.indicator = mx.ui.showProgress();
            }
        }, 5);
        mx.login(UserNameN, PasswordN,
            () => {
                if (this.indicator) {
                    mx.ui.hideProgress(this.indicator);
                }
            },
            () => {
                if ((UserNameN !== "") || (PasswordN !== "")) {
                    if (this.showLoginFailureWarning1) {
                        if (this.loginForm_FailedAttempts === 1) {
                            this.message += "</br>" + this.loginFailureText1;
                        }
                        this.loginForm_FailedAttempts = this.loginForm_FailedAttempts + 1;
                    }
                    dom.byId("warningNode1").innerHTML = this.displayWarning1(this.message);
                } else {
                    dom.byId("warningNode1").innerHTML = this.displayWarning1( this.emptyText1);
                }
                if (this.clearPassword1) {
                    dom.byId("LogUserName1").setAttribute("value", "");
                }
                if (this.clearUserName1) {
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

    private setUsernameInputAttributes() {
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

// tslint:disable-next-line:only-arrow-functions
dojoDeclare("widget.TabbedLoginNoContext", [ WidgetBase ], function(Source: any) {
    const result: any = {};
    for (const i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
}(TabbedLoginNoContext));
