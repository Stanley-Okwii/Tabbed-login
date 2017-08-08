import * as dojoDeclare from "dojo/_base/declare";
import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import * as dom from "dojo/dom";
import * as dojoHas from "dojo/has";
import "./TabbedLogin.css";

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
    gliphyIconunMask: string;
    gliphyIconMask: string;

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

    private DisplayText() {
        const temp = require("./TabbedLoginNoContext.html");
        domConstruct.place(domConstruct.toDom(temp), this.domNode);
        dom.byId("LogUserName1").setAttribute("placeholder", this.userExample1);
        dom.byId("LogPassword1").setAttribute("placeholder", this.passExample1);
        dom.byId("LoginID1").setAttribute("value", this.loginText1);
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

        dom.byId("eyeIdNoContext").setAttribute("src", unMaskImageSource);


        let isUnMask = false;
        dom.byId("eyeIdNoContext").addEventListener("click", () => {
            function ShowPassword1() {
                dom.byId("LogPassword1").setAttribute("type", "text");
                dom.byId("eyeIdNoContext").setAttribute("src", maskImageSource );
            }
            function HidePassword1(): void {
                dom.byId("LogPassword1").setAttribute("type", "password");
                dom.byId("eyeIdNoContext").setAttribute("src", unMaskImageSource);
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

    private DisplayLabels(): void {
        if (this.showLabels1) {
            dom.byId("userLabel1").innerHTML = this.userNameLabel1;
            dom.byId("userPassword1").innerHTML = this.passwordLabel1;
            dom.byId("tab11").innerHTML = this.loginTab1;
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
                        this.emptyText1 + "<br/></div>";
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

dojoDeclare("widget.TabbedLoginNoContext", [WidgetBase], function (Source: any) {
    const result: any = {};
    for (const i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
}(TabbedLoginNoContext));
