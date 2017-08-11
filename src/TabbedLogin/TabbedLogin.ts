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
        dom.byId("userNameToRegister").setAttribute("placeholder", this.userExample);
        dom.byId("LogPassword").setAttribute("placeholder", this.passwordExample);
        dom.byId("passwordToRegister1").setAttribute("placeholder", this.passwordExample);
        dom.byId("passwordToRegister2").setAttribute("placeholder", this.passwordExample);
        dom.byId("forgetID").setAttribute("placeholder", this.emailExample);
        dom.byId("emailToRegister").setAttribute("placeholder", this.emailExample);

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
        ////////////////////////////////////////////////////
        dom.byId("LogUserName").addEventListener("blur", () => {
            const loginUserNameValue = dom.byId("LogUserName").value.trim();
            if (loginUserNameValue !== "") {
                dom.byId("LogUserName").setAttribute("style", "border: none; border-bottom: 1px solid #008CBA;");
            } else {
                dom.byId("warningNode").innerHTML = this.displayWarning("Please enter your user name");
                dom.byId("LogUserName").setAttribute("style", "border: 1px solid red");
            }
        }, false);
        dom.byId("LogPassword").addEventListener("blur", () => {
            const passwordForLogin = dom.byId("LogPassword").value;
            if (passwordForLogin !== "") {
                dom.byId("LogPassword").setAttribute("style", "border: none; border-bottom: 1px solid #008CBA;");
            } else {
                dom.byId("warningNode").innerHTML = this.displayWarning("Please enter your password");
                dom.byId("LogPassword").setAttribute("style", "border: 1px solid red");
            }
        }, false);
        dom.byId("LoginID").addEventListener("click", () => {
            const loginUserNameValue = dom.byId("LogUserName").value.trim();
            const passwordForLogin = dom.byId("LogPassword").value;

            if (!loginUserNameValue || !passwordForLogin) {
                if (!loginUserNameValue) {
                    dom.byId("warningNode").innerHTML = this.displayWarning("Please enter a user name");
                    dom.byId("LogUserName").setAttribute("style", "border: 1px solid red");
                }
                if (!passwordForLogin) {
                    dom.byId("warningNode").innerHTML = this.displayWarning("Please enter a password");
                    dom.byId("LogUserName").setAttribute("style", "border: 1px solid red");
                }
            } else {
                this.loginMethod();
            }
        }, false);
        //handle my blur events
        /////////////////////////////////////////////////
        //handle my validation events
        dom.byId("userNameToRegister").addEventListener("blur", () => {
            const registrationUserNameValue = dom.byId("userNameToRegister").value.trim();
            if (registrationUserNameValue !== "") {
                dom.byId("userNameToRegister").setAttribute("style", "border: none; border-bottom: 1px solid #008CBA;");
            } else {
                dom.byId("warningNode2").innerHTML = this.displayWarning("Please enter a user name");
                dom.byId("userNameToRegister").setAttribute("style", "border: 1px solid red");
            }
        }, false);
        dom.byId("emailToRegister").addEventListener("blur", () => {
            const emailFromInput = dom.byId("emailToRegister").value.trim();
            if (emailFromInput !== "") {
                dom.byId("emailToRegister").setAttribute("style", "border: none; border-bottom: 1px solid #008CBA;");
            } else {
                dom.byId("warningNode2").innerHTML = this.displayWarning("Please enter an email");
                dom.byId("emailToRegister").setAttribute("style", "border: 1px solid red");
            }
        }, false);
        dom.byId("passwordToRegister1").addEventListener("blur", () => {
            const passwordForsignUp = dom.byId("passwordToRegister1").value;
            if (passwordForsignUp !== "") {
                dom.byId("passwordToRegister1").setAttribute("style", "border: none; border-bottom: 1px solid #008CBA;");
            } else {
                dom.byId("warningNode2").innerHTML = this.displayWarning("Please enter password");
                dom.byId("passwordToRegister1").setAttribute("style", "border: 1px solid red");
            }
        }, false);
        dom.byId("passwordToRegister2").addEventListener("blur", () => {
            const confirmPasswordForsignUp = dom.byId("passwordToRegister2").value;
            if (confirmPasswordForsignUp !== "") {
                dom.byId("passwordToRegister2").setAttribute("style", "border: none; border-bottom: 1px solid #008CBA;");
            } else {
                dom.byId("warningNode2").innerHTML = this.displayWarning("Please confirm password");
                dom.byId("passwordToRegister2").setAttribute("style", "border: 1px solid red");
            }
        }, false);
        dom.byId("signup").addEventListener("click", () => {
            const registrationUserNameValue = dom.byId("userNameToRegister").value.trim();
            const emailFromInput = dom.byId("emailToRegister").value.trim();
            const passwordForsignUp = dom.byId("passwordToRegister1").value;
            const confirmPasswordForsignUp = dom.byId("passwordToRegister2").value;

            const regulaExpressionUpperCase = new RegExp("[A-Z]");
            //if any of the field value if empty, look for that field value and check it
            if (!registrationUserNameValue || !emailFromInput || !passwordForsignUp || !confirmPasswordForsignUp) {
                if (!registrationUserNameValue) {
                    dom.byId("warningNode2").innerHTML = this.displayWarning("Please enter a user name");
                    dom.byId("userNameToRegister").setAttribute("style", "border: 1px solid red");
                }
                if (!emailFromInput) {
                    dom.byId("warningNode2").innerHTML = this.displayWarning("Please enter an email");
                    dom.byId("emailToRegister").setAttribute("style", "border: 1px solid red");
                }
                if (!passwordForsignUp) {
                    dom.byId("warningNode2").innerHTML = this.displayWarning("Please enter a password");
                    dom.byId("passwordToRegister1").setAttribute("style", "border: 1px solid red");
                }
                if (!confirmPasswordForsignUp) {
                    dom.byId("warningNode2").innerHTML = this.displayWarning("Please comfirm password");
                    dom.byId("passwordToRegister2").setAttribute("style", "border: 1px solid red");
                }

            } else if (regulaExpressionUpperCase.test(emailFromInput)) {
                dom.byId("warningNode2").innerHTML = this.displayWarning("Email contains uppercase");
                dom.byId("emailToRegister").setAttribute("style", "border: 1px solid red");
            } else if ((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailFromInput)) === false) {
                dom.byId("warningNode2").innerHTML = this.displayWarning("Invalid email");
                dom.byId("emailToRegister").setAttribute("style", "border: 1px solid red");
            } else if (passwordForsignUp !== confirmPasswordForsignUp) {
                dom.byId("warningNode2").innerHTML = this.displayWarning("Passwords do not match");
                dom.byId("passwordToRegister2").setAttribute("style", "border: 1px solid red");
            } else {
                this.signUpMethod();
            }
        }, false);
        //handle my blur events
        dom.byId("RememberPassword").addEventListener("click", () => {
            this.recoverPassword();
        }, false);
        dom.byId("passwordToRegister2").addEventListener("blur", () => {
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
            dom.byId("emailToRegister").setAttribute("autocomplete", "on");
            dom.byId("userNameToRegister").setAttribute("autocomplete", "on");
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
        if (dom.byId("passwordToRegister1").value !== dom.byId("passwordToRegister2").value) {
            // tslint:disable-next-line:max-line-length
            dom.byId("warningNode2").innerHTML = this.displayWarning("Passwords dont match! Please check and try again.");
        } else {
            dom.byId("warningNode2").innerHTML = this.displayWarning("");
        }
    }

    private signUpMethod() {
        if (this.validateEmail(dom.byId("emailToRegister").value)) {
            mx.data.create({
                callback: (object: mendix.lib.MxObject) => {
                    object.set(this.userName, this.changeCase(dom.byId("userNameToRegister").value));
                    object.set(this.email, dom.byId("emailToRegister").value);
                    object.set(this.password, dom.byId("passwordToRegister1").value);
                    object.set(this.password, dom.byId("passwordToRegister2").value);
                    this.contextObject = object;
                    this.executeMicroflow(this.signupMicroflow, this.contextObject.getGuid());
                    console.log("Object created on server");
                },
                entity: this.personLogin,
                error: (errorMessage) => {
                    console.error("Could not commit object:", errorMessage);
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
            dom.byId("userNameToRegister").setAttribute("autocapitalize", "on");
        }
        if (this.convertCase === "toLowerCase") {
            dom.byId("LogUserName").setAttribute("text-transform", "lowercase");
            dom.byId("userNameToRegister").setAttribute("text-transform", "lowercase");
        } else if (this.convertCase === "toUpperCase") {
            dom.byId("LogUserName").setAttribute("text-transform", "uppercase");
            dom.byId("userNameToRegister").setAttribute("text-transform", "uppercase");
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
                error: (errorMessage) => {
                    console.error("Could not commit object:", errorMessage);
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
                    guids: [guid]
                }
            }, this);
        } else if (microflow === this.signupMicroflow) {
            const registrationUserNameValue = dom.byId("userNameToRegister").value;
            const registrationPasswordValue = dom.byId("passwordToRegister1").value;
            if (registrationPasswordValue || registrationUserNameValue) {
                dom.byId("warningNode").innerHTML = this.displayWarning(this.emptyText);
            }
            if (microflow && guid) {
                mx.ui.action(microflow, {
                    params: {
                        applyto: "selection",
                        guids: [ guid ]
                    },
                    // tslint:disable-next-line:object-literal-sort-keys
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
                                    console.log("Error in login");
                                });
                        }
                    },
                    error: (error) => {
                        mx.ui.error("Failed to ");
                    }
                }, this);
            }
        }
    }
}

// tslint:disable-next-line:only-arrow-functions
dojoDeclare("widget.TabbedLogin", [WidgetBase], function (Source: any) {
    const result: any = {};
    for (const i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
}(TabbedLogin));
