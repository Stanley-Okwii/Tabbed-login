import * as dojoDeclare from "dojo/_base/declare";
import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import * as dom from "dojo/dom";
import * as dojoHas from "dojo/has";
import * as dojoEvent from "dojo/_base/event";
import "../ui/TabbedLogin.css";

class TabbedLogin extends WidgetBase {
    // Parameters configured in modeler
    personLogin: string;
    userName: string;
    password: string;
    email: string;
    signupMicroflow: string;
    forgetPasswordMicroflow: string;

    // initializing parameters for Display category in the modeler
    userExample: string;
    passwordExample: string;
    emailExample: string;
    showLabels: false;
    emailLabel: string;
    userNameLabel: string;
    emptyText: string;
    passwordLabel: string;
    loginText: string;
    signupText: string;
    resetPasswordtext: string;
    loginTab: string;
    signupTab: string;
    forgotTab: string;
    // initializing parameters for Login Behaviour category in the modeler
    showprogress: false;
    clearPassword: false;
    clearUserName: false;
    dofocus: false;
    showLoginFailureWarning: false;
    loginFailureText: string;
    autoComplete: false;
    // Mobile
    autoCorrect: false;
    autoCapitalize: false;

    // Case Handling
    private keyboardType: string;
    private showForgotTab: boolean;
    private showSignupTab: boolean;
    private convertCase: string;
    private contextObject: mendix.lib.MxObject;
    private indicator: number;
    private loginForm_FailedAttempts: number;
    private message: string;
    private isUnMask: boolean;

    postCreate() {
        this.isUnMask = false;
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
        const HtmlTemplate = require("../Template/TabbedLogin.html");

        domConstruct.place(domConstruct.toDom(HtmlTemplate), this.domNode);
        dom.byId("LogUserName").setAttribute("placeholder", this.userExample);
        dom.byId("Regusername").setAttribute("placeholder", this.userExample);
        dom.byId("LogPassword").setAttribute("placeholder", this.passwordExample);
        dom.byId("Regpassword1").setAttribute("placeholder", this.passwordExample);
        dom.byId("Regpassword2").setAttribute("placeholder", this.passwordExample);
        dom.byId("forgetID").setAttribute("placeholder", this.emailExample);
        dom.byId("RegEmail").setAttribute("placeholder", this.emailExample);

        dom.byId("LoginID").setAttribute("value", this.loginText);
        dom.byId("signup").setAttribute("value", this.signupText);
        dom.byId("RememberPassword").setAttribute("value", this.resetPasswordtext);
    }
    private updateRendering() {
        this.displayText();
        this.displayLabels();
        this.displayTabs();
        if (this.dofocus) {
            this.focusNode();
        }
        dom.byId("LoginID").addEventListener("click", () => {
            this.loginMethod();
        }, false);
        dom.byId("signup").addEventListener("click", () => {
            this.signUpMethod();
        }, false);
        dom.byId("RememberPassword").addEventListener("click", () => {
            this.recoverPassword();
        }, false);
        dom.byId("Regpassword2").addEventListener("blur", () => {
            this.validatePasswordFields();
        }, false);

        dom.byId("eye").addEventListener("click", () => {

            function ShowPassword1() {
                dom.byId("LogPassword").setAttribute("type", "text");
                dom.byId("eye").innerHTML = "Hide";
            }
            function HidePassword1() {
                dom.byId("LogPassword").setAttribute("type", "password");
                dom.byId("eye").innerHTML = "Show";
            }

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

    private displayLabels() {
        if (this.showLabels) {
            dom.byId("userLabel").innerHTML = this.userNameLabel;
            dom.byId("userPassword").innerHTML = this.passwordLabel;
            dom.byId("EmailLabel").innerHTML = this.emailLabel;
            dom.byId("EmailLabel1").innerHTML = this.emailLabel;
            dom.byId("userPassword2").innerHTML = this.passwordLabel;
            dom.byId("userPassword1").innerHTML = this.passwordLabel;
            dom.byId("userLabel1").innerHTML = this.userNameLabel;
            dom.byId("tab1").innerHTML = this.loginTab;
            dom.byId("tab2").innerHTML = this.signupTab;
            dom.byId("tab3").innerHTML = this.forgotTab;
            dom.byId("domtablabel1").innerHTML = this.loginTab;
            dom.byId("domtablabel2").innerHTML = this.signupTab;
            dom.byId("domtablabel3").innerHTML = this.forgotTab;
        }
    }

    private displayTabs() {
        if (this.showForgotTab === false) {
            dom.byId("domtablabel2").setAttribute("style", "display: none");
        }
        if (this.showSignupTab === false) {
            dom.byId("domtablabel3").setAttribute("style", "display: none");
        }
    }

    private addMobileOptions() {
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

    private validatePasswordFields() {
        if (dom.byId("Regpassword1").value !== dom.byId("Regpassword2").value) {
            // tslint:disable-next-line:max-line-length
            dom.byId("warningNode2").innerHTML = this.displayWarning("Passwords dont match! Please check and try again.");
        } else {
            dom.byId("warningNode2").innerHTML = this.displayWarning("");
        }
    }

    private signUpMethod() {
        if (this.validateEmail(dom.byId("RegEmail").value)) {
            mx.data.create({
                callback: (object: mendix.lib.MxObject) => {
                    object.set(this.userName, this.changeCase(dom.byId("Regusername").value));
                    object.set(this.email, dom.byId("RegEmail").value);
                    object.set(this.password, dom.byId("Regpassword1").value);
                    object.set(this.password, dom.byId("Regpassword2").value);
                    this.contextObject = object;
                    this.executeMicroflow(this.signupMicroflow, this.contextObject.getGuid());
                },
                entity: this.personLogin,
                error: (errorMessage) => {
                    mx.ui.error("Could not commit object:");
                }
            });
        } else {
            dom.byId("warningNode2").innerHTML = this.displayWarning("The Email address you entered is invalid.");
        }
    }

    private displayWarning(WarningText: string) {
        const WarningTextSample = "<div style='color:red; display: block;'>" +
            WarningText +
            "<br/></div>";
        return WarningTextSample;
    }

    private loginMethod() {
        const UserNameN = this.changeCase(dom.byId("LogUserName").value);
        const PasswordN = dom.byId("LogPassword").value;

        if (this.showprogress) {
            this.indicator = mx.ui.showProgress();
        }
        if ((UserNameN !== "") || (PasswordN !== "")) {
            mx.login(UserNameN, PasswordN,
                () => {
                    if (this.indicator) { mx.ui.hideProgress(this.indicator); }
                },
                () => {
                    if (this.showLoginFailureWarning) {
                        if (this.loginForm_FailedAttempts === 1) {
                            this.message += "</br>" + this.loginFailureText;
                        }
                        this.loginForm_FailedAttempts = this.loginForm_FailedAttempts + 1;
                    }
                    dom.byId("warningNode").innerHTML = this.displayWarning(this.message);

                    if (this.clearPassword) {
                        dom.byId("LogUserName").setAttribute("value", "");
                    }
                    if (this.clearUserName) {
                        dom.byId("LogPassword").setAttribute("value", "");
                    }
                });
        } else {
            dom.byId("warningNode").innerHTML = this.displayWarning(this.emptyText);
        }
    }

    private focusNode() {
        setTimeout(() => {
            dom.byId("LogUserName").focus();
        }, 100);
    }

    private setUsernameInputAttributes() {
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

    private recoverPassword() {
        if (this.validateEmail(dom.byId("forgetID").value)) {
            mx.data.create({
                callback: (object: mendix.lib.MxObject) => {
                    object.set(this.email, dom.byId("forgetID").value);
                    this.executeMicroflow(this.forgetPasswordMicroflow, object.getGuid());
                },
                entity: this.personLogin,
                error: (errors) => {
                    mx.ui.error("Failed to fetch email address!");
                }
            });
            dom.byId("warningNode3").innerHTML = this.displayWarning("");
        } else {
            dom.byId("warningNode3").innerHTML = this.displayWarning("The Email address you entered is invalid.");
        }
    }

    private changeCase(username: string): string {
        if (this.convertCase === "toUpperCase") {
            return username.toUpperCase();
        } else if (this.convertCase === "toLowerCase") {
            return username.toLowerCase();
        }
        return username;
    }

    private executeMicroflow(microflow: string, guid: string, callback?: (object: mendix.lib.MxObject) => void) {
        if (microflow === this.forgetPasswordMicroflow && microflow && guid) {
            mx.ui.action(microflow, {
                // tslint:disable-next-line:no-empty
                callback: (object: mendix.lib.MxObject) => {
                },
                error: (error) => {
                    mx.ui.error("Could not commit object");
                },
                params: {
                    applyto: "selection",
                    guids: [ guid ]
                }
            }, this);
        } else if (microflow === this.signupMicroflow) {
            const registrationUserNameValue = dom.byId("Regusername").value;
            const registrationPasswordValue = dom.byId("Regpassword1").value;
            if (registrationPasswordValue || registrationUserNameValue) {
                dom.byId("warningNode").innerHTML = this.displayWarning(this.emptyText);
            }
            if (microflow && guid) {
                mx.ui.action(microflow, {
                    callback: (object: mendix.lib.MxObject) => {
                        if (callback && typeof callback === "function") {
                            callback(object);
                        }
                        if (object) {
                            mx.login(this.changeCase(registrationUserNameValue), registrationPasswordValue,
                                // tslint:disable-next-line:no-empty
                                () => { },
                                () => {
                                    if (this.showLoginFailureWarning) {
                                        if (this.loginForm_FailedAttempts === 1) {
                                            this.message += "</br>" + this.loginFailureText;
                                        }
                                        this.loginForm_FailedAttempts = this.loginForm_FailedAttempts + 1;
                                    }
                                    dom.byId("warningNode").innerHTML = this.displayWarning(this.message);
                                });
                        }
                    },
                    error: (error) => {
                        mx.ui.error("Failed to ");
                    },
                    params: {
                        applyto: "selection",
                        guids: [ guid ]
                    }
                }, this);
            }
        }
    }
}

// tslint:disable-next-line:only-arrow-functions
dojoDeclare("widget.TabbedLogin", [ WidgetBase ], function(Source: any) {
    const result: any = {};
    for (const i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
}(TabbedLogin));
