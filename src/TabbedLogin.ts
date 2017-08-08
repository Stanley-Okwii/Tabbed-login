import * as dojoDeclare from "dojo/_base/declare";
import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import * as dom from "dojo/dom";
import * as dojoHas from "dojo/has";
import * as dojoEvent from "dojo/_base/event";
import "./TabbedLogin.css";

class TabbedLogin extends WidgetBase {
    // Parameters configured in modeler 
    personLogin: string;
    userName: string;
    password: string;
    email: string;
    signupMicroflow: string;
    forgetPasswordMicroflow: string;

    // initializing parameters for Display category in the modeler
    userexample: string;
    passexample: string;
    emailexample: string;
    showLabels: false;
    emailLabel: string;
    usernameLabel: string;
    emptytext: string;
    passwordLabel: string;
    logintext: string;
    signuptext: string;
    resetPasswordtext: string;
    loginTab: string;
    signupTab: string;
    forgotTab: string;
    gliphyIconunMask: string;
    gliphyIconMask: string;
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

    private DisplayText() {
        const HtmlTemplate = require("./TabbedLogin.html");
        domConstruct.place(domConstruct.toDom(HtmlTemplate), this.domNode);
        dom.byId("LogUserName").setAttribute("placeholder", this.userexample);
        dom.byId("Regusername").setAttribute("placeholder", this.userexample);
        dom.byId("LogPassword").setAttribute("placeholder", this.passexample);
        dom.byId("Regpassword1").setAttribute("placeholder", this.passexample);
        dom.byId("Regpassword2").setAttribute("placeholder", this.passexample);
        dom.byId("forgetID").setAttribute("placeholder", this.emailexample);
        dom.byId("RegEmail").setAttribute("placeholder", this.emailexample);

        dom.byId("LoginID").setAttribute("value", this.logintext);
        dom.byId("signup").setAttribute("value", this.signuptext);
        dom.byId("RememberPassword").setAttribute("value", this.resetPasswordtext);
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

        let unMaskImageSource = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAvVBMVEUAAAAAdOgAbfEAbvAAbe8Ab/EAbfAAbfAAbfAAbvEAbvAAbfAAcPUAbvAAbfAAbe8AbfAAbfAAbvAAa/IAbPIAbPAAbfAAbPAAbfAAbe8AbO8AbfEAa+0AbvAAbPAAbfAAbO8AAP8AbfAAbfAAbe8AVf8Abe8AbfAAbfAAbfAAbPAAbvAAgP8AbfAAbfEAZuYAbe8AbfAAbfAAbfAAb/EAbfEAauoAbfEAavEAbfAAbfAAbPAAbPEAbfAAAADVqeqmAAAAPXRSTlMACzZkkTWp3P4lqv0Zl/vE7vqHOTuG4Gj11U44KzPdv1ABiONiA7Tv7a8heQamsApw8OyWN6EMjyT28chcs98b0AAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfhBx8JNi1ohA/RAAAA+klEQVQ4y+VS11LDMBBcpSd2RImdAjhdxCU9AQJk//+3kC1sxhPPkGe4B2l0uzd7tyfg/4UolSuVckkUo9VavcEkGvVa9QJutgxqWYbTauZguy3Jm9u7+44QjivZJWXb/sF7fXLwgMcn8/SGo/GA7Pe+4cmUnM1VIvS88IMQnozUfEZOJ3FyuSLXG8Pdxvq7EO4e2KzJ1RJQ+j7o8uPLK2y8xYwADk8aOehKBX1GSR9S4f3jUzdLH8I6x7lI12aEsyXgGx/yhFTiRAeBIeQlsib3LsJdQZPZmJH0EAb+5ZipUePR0Cs2KrW6S+k6xVb/vqwr1n3Fh/nT8QWVEDP/c98IMQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0wNy0zMVQwOTo1NDo0NSswMjowMCs+z9cAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMDctMzFUMDk6NTQ6NDUrMDI6MDBaY3drAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg==";
        let maskImageSource = "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjMycHgiIGhlaWdodD0iMzJweCIgdmlld0JveD0iMCAwIDEzNy4yMTggMTM3LjIxOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTM3LjIxOCAxMzcuMjE4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTEyOC45NDIsNzcuNDFsMC44Ny0wLjU3NGMxLjY5My0xLjE3MSwyLjA5MS0zLjQ4MywwLjkxOS01LjE2NWMtMS4xODItMS42OTctMy41MDctMi4wOC01LjE2NS0wLjkyNSAgICBjLTU4LjAxMSw0MC41NTgtMTAwLjIzOSwxLjk5Ni0xMDIuMDEzLDAuMzM5Yy0xLjQ5Ny0xLjQwMS0zLjg1Ni0xLjMzLTUuMjUsMC4xNThjLTEuNDAxLDEuNDk0LTEuMzMzLDMuODMxLDAuMTQ5LDUuMjM3ICAgIGMwLjA4LDAuMDc2LDEuNDAxLDEuMjg1LDMuODEyLDMuMDc0bC03LjQzMSwxMi4yNTVjLTEuMDYsMS43NDgtMC41MDQsNC4wMywxLjI0NSw1LjA5OWMwLjU5OCwwLjM2LDEuMjc3LDAuNTQxLDEuOTM0LDAuNTQxICAgIGMxLjI0OSwwLDIuNDY1LTAuNjM1LDMuMTcyLTEuNzc4bDcuMjY2LTExLjk3M2M0LjA3NCwyLjQ4LDkuMjk4LDUuMTg4LDE1LjUyMiw3LjQ3NmwtMy41ODEsMTEuOTcyICAgIGMtMC41OTMsMS45NzEsMC41MTYsNC4wMjcsMi40NzUsNC42MTNsMS4wNjgsMC4xNThjMS41ODMsMCwzLjA2My0xLjA0LDMuNTQ1LTIuNjQ5bDMuNTQ2LTExLjgwOCAgICBjNS43NDUsMS41NzEsMTIuMTcyLDIuNjMyLDE5LjEwOCwyLjg4NHYxMS44NThjMCwyLjA1MiwxLjY1NywzLjcwOSwzLjcwOSwzLjcwOWMyLjA1LDAsMy43MDgtMS42NTcsMy43MDgtMy43MDlWOTYuMjc4ICAgIGM2LjA1Mi0wLjMzMiwxMi40NjYtMS4zNzMsMTkuMTYzLTMuMjgzbDQuNTY1LDEyLjAzOGMwLjU2OSwxLjQ4MywxLjk3OSwyLjM5MSwzLjQ2OCwyLjM5MWwxLjMxMi0wLjIzNCAgICBjMS45MTUtMC43MjgsMi44ODYtMi44NjcsMi4xNTgtNC43ODFsLTQuNDQ1LTExLjcyOWM2LjA5OC0yLjI2NSwxMi40MDEtNS4yNDcsMTguOTExLTkuMjAzbDYuMDA5LDguMDIxICAgIGMwLjczMiwwLjk2OSwxLjg0OSwxLjQ4OSwyLjk2NSwxLjQ4OWMwLjc3OCwwLDEuNTU1LTAuMjM2LDIuMjIyLTAuNzQ1YzEuNjQ0LTEuMjMsMS45NzYtMy41NTUsMC43NTItNS4xOTJMMTI4Ljk0Miw3Ny40MXoiIGZpbGw9IiMwMDZERjAiLz4KCQk8cGF0aCBkPSJNMTM2Ljk4Nyw0OC40YzAsMC0xLjQ3OS0yLjE0OC00LjYwMy01LjAxNWMtMS41MjctMS41MTMtMy41My0zLjAzNy01Ljg3MS00LjgwMmMtMi4zODUtMS41ODctNS4wOTMtMy40NjktOC4yMy01LjA2MiAgICBjLTMuMTI4LTEuNjU4LTYuNTk5LTMuMjQyLTEwLjM4NC00LjUzOWMtMy43Ni0xLjQ4My03LjkwMS0yLjM1My0xMi4yMTUtMy4xMzZjLTQuMzM0LTAuNTQ1LTguOTA5LTAuNjQ2LTEzLjUyMS0wLjQ0MyAgICBjLTQuNjI4LDAuMzkxLTkuMjU0LDAuMzk2LTEzLjkxNywwLjk2MmMtNC42MzYsMC4zODktOS4yNDcsMC44MTItMTMuNzQ2LDEuNzA1Yy0yLjI1MywwLjM5Mi00LjQ4NywwLjcwNi02LjY2MiwxLjE4OCAgICBjLTIuMTU3LDAuNTk0LTQuMjk0LDEuMTgyLTYuMzksMS43NTljLTQuMTk2LDEuMDQzLTguMTUsMi4zODEtMTEuNzk5LDMuOTUxYy0zLjY4NywxLjQwNi03LjEwNiwyLjgyMy0xMC4xMDIsNC41MzkgICAgYy0zLjAzMiwxLjYwMS01LjgxMSwyLjk2OS04LjIsNC4zNDJjLTIuMjczLDEuNTUxLTQuMjY5LDIuODk3LTUuOTExLDQuMDA1Yy0zLjIwMSwyLjI0MS01LjAzMSwzLjUyNC01LjAzMSwzLjUyNEwwLDUyLjY0NyAgICBjMC4xODYsMC41ODgsMC44MTgsMC44OTcsMS40MTIsMC43bDAuMTE5LTAuMDQ0YzAsMCwyLjA3My0wLjcwNiw1LjcyLTEuOTQ1YzEuNzg0LTAuNjI1LDMuOTYyLTEuMzg5LDYuNDQ2LTIuMjY4ICAgIGMyLjUyNi0wLjcyMiw1LjQ1MS0xLjM1Nyw4LjU1Ny0yLjEzMWMzLjA2NC0wLjg4NCw2LjUxMS0xLjQwNiwxMC4xNDgtMS44NDdjMS43ODEtMC4yNTksMy42MTktMC41MzksNS41MDEtMC44MTcgICAgYzEuOS0wLjIwMywzLjg1Ni0wLjI1Miw1LjgxMi0wLjM5NWMxLjk2Ni0wLjEyMywzLjk1LTAuMjQ1LDUuOTYtMC4zNjljMi4wMjMsMC4wMTEsNC4wNzQsMC4wMjgsNi4xMywwLjA0NyAgICBjNC4wODMtMC4xMjEsOC4yNjQsMC4yMzYsMTIuNDEzLDAuNmM4LjI5MiwwLjU4MiwxNi4zMzYsMy4zMSwyMy44OSw0LjU3MWM3LjU4OCwxLjI2MSwxNC44ODIsMS42MTQsMjEuMzE2LDEuOTY3ICAgIGM2LjQ1NywwLjE4NCwxMi4wMTcsMC4zMDcsMTYuMDk0LDAuMTA3YzQuMDU3LTAuMTQ3LDYuNTUtMC4zOTksNi41NS0wLjM5OWwwLjYxMi0wLjIzNSAgICBDMTM3LjI0OSw0OS43OSwxMzcuMzkzLDQ4Ljk4OSwxMzYuOTg3LDQ4LjR6IiBmaWxsPSIjMDA2REYwIi8+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==";

        if (this.gliphyIconMask != ""){
            maskImageSource = this.gliphyIconMask;
        }else{

        }

        if(this.gliphyIconunMask != ""){
            unMaskImageSource = this.gliphyIconunMask;
        }else{

        }

        dom.byId("eye").setAttribute("src", unMaskImageSource);

        dom.byId("eye").addEventListener("click", () => {
            
            function ShowPassword1(): void {
                dom.byId("LogPassword").setAttribute("type", "text");
                dom.byId("eye").setAttribute("src", maskImageSource);
            }
            function HidePassword1(): void {
                dom.byId("LogPassword").setAttribute("type", "password");
                dom.byId("eye").setAttribute("src", unMaskImageSource);
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
        this.gliphyIconunMask;
    }

    private DisplayLabels(): void {
        if (this.showLabels) {
            dom.byId("userLabel").innerHTML = this.usernameLabel;
            dom.byId("userPassword").innerHTML = this.passwordLabel;
            dom.byId("EmailLabel").innerHTML = this.emailLabel;
            dom.byId("EmailLabel1").innerHTML = this.emailLabel;
            dom.byId("userPassword2").innerHTML = this.passwordLabel;
            dom.byId("userPassword1").innerHTML = this.passwordLabel;
            dom.byId("userLabel1").innerHTML = this.usernameLabel;
            dom.byId("tab1").innerHTML = this.loginTab;
            dom.byId("tab2").innerHTML = this.signupTab;
            dom.byId("tab3").innerHTML = this.forgotTab;
            dom.byId("domtablabel1").innerHTML = this.loginTab;
            dom.byId("domtablabel2").innerHTML = this.signupTab;
            dom.byId("domtablabel3").innerHTML = this.forgotTab;
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
                    obj.set(this.userName, this.changeCase(dom.byId("Regusername").value));
                    obj.set(this.email, dom.byId("RegEmail").value);
                    obj.set(this.password, dom.byId("Regpassword1").value);
                    obj.set(this.password, dom.byId("Regpassword2").value);
                    this.contextObject = obj;
                    this.ExecuteMicroflowSignup(this.signupMicroflow, this.contextObject.getGuid());
                    console.log("Object created on server");
                },
                entity: this.personLogin,
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
                    obj.set(this.email, dom.byId("forgetID").value);
                    this.ExecuteMicroflow(this.forgetPasswordMicroflow, obj.getGuid());
                },
                entity: this.personLogin,
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

dojoDeclare("widget.TabbedLogin", [WidgetBase], function (Source: any) {
    const result: any = {};
    for (const i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;

}(TabbedLogin));
